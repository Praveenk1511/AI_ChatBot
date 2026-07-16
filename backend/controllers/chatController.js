import askAI from "../services/cohere.js";

// In-memory session store (keyed by sessionId)
const sessions = new Map();

// Clean up old sessions after 1 hour of inactivity
const SESSION_TTL = 60 * 60 * 1000;

function cleanupSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActive > SESSION_TTL) {
      sessions.delete(id);
    }
  }
}

setInterval(cleanupSessions, 5 * 60 * 1000);

export async function chat(req, res) {
  try {
    const { message, sessionId = "default" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get or create session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        chatHistory: [],
        lastActive: Date.now(),
      });
    }

    const session = sessions.get(sessionId);
    session.lastActive = Date.now();

    // Send message with history for context
    const reply = await askAI(message, session.chatHistory);

    // Store this exchange in history
    session.chatHistory.push({ role: "USER", message: message });
    session.chatHistory.push({ role: "CHATBOT", message: reply });

    // Keep history manageable (last 50 exchanges)
    if (session.chatHistory.length > 100) {
      session.chatHistory = session.chatHistory.slice(-100);
    }

    res.json({ reply, sessionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Get chat history for a session
export function getHistory(req, res) {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.json({ history: [] });
  }

  res.json({ history: session.chatHistory });
}

// List all active sessions
export function listSessions(req, res) {
  const sessionList = [];
  for (const [id, session] of sessions) {
    const firstUserMsg = session.chatHistory.find((m) => m.role === "USER");
    sessionList.push({
      id,
      preview: firstUserMsg ? firstUserMsg.message.slice(0, 50) : "New chat",
      messageCount: session.chatHistory.length,
      lastActive: session.lastActive,
    });
  }

  // Sort by most recent
  sessionList.sort((a, b) => b.lastActive - a.lastActive);
  res.json({ sessions: sessionList });
}

// Delete a session
export function deleteSession(req, res) {
  const { sessionId } = req.params;
  sessions.delete(sessionId);
  res.json({ success: true });
}
