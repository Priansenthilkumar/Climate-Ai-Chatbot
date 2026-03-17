import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "tourism",   osm: "tourism~\"attraction|museum|zoo|theme_park|gallery|viewpoint|aquarium\"", label: "🏛️ Attractions", color: "#818cf8" },
  { id: "natural",   osm: "natural~\"peak|beach|cave_entrance|waterfall\"",                         label: "🌿 Nature",      color: "#10b981" },
  { id: "historic",  osm: "historic~\"monument|castle|ruins|memorial|archaeological_site\"",        label: "🏰 Historic",    color: "#f97316" },
  { id: "amenity",   osm: "amenity~\"place_of_worship|theatre|arts_centre\"",                       label: "⛪ Culture",     color: "#fbbf24" },
  { id: "leisure",   osm: "leisure~\"park|garden|nature_reserve\"",                                 label: "🌳 Parks",       color: "#38bdf8" },
];

async function getCoords(city) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
  const data = await res.json();
  if (!data.results?.length) throw new Error(`City "${city}" not found.`);
  const { latitude: lat, longitude: lon, name, country } = data.results[0];
  return { lat, lon, name, country };
}

async function fetchOSMSpots(lat, lon, osmFilter) {
  const query = `[out:json][timeout:25];node[${osmFilter}](around:8000,${lat},${lon});out body 15;`;
  const res = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
  );
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.elements || [];
  } catch {
    throw new Error('Could not load spots. Overpass API unavailable, try again.');
  }
}

async function getWikiImage(title) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return {
      image: data.thumbnail?.source || null,
      desc: data.extract?.slice(0, 130) || null,
      url: data.content_urls?.desktop?.page || null,
    };
  } catch { return { image: null, desc: null, url: null }; }
}

async function buildSpots(lat, lon, osmFilter) {
  const elements = await fetchOSMSpots(lat, lon, osmFilter);
  const named = elements.filter(e => e.tags?.name).slice(0, 12);

  const spots = await Promise.all(
    named.map(async (e) => {
      const name = e.tags.name;
      const wiki = await getWikiImage(name);
      const dist = calcDist(lat, lon, e.lat, e.lon);
      return {
        id: e.id,
        name,
        desc: wiki.desc || e.tags?.description || e.tags?.["description:en"] || "A popular spot worth visiting.",
        image: wiki.image,
        url: wiki.url,
        dist: `${dist.toFixed(1)} km away`,
        type: Object.values(e.tags).find(v => typeof v === "string" && v.length > 2 && v !== name) || "attraction",
      };
    })
  );
  return spots.filter(s => s.name);
}

function calcDist(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function SpotCard({ spot, color, delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="spot-card" style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)",
      transition: `all 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      "--card-color": color,
    }}>
      <div className="dash-card-glow" style={{ background: color }} />
      {spot.image
        ? <img src={spot.image} alt={spot.name} className="spot-img" />
        : <div className="spot-img-placeholder">🗺️</div>
      }
      <div className="spot-body">
        <div className="spot-header">
          <h3 className="spot-name">{spot.name}</h3>
          <span className="spot-dist">{spot.dist}</span>
        </div>
        <p className="spot-desc">{spot.desc}...</p>
        <div className="spot-footer">
          <span className="spot-kind" style={{ color }}>{spot.type.replace(/_/g, " ")}</span>
          {spot.url && (
            <a href={spot.url} target="_blank" rel="noreferrer" className="spot-wiki-btn">
              Wikipedia →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TouristSpots() {
  const [spots, setSpots]       = useState([]);
  const [inputCity, setInputCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [coords, setCoords]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const search = async (lat, lon, name, tabIdx = activeTab) => {
    setLoading(true); setError(null); setSpots([]);
    try {
      const results = await buildSpots(lat, lon, CATEGORIES[tabIdx].osm);
      if (!results.length) setError("No spots found nearby. Try a bigger city.");
      else setSpots(results);
      setCityName(name);
      setCoords({ lat, lon });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputCity.trim()) return;
    setLoading(true); setError(null);
    try {
      const { lat, lon, name, country } = await getCoords(inputCity);
      setInputCity("");
      await search(lat, lon, `${name}, ${country}`);
    } catch (e) { setError(e.message); setLoading(false); }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setLoading(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const d = await res.json();
          const name = d.address?.city || d.address?.town || "Your Location";
          await search(latitude, longitude, name);
        } catch { await search(latitude, longitude, "Your Location"); }
      },
      () => { setError("Location denied. Please search manually."); setLoading(false); }
    );
  };

  const handleTab = async (idx) => {
    setActiveTab(idx);
    if (!coords) return;
    await search(coords.lat, coords.lon, cityName, idx);
  };

  const activeColor = CATEGORIES[activeTab].color;

  return (
    <div className="page">
      <h1>Tourist Spots</h1>
      <p>Discover top attractions near any city in the world.</p>

      <form onSubmit={handleSearch} style={{ marginBottom: "32px" }}>
        <div className="dash-search-wrapper">
          <div className="dash-search-box">
            <span className="dash-search-icon">🗺️</span>
            <input
              className="dash-search-input"
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              placeholder="Search any city for tourist spots..."
            />
            {inputCity && <button type="button" className="dash-search-clear" onClick={() => setInputCity("")}>✕</button>}
          </div>
          <button type="submit" className="dash-search-btn">Search</button>
          <button type="button" onClick={handleLocation} className="dash-loc-btn">
            <span>📍</span><span className="dash-loc-label">My Location</span>
          </button>
        </div>
      </form>

      {(spots.length > 0 || cityName) && (
        <div className="spot-tabs">
          {CATEGORIES.map((c, i) => (
            <button key={i} className={`spot-tab ${activeTab === i ? "active" : ""}`}
              style={{ "--tc": c.color }} onClick={() => handleTab(i)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {cityName && !loading && (
        <p className="section-label" style={{ marginBottom: "24px" }}>📍 {cityName}</p>
      )}

      {loading && (
        <div className="dash-loader">
          <div className="dash-loader-orbs">
            <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
          </div>
          <p className="dash-loader-text">Finding tourist spots...</p>
        </div>
      )}

      {error && <p className="error-msg">⚠️ {error}</p>}

      {!loading && !error && spots.length === 0 && !cityName && (
        <div className="spot-empty">
          <div style={{ fontSize: "64px", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>🌍</div>
          <h3 style={{ color: "#f1f5f9", fontSize: "20px", marginBottom: "8px" }}>Discover Amazing Places</h3>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Search a city or use your location to find tourist spots nearby</p>
        </div>
      )}

      {!loading && spots.length > 0 && (
        <div className="spot-grid">
          {spots.map((spot, i) => (
            <SpotCard key={spot.id} spot={spot} color={activeColor} delay={i * 80} />
          ))}
        </div>
      )}
    </div>
  );
}
