import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Typewriter({ words }) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wi];
    const speed = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting && text === word) setTimeout(() => setDeleting(true), 1400);
      else if (deleting && text === "") { setDeleting(false); setWi(p => (p + 1) % words.length); }
      else setText(p => deleting ? p.slice(0, -1) : word.slice(0, p.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, wi, words]);
  return <span className="home-typewriter">{text}<span className="home-cursor">|</span></span>;
}

function RevealCard({ children, delay = 0 }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
      transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`
    }}>
      {children}
    </div>
  );
}

const IconThermometer = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
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
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const IconLeaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconBarChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconCountries = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconSignal = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>
  </svg>
);

const IconZap = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}>
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconRocket = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m3.5 11.5 1 4 4 1 7-7-5-5z"/><path d="m20.5 3.5-5 5"/>
    <path d="M15 4.5 19.5 9"/><path d="m3.5 11.5 5-5"/>
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}>
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
  </svg>
);

export default function Home() {
  const features = [
    { Icon: IconThermometer, color: "#f97316", bg: "rgba(249,115,22,0.12)",  title: "Live Weather",     desc: "Real-time temperature, humidity, wind and pressure from anywhere in the world." },
    { Icon: IconBot,         color: "#818cf8", bg: "rgba(129,140,248,0.12)", title: "AI Chatbot",        desc: "Powered by Google Gemini AI to answer all your climate and weather questions." },
    { Icon: IconBell,        color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  title: "Smart Alerts",      desc: "Instant alerts for extreme weather events, storms, heatwaves and more." },
    { Icon: IconLeaf,        color: "#10b981", bg: "rgba(16,185,129,0.12)",  title: "Carbon Calculator", desc: "Calculate and track your personal carbon footprint with actionable tips." },
    { Icon: IconBarChart,    color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  title: "Dashboard",         desc: "Beautiful visual dashboard with air quality index and weather metrics." },
    { Icon: IconGlobe,       color: "#f472b6", bg: "rgba(244,114,182,0.12)", title: "Global Coverage",   desc: "Monitor climate data for any city across the globe in real time." },
  ];

  const stats = [
    { num: "195+",  label: "Countries",       Icon: IconCountries, color: "#38bdf8" },
    { num: "1M+",   label: "Data Points/Day", Icon: IconSignal,    color: "#818cf8" },
    { num: "99.9%", label: "Uptime",          Icon: IconZap,       color: "#fbbf24" },
    { num: "24/7",  label: "Live Updates",    Icon: IconRefresh,   color: "#10b981" },
  ];

  return (
    <div>
      {/* HERO */}
      <div className="home-hero">
        <div className="home-hero-left">
          <div className="home-badge" style={{ animation: "fadeInDown 0.6s ease both" }}>
            <span className="home-badge-dot" />
            AI-Powered Climate Intelligence
          </div>

          <h1 className="home-hero-h1" style={{ animation: "fadeInDown 0.7s ease 0.1s both" }}>
            The Smartest Way<br />to{" "}
            <Typewriter words={["Monitor Climate", "Predict Weather", "Track Carbon", "Protect Earth"]} />
          </h1>

          <p className="home-hero-p" style={{ animation: "fadeInUp 0.7s ease 0.2s both" }}>
            Advanced AI climate system that monitors real-time weather data,
            predicts environmental risks, and helps reduce your carbon footprint.
          </p>

          <div className="home-hero-btns" style={{ animation: "fadeInUp 0.7s ease 0.3s both" }}>
            <Link to="/dashboard" className="home-btn-primary"><IconDashboard />View Dashboard</Link>
            <Link to="/chatbot" className="home-btn-ghost"><IconChat />Ask AI Chatbot</Link>
          </div>

          <div className="home-pills" style={{ animation: "fadeInUp 0.7s ease 0.5s both" }}>
            <span className="home-pill" style={{ "--pc": "#f97316" }}>
              <IconThermometer /> Live Temp
            </span>
            <span className="home-pill" style={{ "--pc": "#38bdf8" }}>
              <IconBarChart /> AQI Tracking
            </span>
            <span className="home-pill" style={{ "--pc": "#10b981" }}>
              <IconLeaf /> Carbon Score
            </span>
          </div>
        </div>

        {/* Globe */}
        <div className="home-globe-wrap" style={{ animation: "fadeIn 1s ease 0.3s both" }}>
          <div className="home-globe-ring r1" />
          <div className="home-globe-ring r2" />
          <svg className="home-globe-svg" viewBox="0 0 200 200" fill="none">
            <defs>
              <radialGradient id="hg1" cx="38%" cy="32%" r="62%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95"/>
                <stop offset="45%" stopColor="#6366f1" stopOpacity="0.85"/>
                <stop offset="100%" stopColor="#0a0f1e" stopOpacity="1"/>
              </radialGradient>
              <radialGradient id="hg2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#hg2)"/>
            <circle cx="100" cy="100" r="78" fill="url(#hg1)" stroke="rgba(56,189,248,0.35)" strokeWidth="1.5"/>
            <ellipse cx="100" cy="100" rx="38" ry="78" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none"/>
            <ellipse cx="100" cy="100" rx="78" ry="28" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none"/>
            <ellipse cx="100" cy="100" rx="78" ry="52" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"/>
            <path d="M28 72 Q52 62 68 78 Q84 94 112 82 Q132 72 158 78" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none"/>
            <path d="M22 108 Q48 98 74 114 Q100 130 132 108 Q152 94 172 104" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none"/>
            <circle cx="66" cy="70" r="11" fill="rgba(16,185,129,0.65)"/>
            <circle cx="122" cy="83" r="15" fill="rgba(16,185,129,0.55)"/>
            <circle cx="88" cy="122" r="9" fill="rgba(16,185,129,0.45)"/>
            <circle cx="148" cy="104" r="8" fill="rgba(16,185,129,0.55)"/>
            <circle cx="52" cy="112" r="7" fill="rgba(16,185,129,0.45)"/>
          </svg>
        </div>
      </div>

      <div className="page" style={{ paddingTop: "0" }}>

        {/* STATS */}
        <div className="glow-divider" />
        <div className="section-label">By The Numbers</div>
        <div className="home-stats-grid">
          {stats.map((s, i) => (
            <RevealCard key={i} delay={i * 80}>
              <div className="dash-card" style={{ "--card-color": s.color, textAlign: "center" }}>
                <div className="dash-card-glow" style={{ background: s.color }} />
                <div style={{ color: s.color, marginBottom: "10px" }}><s.Icon /></div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: s.color, letterSpacing: "-1px" }}>{s.num}</div>
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "6px" }}>{s.label}</div>
              </div>
            </RevealCard>
          ))}
        </div>

        <div className="glow-divider" />

        {/* FEATURES */}
        <div className="section-label">What We Offer</div>
        <h2 style={{ textAlign: "center", fontSize: "38px", fontWeight: 800, color: "#f1f5f9", marginBottom: "10px", letterSpacing: "-0.5px" }}>
          Everything You Need
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "15px", marginBottom: "40px" }}>
          A complete climate intelligence platform in one place.
        </p>

        <div className="home-features-grid">
          {features.map((f, i) => (
            <RevealCard key={i} delay={i * 80}>
              <div className="dash-card home-feature-card" style={{ "--card-color": f.color }}>
                <div className="dash-card-glow" style={{ background: f.color }} />
                <div className="home-feature-icon" style={{ background: f.bg, color: f.color }}>
                  <f.Icon />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: f.color, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                <div style={{ height: "2px", background: f.color, borderRadius: "2px", marginTop: "18px", opacity: 0.4 }} />
              </div>
            </RevealCard>
          ))}
        </div>

        <div className="glow-divider" />

        {/* CTA */}
        <div style={{ textAlign: "center", paddingBottom: "40px", animation: "fadeInUp 0.6s ease both" }}>
          <h2 style={{ fontSize: "42px", fontWeight: 900, color: "#f1f5f9", marginBottom: "14px", letterSpacing: "-1px" }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "16px" }}>
            Explore real-time climate data and AI-powered insights right now.
          </p>
          <div className="home-hero-btns">
            <Link to="/dashboard" className="home-btn-primary"><IconRocket />Launch Dashboard</Link>
            <Link to="/about" className="home-btn-ghost"><IconInfo />Learn More</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
