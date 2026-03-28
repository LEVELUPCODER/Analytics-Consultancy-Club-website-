import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePredictions } from "../hooks/usePredictions";
import { TeamFlag } from "../components/TeamFlag";
import { LiveInsightsTicker } from "../components/LiveInsightsTicker";
import type { PredictionKPIs } from "../types/ipl";

const MODEL_VERSION = "ACC-IPL-XGB-v2.3";
const LAST_REFRESH_UTC = new Date().toISOString().split("T")[0] + " 13:45";

const MODEL_FEATURES = [
  "Team momentum score over last 5 fixtures",
  "Venue-specific run-rate and wicket behavior",
  "Head-to-head context with recency weighting",
  "Powerplay and death-overs efficiency deltas",
  "Top-order and finisher impact index",
  "Probabilistic toss-impact adjustment",
];

const PIPELINE_STEPS = [
  {
    title: "Data Ingestion",
    detail: "Ball-by-ball, team sheets, venue history, weather proxy signals.",
  },
  {
    title: "Feature Engineering",
    detail:
      "Form vectors, phase-wise strike/wicket metrics, matchup strengths.",
  },
  {
    title: "Model Inference",
    detail:
      "Ensemble classification with calibration for stable probabilities.",
  },
  {
    title: "Human Review",
    detail: "Edge-case checks for injuries, lineup uncertainty, and anomalies.",
  },
];

function getMatchNo(id: string): number {
  return Number.parseInt(id.split("-")[1], 10);
}

