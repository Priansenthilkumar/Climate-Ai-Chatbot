import { useState, useEffect, useRef } from "react";
import { getWeatherByCity, getWeatherByCoords, getAirQuality } from "../service/weatherAPI";

function AnimatedNumber({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = parseFloat(value) || 0;
    let start = 0;
    const steps = 50;
    const step = num / steps;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      start += step;
      if (count >= steps) { setDisplay(num); clearInterval(timer); }
      else setDisplay(parseFloat(start.toFixed(1)));
    }, 25);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}{suffix}</span>;
}

function ProgressBar({ pct, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "50px", height: "4px", marginTop: "10px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: "50px", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
}

function WeatherCard({ icon, label, value, suffix, sub, color, pct, delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="dash-card" style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
      transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
      "--card-color": color,
    }}>
      <div className="dash-card-glow" style={{ background: color }} />
      <div className="dash-card-top">
        <span className="dash-card-icon">{icon}</span>
        <span className="dash-card-label">{label}</span>
      </div>
      <div className="dash-card-value" style={{ color }}>
        <AnimatedNumber value={typeof value === "number" ? value : 0} suffix={suffix} />
        {typeof value !== "number" && <span>{value}</span>}
      </div>
      <div className="dash-card-sub">{sub}</div>
      <ProgressBar pct={pct} color={color} />
    </div>
  );
}

function PulseLoader({ text }) {
  return (
    <div className="dash-loader">
      <div className="dash-loader-orbs">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <p className="dash-loader-text">{text}</p>
    </div>
  );
}

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  const fetchWeatherData = async (cityName) => {
    setLoading(true); setError(null); setHeaderVisible(false);
    try {
      const w = await getWeatherByCity(cityName);
      setWeather(w);
      try {
        const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
        const gd = await geo.json();
        if (gd.results?.length > 0) setAirQuality(await getAirQuality(gd.results[0].latitude, gd.results[0].longitude));
      } catch (_) {}
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setTimeout(() => setHeaderVisible(true), 100); }
  };

  const fetchByLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setLocating(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLoading(true); setLocating(false); setHeaderVisible(false);
        try {
          const w = await getWeatherByCoords(latitude, longitude);
          setWeather(w);
          setAirQuality(await getAirQuality(latitude, longitude));
        } catch (err) { setError(err.message); }
        finally { setLoading(false); setTimeout(() => setHeaderVisible(true), 100); }
      },
      () => { setLocating(false); setError("Location denied. Search manually."); }
    );
  };

  useEffect(() => { fetchByLocation(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) { fetchWeatherData(inputCity); setInputCity(""); }
  };

  const cards = weather ? [
    { icon: "🌡️", label: "Temperature", value: weather.temperature,  suffix: "°C",   sub: `Feels like ${weather.feelsLike}°C`,   color: "#f97316", pct: Math.min(100, ((weather.temperature + 20) / 60) * 100) },
    { icon: "💧", label: "Humidity",    value: weather.humidity,      suffix: "%",    sub: weather.description,                    color: "#38bdf8", pct: weather.humidity },
    { icon: "🌬️", label: "Wind Speed",  value: weather.windSpeed,     suffix: " m/s", sub: `Pressure: ${weather.pressure} hPa`,   color: "#818cf8", pct: Math.min(100, (weather.windSpeed / 30) * 100) },
    { icon: "🌿", label: "Air Quality", value: airQuality?.quality || "N/A", suffix: "", sub: `AQI: ${airQuality?.aqi ?? "-"}`, color: "#10b981", pct: airQuality ? Math.min(100, 100 - airQuality.aqi) : 50 },
  ] : [];

  if (loading || locating) return (
    <div className="page">
      <h1>Climate Dashboard</h1>
      <PulseLoader text={locating ? "📍 Detecting your location..." : "⏳ Fetching weather data..."} />
    </div>
  );

  return (
    <div className="page">
      <h1>Climate Dashboard</h1>
      <p>Real-time weather intelligence for any city on Earth.</p>

      <form onSubmit={handleSearch} style={{ marginBottom: "40px" }}>
        <div className="dash-search-wrapper">
          <div className="dash-search-box">
            <span className="dash-search-icon">🔍</span>
            <input
              className="dash-search-input"
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              placeholder="Search any city in the world..."
            />
            {inputCity && (
              <button type="button" className="dash-search-clear" onClick={() => setInputCity("")}>✕</button>
            )}
          </div>
          <button type="submit" className="dash-search-btn">Search</button>
          <button type="button" onClick={fetchByLocation} className="dash-loc-btn" title="Use my location">
            <span>📍</span><span className="dash-loc-label">My Location</span>
          </button>
        </div>
      </form>

      {error && <p className="error-msg">⚠️ {error}</p>}

      {weather && (
        <>
          <div className="city-header" style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <span className="city-icon">{weather.icon}</span>
            <div>
              <h2 className="city-name">{weather.city}, {weather.country}</h2>
              <span className="city-desc">{weather.description}</span>
            </div>
            <div className="city-time">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              <span style={{ display: "block", fontSize: "12px", color: "#475569" }}>
                {new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>

          <div className="dash-cards-grid">
            {cards.map((c, i) => (
              <WeatherCard key={i} {...c} delay={i * 120} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
