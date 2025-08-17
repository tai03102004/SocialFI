import { Router } from "express";
import { aiController } from "../controllers/ai.controller";

const router = Router();

// Quest generation
router.post("/quests/generate", aiController.generateDailyQuests);

// Market analysis
router.get("/analysis/:symbol", aiController.getMarketAnalysis);

// Chatbot
router.post("/chatbot", aiController.chatbotResponse);

// Technical analysis
router.get("/technical", aiController.getTechnicalAnalysis);

export default router;
