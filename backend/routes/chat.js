import express from "express";
import { chat, listChats, getChat, deleteChat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

router.post("/", chat);
router.get("/list", listChats);
router.get("/:chatId", getChat);
router.delete("/:chatId", deleteChat);

export default router;
