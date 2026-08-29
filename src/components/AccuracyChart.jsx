import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#161B22",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 12,
    }}>
      <div style={{ color: "rgba(226,232,240,0.5)", marginBottom: 2 }}>Trade #{label}</div>
      <div style={{ color: "#60a5fa", fontWeight: 700 }}>{payload[0].value}% win rate</div>
    </div>
  );
}

export default function AccuracyChart() {
  const data = useMemo(() => {
    const signals = getLastResolvedSignals(300)
      .filter(s => s.result === "WIN" || s.result === "LOSS")
      .sort((a, b) => a.resolveAt - b.resolveAt);

    let wins = 0;
    return signals.map((s, i) => {
      if (s.result === "WIN") wins++;
      return {
        index: i + 1,
        accuracy: Number(((wins / (i + 1)) * 100).toFixed(1)),
      };
    });
  }, []);

  if (!data.length) {
    return (
      <div style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(226,232,240,0.3)",
        fontSize: 13,
      }}>
        No resolved signals yet
      </div>
    );
  }

  const latest = data[data.length - 1]?.accuracy ?? 0;

  return (
    <div style={{
      background: "rgba(15,23,42,0.8)",
      border: "1px solid #1e293b",
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Accuracy Over Time</div>
          <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginTop: 2 }}>Rolling cumulative win rate · {data.length} trades</div>
        </div>
        <div style={{
          padding: "4px 12px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          background: latest >= 60 ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
          color: latest >= 60 ? "#10b981" : "#f59e0b",
          border: `1px solid ${latest >= 60 ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
        }}>
          {latest}%
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="index"
            tick={{ fontSize: 9, fill: "rgba(226,232,240,0.3)" }}
            tickLine={false}
            axisLine={false}
            interval={Math.max(1, Math.floor(data.length / 5))}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(226,232,240,0.3)" }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={50} stroke="rgba(244,63,94,0.4)" strokeDasharray="4 4" />
          <ReferenceLine y={65} stroke="rgba(16,185,129,0.3)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
