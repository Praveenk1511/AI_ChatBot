import "dotenv/config";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export default async function askAI(prompt, chatHistory = []) {
  const response = await cohere.chat({
    model: "command-a-03-2025",
    message: prompt,
    chatHistory: chatHistory,
    preamble:
      "You are a friendly and helpful AI assistant. Remember details the user shares with you like their name, skills, city, preferences, and any personal information. Refer back to these details naturally in conversation when relevant.",
  });

  return response.text;
}
