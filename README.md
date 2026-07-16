# AI ChatBot — Full Stack with Auth & Memory

A full-stack AI chatbot application with user authentication, conversation memory, and persistent chat history. Built with React, Node.js, MongoDB, and powered by Cohere AI.

![React](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express_5-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen) ![AI](https://img.shields.io/badge/AI-Cohere-purple) ![Auth](https://img.shields.io/badge/Auth-JWT-orange)

---

## Features

### Authentication
- User registration with name, email, and password
- Login/logout with JWT tokens stored in HTTP-only cookies
- Protected routes — chat is only accessible to logged-in users
- Passwords hashed with bcrypt (12 rounds)
- Token expires after 7 days

### AI Chat with Memory
- Powered by Cohere's `command-a-03-2025` model
- Conversation memory — AI remembers names, skills, city, preferences
- Full chat history sent as context with each message
- System preamble instructs AI to remember personal details

### Chat Management
- Multiple chat sessions per user
- Chat history saved to MongoDB
- Load, switch between, and delete past chats
- Chat titles auto-generated from first message
- History capped at 100 messages per chat

### UI/UX
- Modern, responsive design with sidebar
- Mobile-friendly with slide-out sidebar (hamburger menu)
- Animated typing indicator (bouncing dots)
- Auto-scroll to latest message
- Suggested quick-start prompts
- Welcome screen with user's name
- Online status badge and memory indicator
- Smooth message fade-in animations

---

## Tech Stack

| Layer      | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 19, Vite 8, React Router, Axios |
| Backend   | Node.js, Express 5                   |
| Database  | MongoDB with Mongoose               |
| AI        | Cohere AI SDK (command-a-03-2025)    |
| Auth      | JWT, bcryptjs, cookie-parser        |
| Styling   | Custom CSS with variables & animations |

---

## Project Structure

```
chatBot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBox.jsx          # Main chat interface
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Register.jsx          # Registration page
│   │   ├── App.jsx                   # Routing & protected routes
│   │   ├── App.css                   # All styles
│   │   ├── index.css                 # Global reset & fonts
│   │   └── main.jsx                  # React entry point
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   │   ├── authController.js         # Register, login, logout, getMe
│   │   └── chatController.js         # Chat CRUD operations
│   ├── middleware/
│   │   └── auth.js                   # JWT verification middleware
│   ├── models/
│   │   ├── User.js                   # User schema (name, email, password)
│   │   └── Chat.js                   # Chat schema (messages, user ref)
│   ├── routes/
│   │   ├── auth.js                   # Auth endpoints
│   │   └── chat.js                   # Chat endpoints (protected)
│   ├── services/
│   │   └── cohere.js                 # Cohere AI integration
│   ├── server.js                     # Express app + MongoDB connection
│   ├── .env                          # Environment variables
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally or a MongoDB Atlas URI
- **Cohere API key** — [Get one free here](https://dashboard.cohere.com)

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

   Create a `.env` file in `backend/`:
   ```env
   COHERE_API_KEY=your_cohere_api_key
   MONGO_URI=mongodb://localhost:27017/chatbot
   JWT_SECRET=your_secret_key_here
   PORT=8000
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Make sure MongoDB is running**
   ```bash
   mongod
   ```

2. **Start the backend**
   ```bash
   cd backend
   node server.js
   ```
   Output: `Connected to MongoDB` → `Server running on port 8000`

3. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

4. Open `http://localhost:5173` in your browser.

---

## User Flow

1. **Register** — Create an account at `/register`
2. **Login** — Sign in at `/login`
3. **Chat** — Start a conversation, AI remembers context within the session
4. **History** — Click past chats in the sidebar to reload them
5. **New Chat** — Start fresh with the "New Chat" button
6. **Logout** — Click logout in the sidebar footer

---

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint    | Description              | Auth Required |
|--------|------------|--------------------------|:-------------:|
| POST   | `/register`| Create a new account     | No            |
| POST   | `/login`   | Login and get JWT        | No            |
| POST   | `/logout`  | Clear JWT cookie         | No            |
| GET    | `/me`      | Get current user info    | Yes           |

### Chat Routes (`/api/chat`) — All require authentication

| Method | Endpoint      | Description                 |
|--------|--------------|------------------------------|
| POST   | `/`          | Send message (create/continue chat) |
| GET    | `/list`      | Get all chats for the user   |
| GET    | `/:chatId`   | Get a specific chat with messages |
| DELETE | `/:chatId`   | Delete a chat                |

### Request/Response Examples

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"123456"}'
```

**Send Message:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<your_token>" \
  -d '{"message":"Hello AI","chatId":null}'
```

**Response:**
```json
{
  "reply": "Hello Alex! How can I help you today?",
  "chatId": "669e215f07339c70862190cf"
}
```

---

## Database Schemas

### User
```javascript
{
  name: String,        // required
  email: String,       // required, unique, lowercase
  password: String,    // required, min 6 chars, hashed
  createdAt: Date,
  updatedAt: Date
}
```

### Chat
```javascript
{
  user: ObjectId,      // ref to User
  title: String,       // auto-generated from first message
  messages: [{
    role: "USER" | "CHATBOT",
    message: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## How Memory Works

1. User sends a message
2. Server fetches the full chat history from MongoDB
3. History is sent to Cohere along with the new message
4. A system preamble tells the AI to remember personal details (name, skills, city, etc.)
5. AI responds with awareness of the full conversation context
6. Both user message and AI response are saved to MongoDB

**Try it:** Tell the AI your name and city, then in a later message ask "What's my name?" — it will remember.

---

## Environment Variables

| Variable        | Description                         | Example                              |
|----------------|-------------------------------------|--------------------------------------|
| `COHERE_API_KEY`| Cohere API key                     | `lggZ9dTy...`                        |
| `MONGO_URI`    | MongoDB connection string           | `mongodb://localhost:27017/chatbot`   |
| `JWT_SECRET`   | Secret for signing JWT tokens       | `my_super_secret_key`                |
| `PORT`         | Backend server port                 | `8000`                               |

---

## Security Notes

- Passwords are hashed with bcrypt (12 rounds) — never stored in plain text
- JWT stored in HTTP-only cookies — not accessible via JavaScript (XSS protection)
- All chat routes are protected by auth middleware
- CORS is configured to only allow the frontend origin
- Chat ownership is verified on every request (users can't access others' chats)

---

## Future Improvements

- [ ] Password reset / forgot password
- [ ] User profile editing
- [ ] Chat export (download as text/PDF)
- [ ] Dark mode toggle
- [ ] File/image sharing in chat
- [ ] Streaming AI responses (real-time token output)
- [ ] Rate limiting on API endpoints
- [ ] Persistent database sessions (Redis)

---

## License

ISC
