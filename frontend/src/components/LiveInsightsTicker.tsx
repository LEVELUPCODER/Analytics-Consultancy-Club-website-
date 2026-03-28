import React from "react";

export function LiveInsightsTicker() {
  // In the future, this component will connect to WebSockets
  // to stream live AI suggestions during the match.
  return (
    <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <p className="text-emerald-100 text-sm font-medium">
          Live Model Engine Active: Waiting for match toss data...
        </p>
      </div>
      <span className="text-xs text-emerald-500/60 uppercase tracking-widest">
        WebSockets Offline
      </span>
    </div>
  );
}
