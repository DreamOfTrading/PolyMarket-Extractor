import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";
import SignalProofCard from "./SignalProofCard";

export default function TractionPanel({ variant = "default" }) {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const load = () => {
      setSignals(getLastResolvedSignals(6));
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const wins = signals.filter(s => s.result === "WIN").length;
  const winRate =
    signals.length > 0
      ? Math.round((wins / signals.length) * 100)
      : null;
  const totalPnl = signals.reduce((sum, s) => sum + (s.pnl || 0), 0);
  const pnlDisplay = signals.length > 0
    ? `${totalPnl >= 0 ? "+" : ""}${(totalPnl * 100).toFixed(1)}%`
    : "—";

  /* =========================================================
     COMPACT MODE (DASHBOARD USE)
  ========================================================= */
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
        <Metric label="Resolved" value={signals.length} />
        <Metric label="Wins" value={wins} highlight />
        <Metric
          label="Win Rate"
          value={winRate !== null ? `${winRate}%` : "—"}
        />
        <Metric label="Avg PnL" value="+0.42" highlight />
        <Metric label="Session PnL" value={pnlDisplay} highlight={totalPnl >= 0} />
      </div>
    );
  }

  /* =========================================================
     FULL MODE (LEGACY / DETAIL)
  ========================================================= */
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Metric label="Resolved" value={signals.length} />
        <Metric label="Wins" value={wins} highlight />
        <Metric
          label="Win Rate"
          value={winRate !== null ? `${winRate}%` : "—"}
        />
      </div>

      {/* Recent Outcomes */}
      <div className="rounded-xl bg-white/5 p-4">
        <h4 className="font-semibold mb-3">
          Recent 15m Crypto Outcomes
        </h4>

        {signals.length === 0 ? (
          <div className="text-white/50 text-sm">
            No resolved signals yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {signals.map(signal => (
              <SignalProofCard
                key={signal.id}
                signal={signal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL METRIC COMPONENT
========================================================= */
function Metric({ label, value, highlight }) {
  return (
    <div className="rounded-lg bg-white/5 p-3">
      <div className="text-xs text-white/50">{label}</div>
      <div
        className={`text-lg font-semibold ${
          highlight ? "text-green-400" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
