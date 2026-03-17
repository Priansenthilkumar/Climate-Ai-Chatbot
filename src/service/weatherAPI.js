// Open-Meteo - completely free, no API key needed
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const HISTORY_URL = 'https://archive-api.open-meteo.com/v1/archive';

const getCoords = async (city) => {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error(`City "${city}" not found.`);
  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, city: name, country };
};

const fetchWeather = async (lat, lon, cityName, country) => {
  const res = await fetch(
    `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&timezone=auto`
  );
  const data = await res.json();
  const c = data.current;

  return {
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    pressure: Math.round(c.surface_pressure),
    description: getWeatherDescription(c.weather_code),
    icon: getWeatherIcon(c.weather_code),
    city: cityName,
    country
  };
};

export const getWeatherByCity = async (city) => {
  const { lat, lon, city: cityName, country } = await getCoords(city);
  return fetchWeather(lat, lon, cityName, country);
};

export const getWeatherByCoords = async (lat, lon) => {
  // Reverse geocode using Open-Meteo nominatim
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  const data = await res.json();
  const cityName = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
  const country = data.address?.country_code?.toUpperCase() || '';
  return fetchWeather(lat, lon, cityName, country);
};

export const getHistoricalWeather = async (city, days = 5) => {
  const { lat, lon, city: cityName, country } = await getCoords(city);
  const end = new Date();
  end.setDate(end.getDate() - 1); // yesterday (archive has 1-day delay)
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  const fmt = d => d.toISOString().split('T')[0];

  const res = await fetch(
    `${HISTORY_URL}?latitude=${lat}&longitude=${lon}&start_date=${fmt(start)}&end_date=${fmt(end)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code&timezone=auto`
  );
  const data = await res.json();
  const d = data.daily;

  const days_data = d.time.map((date, i) => ({
    date,
    maxTemp: Math.round(d.temperature_2m_max[i]),
    minTemp: Math.round(d.temperature_2m_min[i]),
    precipitation: d.precipitation_sum[i],
    windSpeed: Math.round(d.wind_speed_10m_max[i]),
    description: getWeatherDescription(d.weather_code[i]),
    icon: getWeatherIcon(d.weather_code[i]),
  }));

  return { city: cityName, country, days: days_data };
};

export const getAirQuality = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`
    );
    const data = await res.json();
    const aqi = data.current?.european_aqi ?? 50;
    const quality = aqi <= 20 ? 'Good' : aqi <= 40 ? 'Fair' : aqi <= 60 ? 'Moderate' : aqi <= 80 ? 'Poor' : 'Very Poor';
    return { aqi, quality };
  } catch {
    return { aqi: '-', quality: 'N/A' };
  }
};

const getWeatherDescription = (code) => {
  const map = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Heavy drizzle', 61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
    81: 'Rain showers', 82: 'Heavy rain showers', 95: 'Thunderstorm',
    96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
  };
  return map[code] || 'Unknown';
};

const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌤️';
};
