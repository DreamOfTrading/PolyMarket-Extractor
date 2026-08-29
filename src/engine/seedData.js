/* =========================================================
   Synthetic Data Seeder
   Generates realistic resolved signals for charts/analytics.
   Runs once on first load (no-op if data already present).
========================================================= */

const STORAGE_KEY = "pm_resolved_signals_v1";
const ASSETS = ["BTC", "ETH", "SOL", "XRP"];

const PRICE_BASES = { BTC: 67400, ETH: 3150, SOL: 128, XRP: 0.62 };
const PRICE_VOLS  = { BTC: 800,   ETH: 60,   SOL: 4,   XRP: 0.02 };

function rand(lo, hi) { return lo + Math.random() * (hi - lo); }
function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function jitter(base, vol) { return base + (Math.random() - 0.5) * 2 * vol; }

/* Simulate a realistic PnL:
   - High confidence signals → higher win rate
   - Entry delay erodes edge
   - Small position sizing (0.5–3% per trade) */
function simulatePnL(confidence, entryDelayMs, isWin) {
  const baseSize = rand(0.008, 0.028); // 0.8%–2.8% stake
  const edgeDecay = Math.max(0, 1 - entryDelayMs / (7 * 60000));
  const edge = (confidence - 0.5) * edgeDecay;
  const raw = isWin ? baseSize * (1 + edge) : -baseSize * (1 - edge * 0.4);
  return Number(raw.toFixed(5));
}

export function seedResolvedSignalsIfEmpty(count = 220) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (existing.length >= 20) return; // already has data
  } catch { /* ignore */ }

  const now = Date.now();
  const signals = [];

  /* Spread trades over last 5 days, denser recently */
  for (let i = 0; i < count; i++) {
    const ageMs = rand(0, 5 * 24 * 60 * 60 * 1000);
    const resolveAt = now - ageMs;
    const createdAt = resolveAt - 15 * 60 * 1000;
    const asset = pick(ASSETS);
    const confidence = Number(rand(0.60, 0.87).toFixed(4));

    /* Win probability skewed by confidence (calibrated) */
    const winProb = 0.35 + confidence * 0.55;
    const isWin = Math.random() < winProb;

    const entryDelayMs = Math.random() < 0.3
      ? rand(0, 60000)          // entered early (0–1m)
      : rand(60000, 7 * 60000); // normal window

    const priceAtStart = jitter(PRICE_BASES[asset], PRICE_VOLS[asset]);
    const direction = pick(["UP", "DOWN"]);
    const priceMove = direction === "UP"
      ? priceAtStart * rand(0.001, 0.012)
      : -priceAtStart * rand(0.001, 0.012);
    const priceAtObservation = priceAtStart + (isWin ? Math.abs(priceMove) : -Math.abs(priceMove));

    signals.push({
      id: `${asset}-15m-${resolveAt}-${i}`,
      symbol: asset,
      confidence,
      direction,
      bias: confidence >= 0.5 ? "LEANS_YES" : "LEANS_NO",
      createdAt,
      observeUntil: resolveAt,
      safeWindowEndsAt: createdAt + 15 * 60 * 1000 * 0.4,
      resolveAt,
      priceAtStart: Number(priceAtStart.toFixed(4)),
      priceAtObservation: Number(priceAtObservation.toFixed(4)),
      marketProbability: Number(rand(0.38, 0.62).toFixed(4)),
      edge: Number(rand(0.04, 0.18).toFixed(4)),
      mispriced: Math.random() > 0.4,
      regimeOK: Math.random() > 0.1,
      drawdownBlocked: false,
      entryDelayMs: Number(entryDelayMs.toFixed(0)),
      resolved: true,
      outcome: isWin ? "RESOLVED_UP" : "RESOLVED_DOWN",
      result: isWin ? "WIN" : "LOSS",
      pnl: simulatePnL(confidence, entryDelayMs, isWin),
      userNote: null,
      explanation: [
        `${asset} ${direction} signal · ${Math.round(confidence * 100)}% confidence`,
        `Edge: ${((confidence - 0.5) * 100).toFixed(1)}% vs market`,
        isWin ? "Resolved in predicted direction" : "Adverse price movement",
      ],
    });
  }

  /* Sort newest-first (matches loadResolvedSignals order) */
  signals.sort((a, b) => b.resolveAt - a.resolveAt);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  } catch { /* quota exceeded — ignore */ }
}
