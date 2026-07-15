import askAI from "../services/gemini.js";

export async function chat(req, res) {
  try {
    const { message } = req.body;

    const reply = await askAI(message);

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}