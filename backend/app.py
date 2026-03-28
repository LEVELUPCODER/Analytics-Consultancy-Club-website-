import os
import time
import json
from dataclasses import dataclass
from typing import Any, Dict, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")
load_dotenv(os.path.join(BASE_DIR, ".env"))

CRICAPI_KEY = os.getenv("CRICAPI_KEY", "")
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(MODELS_DIR, "ipl_final_xgboost.pkl"))
TEAM_ENCODER_PATH = os.getenv("TEAM_ENCODER_PATH", os.path.join(MODELS_DIR, "team_encoder.pkl"))
VENUE_ENCODER_PATH = os.getenv("VENUE_ENCODER_PATH", os.path.join(MODELS_DIR, "venue_encoder.pkl"))
PREMATCH_FEATURE_STORE = os.getenv(
    "PREMATCH_FEATURE_STORE", os.path.join(DATA_DIR, "ipl_2026_predictions.csv")
)
SCORECARD_PATH = os.getenv("SCORECARD_PATH", os.path.join(DATA_DIR, "live_scorecard.json"))
CACHE_TTL_SECONDS = int(os.getenv("LIVE_CACHE_TTL", "60"))
LIVE_MATCH_API = "https://api.cricapi.com/v1/currentMatches"
IPL_MATCH_HINTS = (
    "rcb",
    "srh",
    "bengaluru",
    "bangalore",
    "hyderabad",
    "sunrisers",
    "ipl",
)


@dataclass
class CacheEntry:
    ts: float
    payload: Dict[str, Any]


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

_cache: Dict[str, CacheEntry] = {}
model: Optional[Any] = None
team_encoder: Optional[Any] = None
venue_encoder: Optional[Any] = None
prematch_df: Optional[pd.DataFrame] = None
supported_teams: set[str] = set()

TEAM_NAME_ALIASES = {
    "chennai super kings": "Chennai Super Kings",
    "csk": "Chennai Super Kings",
    "delhi capitals": "Delhi Capitals",
    "dc": "Delhi Capitals",
    "gujarat titans": "Gujarat Titans",
    "gt": "Gujarat Titans",
    "kolkata knight riders": "Kolkata Knight Riders",
    "kkr": "Kolkata Knight Riders",
    "lucknow super giants": "Lucknow Super Giants",
    "lsg": "Lucknow Super Giants",
    "mumbai indians": "Mumbai Indians",
    "mi": "Mumbai Indians",
    "punjab kings": "Punjab Kings",
    "pbks": "Punjab Kings",
    "rajasthan royals": "Rajasthan Royals",
    "rr": "Rajasthan Royals",
    "rcb": "Royal Challengers Bengaluru",
    "royal challengers bengaluru": "Royal Challengers Bengaluru",
    "royal challengers bangalore": "Royal Challengers Bengaluru",
    "sunrisers hyderabad": "Sunrisers Hyderabad",
    "srh": "Sunrisers Hyderabad",
    "delhi daredevils": "Delhi Capitals",
    "kings xi punjab": "Punjab Kings",
}

VENUE_NAME_ALIASES = {
    "wankhede stadium, mumbai": "Mumbai",
    "eden gardens, kolkata": "Kolkata",
    "m. a. chidambaram stadium, chennai": "Chennai",
    "m chinnaswamy stadium, bengaluru": "M Chinnaswamy Stadium, Bengaluru",
    "narendra modi stadium, ahmedabad": "Ahmedabad",
    "rajiv gandhi international stadium, hyderabad": "Hyderabad",
    "bharat ratna shri atal bihari vajpayee ekana cricket stadium, lucknow": "Lucknow",
    "arun jaitley stadium, delhi": "Delhi",
    "sawai mansingh stadium, jaipur": "Jaipur",
    "barsapara cricket stadium, guwahati": "Guwahati",
    "new pca stadium, new chandigarh": "New Chandigarh",
    "new chandigarh": "New Chandigarh",
}


def _normalize_team_name(team: str) -> str:
    if not team:
        return team
    key = team.strip().lower()
    return TEAM_NAME_ALIASES.get(key, team.strip())


def _normalize_venue_name(venue: str) -> str:
    if not venue:
        return venue
    key = venue.strip().lower()
    return VENUE_NAME_ALIASES.get(key, venue.strip())


