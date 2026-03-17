import { useState, useEffect } from "react";
import { getWeatherByCity } from "../service/weatherAPI";

const IconFire = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const IconSun = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const IconSnowflake = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="m20 16-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>
  </svg>
);

const IconDroplets = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
  </svg>
);

const IconWind = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
  </svg>
);

const IconRain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="M16 14v6M8 14v6M12 16v6"/>
  </svg>
);

const IconStorm = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>
  </svg>
);

const IconCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
  </svg>
);

const IconAlert = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);

const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const ICON_MAP = {
  heat: <IconFire />, sun: <IconSun />, cold: <IconSnowflake />,
  humidity: <IconDroplets />, wind: <IconWind />, rain: <IconRain />,
  storm: <IconStorm />, clear: <IconCheck />, error: <IconAlert />
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [city, setCity] = useState("London");
  const [inputCity, setInputCity] = useState("");
  const [loading, setLoading] = useState(true);

  const generateAlerts = (weather) => {
    const list = [];
    if (weather.temperature > 35)
      list.push({ type: "critical", icon: "heat", title: "Extreme Heat Warning", message: `${weather.city} is ${weather.temperature}°C. Stay hydrated, avoid outdoor activities.` });
    else if (weather.temperature > 30)
      list.push({ type: "warning", icon: "sun", title: "Heatwave Alert", message: `High temperature of ${weather.temperature}°C. Take precautions outside.` });
    else if (weather.temperature < 0)
      list.push({ type: "warning", icon: "cold", title: "Freezing Temperature", message: `${weather.temperature}°C in ${weather.city}. Risk of ice on roads.` });

    if (weather.humidity > 80)
      list.push({ type: "info", icon: "humidity", title: "High Humidity", message: `Humidity at ${weather.humidity}%. Stay in ventilated areas.` });

    if (weather.windSpeed > 15)
      list.push({ type: "warning", icon: "wind", title: "Strong Wind Warning", message: `Wind speed ${weather.windSpeed} m/s. Secure loose objects outdoors.` });

    if (weather.description.toLowerCase().includes("rain") || weather.description.toLowerCase().includes("drizzle"))
      list.push({ type: "info", icon: "rain", title: "Rainfall Alert", message: `${weather.description} in ${weather.city}. Carry an umbrella.` });

    if (weather.description.toLowerCase().includes("storm") || weather.description.toLowerCase().includes("thunder"))
      list.push({ type: "critical", icon: "storm", title: "Storm Warning", message: `${weather.description} detected. Stay indoors.` });

    if (list.length === 0)
      list.push({ type: "info", icon: "clear", title: "All Clear", message: `Weather in ${weather.city} is pleasant — ${weather.description}. Enjoy your day!` });

    return list;
  };

  const fetchAlerts = async (cityName) => {
    setLoading(true);
    try {
      const weather = await getWeatherByCity(cityName);
      setCity(weather.city);
      setAlerts(generateAlerts(weather));
    } catch {
      setAlerts([{ type: "warning", icon: "error", title: "Fetch Failed", message: "Could not load weather data. Check your connection." }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAlerts(city); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) { fetchAlerts(inputCity); setInputCity(""); }
  };

  if (loading) return (
    <div className="page" style={{ textAlign: "center", paddingTop: "120px" }}>
      <div className="loader-ring"/>
      <p style={{ color: "#64748b", marginTop: "24px" }}>Loading alerts...</p>
    </div>
  );

  return (
    <div className="page">
      <h1>Climate Alerts</h1>
      <p>Live weather alerts and warnings for any city.</p>

      <form onSubmit={handleSearch} style={{ marginBottom: "40px" }}>
        <div className="chat-input-container" style={{ maxWidth: "560px", margin: "0 auto" }}>
          <input value={inputCity} onChange={e => setInputCity(e.target.value)} placeholder="Search city for alerts..." />
          <button type="submit">Search</button>
        </div>
      </form>

      <p className="section-label" style={{ marginBottom: "20px" }}>
        <IconPin />{city}
      </p>

      <div className="alert-container">
        {alerts.map((alert, i) => (
          <div key={i} className={`alert alert-${alert.type} alert-animate`} style={{ animationDelay: `${i * 0.12}s` }}>
            <div className={`alert-icon-wrap ${alert.type === "critical" ? "pulse-alert" : ""}`}>
              {ICON_MAP[alert.icon]}
            </div>
            <div>
              <strong style={{ fontSize: "16px" }}>{alert.title}</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", opacity: 0.85 }}>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
