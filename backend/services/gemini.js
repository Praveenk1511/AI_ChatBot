import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

console.log("API Key:", process.env.GEMINI_API_KEY);
console.log("Key exists:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-2.0-flash-lite";
console.log("Using model:", model);

export default async function askAI(prompt) {
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text;
}