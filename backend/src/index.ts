import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { GeminiService } from "./services/geminiService.js";
import { MarketDataService } from "./services/marketDataService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());

// Services
const geminiService = new GeminiService();
const marketService = new MarketDataService();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// AI Chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, playerStats, context } = req.body;

    const response = await geminiService.generateChatResponse(message, {
      playerStats,
      context: context || "gamefi_coach",
    });

    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Market insight endpoint
app.get("/api/ai/market-insight", async (req, res) => {
  try {
    const insight = await geminiService.analyzeMarketSentiment();
    res.json(insight);
  } catch (error) {
    console.error("Market insight error:", error);
    res.status(500).json({ error: "Failed to analyze market" });
  }
});

// Quiz generation endpoint
app.get("/api/ai/quiz/:difficulty?", async (req, res) => {
  try {
    const difficulty =
      (req.params.difficulty as "easy" | "medium" | "hard") || "medium";
    const quiz = await geminiService.generateQuiz(difficulty);
    res.json(quiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// Daily quest endpoint
app.get("/api/ai/daily-quest", async (req, res) => {
  try {
    const quest = await geminiService.generateDailyQuest();
    res.json(quest);
  } catch (error) {
    console.error("Daily quest error:", error);
    res.status(500).json({ error: "Failed to generate quest" });
  }
});

// Price data endpoints
app.get("/api/price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toLowerCase();
    const priceData = await marketService.getPrice(symbol);
    res.json(priceData);
  } catch (error) {
    console.error("Price fetch error:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

app.get("/api/market-data", async (req, res) => {
  try {
    const marketData = await marketService.getCurrentMarketData();
    res.json(marketData);
  } catch (error) {
    console.error("Market data error:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

// Trading strategy endpoint
app.post("/api/ai/strategy", async (req, res) => {
  try {
    const { playerStats } = req.body;
    const strategy = await geminiService.generateTradingStrategy(playerStats);
    res.json({ strategy });
  } catch (error) {
    console.error("Strategy generation error:", error);
    res.status(500).json({ error: "Failed to generate strategy" });
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 GameFi Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Chat: http://localhost:${PORT}/api/ai/chat`);
});

export default app;
