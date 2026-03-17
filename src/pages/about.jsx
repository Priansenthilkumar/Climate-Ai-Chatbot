function About() {
  const features = [
    { emoji: "📊", title: "Live Dashboard", desc: "Real-time weather metrics with beautiful visualizations." },
    { emoji: "🤖", title: "AI Chatbot", desc: "Google Gemini-powered assistant for climate Q&A." },
    { emoji: "⚡", title: "Smart Alerts", desc: "Instant warnings for extreme weather events." },
    { emoji: "🌿", title: "Carbon Tracker", desc: "Calculate and reduce your environmental impact." },
    { emoji: "🌍", title: "Global Coverage", desc: "Weather data for any city worldwide." },
    { emoji: "📡", title: "Real-Time Data", desc: "Live updates powered by Open-Meteo API." },
  ];

  const stack = ["React 18", "Google Gemini AI", "Open-Meteo API", "React Router", "CSS Animations", "Geolocation API"];

  return (
    <div className="page">
      <h1>About Climate AI</h1>
      <p>An AI-powered climate intelligence platform built to help people understand and respond to environmental changes.</p>

      <div className="about-content">
        <div className="about-banner">
          <span style={{ fontSize: "48px" }}>🌍</span>
          <div>
            <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: "22px" }}>Our Mission</h3>
            <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "15px" }}>
              Making climate data accessible, understandable, and actionable for everyone on the planet.
            </p>
          </div>
        </div>

        <h3>Key Features</h3>
        <div className="about-features-grid">
          {features.map((f, i) => (
            <div className="about-feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <span style={{ fontSize: "28px" }}>{f.emoji}</span>
              <div>
                <strong style={{ color: "#f1f5f9", fontSize: "15px" }}>{f.title}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3>Technology Stack</h3>
        <div className="tech-stack">
          {stack.map((t, i) => (
            <span key={i} className="tech-badge" style={{ animationDelay: `${i * 0.07}s` }}>{t}</span>
          ))}
        </div>

        <h3>How It Works</h3>
        <ul>
          <li>Enter any city or allow location access to get live weather</li>
          <li>AI chatbot enriches responses with real-time weather data</li>
          <li>Smart alert engine monitors conditions and warns you instantly</li>
          <li>Carbon calculator uses emission factors to estimate your footprint</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
