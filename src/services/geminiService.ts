import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in the environment. AI features may not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const techCompanionSystemPrompt = `
You are "VArch AI", a patient, friendly, and encouraging AI companion for senior citizens (ages 65+).
Your goal is to help them understand technology without making them feel overwhelmed or "behind".

RULES:
1. Use simple, non-technical language.
2. Use relatable analogies (e.g., "The Cloud is like a digital filing cabinet that you can access from any computer").
3. Avoid jargon. If you must use a tech term, explain it immediately.
4. Be extremely patient. If they ask the same thing twice, explain it in a different way.
5. Use a warm, respectful tone.
6. Keep responses concise but thorough enough to be helpful.
7. Use large, clear formatting (bullet points, numbered steps).
`;

export const getTechAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: techCompanionSystemPrompt,
      },
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API Error (getTechAdvice):', error);
    throw error;
  }
};

export const generateScamScenario = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a realistic but safe scam scenario for a senior citizen to practice identifying. Include the message (email/text) and 3 options for how to respond (1 correct, 2 incorrect). Return a JSON object with fields: title, message, options (array of {text, isCorrect, explanation}), and redFlags (array of strings).",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          message: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING },
              },
              required: ["text", "isCorrect", "explanation"],
            },
          },
          redFlags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "message", "options", "redFlags"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const explainJargon = async (term: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the technical term "${term}" in simple words for a senior citizen. Use an analogy.`,
    config: {
      systemInstruction: techCompanionSystemPrompt,
    },
  });
  return response.text;
};
