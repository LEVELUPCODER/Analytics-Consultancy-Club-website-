import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLivePrediction } from "../hooks/useLivePrediction";

const MODEL_VERSION = "ACC-IPL-XGB-v2.3";
const LAST_REFRESH_UTC = "2026-03-26 13:45";

const UPCOMING_PREDICTIONS = [
  {
    id: "IPL2026-001",
    teamA: "Punjab Kings",
    teamB: "Gujarat Titans",
    venue: "New Chandigarh",
    date: "2026-03-31",
    kickoff: "7:30 PM",
    predictedWinner: "Punjab Kings",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-002",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Chennai Super Kings",
    venue: "Bengaluru",
    date: "2026-04-05",
    kickoff: "7:30 PM",
    predictedWinner: "Royal Challengers Bengaluru",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-003",
    teamA: "Delhi Capitals",
    teamB: "Gujarat Titans",
    venue: "Delhi",
    date: "2026-04-08",
    kickoff: "7:30 PM",
    predictedWinner: "Delhi Capitals",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-004",
    teamA: "Rajasthan Royals",
    teamB: "Royal Challengers Bengaluru",
    venue: "Guwahati",
    date: "2026-04-10",
    kickoff: "7:30 PM",
    predictedWinner: "Rajasthan Royals",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-005",
    teamA: "Mumbai Indians",
    teamB: "Kolkata Knight Riders",
    venue: "Mumbai",
    date: "2026-03-29",
    kickoff: "7:30 PM",
    predictedWinner: "Kolkata Knight Riders",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-006",
    teamA: "Lucknow Super Giants",
    teamB: "Delhi Capitals",
    venue: "Lucknow",
    date: "2026-04-01",
    kickoff: "7:30 PM",
    predictedWinner: "Delhi Capitals",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-007",
    teamA: "Lucknow Super Giants",
    teamB: "Gujarat Titans",
    venue: "Lucknow",
    date: "2026-04-12",
    kickoff: "7:30 PM",
    predictedWinner: "Gujarat Titans",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-008",
    teamA: "Mumbai Indians",
    teamB: "Royal Challengers Bengaluru",
    venue: "Mumbai",
    date: "2026-04-12",
    kickoff: "7:30 PM",
    predictedWinner: "Royal Challengers Bengaluru",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-009",
    teamA: "Chennai Super Kings",
    teamB: "Delhi Capitals",
    venue: "Chennai",
    date: "2026-04-11",
    kickoff: "7:30 PM",
    predictedWinner: "Delhi Capitals",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-010",
    teamA: "Kolkata Knight Riders",
    teamB: "Lucknow Super Giants",
    venue: "Kolkata",
    date: "2026-04-09",
    kickoff: "7:30 PM",
    predictedWinner: "Lucknow Super Giants",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-011",
    teamA: "Rajasthan Royals",
    teamB: "Chennai Super Kings",
    venue: "Guwahati",
    date: "2026-03-30",
    kickoff: "7:30 PM",
    predictedWinner: "Chennai Super Kings",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-012",
    teamA: "Gujarat Titans",
    teamB: "Rajasthan Royals",
    venue: "Ahmedabad",
    date: "2026-04-04",
    kickoff: "7:30 PM",
    predictedWinner: "Rajasthan Royals",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-013",
    teamA: "Chennai Super Kings",
    teamB: "Punjab Kings",
    venue: "Chennai",
    date: "2026-04-03",
    kickoff: "7:30 PM",
    predictedWinner: "Punjab Kings",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-014",
    teamA: "Rajasthan Royals",
    teamB: "Mumbai Indians",
    venue: "Guwahati",
    date: "2026-04-07",
    kickoff: "7:30 PM",
    predictedWinner: "Mumbai Indians",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-015",
    teamA: "Sunrisers Hyderabad",
    teamB: "Lucknow Super Giants",
    venue: "Hyderabad",
    date: "2026-04-05",
    kickoff: "7:30 PM",
    predictedWinner: "Lucknow Super Giants",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-016",
    teamA: "Punjab Kings",
    teamB: "Sunrisers Hyderabad",
    venue: "New Chandigarh",
    date: "2026-04-11",
    kickoff: "7:30 PM",
    predictedWinner: "Sunrisers Hyderabad",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-017",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Sunrisers Hyderabad",
    venue: "Bengaluru",
    date: "2026-03-28",
    kickoff: "7:30 PM",
    predictedWinner: "Sunrisers Hyderabad",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-018",
    teamA: "Kolkata Knight Riders",
    teamB: "Sunrisers Hyderabad",
    venue: "Kolkata",
    date: "2026-04-02",
    kickoff: "7:30 PM",
    predictedWinner: "Sunrisers Hyderabad",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-019",
    teamA: "Kolkata Knight Riders",
    teamB: "Punjab Kings",
    venue: "Kolkata",
    date: "2026-04-06",
    kickoff: "7:30 PM",
    predictedWinner: "Punjab Kings",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
  {
    id: "IPL2026-020",
    teamA: "Delhi Capitals",
    teamB: "Mumbai Indians",
    venue: "Delhi",
    date: "2026-04-04",
    kickoff: "7:30 PM",
    predictedWinner: "Mumbai Indians",
    confidence: 50,
    tossImpact: "TBD",
    keyDrivers: ["Pre-match model confidence: 50%", "Elo & Form EMA factored"],
  },
];

const TEAM_META = {
  "Chennai Super Kings": {
    code: "CSK",
    flagColor: "#facc15",
    textColor: "#fef08a",
  },
  "Mumbai Indians": { code: "MI", flagColor: "#38bdf8", textColor: "#e0f2fe" },
  "Royal Challengers Bengaluru": {
    code: "RCB",
    flagColor: "#fb7185",
    textColor: "#ffe4e6",
  },
  "Sunrisers Hyderabad": {
    code: "SRH",
    flagColor: "#fb923c",
    textColor: "#ffedd5",
  },
  "Kolkata Knight Riders": {
    code: "KKR",
    flagColor: "#c084fc",
    textColor: "#f3e8ff",
  },
  "Rajasthan Royals": {
    code: "RR",
    flagColor: "#f472b6",
    textColor: "#fce7f3",
  },
  "Punjab Kings": { code: "PBKS", flagColor: "#f87171", textColor: "#fee2e2" },
  "Gujarat Titans": { code: "GT", flagColor: "#818cf8", textColor: "#e0e7ff" },
  "Lucknow Super Giants": {
    code: "LSG",
    flagColor: "#22d3ee",
    textColor: "#cffafe",
  },
  "Delhi Capitals": { code: "DC", flagColor: "#60a5fa", textColor: "#dbeafe" },
};

function getTeamMeta(teamName) {
  return (
    TEAM_META[teamName] || {
      code: "TEAM",
      flagColor: "#9ca3af",
      textColor: "#f3f4f6",
    }
  );
}

function getMatchNo(id) {
  return Number.parseInt(id.split("-")[1], 10);
}

function TeamFlag({ teamName, compact = false }) {
  const meta = getTeamMeta(teamName);
  const sizeClasses = compact
    ? "h-5 min-w-[2.6rem] px-2 text-[10px]"
    : "h-6 min-w-[3.1rem] px-2.5 text-xs";
  return (
    <span
      className="inline-flex items-center gap-0.5"
      title={teamName}
      aria-label={teamName}
    >
      <span className="h-6 w-px bg-white/35" />
      <span
        className={`inline-flex items-center justify-center rounded-l-sm border border-white/20 font-semibold tracking-wide ${sizeClasses}`}
        style={{
          backgroundColor: `${meta.flagColor}22`,
          color: meta.textColor,
        }}
      >
        {meta.code}
      </span>
      <span
        className={compact ? "h-5 w-2.5" : "h-6 w-3"}
        style={{
          backgroundColor: `${meta.flagColor}66`,
          clipPath: "polygon(0 0, 100% 50%, 0 100%)",
        }}
      />
    </span>
  );
}

function getConfidenceTier(confidence) {
  if (confidence >= 65)
    return {
      label: "Strong",
      color: "bg-emerald-400/20 text-emerald-200 border-emerald-300/20",
    };
  if (confidence >= 55)
    return {
      label: "Moderate",
      color: "bg-amber-300/20 text-amber-100 border-amber-200/20",
    };
  return {
    label: "Balanced",
    color: "bg-sky-300/20 text-sky-100 border-sky-200/20",
  };
}

function getAsciiConfidenceBar(confidence = 0) {
  const safe = Math.max(0, Math.min(100, Math.round(confidence)));
  const total = 20;
  const filled = Math.round((safe / 100) * total);
  return `[${"#".repeat(filled)}${"-".repeat(total - filled)}] ${safe}%`;
}

function parseKickoffToMinutes(kickoff = "") {
  const match = kickoff.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function getMatchTimestamp(row) {
  const baseDate = new Date(`${row.date}T00:00:00`).getTime();
  return baseDate + parseKickoffToMinutes(row.kickoff) * 60 * 1000;
}

function formatLivePercent(value) {
  return value == null ? "N/A" : `${value}%`;
}

function ScorecardModal({ onClose, data }) {
  const detailed = data?.detailedScorecard || {};
  const batsmen = Array.isArray(detailed.batsmen) ? detailed.batsmen : [];
  const bowlers = Array.isArray(detailed.bowlers) ? detailed.bowlers : [];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center backdrop-blur-lg bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.5)] font-mono"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Live scorecard"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-red-200">
                LIVE
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {detailed.match || `${data.teamA} vs ${data.teamB}`}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 p-6 text-sm">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-white/50">
              Score
            </p>
            <p className="mt-2 text-lg text-green-400">
              {detailed.score || data.score || "N/A"}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
              <span>
                CRR{" "}
                <span className="text-green-400">{detailed.crr || "N/A"}</span>
              </span>
              <span>
                RRR{" "}
                <span className="text-green-400">{detailed.rrr || "N/A"}</span>
              </span>
              <span>
                Recent{" "}
                <span className="text-green-400">
                  {detailed.recent || "N/A"}
                </span>
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                Batsmen
              </p>
              <div className="mt-3 space-y-2">
                {batsmen.slice(0, 2).map((batsman) => (
                  <div
                    key={batsman.name}
                    className="flex items-center justify-between text-white/80"
                  >
                    <span>
                      {batsman.name} {batsman.isStriker ? "*" : ""}
                    </span>
                    <span className="text-green-400">
                      {batsman.runs} ({batsman.balls})
                    </span>
                  </div>
                ))}
                {batsmen.length === 0 && <p className="text-white/50">N/A</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                Batsmen
              </p>
              <div className="mt-3 space-y-2">
                {batsmen.slice(2, 4).map((batsman) => (
                  <div
                    key={batsman.name}
                    className="flex items-center justify-between text-white/80"
                  >
                    <span>
                      {batsman.name} {batsman.isStriker ? "*" : ""}
                    </span>
                    <span className="text-green-400">
                      {batsman.runs} ({batsman.balls})
                    </span>
                  </div>
                ))}
                {batsmen.length < 3 && <p className="text-white/50">N/A</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-white/50">
              Bowlers
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {bowlers.map((bowler) => (
                <div
                  key={bowler.name}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2"
                >
                  <span className="text-white/80">{bowler.name}</span>
                  <span className="text-green-400">
                    {bowler.overs}-{bowler.runs}-{bowler.wickets}
                  </span>
                </div>
              ))}
              {bowlers.length === 0 && <p className="text-white/50">N/A</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IPL2026Page() {
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [selectedVenue, setSelectedVenue] = useState("All Venues");
  const [sortBy, setSortBy] = useState("date");
  const [showRawData, setShowRawData] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const {
    data: livePrediction,
    loading: liveLoading,
    error: liveError,
  } = useLivePrediction();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teams = useMemo(() => {
    const uniqueTeams = new Set();
    UPCOMING_PREDICTIONS.forEach((m) => {
      uniqueTeams.add(m.teamA);
      uniqueTeams.add(m.teamB);
    });
    return ["All Teams", ...Array.from(uniqueTeams).sort()];
  }, []);

  const venues = useMemo(() => {
    const uniqueVenues = Array.from(
      new Set(UPCOMING_PREDICTIONS.map((m) => m.venue)),
    ).sort();
    return ["All Venues", ...uniqueVenues];
  }, []);

  const filteredPredictions = useMemo(() => {
    const filtered = UPCOMING_PREDICTIONS.filter((m) => {
      const teamMatch =
        selectedTeam === "All Teams" ||
        m.teamA === selectedTeam ||
        m.teamB === selectedTeam;
      const venueMatch =
        selectedVenue === "All Venues" || m.venue === selectedVenue;
      return teamMatch && venueMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "confidence") return b.confidence - a.confidence;
      if (sortBy === "winner")
        return a.predictedWinner.localeCompare(b.predictedWinner);
      return getMatchTimestamp(a) - getMatchTimestamp(b);
    });
  }, [selectedTeam, selectedVenue, sortBy]);

  const kpi = useMemo(() => {
    const total = filteredPredictions.length;
    const avgConfidence = total
      ? Math.round(
          filteredPredictions.reduce((acc, m) => acc + m.confidence, 0) / total,
        )
      : 0;
    const highConfidence = filteredPredictions.filter(
      (m) => m.confidence >= 60,
    ).length;
    const tossSensitive = filteredPredictions.filter(
      (m) => m.tossImpact === "High",
    ).length;

    return {
      total,
      avgConfidence,
      highConfidence,
      tossSensitive,
    };
  }, [filteredPredictions]);

  return (
    <div className="bg-surface text-white min-h-screen pt-40 md:pt-44 lg:pt-48 pb-28 px-5 md:px-6">
      <div className="max-w-7xl mx-auto">
        <section className="glass-card rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.02] to-white/[0.01] backdrop-blur-xl p-6 md:p-8 shadow-[0_0_0_1px_rgba(52,211,153,0.2),0_0_40px_rgba(16,185,129,0.16)]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-3 py-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-emerald-300 font-semibold">
                  LIVE
                </span>
              </div>
              <h1 className="mt-4 font-heading text-3xl md:text-5xl font-bold leading-tight text-white">
                LIVE IN-PLAY
                <br />
                Prediction Terminal
              </h1>
              <p className="mt-3 text-sm md:text-base text-white/60 max-w-2xl">
                Real-time inference stream for active fixtures. Confidence and
                win probability update from live signals..
              </p>
            </div>
            <div className="text-xs tracking-wide text-emerald-300/80 border border-emerald-300/30 bg-emerald-500/10 rounded-xl px-4 py-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Refresh: 30s |
            </div>
          </div>

          {liveLoading && (
            <p className="mt-5 text-sm text-emerald-200/80 animate-pulse">
              Streaming live inference feed...
            </p>
          )}

          {liveError && (
            <p className="mt-5 text-sm text-rose-200">{liveError}</p>
          )}

          {livePrediction && (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <article className="rounded-2xl border border-emerald-300/25 bg-black/35 p-5 shadow-[0_0_25px_rgba(16,185,129,0.18)]">
                <p className="text-emerald-300/80 text-xs uppercase tracking-[0.2em]">
                  Live Match
                </p>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold text-white font-mono">
                  {livePrediction.teamA} vs {livePrediction.teamB}
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  {livePrediction.status}
                </p>
                <p className="mt-3 font-mono text-base md:text-lg text-emerald-300 animate-pulse [text-shadow:0_0_12px_rgba(74,222,128,0.8)]">
                  {livePrediction.score}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  {livePrediction.venue}
                </p>
              </article>

              <article className="rounded-2xl border border-emerald-300/25 bg-black/35 p-5 shadow-[0_0_25px_rgba(16,185,129,0.18)]">
                <p className="text-emerald-300/80 text-xs uppercase tracking-[0.2em]">
                  Predicted Winner
                </p>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold text-white font-mono">
                  {livePrediction.predictedWinner ||
                    "Awaiting Compatible Live Match"}
                </h3>
                <p className="mt-3 text-sm text-white/75 font-mono">
                  Team A:{" "}
                  {formatLivePercent(livePrediction.teamAWinProbability)}
                  {" | "}
                  Team B:{" "}
                  {formatLivePercent(livePrediction.teamBWinProbability)}
                </p>
                <p className="mt-3 font-mono text-base text-green-400 animate-pulse [text-shadow:0_0_14px_rgba(74,222,128,0.9)]">
                  {livePrediction.confidence != null
                    ? getAsciiConfidenceBar(livePrediction.confidence)
                    : "[--------------------] N/A"}
                </p>
                <button
                  onClick={() => setIsScoreModalOpen(true)}
                  className="mt-4 border border-red-500/50 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 animate-pulse"
                  type="button"
                >
                  Click to see Live Status
                </button>
              </article>
            </div>
          )}
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article className="glass-card rounded-2xl p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              Visible Fixtures
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">{kpi.total}</p>
          </article>
          <article className="glass-card rounded-2xl p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              Avg Confidence
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">
              {kpi.avgConfidence}%
            </p>
          </article>
          <article className="glass-card rounded-2xl p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              High Confidence (&gt;=60%)
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">
              {kpi.highConfidence}
            </p>
          </article>
          <article className="glass-card rounded-2xl p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              Toss Sensitive
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">
              {kpi.tossSensitive}
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <span className="text-white/40 text-xs tracking-[0.28em] uppercase font-medium">
                Fixtures Intelligence
              </span>
              <h2 className="mt-3 font-heading text-3xl md:text-5xl font-bold text-white">
                Upcoming Matches
              </h2>
              <p className="mt-2 text-white/45 text-sm md:text-base max-w-2xl">
                Filter and prioritize fixtures by team, venue, and confidence to
                review likely outcomes.
              </p>
            </div>

            <div className="rounded-2xl p-3 md:p-4 border border-white/15 bg-white/[0.03] backdrop-blur-xl grid sm:grid-cols-3 gap-3 w-full md:w-auto shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <label className="text-xs text-white/35 uppercase tracking-wider">
                Team
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="mt-1.5 w-full bg-black/35 border border-white/15 rounded-xl px-3 py-2.5 text-white/85 text-sm focus:outline-none focus:border-white/30"
                  aria-label="Filter by team"
                >
                  {teams.map((team) => (
                    <option
                      key={team}
                      value={team}
                      className="bg-black text-white"
                    >
                      {team}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-white/35 uppercase tracking-wider">
                Venue
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="mt-1.5 w-full bg-black/35 border border-white/15 rounded-xl px-3 py-2.5 text-white/85 text-sm focus:outline-none focus:border-white/30"
                  aria-label="Filter by venue"
                >
                  {venues.map((venue) => (
                    <option
                      key={venue}
                      value={venue}
                      className="bg-black text-white"
                    >
                      {venue}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-white/35 uppercase tracking-wider">
                Sort
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1.5 w-full bg-black/35 border border-white/15 rounded-xl px-3 py-2.5 text-white/85 text-sm focus:outline-none focus:border-white/30"
                  aria-label="Sort predictions"
                >
                  <option value="date" className="bg-black text-white">
                    Date
                  </option>
                  <option value="confidence" className="bg-black text-white">
                    Confidence
                  </option>
                  <option value="winner" className="bg-black text-white">
                    Predicted Winner
                  </option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 gap-5 mb-7">
            {filteredPredictions.map((row) => {
              const tier = getConfidenceTier(row.confidence);
              return (
                <article
                  key={row.id}
                  className="glass-card rounded-2xl p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] tracking-[0.2em] uppercase text-white/35">
                          {row.id}
                        </p>
                        <span className="text-[11px] tracking-[0.15em] uppercase text-white/40">
                          Match {getMatchNo(row.id)}
                        </span>
                      </div>
                      <h3 className="mt-2 font-heading text-xl font-bold text-white leading-tight">
                        {row.teamA} vs {row.teamB}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <TeamFlag teamName={row.teamA} />
                        <span className="text-white/30 text-xs uppercase tracking-widest">
                          vs
                        </span>
                        <TeamFlag teamName={row.teamB} />
                      </div>
                      <p className="mt-2 text-white/40 text-sm">
                        {row.venue} | {row.date} | {row.kickoff}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium ${tier.color}`}
                    >
                      {tier.label}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/45">Predicted Winner</span>
                      <span className="text-white font-medium">
                        {row.predictedWinner}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-white/70"
                        style={{ width: `${row.confidence}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                      <span>Confidence: {row.confidence}%</span>
                      <span>Toss Impact: {row.tossImpact}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-white/40">
                      Predicted Winner Flag
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-2">
                      {row.predictedWinner === "To Be Updated" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-white/20 text-xs text-white/75 bg-white/10">
                          TBD
                        </span>
                      ) : (
                        <TeamFlag teamName={row.predictedWinner} />
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Key Drivers
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-white/45">
                      {row.keyDrivers.map((driver) => (
                        <li key={driver} className="flex items-start gap-2">
                          <span className="mt-1 w-1 h-1 rounded-full bg-white/50" />
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowRawData((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.03] backdrop-blur-xl px-5 py-2.5 text-sm font-medium tracking-wide text-white/85 hover:text-white hover:border-white/35 hover:bg-white/[0.06] transition-all"
            >
              {showRawData ? "Hide Table" : "View upcoming matches Table"}
            </button>
          </div>

          {showRawData && (
            <div
              className="glass-card rounded-3xl border border-white/10 overflow-hidden bg-white/[0.01] animate-fade-in-up"
              style={{ animationDuration: "0.25s" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[960px]">
                  <thead className="bg-white/[0.03] border-b border-white/10">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Match No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Match
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Venue
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Date/Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Predicted Winner
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Confidence
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium"
                      >
                        Toss Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPredictions.map((row) => (
                      <tr
                        key={`${row.id}-table`}
                        className="border-b border-white/5 last:border-b-0"
                      >
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {getMatchNo(row.id)}
                        </td>
                        <td className="px-6 py-4 text-white/85 text-sm md:text-base">
                          <div className="flex flex-col gap-2">
                            <span>
                              {row.teamA} vs {row.teamB}
                            </span>
                            <div className="flex items-center gap-2">
                              <TeamFlag teamName={row.teamA} compact />
                              <span className="text-white/30 text-[10px] uppercase tracking-wider">
                                vs
                              </span>
                              <TeamFlag teamName={row.teamB} compact />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/45 text-sm">
                          {row.venue}
                        </td>
                        <td className="px-6 py-4 text-white/45 text-sm">
                          {row.date} | {row.kickoff}
                        </td>
                        <td className="px-6 py-4 text-white text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <span>{row.predictedWinner}</span>
                            {row.predictedWinner !== "To Be Updated" && (
                              <TeamFlag
                                teamName={row.predictedWinner}
                                compact
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80">
                          {row.confidence}%
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">
                          {row.tossImpact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 py-4 border-t border-white/10 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              Model Version:{" "}
              <span className="text-white/80">{MODEL_VERSION}</span>
            </span>
            <span>
              Last Refresh:{" "}
              <span className="text-white/80">{LAST_REFRESH_UTC}</span>
            </span>
            <span>
              Calibration: <span className="text-white/80">Elo + Form EMA</span>
            </span>
            <span>
              Inference SLA:{" "}
              <span className="text-white/80">&lt; 3 seconds</span>
            </span>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center px-4 py-2 border border-white/20 rounded-full text-white/75 hover:text-white hover:border-white/35 transition-all"
          >
            Back to Projects
          </Link>
        </footer>

        {isScoreModalOpen && livePrediction && (
          <ScorecardModal
            onClose={() => setIsScoreModalOpen(false)}
            data={livePrediction}
          />
        )}
      </div>
    </div>
  );
}

export default IPL2026Page;
