import { useState, useRef, useEffect } from "react";
import { askGemini } from "../service/chatbotAPI";
import { getWeatherByCity, getHistoricalWeather } from "../service/weatherAPI";

const SUGGESTIONS = [
  "Weather in Tokyo",
  "What causes heatwaves?",
  "Tips to reduce carbon footprint",
  "Effects of rising sea levels",
];

const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20V16H14L10 20V16H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9H16M8 13H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
  </svg>
);

const IconGlobe = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M2 12H22M12 2C14.5 2 16.7 3.4 17.8 5.5M12 22C9.5 22 7.3 20.6 6.2 18.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="12" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M9 8H9.01M15 8H15.01M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" />
    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22" stroke="currentColor" strokeWidth="2" />
  </svg>
);

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current)
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userText, id: Date.now() }]);
    setLoading(true);
    try {
      let prompt = userText;
      const lower = userText.toLowerCase();

      // Detect past/historical weather query
      const historyMatch = lower.match(
        /(?:past|last|previous|history|historical)\s*(\d+)?\s*days?.*?(?:in|for|at)?\s*([a-zA-Z\s]+)|([a-zA-Z\s]+)\s*(?:past|last|previous|history|historical)\s*(\d+)?\s*days?/
      );

      // Detect current weather query
      const cityMatch = lower.match(/weather in ([a-zA-Z\s]+)|([a-zA-Z\s]+) weather/);

      if (historyMatch) {
        const days = parseInt(historyMatch[1] || historyMatch[4]) || 5;
        const rawCity = (historyMatch[2] || historyMatch[3] || '').trim().replace(/^(in|for|at)\s+/i, '').trim();
        if (rawCity) {
          try {
            const hist = await getHistoricalWeather(rawCity, days);
            const summary = hist.days.map(d =>
              `${d.date}: Max ${d.maxTemp}°C, Min ${d.minTemp}°C, ${d.description}, Rain: ${d.precipitation}mm, Wind: ${d.windSpeed} km/h`
            ).join('\n');
            prompt = `User asked: "${userText}". Here is the REAL past ${days}-day weather data for ${hist.city}, ${hist.country}:\n${summary}\n\nRespond using ONLY this real data. Do NOT say you don't have access to real-time data.`;
          } catch (_) {}
        }
      } else if (cityMatch) {
        const city = (cityMatch[1] || cityMatch[2]).trim();
        try {
          const w = await getWeatherByCity(city);
          prompt = `User asked: "${userText}". Live data for ${w.city}, ${w.country}: Temp: ${w.temperature}°C (feels ${w.feelsLike}°C), Humidity: ${w.humidity}%, ${w.description}, Wind: ${w.windSpeed} m/s. Respond using this real data.`;
        } catch (_) {}
      }

      const { reply, updatedHistory } = await askGemini(prompt, history);
      setHistory(updatedHistory);
      setMessages(prev => [...prev, { sender: "bot", text: reply, id: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: `Error: ${err.message}`, id: Date.now() }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1>AI Climate Chatbot</h1>
      <p>Ask anything about weather &amp; climate</p>

      <div className="chatbot-container">
        {messages.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            <button className="clear-btn" onClick={() => { setMessages([]); setHistory([]); }}><IconClose /> Clear</button>
          </div>
        )}

        <div className="chatbot-input-top">
          <div className="chatbot-search-box">
            <span className="chatbot-search-icon"><IconChat /></span>
            <input
              className="chatbot-search-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && !loading && sendMessage()}
              placeholder="Ask about weather, climate change, sustainability..."
              disabled={loading}
            />
            {input && <button className="dash-search-clear" onClick={() => setInput("")}> <IconClose /> </button>}
          </div>
          <button className="chatbot-send-btn" onClick={() => sendMessage()} disabled={loading}>
            {loading ? <span className="btn-spinner"/> : <><IconSend /> Send</>}
          </button>
        </div>

        <div className="chatbox" ref={chatboxRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-globe"><IconGlobe /></div>
              <h3>Hello! I'm your AI Climate Assistant</h3>
              <p>Ask me anything about weather, climate change, or sustainability</p>
              <div className="suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)} style={{ animationDelay: `${i * 0.1}s` }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={msg.id} className={`message ${msg.sender}`} style={{ animationDelay: `${i * 0.05}s`, whiteSpace: "pre-wrap" }}>
              {msg.sender === "bot" && <span className="msg-avatar"><IconBot /></span>}
              <span>{msg.text}</span>
              {msg.sender === "user" && <span className="msg-avatar"><IconUser /></span>}
            </div>
          ))}

          {loading && (
            <div className="message bot typing-msg">
              <span className="msg-avatar"><IconBot /></span>
              <span className="typing-dots"><span/><span/><span/></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
