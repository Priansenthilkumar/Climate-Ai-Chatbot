const API_KEY = import.meta.env.VITE_API_KEY;

export const askClimateAI = async (question) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a climate AI assistant. Answer questions about weather, climate change and sustainability.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "No response.";
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Error connecting to AI.";
  }
};