def _load_artifacts() -> None:
    global model, team_encoder, venue_encoder, prematch_df, supported_teams

    required_paths = [
        MODEL_PATH,
        TEAM_ENCODER_PATH,
        VENUE_ENCODER_PATH,
        PREMATCH_FEATURE_STORE,
    ]
    for path in required_paths:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Required artifact is missing: {path}")

    model = joblib.load(MODEL_PATH)
    team_encoder = joblib.load(TEAM_ENCODER_PATH)
    venue_encoder = joblib.load(VENUE_ENCODER_PATH)
    prematch_df = pd.read_csv(PREMATCH_FEATURE_STORE)

    required_cols = {
        "Team_A",
        "Team_B",
        "Venue",
        "Prob_Team_A_Win",
        "Prob_Team_B_Win",
    }
    missing_cols = required_cols.difference(set(prematch_df.columns))
    if missing_cols:
        raise ValueError(
            f"Prediction CSV at {PREMATCH_FEATURE_STORE} is missing columns: {sorted(missing_cols)}"
        )

    supported_teams = set(prematch_df["Team_A"].dropna().astype(str).tolist())
    supported_teams.update(set(prematch_df["Team_B"].dropna().astype(str).tolist()))


def _is_known_label(enc: Any, label: str) -> bool:
    classes = set(getattr(enc, "classes_", []))
    return label in classes


def _cached_get(key: str) -> Optional[Dict[str, Any]]:
    hit = _cache.get(key)
    if not hit:
        return None
    if time.time() - hit.ts > CACHE_TTL_SECONDS:
        _cache.pop(key, None)
        return None
    return hit.payload


def _cached_set(key: str, payload: Dict[str, Any]) -> None:
    _cache[key] = CacheEntry(ts=time.time(), payload=payload)


def _load_detailed_scorecard() -> Dict[str, Any]:
    if not os.path.exists(SCORECARD_PATH):
        return {}

    try:
        with open(SCORECARD_PATH, encoding="utf-8") as f:
            loaded = json.load(f)
            return loaded if isinstance(loaded, dict) else {}
    except Exception:
        return {}


def _fetch_live_match() -> Dict[str, Any]:
    # Production mode: demo payload disabled so live data is always fetched from CricAPI.
    # if DEMO_MODE:
    #     return {
    #         "match_id": "demo-ipl-2026-rcb-csk",
    #         "teamA": "Royal Challengers Bengaluru",
    #         "teamB": "Chennai Super Kings",
    #         "venue": "M Chinnaswamy Stadium, Bengaluru",
    #         "status": "Live Demo - 1st Innings",
    #         "score": "Royal Challengers Bengaluru 147/4 (15.2 ov)",
    #         "toss": "Royal Challengers Bengaluru",
    #         "source": "demo",
    #         "modelCompatible": True,
    #         "compatibilityReason": None,
    #     }

    cached = _cached_get("live_match")
    if cached is not None:
        return cached

    if not CRICAPI_KEY:
        raise RuntimeError("CRICAPI_KEY is required and was not provided")

    try:
        res = requests.get(
            LIVE_MATCH_API,
            params={"apikey": CRICAPI_KEY, "offset": 0},
            timeout=12,
        )
        res.raise_for_status()
        body = res.json()
        data = body.get("data", [])

        if not data:
            raise RuntimeError("No live matches were returned by CricAPI")

        def _is_ipl_candidate(candidate: Dict[str, Any]) -> bool:
            match_str = str(candidate).lower()
            return any(keyword in match_str for keyword in IPL_MATCH_HINTS)

        ipl_candidates = [m for m in data if _is_ipl_candidate(m)]
        selected_match = None
        for candidate in ipl_candidates:
            teams = candidate.get("teams", [])
            if len(teams) < 2:
                continue

            team_a = _normalize_team_name(teams[0])
            team_b = _normalize_team_name(teams[1])
            venue = _normalize_venue_name(str(candidate.get("venue", "Unknown")))

            if team_a not in supported_teams or team_b not in supported_teams:
                continue
            if team_encoder is None or venue_encoder is None:
                continue
            if not _is_known_label(team_encoder, team_a) or not _is_known_label(team_encoder, team_b):
                continue
            if not _is_known_label(venue_encoder, venue):
                continue

            selected_match = {
                "raw": candidate,
                "teamA": team_a,
                "teamB": team_b,
                "venue": venue,
            }
            break

        if selected_match is None:
            first_ipl = ipl_candidates[0] if ipl_candidates else {}
            teams = first_ipl.get("teams", ["Team A", "Team B"]) if isinstance(first_ipl, dict) else ["Team A", "Team B"]
            payload = {
                "match_id": first_ipl.get("id", "unknown") if isinstance(first_ipl, dict) else "unknown",
                "teamA": teams[0] if len(teams) > 0 else "Team A",
                "teamB": teams[1] if len(teams) > 1 else "Team B",
                "venue": _normalize_venue_name(first_ipl.get("venue", "Unknown")) if isinstance(first_ipl, dict) else "Unknown",
                "status": first_ipl.get("status", "Live") if isinstance(first_ipl, dict) else "Live",
                "score": " | ".join(
                    [
                        f"{s.get('inning', 'Inning')} {s.get('r', 0)}/{s.get('w', 0)} ({s.get('o', 0)} ov)"
                        for s in (first_ipl.get("score", []) if isinstance(first_ipl, dict) else [])
                    ]
                )
                or "Live score unavailable",
                "toss": first_ipl.get("tossWinner", "N/A") if isinstance(first_ipl, dict) else "N/A",
                "source": "cricapi",
                "modelCompatible": False,
                "compatibilityReason": (
                    "No live IPL match found in CricAPI response"
                    if not ipl_candidates
                    else "No live IPL match matched trained team/venue labels"
                ),
            }
            _cached_set("live_match", payload)
            return payload

        first = selected_match["raw"]
        score_rows = first.get("score", [])
        pretty_score = " | ".join(
            [
                f"{s.get('inning', 'Inning')} {s.get('r', 0)}/{s.get('w', 0)} ({s.get('o', 0)} ov)"
                for s in score_rows
            ]
        )

        payload = {
            "match_id": first.get("id", "unknown"),
            "teamA": selected_match["teamA"],
            "teamB": selected_match["teamB"],
            "venue": selected_match["venue"],
            "status": first.get("status", "Live"),
            "score": pretty_score or "Live score unavailable",
            "toss": first.get("tossWinner", "N/A"),
            "source": "cricapi",
            "modelCompatible": True,
            "compatibilityReason": None,
        }
        print("SELECTED MATCH:", first)
        _cached_set("live_match", payload)
        return payload
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Live API fetch failed: {exc}") from exc


