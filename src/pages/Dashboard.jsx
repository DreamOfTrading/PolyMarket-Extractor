import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import AccuracyChart from "../components/AccuracyChart";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import ConfidenceDecayChart from "../components/ConfidenceDecayChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import DrawdownBanner from "../components/DrawdownBanner";
import CapitalCurveChart from "../components/CapitalCurveChart";
import ExportTradesButton from "../components/ExportTradesButton";

const GRID2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))", gap: 16 };
const LABEL = { fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" };

export default function Dashboard() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "24px",
      paddingBottom: 64,
      display: "flex",
      flexDirection: "column",
      gap: 28,
      background: "linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px),#0B0E14",
      backgroundSize: "40px 40px,40px 40px,auto",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em", margin: 0 }}>
            Crypto 15m Signal Dashboard
          </h1>
          <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0" }}>
            Live signals · BTC · ETH · SOL · XRP
          </p>
        </div>
        <ExportTradesButton />
      </div>

      {/* Drawdown warning */}
      <DrawdownBanner />

      {/* Signal grid — sticky strip */}
      <section style={{
        position: "sticky", top: 0, zIndex: 30,
        margin: "0 -24px", padding: "16px 24px",
        background: "rgba(11,14,20,0.93)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1e293b",
      }}>
        <Crypto15mSignalGrid />
      </section>

      {/* Session stats */}
      <section>
        <div style={LABEL}>Session Traction</div>
        <TractionPanel variant="compact" />
      </section>

      {/* Equity curve */}
      <section>
        <div style={LABEL}>Equity Curve</div>
        <CapitalCurveChart />
      </section>

      {/* Performance analytics */}
      <section>
        <div style={LABEL}>Performance Analytics</div>
        <div style={GRID2}>
          <ConfidenceWinRateChart />
          <EntryTimingPnLChart />
        </div>
      </section>

      {/* Signal accuracy */}
      <section>
        <div style={LABEL}>Signal Intelligence</div>
        <div style={GRID2}>
          <AccuracyChart />
          <ConfidenceDecayChart />
        </div>
      </section>

      {/* Live market data */}
      <section>
        <div style={LABEL}>Live Market Data</div>
        <div style={{ ...GRID2, paddingBottom: 16 }}>
          <PriceMovement />
          <LiquidityHeatmap />
        </div>
      </section>

    </div>
  );
}
