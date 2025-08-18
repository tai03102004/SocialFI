import { Router } from "express";
import { aiController } from "../controllers/ai.controller";

const router = Router();

// Quest routes (Agent 1: Daily Quests)
router.post("/quests/generate", aiController.generateDailyQuests);
router.get("/quests/active", aiController.getActiveQuests);
router.post("/quests/:questId/submit", aiController.submitQuestResult);

// Technical Analysis routes (Agent 2: Technical Predictions)
router.get("/technical/:symbol", aiController.getTechnicalAnalysis);
router.get("/technical", aiController.getTechnicalAnalysis);

// Market Analysis routes (Agent 3: Sentiment Analysis + Strategy)
router.get("/analysis/:symbol", aiController.getMarketAnalysis);
router.get("/sentiment/:symbol", aiController.getSentimentAnalysis);
router.get("/strategy/:symbol", aiController.getStrategyRecommendations);

// News routes (Agent 4: Blockchain News)
router.get("/news/:symbol", aiController.getBlockchainNews);
router.get("/news", aiController.getBlockchainNews);

// Community routes (Agent 5: Community Support)
router.post("/chatbot", aiController.chatbotResponse);
router.post("/community/ask", aiController.getCommunitySupport);

// Combined analysis (Agent 6: All-in-one)
router.get("/comprehensive/:symbol", aiController.getComprehensiveAnalysis);

// Health
router.get("/health", aiController.healthCheck);

export default router;
