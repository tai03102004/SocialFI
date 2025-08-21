import express, { Request, Response } from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChromaDB } from "./rag/chromadb";
import { GraphRAG } from "./rag/graphrag";
import { KnowledgeBase } from "./rag/knowledge";

// Define types
interface PlayerStats {
  accuracy?: number;
  totalPredictions?: number;
  currentStreak?: number;
  experienceLevel?: string;
  preferredAsset?: string;
}

interface ChatRequest {
  message: string;
  playerStats?: PlayerStats;
  useRAG?: boolean;
  useGraph?: boolean;
}

interface StrategyRequest {
  playerStats: PlayerStats;
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI and RAG systems
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_API_KEY || "AIzaSyCCO8rjxQRUP2mc0Ndjzhb1YrtQZo4mNLE"
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const chromaDB = new ChromaDB();
const graphRAG = new GraphRAG();
const knowledgeBase = new KnowledgeBase();

// Enhanced AI Chat with RAG
app.post(
  "/api/ai/chat",
  async (req: Request<{}, {}, ChatRequest>, res: Response) => {
    try {
      const {
        message,
        playerStats = {},
        useRAG = true,
        useGraph = true,
      } = req.body;

      console.log("🤖 Processing AI request:", { message, useRAG, useGraph });

      let enhancedPrompt = message;
      let context = "";
      let graphInsights = "";

      if (useRAG) {
        const relevantDocs = await chromaDB.query(message, 5);
        context = relevantDocs.map((doc: any) => doc.content).join("\n\n");
        console.log(
          "📚 Retrieved knowledge:",
          relevantDocs.length,
          "documents"
        );
      }

      if (useGraph) {
        graphInsights = await graphRAG.getRelatedInsights(message);
        console.log("🕸️ Graph insights:", graphInsights);
      }

      enhancedPrompt = `
        Context from Knowledge Base:
        ${context}

        Graph Insights:
        ${graphInsights}

        Player Stats:
        - Accuracy: ${playerStats.accuracy ?? "Unknown"}%
        - Total Predictions: ${playerStats.totalPredictions ?? "Unknown"}
        - Current Streak: ${playerStats.currentStreak ?? "Unknown"}

        User Question: ${message}

        Please provide a helpful, accurate, and personalized response based on the context above.
      `;

      const result = await model.generateContent(enhancedPrompt);
      const responseText = result.response.text();

      await knowledgeBase.storeInteraction(message, responseText, {
        ...playerStats,
        totalPredictions: playerStats.totalPredictions ?? 0,
        accuracy: playerStats.accuracy ?? 0,
        currentStreak: playerStats.currentStreak ?? 0,
      });

      console.log("✅ AI response generated");
      res.json({ response: responseText });
    } catch (error) {
      console.error("❌ AI chat error:", error);
      res.status(500).json({
        response:
          "I'm experiencing some technical difficulties. Let me try to help you anyway! What specific crypto or trading topic would you like to discuss?",
      });
    }
  }
);

// Market Analysis with RAG
app.get("/api/ai/market-insight", async (_req: Request, res: Response) => {
  try {
    const marketData = await getLatestMarketData();
    const historicalContext = await chromaDB.query("market analysis trends", 3);

    const prompt = `
      Based on current market data and historical patterns:

      Current Market Data:
      ${JSON.stringify(marketData, null, 2)}

      Historical Context:
      ${historicalContext.map((doc: any) => doc.content).join("\n")}

      Please provide a comprehensive market analysis including:
      1. Current sentiment (bullish/bearish/neutral)
      2. Key factors affecting the market
      3. Price prediction range for major crypto
      4. Risk assessment
      5. Trading recommendations

      Format as JSON with sentiment, confidence, recommendation, keyFactors, predictedPriceRange, and riskLevel.
    `;

    const result = await model.generateContent(prompt);
    const analysisText = result.response.text();

    let analysis: any;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      analysis = {
        sentiment: "neutral",
        confidence: 75,
        recommendation: analysisText,
        keyFactors: [
          "Market volatility",
          "Regulatory developments",
          "Institutional adoption",
        ],
        predictedPriceRange: {
          asset: "BTC",
          low: 40000,
          high: 50000,
          timeframe: "24h",
        },
        riskLevel: "medium",
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error("Market insight error:", error);
    res.status(500).json({
      sentiment: "neutral",
      confidence: 50,
      recommendation: "Unable to generate market analysis at this time.",
      keyFactors: ["Technical analysis needed"],
      predictedPriceRange: {
        asset: "BTC",
        low: 45000,
        high: 55000,
        timeframe: "24h",
      },
      riskLevel: "medium",
    });
  }
});

// Trading Strategy with Personalization
app.post(
  "/api/ai/strategy",
  async (req: Request<{}, {}, StrategyRequest>, res: Response) => {
    try {
      const { playerStats } = req.body;

      const strategies = await chromaDB.query(
        `trading strategy ${playerStats.experienceLevel} ${playerStats.preferredAsset}`,
        3
      );

      const prompt = `
Based on the player's profile and proven trading strategies:

Player Profile:
- Experience: ${playerStats.experienceLevel}
- Accuracy: ${playerStats.accuracy}%
- Total Predictions: ${playerStats.totalPredictions}
- Preferred Asset: ${playerStats.preferredAsset}
- Current Streak: ${playerStats.currentStreak}

Relevant Strategies from Knowledge Base:
${strategies.map((s: any) => s.content).join("\n\n")}

Create a personalized trading strategy with actionable steps and risk management.
`;

      const result = await model.generateContent(prompt);
      const strategy = result.response.text();

      res.json({ strategy });
    } catch (error) {
      console.error("Strategy generation error:", error);
      res.json({
        strategy:
          "Focus on developing a consistent methodology: 1) Research before trading, 2) Set stop-losses, 3) Never risk more than 2% per trade, 4) Keep a trading journal, 5) Learn from both wins and losses.",
      });
    }
  }
);

// Mock market data function
async function getLatestMarketData() {
  return {
    btc: { price: 45000, change24h: 2.5 },
    eth: { price: 3200, change24h: -1.2 },
    fear_greed_index: 65,
    total_market_cap: "1.8T",
    timestamp: new Date().toISOString(),
  };
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 AI Backend running on port ${PORT}`);

  chromaDB.initialize();
  graphRAG.initialize();
  knowledgeBase.initialize();
});
