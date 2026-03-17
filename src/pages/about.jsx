const IconBarChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const IconBot = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4M8 15h.01M16 15h.01"/>
  </svg>
);

const IconBell = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const IconLeaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconSignal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>
  </svg>
);

const IconGlobeLarge = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

function About() {
  const features = [
    { Icon: IconBarChart, title: "Live Dashboard",   desc: "Real-time weather metrics with beautiful visualizations." },
    { Icon: IconBot,      title: "AI Chatbot",       desc: "Google Gemini-powered assistant for climate Q&A." },
    { Icon: IconBell,     title: "Smart Alerts",     desc: "Instant warnings for extreme weather events." },
    { Icon: IconLeaf,     title: "Carbon Tracker",   desc: "Calculate and reduce your environmental impact." },
    { Icon: IconGlobe,    title: "Global Coverage",  desc: "Weather data for any city worldwide." },
    { Icon: IconSignal,   title: "Real-Time Data",   desc: "Live updates powered by Open-Meteo API." },
  ];

  const stack = ["React 18", "Google Gemini AI", "Open-Meteo API", "React Router", "CSS Animations", "Geolocation API"];

  return (
    <div className="page">
      <h1>About Climate AI</h1>
      <p>An AI-powered climate intelligence platform built to help people understand and respond to environmental changes.</p>

      <div className="about-content">
        <div className="about-banner">
          <span style={{ color: "#38bdf8" }}><IconGlobeLarge /></span>
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
              <span style={{ color: "#38bdf8" }}><f.Icon /></span>
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
