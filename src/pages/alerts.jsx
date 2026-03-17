import { useState, useEffect } from "react";
import { getWeatherByCity } from "../service/weatherAPI";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [city, setCity] = useState("London");
  const [inputCity, setInputCity] = useState("");
  const [loading, setLoading] = useState(true);

  const generateAlerts = (weather) => {
    const list = [];
    if (weather.temperature > 35)
      list.push({ type: "critical", emoji: "🔥", title: "Extreme Heat Warning", message: `${weather.city} is ${weather.temperature}°C. Stay hydrated, avoid outdoor activities.` });
    else if (weather.temperature > 30)
      list.push({ type: "warning", emoji: "☀️", title: "Heatwave Alert", message: `High temperature of ${weather.temperature}°C. Take precautions outside.` });
    else if (weather.temperature < 0)
      list.push({ type: "warning", emoji: "🧊", title: "Freezing Temperature", message: `${weather.temperature}°C in ${weather.city}. Risk of ice on roads.` });

    if (weather.humidity > 80)
      list.push({ type: "info", emoji: "💧", title: "High Humidity", message: `Humidity at ${weather.humidity}%. Stay in ventilated areas.` });

    if (weather.windSpeed > 15)
      list.push({ type: "warning", emoji: "🌬️", title: "Strong Wind Warning", message: `Wind speed ${weather.windSpeed} m/s. Secure loose objects outdoors.` });

    if (weather.description.toLowerCase().includes("rain") || weather.description.toLowerCase().includes("drizzle"))
      list.push({ type: "info", emoji: "🌧️", title: "Rainfall Alert", message: `${weather.description} in ${weather.city}. Carry an umbrella.` });

    if (weather.description.toLowerCase().includes("storm") || weather.description.toLowerCase().includes("thunder"))
      list.push({ type: "critical", emoji: "⛈️", title: "Storm Warning", message: `${weather.description} detected. Stay indoors.` });

    if (list.length === 0)
      list.push({ type: "info", emoji: "✅", title: "All Clear", message: `Weather in ${weather.city} is pleasant — ${weather.description}. Enjoy your day!` });

    return list;
  };

  const fetchAlerts = async (cityName) => {
    setLoading(true);
    try {
      const weather = await getWeatherByCity(cityName);
      setCity(weather.city);
      setAlerts(generateAlerts(weather));
    } catch {
      setAlerts([{ type: "warning", emoji: "⚠️", title: "Fetch Failed", message: "Could not load weather data. Check your connection." }]);
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

      <p className="section-label" style={{ marginBottom: "20px" }}>📍 {city}</p>

      <div className="alert-container">
        {alerts.map((alert, i) => (
          <div key={i} className={`alert alert-${alert.type} alert-animate`} style={{ animationDelay: `${i * 0.12}s` }}>
            <div className={`alert-emoji ${alert.type === "critical" ? "pulse-alert" : ""}`}>{alert.emoji}</div>
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
