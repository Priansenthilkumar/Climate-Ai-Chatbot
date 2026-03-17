const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_CONTEXT = `You are a strict AI assistant ONLY for climate and weather topics. You ONLY answer questions related to: weather conditions, temperature, humidity, wind, rain, snow, storms, climate change, global warming, carbon footprint, air quality, sustainability, and environmental topics.

IMPORTANT: When the user's message contains real live or historical weather data (prefixed with "Live data" or "REAL past"), you MUST use ONLY that provided data to answer. Never say you don't have access to real-time data when data is already provided in the prompt.

If the user asks about ANYTHING else (coding, sports, movies, food, history, math, general knowledge, etc.), you must reply: "I can only answer questions about climate and weather topics. Please ask me something related to weather or climate! 🌍"

Keep responses concise, friendly and use emojis where appropriate.`;

export const askClimateAI = async (userMessage, history = []) => {};

export const askGemini = async (userMessage, history = []) => {
  const messages = [
    { role: 'system', content: SYSTEM_CONTEXT },
    ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.parts[0].text })),
    { role: 'user', content: userMessage }
  ];

  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 512,
      })
    });
  } catch (err) {
    throw new Error('Network error. Please check your internet connection.');
  }

  const data = await response.json();

  if (!response.ok) {
    const msg = data?.error?.message || '';
    if (response.status === 401) throw new Error('❌ Invalid Groq API key.');
    if (response.status === 429) throw new Error('⏳ Rate limit reached. Please wait a moment and try again.');
    throw new Error(`API Error: ${msg}`);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('No response from AI. Please try again.');

  return {
    reply,
    updatedHistory: [
      ...history,
      { role: 'user',  parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: reply }] }
    ]
  };
};
