# AI ChatBot with Memory

A full-stack AI chatbot with conversation memory — it remembers your name, skills, city, and preferences throughout the session. Built with React and Node.js, powered by Cohere's Command A model.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![Tech Stack](https://img.shields.io/badge/AI-Cohere-purple) ![Feature](https://img.shields.io/badge/Feature-Memory-orange)

## Features

- **Conversation Memory** — AI remembers names, skills, city, preferences across messages
- **Session Management** — Multiple chat sessions with history
- **Chat History Sidebar** — View, switch, and delete past conversations
- Real-time AI responses with Cohere's `command-a-03-2025` model
- Modern, responsive UI with animations
- Typing indicator with animated dots
- Suggested prompts for quick start
- Auto-scroll to latest messages
- Session auto-cleanup after 1 hour of inactivity
- Mobile-friendly design

## Tech Stack

### Frontend
- React 19
- Vite 8
- Axios (HTTP client)
- CSS3 with custom properties and animations

### Backend
- Node.js with Express 5
- Cohere AI SDK
- In-memory session store
- CORS enabled
- Environment variable management with dotenv

## Project Structure

```
chatBot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBox.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   │   └── chatController.js
│   ├── routes/
│   │   └── chat.js
│   ├── services/
│   │   └── cohere.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Cohere API key ([Get one here](https://dashboard.cohere.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatBot
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   PORT=8000
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   Server runs on `http://localhost:8000`

2. **Start the frontend dev server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. Open `http://localhost:5173` in your browser.

## How Memory Works

The chatbot maintains conversation context per session:

1. Each chat gets a unique session ID
2. All messages (user + AI) are stored in memory on the server
3. The full conversation history is sent with each new message
4. The AI uses a system preamble instructing it to remember personal details
5. History is capped at 50 message pairs per session
6. Sessions auto-expire after 1 hour of inactivity

**Try it:**
- Tell the AI: "My name is Alex and I'm a React developer from New York"
- Then ask: "What's my name?" or "What city am I from?"
- The AI will remember and respond with your details

## API Endpoints

| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| GET    | `/`                           | Health check               |
| POST   | `/api/chat`                   | Send message to AI         |
| GET    | `/api/chat/sessions`          | List all active sessions   |
| GET    | `/api/chat/history/:sessionId`| Get history for a session  |
| DELETE | `/api/chat/sessions/:sessionId`| Delete a session          |

### POST /api/chat

**Request Body:**
```json
{
  "message": "My name is Alex",
  "sessionId": "session_123"
}
```

**Response:**
```json
{
  "reply": "Nice to meet you, Alex! How can I help you today?",
  "sessionId": "session_123"
}
```

### GET /api/chat/sessions

**Response:**
```json
{
  "sessions": [
    {
      "id": "session_123",
      "preview": "My name is Alex",
      "messageCount": 4,
      "lastActive": 1721145600000
    }
  ]
}
```

## License

ISC
