import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/chat";

function generateSessionId() {
  return "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId);
  const [sessions, setSessions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch sessions list
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/sessions`);
      setSessions(res.data.sessions);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Load a previous session
  const loadSession = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/history/${id}`);
      const history = res.data.history;
      const loaded = history.map((m) => ({
        sender: m.role === "USER" ? "user" : "ai",
        text: m.message,
      }));
      setMessages(loaded);
      setSessionId(id);
    } catch (err) {
      console.error("Failed to load session", err);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    setMessages([]);
    setSessionId(generateSessionId());
    fetchSessions();
  };

  // Delete a session
  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/sessions/${id}`);
      if (id === sessionId) {
        startNewChat();
      }
      fetchSessions();
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(API_BASE, {
        message: userMessage,
        sessionId: sessionId,
      });
      setMessages((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
      fetchSessions();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>ChatBot AI</span>
          </div>
        </div>

        <button className="new-chat-btn" onClick={startNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>

        {/* Chat History */}
        <div className="chat-history">
          <h3 className="history-title">Recent Chats</h3>
          <div className="history-list">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`history-item ${s.id === sessionId ? "active" : ""}`}
                onClick={() => loadSession(s.id)}
              >
                <div className="history-item-content">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="history-preview">{s.preview}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => deleteSession(s.id, e)}
                  aria-label="Delete chat"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="memory-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            Memory Enabled
          </div>
          <p>Powered by Cohere AI</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <h1>AI Assistant</h1>
          <div className="header-badges">
            <span className="memory-indicator" title="The AI remembers your conversation context">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Memory Active
            </span>
            <span className="status-badge">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
        </header>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2>How can I help you today?</h2>
              <p>I can remember your name, skills, city, and preferences throughout our conversation.</p>
              <div className="suggestions">
                <button onClick={() => { setMessage("My name is ... and I'm a developer from ..."); inputRef.current?.focus(); }}>
                  👋 Introduce yourself
                </button>
                <button onClick={() => { setMessage("What do you remember about me?"); inputRef.current?.focus(); }}>
                  🧠 Test my memory
                </button>
                <button onClick={() => { setMessage("Tell me a fun fact about programming"); inputRef.current?.focus(); }}>
                  💡 Fun programming fact
                </button>
                <button onClick={() => { setMessage("Help me brainstorm project ideas"); inputRef.current?.focus(); }}>
                  🚀 Brainstorm ideas
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === "user" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a7 7 0 0 1-12.46 0H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                  </svg>
                )}
              </div>
              <div className="message-content">
                <span className="message-sender">{msg.sender === "user" ? "You" : "AI"}</span>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="message-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a7 7 0 0 1-12.46 0H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <div className="message-content">
                <span className="message-sender">AI</span>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message... (I'll remember what you tell me!)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              aria-label="Chat message input"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="input-hint">Press Enter to send · AI remembers your conversation</p>
        </div>
      </main>
    </div>
  );
}