def _team_elo(team: str) -> float:
    if prematch_df is None:
        return 1500.0

    as_team_a = prematch_df[prematch_df["Team_A"] == team]
    as_team_b = prematch_df[prematch_df["Team_B"] == team]
    vals = []
    if not as_team_a.empty:
        vals.extend(as_team_a["Prob_Team_A_Win"].astype(float).tolist())
    if not as_team_b.empty:
        vals.extend(as_team_b["Prob_Team_B_Win"].astype(float).tolist())

    if not vals:
        return 1500.0
    # Convert historical win prior into Elo-like scale.
    return float(1400.0 + (sum(vals) / len(vals)) * 200.0)


def _team_ema_form(team: str) -> float:
    if prematch_df is None:
        return 0.0

    as_team_a = prematch_df[prematch_df["Team_A"] == team]
    as_team_b = prematch_df[prematch_df["Team_B"] == team]
    vals = []
    if not as_team_a.empty:
        vals.extend(as_team_a["Prob_Team_A_Win"].astype(float).tolist())
    if not as_team_b.empty:
        vals.extend(as_team_b["Prob_Team_B_Win"].astype(float).tolist())

    if not vals:
        return 0.0
    return float((sum(vals) / len(vals)) - 0.5)


def _venue_bias(venue: str) -> float:
    if prematch_df is None:
        return 0.0

    row = prematch_df[prematch_df["Venue"] == venue]
    if row.empty:
        return 0.0
    return float(row["Prob_Team_A_Win"].astype(float).mean() - 0.5)


def _parse_live_score(score_text: str) -> Tuple[float, float, float]:
    # Extract rough live context features from score string.
    # Keeps the pipeline robust when score formats vary.
    runs = wickets = overs = 0.0
    try:
        # Example fragment: "PBKS 78/2 (8.4 ov)"
        import re

        m = re.search(r"(\d+)\s*/\s*(\d+)", score_text)
        if m:
            runs = float(m.group(1))
            wickets = float(m.group(2))

        o = re.search(r"\((\d+(?:\.\d+)?)\s*ov\)", score_text)
        if o:
            overs = float(o.group(1))
    except Exception:  # noqa: BLE001
        pass

    return runs, wickets, overs


def _encode_if_needed(col: str, value: str) -> float:
    enc = team_encoder if col == "team" else venue_encoder
    if enc is None:
        raise RuntimeError(f"Encoder for {col} is not loaded")

    classes = set(getattr(enc, "classes_", []))
    if value not in classes:
        raise ValueError(f"Unknown {col} label '{value}' not present in encoder classes")

    try:
        return float(enc.transform([value])[0])
    except Exception:  # noqa: BLE001
        raise


