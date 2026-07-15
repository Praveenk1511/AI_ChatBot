import "dotenv/config";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export default async function askAI(prompt) {
  const response = await cohere.chat({
    model: "command-a-03-2025",
    message: prompt,
  });

  return response.text;
}
