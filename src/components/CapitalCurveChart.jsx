import { getCapitalCurve } from "../engine/capitalCurve";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div style={{
      background: "#161B22",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 13,
    }}>
      <div style={{ color: "#34d399", fontWeight: 700 }}>
        ${typeof val === "number" ? val.toFixed(2) : val}
      </div>
    </div>
  );
}

export default function CapitalCurveChart() {
  const curve = getCapitalCurve();

  if (!curve.length) {
    return (
      <div style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
        color: "rgba(226,232,240,0.3)",
      }}>
        <TrendingUp size={28} />
        <div style={{ fontSize: 13 }}>No resolved trades yet</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>Curve appears once signals resolve</div>
      </div>
    );
  }

  const data = curve.map(p => ({
    t: p.t,
    label: new Date(p.t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    capital: typeof p.capital === "number" ? Number(p.capital.toFixed(2)) : p.capital,
  }));

  const startVal = data[0]?.capital ?? 100;
  const endVal = data[data.length - 1]?.capital ?? 100;
  const pct = (((endVal - startVal) / startVal) * 100).toFixed(1);
  const isUp = endVal >= startVal;

  return (
    <div style={{
      background: "rgba(15,23,42,0.8)",
      border: `1px solid ${isUp ? "rgba(52,211,153,0.2)" : "rgba(244,63,94,0.2)"}`,
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Capital Curve</div>
          <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginTop: 2 }}>Simulated equity growth · {data.length} trades</div>
        </div>
        <div style={{
          padding: "4px 12px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          background: isUp ? "rgba(52,211,153,0.12)" : "rgba(244,63,94,0.12)",
          color: isUp ? "#34d399" : "#f43f5e",
          border: `1px solid ${isUp ? "rgba(52,211,153,0.25)" : "rgba(244,63,94,0.25)"}`,
        }}>
          {isUp ? "+" : ""}{pct}%
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: "rgba(226,232,240,0.3)" }}
            tickLine={false}
            axisLine={false}
            interval={Math.max(1, Math.floor(data.length / 5))}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(226,232,240,0.3)" }}
            tickLine={false}
            axisLine={false}
            domain={[d => Math.floor(d * 0.97), d => Math.ceil(d * 1.02)]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="capital"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#capGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#34d399", stroke: "rgba(52,211,153,0.5)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
