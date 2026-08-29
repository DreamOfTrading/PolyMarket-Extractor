import { useEffect, useRef, useState } from "react";
import { getActive15mSignals } from "../engine/Crypto15mSignalEngine";
import ConfidenceExplanation from "./ConfidenceExplanation";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];

function formatTime(ms) {
  if (!ms || isNaN(ms) || ms <= 0) return "0:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Crypto15mSignalGrid() {
  const [signals, setSignals] = useState({});
  const stripRef = useRef(null);

  useEffect(() => {
    const tick = () => setSignals(getActive15mSignals());
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      ref={stripRef}
      className="
        grid
        w-full
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
      "
    >
      {ASSETS.map((asset) => {
        const s = signals[asset];
        if (!s) return null;

        const remaining = (s.resolveAt && !isNaN(s.resolveAt)) ? s.resolveAt - Date.now() : 0;
        const confidencePct = Math.round((s.confidence ?? 0) * 100);
        const isUrgent = remaining > 0 && remaining < 5 * 60 * 1000;

        return (
          <div
            key={s.id}
            className={`
              card
              p-5
              space-y-4
              bg-gradient-to-br from-black/80 to-black/95
              ${isUrgent ? "resolve-border" : ""}
            `}
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <div className="text-base font-semibold">
                  {asset} · 15m
                </div>

                {remaining > 0 && (
                  <div
                    className={`text-sm font-semibold flex items-center gap-1 ${
                      isUrgent ? "fire text-red-400" : "text-white/50"
                    }`}
                  >
                    {isUrgent ? "🔥" : "⏱"} Resolve in {formatTime(remaining)}
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold leading-none">
                  {confidencePct}%
                </div>
                <div className="text-sm opacity-70">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* ANALYTICS STATUS */}
            <div className="text-sm font-semibold text-white/40">
              Analytics only · Execution disabled
            </div>

            {/* ACTIONS (SAFE) */}
            <div className="flex gap-3">
              <a
                href="https://polymarket.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold text-center"
              >
                View Market ↗
              </a>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${asset} ${s.direction} · ${confidencePct}%\nResolve in ${formatTime(
                      remaining
                    )}`
                  )
                }
                className="flex-1 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold"
              >
                Copy Thesis
              </button>
            </div>

            {/* CONFIDENCE EXPLANATION */}
            <div className="bg-black/40 rounded-lg p-3 decay">
              <ConfidenceExplanation signal={s} />
            </div>

            {/* FOOTER */}
            <div className="flex justify-between text-sm text-white/50">
              <span>Why this signal?</span>
              <span className="italic">Model-derived analytics</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
