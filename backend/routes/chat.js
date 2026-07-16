import express from "express";
import {
  chat,
  getHistory,
  listSessions,
  deleteSession,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chat);
router.get("/sessions", listSessions);
router.get("/history/:sessionId", getHistory);
router.delete("/sessions/:sessionId", deleteSession);

export default router;
