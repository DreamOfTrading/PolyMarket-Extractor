import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
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

export default function ConfidenceDecayChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getConfidenceWinRateStats(300));
  }, []);

  return (
    <div style={{
      background: "rgba(15,23,42,0.8)",
      border: "1px solid #1e293b",
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Confidence Calibration</div>
        <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginTop: 2 }}>Win rate by confidence band</div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={rows} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
          <Bar dataKey="winRate" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {rows.map((r, i) => (
              <Cell
                key={i}
                fill={
                  r.winRate == null ? "#1e293b"
                  : r.winRate >= 70 ? "#10b981"
                  : r.winRate >= 60 ? "#f59e0b"
                  : "#f43f5e"
                }
                fillOpacity={r.total === 0 ? 0.2 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
