import React from "react";
import { TeamMetadata } from "../types/ipl";

const TEAM_META: Record<string, TeamMetadata> = {
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

export function getTeamMeta(teamName: string): TeamMetadata {
  return (
    TEAM_META[teamName] || {
      code: "TEAM",
      flagColor: "#9ca3af",
      textColor: "#f3f4f6",
    }
  );
}

interface TeamFlagProps {
  teamName: string;
  compact?: boolean;
}

export function TeamFlag({ teamName, compact = false }: TeamFlagProps) {
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