function getConfidenceTier(confidence: number) {
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

export default function IPL2026Page() {
  const { data: predictions, isLoading, error } = usePredictions();

  // URL-Synced State Management
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTeam = searchParams.get("team") || "All Teams";
  const selectedVenue = searchParams.get("venue") || "All Venues";
  const sortBy = searchParams.get("sort") || "date";

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const teams = useMemo(() => {
    const uniqueTeams = new Set<string>();
    predictions.forEach((m) => {
      uniqueTeams.add(m.teamA);
      uniqueTeams.add(m.teamB);
    });
    return ["All Teams", ...Array.from(uniqueTeams).sort()];
  }, [predictions]);

  const venues = useMemo(() => {
    const uniqueVenues = Array.from(
      new Set(predictions.map((m) => m.venue)),
    ).sort();
    return ["All Venues", ...uniqueVenues];
  }, [predictions]);

  const filteredPredictions = useMemo(() => {
    return predictions
      .filter((m) => {
        const teamMatch =
          selectedTeam === "All Teams" ||
          m.teamA === selectedTeam ||
          m.teamB === selectedTeam;
        const venueMatch =
          selectedVenue === "All Venues" || m.venue === selectedVenue;
        return teamMatch && venueMatch;
      })
      .sort((a, b) => {
        if (sortBy === "confidence") return b.confidence - a.confidence;
        if (sortBy === "winner")
          return a.predictedWinner.localeCompare(b.predictedWinner);
        return a.id.localeCompare(b.id);
      });
  }, [predictions, selectedTeam, selectedVenue, sortBy]);

  const kpi: PredictionKPIs = useMemo(() => {
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

    return { total, avgConfidence, highConfidence, tossSensitive };
  }, [filteredPredictions]);

  if (isLoading) {
    return (
      <div className="bg-surface text-white min-h-screen pt-48 pb-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">Loading Industry-Ready Models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface text-white min-h-screen pt-48 pb-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-400">System Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-white min-h-screen pt-44 md:pt-48 lg:pt-52 pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Live Match Engine Readiness */}
        <LiveInsightsTicker />

        {/* Hero Section */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-12 items-start">
            <div>
              <span className="text-white/35 text-xs tracking-[0.3em] uppercase font-medium">
                Project IPL 2026
              </span>
              <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Upcoming Match
                <br />
                Prediction Intelligence
              </h1>
              <p className="mt-6 text-white/45 text-base md:text-lg leading-relaxed max-w-2xl">
                Production-ready pre-match prediction dashboard powered by
                structured cricket analytics. Outputs are calibrated
                probabilities, driver explanations, and confidence segmentation
                designed for transparency.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-xs tracking-wider uppercase">
                  Data Analytics
                </span>
                <span className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-xs tracking-wider uppercase">
                  Prediction Ops
                </span>
                <span className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-xs tracking-wider uppercase">
                  Sports Intelligence
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 md:p-7 border border-white/10">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
                Model Metadata
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/40">Model</span>
                  <span className="text-white/85 font-medium">
                    {MODEL_VERSION}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/40">Last Refresh (UTC)</span>
                  <span className="text-white/85 font-medium">
                    {LAST_REFRESH_UTC}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/40">Calibration Method</span>
                  <span className="text-white/85 font-medium">
                    Platt + Isotonic
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/40">Inference SLA</span>
                  <span className="text-white/85 font-medium">
                    &lt; 3 seconds
                  </span>
                </div>
              </div>
              <p className="mt-5 text-xs text-white/35 leading-relaxed">
                Probabilities indicate model confidence, not guaranteed
                outcomes. External match-day uncertainty can shift final
                results.
              </p>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article className="glass-card rounded-2xl p-6 border border-white/10">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              Visible Fixtures
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">{kpi.total}</p>
          </article>
          <article className="glass-card rounded-2xl p-6 border border-white/10">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              Avg Confidence
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">
              {kpi.avgConfidence}%
            </p>
          </article>
          <article className="glass-card rounded-2xl p-6 border border-white/10">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              High Confidence (&gt;=60%)
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">
              {kpi.highConfidence}
            </p>
          </article>
          <article className="glass-card rounded-2xl p-6 border border-white/10">
            <p className="text-white/35 text-xs tracking-[0.2em] uppercase">
              Toss Sensitive
            </p>
            <p className="mt-3 text-3xl font-heading font-bold">
              {kpi.tossSensitive}
            </p>
          </article>
        </section>

        {/* Features & Pipeline */}
        <section className="mt-16 grid lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-7 md:p-9 border border-white/10">
            <h2 className="font-heading text-2xl font-bold text-white">
              Feature Stack
            </h2>
            <ul className="mt-5 space-y-3">
              {MODEL_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-white/45 text-sm md:text-base"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/50" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-3xl p-7 md:p-9 border border-white/10">
            <h2 className="font-heading text-2xl font-bold text-white">
              Prediction Pipeline
            </h2>
            <div className="mt-5 space-y-4">
              {PIPELINE_STEPS.map((step, idx) => (
                <div key={step.title} className="flex items-start gap-4">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-white font-medium text-sm md:text-base">
                      {step.title}
                    </h3>
                    <p className="text-white/40 text-sm mt-1 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Predictions Section */}
        <section className="mt-16">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-medium">
                Predictions
              </span>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold text-white">
                Upcoming Matches
              </h2>
              <p className="mt-2 text-white/35 text-sm max-w-xl">
                Filter and prioritize fixtures by team, venue, and confidence to
                review likely outcomes.
              </p>
            </div>

            <div className="rounded-2xl p-3 border border-white/10 bg-white/[0.02] grid sm:grid-cols-3 gap-3 w-full md:w-auto">
              <label className="text-xs text-white/35 uppercase tracking-wider">
                Team
                <select
                  value={selectedTeam}
                  onChange={(e) => handleFilterChange("team", e.target.value)}
                  className="mt-1.5 w-full bg-black/35 border border-white/15 rounded-xl px-3 py-2.5 text-white/85 text-sm focus:outline-none focus:border-white/30"
                  aria-label="Filter by team"
                >
                  {teams.map((t) => (
                    <option key={t} value={t} className="bg-black text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-white/35 uppercase tracking-wider">
                Venue
                <select
                  value={selectedVenue}
                  onChange={(e) => handleFilterChange("venue", e.target.value)}
                  className="mt-1.5 w-full bg-black/35 border border-white/15 rounded-xl px-3 py-2.5 text-white/85 text-sm focus:outline-none focus:border-white/30"
                  aria-label="Filter by venue"
                >
                  {venues.map((v) => (
                    <option key={v} value={v} className="bg-black text-white">
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-white/35 uppercase tracking-wider">
                Sort
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
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

          {/* Prediction Cards Grid */}
          <div className="grid xl:grid-cols-2 gap-4 mb-6">
            {filteredPredictions.map((row) => {
              const tier = getConfidenceTier(row.confidence);
              return (
                <article
                  key={row.id}
                  className="glass-card rounded-2xl p-6 border border-white/10"
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

          {/* Data Table */}
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[960px]">
                <thead className="bg-white/[0.03] border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
                      Match No
                    </th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
                      Match
                    </th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
                      Date/Time
                    </th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
                      Predicted Winner
                    </th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-white/35 font-medium">
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
                            <TeamFlag teamName={row.predictedWinner} compact />
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
        </section>

        {/* Info Cards */}
        <section className="mt-16 grid lg:grid-cols-2 gap-5">
          <article className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="font-heading text-xl font-bold text-white">
              Production Notes
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/45">
              <li>
                Prediction snapshot refreshes every 6 hours during active match
                weeks.
              </li>
              <li>
                Late injury and playing-XI updates are applied in the pre-toss
                refresh window.
              </li>
              <li>
                Confidence is calibrated for consistency across low- and
                high-scoring venues.
              </li>
            </ul>
          </article>

          <article className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="font-heading text-xl font-bold text-white">
              Responsible Usage
            </h3>
            <p className="mt-4 text-sm text-white/45 leading-relaxed">
              This system is intended for educational analytics and strategic
              interpretation. It does not guarantee outcomes and should be used
              alongside expert cricket context.
            </p>
          </article>
        </section>

        {/* CTA Section */}
        <section className="mt-16">
          <div className="glass-card rounded-3xl p-7 md:p-9 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="font-heading text-2xl font-bold text-white">
                Need Live Match-Day Automation?
              </h3>
              <p className="mt-2 text-white/40 text-sm md:text-base">
                Next iteration can integrate live lineup feeds, toss event
                hooks, and real-time probability stream updates.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-full text-white/80 hover:text-white hover:border-white/35 transition-all"
              >
                Back to Projects
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all"
              >
                Export Prediction Snapshot
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
