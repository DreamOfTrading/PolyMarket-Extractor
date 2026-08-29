import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from "recharts";
import { Clock } from "lucide-react";
import { getEntryTimingPnLStats } from "../engine/entryTimingPnLAnalytics";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pnl = d.avgPnL;
  return (
    <div style={{
      background: "#161B22",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 12,
    }}>
      <div style={{ color: "rgba(226,232,240,0.5)", marginBottom: 4 }}>Entry delay {label}</div>
      {pnl != null ? (
        <div style={{ color: pnl >= 0 ? "#10b981" : "#f43f5e", fontWeight: 700 }}>
          Avg PnL: {pnl >= 0 ? "+" : ""}{(pnl * 100).toFixed(2)}%
        </div>
      ) : (
        <div style={{ color: "rgba(226,232,240,0.4)" }}>Not enough data</div>
      )}
      <div style={{ color: "rgba(226,232,240,0.4)", fontSize: 11, marginTop: 2 }}>{d.count} signals</div>
    </div>
  );
}

export default function EntryTimingPnLChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getEntryTimingPnLStats(300));
  }, []);

  const hasData = rows.some(r => r.avgPnL != null);

  return (
    <div style={{
      background: "rgba(15,23,42,0.8)",
      border: "1px solid #1e293b",
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Entry Timing vs PnL</div>
        <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginTop: 2 }}>Edge decay by entry delay</div>
      </div>

      {!hasData ? (
        <div style={{
          height: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: "rgba(226,232,240,0.3)",
        }}>
          <Clock size={22} />
          <div style={{ fontSize: 12 }}>Accumulating entry timing data…</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={rows} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
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
              tickFormatter={v => `${(v * 100).toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <ReferenceLine y={0} stroke="rgba(226,232,240,0.15)" />
            <Bar dataKey="avgPnL" radius={[4, 4, 0, 0]} maxBarSize={44}>
              {rows.map((r, i) => (
                <Cell
                  key={i}
                  fill={r.avgPnL == null ? "#1e293b" : r.avgPnL >= 0 ? "#10b981" : "#f43f5e"}
                  fillOpacity={r.avgPnL == null ? 0.3 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
