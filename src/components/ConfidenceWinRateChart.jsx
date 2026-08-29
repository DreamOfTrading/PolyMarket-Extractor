import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from "recharts";
import { getConfidenceWinRateStats } from "../engine/confidenceAnalytics";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "#161B22",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 12,
    }}>
      <div style={{ color: "rgba(226,232,240,0.5)", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#e2e8f0", fontWeight: 700 }}>{d.winRate ?? "—"}% win rate</div>
      <div style={{ color: "rgba(226,232,240,0.4)", fontSize: 11, marginTop: 2 }}>{d.total} signals</div>
    </div>
  );
}

function barColor(winRate) {
  if (winRate == null) return "#334155";
  if (winRate >= 70) return "#10b981";
  if (winRate >= 60) return "#f59e0b";
  return "#f43f5e";
}

export default function ConfidenceWinRateChart() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const compute = () => setStats(getConfidenceWinRateStats(300));
    compute();
    const id = setInterval(compute, 3000);
    return () => clearInterval(id);
  }, []);

  const hasData = stats.some(s => s.total > 0);

  return (
    <div style={{
      background: "rgba(15,23,42,0.8)",
      border: "1px solid #1e293b",
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Confidence vs Win Rate</div>
        <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginTop: 2 }}>Win rate by confidence bucket</div>
      </div>

      {!hasData ? (
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(226,232,240,0.3)", fontSize: 12 }}>
          Accumulating data…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={stats} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "rgba(226,232,240,0.4)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "rgba(226,232,240,0.4)" }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <ReferenceLine y={50} stroke="rgba(244,63,94,0.4)" strokeDasharray="4 4" />
            <ReferenceLine y={65} stroke="rgba(16,185,129,0.3)" strokeDasharray="4 4" />
            <Bar dataKey="winRate" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {stats.map((s, i) => (
                <Cell key={i} fill={barColor(s.winRate)} fillOpacity={s.total === 0 ? 0.2 : 0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
