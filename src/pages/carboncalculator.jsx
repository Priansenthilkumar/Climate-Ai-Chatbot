import { useState } from "react";

const IconGlobe = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}>
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconLeaf = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);

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
    if (val < 5)  return { label: "Low",      icon: <IconCheck />,  color: "#10b981", pct: 20, tip: "Great job! Your footprint is below average. Keep it up!" };
    if (val < 15) return { label: "Moderate", icon: <IconAlert />,  color: "#f59e0b", pct: 55, tip: "Consider using public transport or renewable energy." };
    return              { label: "High",      icon: <IconAlert />,  color: "#ef4444", pct: 90, tip: "High footprint detected. Try reducing travel and energy use." };
  };

  const level = result !== null ? getLevel(parseFloat(result)) : null;

  return (
    <div className="page">
      <h1>Carbon Calculator</h1>
      <p>Measure your daily carbon footprint and take action.</p>

      <div className="calculator-form">
        <div className="calc-icon-header">
          <IconGlobe />
        </div>

        <div className="form-group">
          <label><IconCar />Daily Travel Distance (km)</label>
          <input type="number" placeholder="e.g. 30" value={travel} onChange={e => setTravel(e.target.value)} />
        </div>

        <div className="form-group">
          <label><IconZap />Daily Electricity Usage (kWh)</label>
          <input type="number" placeholder="e.g. 10" value={electric} onChange={e => setElectric(e.target.value)} />
        </div>

        <button className="btn-calculate" onClick={calculate}>
          <IconLeaf />Calculate My Footprint
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
            <div className="result-level" style={{ color: level.color }}>{level.icon}{level.label}</div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${level.pct}%`, background: level.color }}/>
            </div>

            <p style={{ fontSize: "13px", color: "#475569", marginTop: "16px" }}>{level.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarbonCalculator;
