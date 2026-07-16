import askAI from "../services/cohere.js";
import Chat from "../models/Chat.js";

// Send a message
export async function chat(req, res) {
  try {
    const { message, chatId } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chatDoc;

    if (chatId) {
      // Existing chat - verify ownership
      chatDoc = await Chat.findOne({ _id: chatId, user: userId });
      if (!chatDoc) {
        return res.status(404).json({ error: "Chat not found" });
      }
    } else {
      // New chat - create it
      chatDoc = await Chat.create({
        user: userId,
        title: message.slice(0, 50),
        messages: [],
      });
    }

    // Build chat history for AI context
    const chatHistory = chatDoc.messages.map((m) => ({
      role: m.role,
      message: m.message,
    }));

    // Get AI response
    const reply = await askAI(message, chatHistory);

    // Save messages to DB
    chatDoc.messages.push({ role: "USER", message: message });
    chatDoc.messages.push({ role: "CHATBOT", message: reply });

    // Keep last 100 messages
    if (chatDoc.messages.length > 100) {
      chatDoc.messages = chatDoc.messages.slice(-100);
    }

    await chatDoc.save();

    res.json({ reply, chatId: chatDoc._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Get all chats for the logged-in user
export async function listChats(req, res) {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title createdAt updatedAt messages")
      .sort({ updatedAt: -1 });

    const chatList = chats.map((c) => ({
      id: c._id,
      title: c.title,
      messageCount: c.messages.length,
      lastActive: c.updatedAt,
    }));

    res.json({ chats: chatList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
}

// Get a single chat with messages
export async function getChat(req, res) {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
}

// Delete a chat
export async function deleteChat(req, res) {
  try {
    const result = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
}
