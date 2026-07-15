import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function askAI(prompt) {
  const response = await client.responses.create({
    model: "gpt-5.5",
    input: prompt,
  });

  return response.output_text;
}