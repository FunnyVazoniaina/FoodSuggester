import express from "express";
import { chatWithAI } from "../controllers/ai.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * POST /api/ai/chat
 * Send a message to the AI chef assistant
 * Requires authentication
 */
router.post("/chat", authenticateToken, chatWithAI);

export default router;
