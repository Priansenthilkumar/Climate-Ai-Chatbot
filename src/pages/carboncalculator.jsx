import { useState } from "react";

function CarbonCalculator() {
  const [travel, setTravel] = useState("");
  const [electric, setElectric] = useState("");
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const calculate = () => {
    const score = (parseFloat(travel) || 0) * 0.21 + (parseFloat(electric) || 0) * 0.5;
    setResult(null);
    setAnimating(true);
    setTimeout(() => { setResult(score.toFixed(2)); setAnimating(false); }, 400);
  };

  const getLevel = (val) => {
    if (val < 5)  return { label: "Low 🌿",    color: "#10b981", pct: 20 };
    if (val < 15) return { label: "Moderate ⚠️", color: "#f59e0b", pct: 55 };
    return              { label: "High 🔴",     color: "#ef4444", pct: 90 };
  };

  const level = result !== null ? getLevel(parseFloat(result)) : null;

  return (
    <div className="page">
      <h1>Carbon Calculator</h1>
      <p>Measure your daily carbon footprint and take action.</p>

      <div className="calculator-form">
        <div className="calc-icon-header">🌍</div>

        <div className="form-group">
          <label>🚗 Daily Travel Distance (km)</label>
          <input type="number" placeholder="e.g. 30" value={travel} onChange={e => setTravel(e.target.value)} />
        </div>

        <div className="form-group">
          <label>⚡ Daily Electricity Usage (kWh)</label>
          <input type="number" placeholder="e.g. 10" value={electric} onChange={e => setElectric(e.target.value)} />
        </div>

        <button className="btn-calculate" onClick={calculate}>
          Calculate My Footprint 🌱
        </button>

        {animating && (
          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <div className="loader-ring" style={{ margin: "0 auto" }}/>
          </div>
        )}

        {result !== null && !animating && (
          <div className="result-box result-animate">
            <p style={{ fontSize: "13px", color: "#6ee7b7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Your Daily Carbon Footprint</p>
            <div className="result-number">{result} <span style={{ fontSize: "20px" }}>kg CO₂</span></div>
            <div className="result-level" style={{ color: level.color }}>{level.label}</div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${level.pct}%`, background: level.color }}/>
            </div>

            <p style={{ fontSize: "13px", color: "#475569", marginTop: "16px" }}>
              {parseFloat(result) < 5
                ? "Great job! Your footprint is below average. Keep it up! 🎉"
                : parseFloat(result) < 15
                ? "Consider using public transport or renewable energy. 💡"
                : "High footprint detected. Try reducing travel and energy use. 🌱"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarbonCalculator;