def _predict(features: Dict[str, float]) -> float:
    if model is None:
        raise RuntimeError("Model is not loaded")

    # Full feature set for models trained with richer live + prematch context.
    full_cols = [
        "teamA_elo",
        "teamB_elo",
        "elo_diff",
        "teamA_ema_form",
        "teamB_ema_form",
        "ema_form_diff",
        "venue_bias",
        "live_runs",
        "live_wickets",
        "live_overs",
        "teamA_encoded",
        "teamB_encoded",
        "venue_encoded",
    ]

    # Compact feature set for earlier training artifacts that expect fewer columns.
    compact_cols = [
        "teamA_elo",
        "teamB_elo",
        "elo_diff",
        "teamA_encoded",
        "teamB_encoded",
        "venue_encoded",
        "live_overs",
    ]

    expected_features = getattr(model, "n_features_in_", None)
    if expected_features == len(compact_cols):
        ordered_cols = compact_cols
    else:
        ordered_cols = full_cols

    x = np.array([[features.get(c, 0.0) for c in ordered_cols]], dtype=np.float32)

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(x)[0][1]
        return float(np.clip(proba, 0.0, 1.0))

    # Fallback for Booster-like outputs
    pred = float(model.predict(x)[0])
    return float(np.clip(pred, 0.0, 1.0))


def _build_features(match: Dict[str, Any]) -> Dict[str, float]:
    team_a = _normalize_team_name(match["teamA"])
    team_b = _normalize_team_name(match["teamB"])
    venue = _normalize_venue_name(match["venue"])
    runs, wickets, overs = _parse_live_score(match.get("score", ""))

    team_a_elo = _team_elo(team_a)
    team_b_elo = _team_elo(team_b)
    team_a_ema = _team_ema_form(team_a)
    team_b_ema = _team_ema_form(team_b)

    return {
        "teamA_elo": team_a_elo,
        "teamB_elo": team_b_elo,
        "elo_diff": team_a_elo - team_b_elo,
        "teamA_ema_form": team_a_ema,
        "teamB_ema_form": team_b_ema,
        "ema_form_diff": team_a_ema - team_b_ema,
        "venue_bias": _venue_bias(venue),
        "live_runs": runs,
        "live_wickets": wickets,
        "live_overs": overs,
        "teamA_encoded": _encode_if_needed("team", team_a),
        "teamB_encoded": _encode_if_needed("team", team_b),
        "venue_encoded": _encode_if_needed("venue", venue),
    }


@app.get("/api/health")
def health() -> Any:
    return jsonify(
        {
            "ok": True,
            "artifacts": {
                "model": MODEL_PATH,
                "teamEncoder": TEAM_ENCODER_PATH,
                "venueEncoder": VENUE_ENCODER_PATH,
                "predictionCsv": PREMATCH_FEATURE_STORE,
            },
        }
    )


@app.get("/api/live-prediction")
def live_prediction() -> Any:
    try:
        live = _fetch_live_match()
        detailed_scorecard = _load_detailed_scorecard()

        if not live.get("modelCompatible", True):
            return jsonify(
                {
                    "matchId": live["match_id"],
                    "status": live["status"],
                    "score": live["score"],
                    "venue": live["venue"],
                    "teamA": live["teamA"],
                    "teamB": live["teamB"],
                    "toss": live.get("toss", "N/A"),
                    "predictedWinner": None,
                    "teamAWinProbability": None,
                    "teamBWinProbability": None,
                    "confidence": None,
                    "cacheTtlSeconds": CACHE_TTL_SECONDS,
                    "predictionStatus": "unavailable",
                    "reason": live.get("compatibilityReason"),
                    "source": live.get("source", "cricapi"),
                    "detailedScorecard": detailed_scorecard,
                }
            )

        features = _build_features(live)
        p_team_a = _predict(features)

        winner = live["teamA"] if p_team_a >= 0.5 else live["teamB"]
        confidence = round((p_team_a if p_team_a >= 0.5 else 1 - p_team_a) * 100, 2)

        return jsonify(
            {
                "matchId": live["match_id"],
                "status": live["status"],
                "score": live["score"],
                "venue": live["venue"],
                "teamA": live["teamA"],
                "teamB": live["teamB"],
                "toss": live.get("toss", "N/A"),
                "predictedWinner": winner,
                "teamAWinProbability": round(p_team_a * 100, 2),
                "teamBWinProbability": round((1 - p_team_a) * 100, 2),
                "confidence": confidence,
                "cacheTtlSeconds": CACHE_TTL_SECONDS,
                "featureAlignment": {
                    "prematch": ["historical team priors from prediction CSV", "venue bias"],
                    "live": ["runs", "wickets", "overs", "toss context"],
                    "notes": "Live match context is merged with pre-match priors and encoded using your persisted pickles.",
                },
                "detailedScorecard": detailed_scorecard,
            }
        )
    except Exception as exc:  # noqa: BLE001
        app.logger.exception("/api/live-prediction failed: %s", exc)
        return jsonify({"error": str(exc)}), 500


_load_artifacts()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
