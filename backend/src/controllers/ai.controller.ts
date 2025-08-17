import { Request, Response } from "express";
import { aiService } from "../services/aiService";

export class AIController {
  async generateDailyQuests(req: Request, res: Response) {
    try {
      const { symbol = "BTC", difficulty = "intermediate" } = req.body;

      // Run CrewAI
      const aiResults = await aiService.runCrewAI({
        symbol,
        user_question: `Generate daily quests for ${difficulty} player`,
      });

      // Extract quests data safely
      const quests = aiResults.daily_quests || { quests: [] };

      res.json({
        success: true,
        data: quests,
        generated_at: new Date(),
      });
    } catch (error) {
      console.error("Generate quests error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate quests",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getMarketAnalysis(req: Request, res: Response) {
    try {
      const { symbol } = req.params;

      if (!symbol) {
        return res.status(400).json({
          success: false,
          error: "Symbol parameter is required",
        });
      }

      const aiResults = await aiService.runCrewAI({
        symbol: symbol.toUpperCase(),
        user_question: `Provide market analysis for ${symbol}`,
      });

      res.json({
        success: true,
        data: {
          news: aiResults.blockchain_news || [],
          sentiment: aiResults.sentiment_analysis || {},
          strategy: aiResults.strategy_recommendations || {},
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Market analysis error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get market analysis",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async chatbotResponse(req: Request, res: Response) {
    try {
      const { question, context = {} } = req.body;

      if (!question) {
        return res.status(400).json({
          success: false,
          error: "Question is required",
        });
      }

      const aiResults = await aiService.runCrewAI({
        symbol: context.symbol || "BTC",
        user_question: question,
      });

      const response =
        aiResults.chatbot_responses?.response ||
        "I'm here to help! What would you like to know?";

      res.json({
        success: true,
        data: {
          response,
          question,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get response",
        data: {
          response:
            "I apologize, but I'm experiencing technical difficulties. Please try again later.",
          question: req.body.question,
          timestamp: new Date(),
        },
      });
    }
  }

  async getTechnicalAnalysis(req: Request, res: Response) {
    try {
      const {
        symbol,
        period = "1d",
        indicators = "rsi,macd,bollinger",
      } = req.query;

      if (!symbol) {
        return res.status(400).json({
          success: false,
          error: "Symbol parameter is required",
        });
      }

      // Get price data
      const prices = await this.getPriceHistory(
        symbol as string,
        period as string
      );

      const indicatorArray =
        typeof indicators === "string"
          ? indicators.split(",")
          : ["rsi", "macd"];

      const technicalData: Record<string, any> = {};

      // Get technical indicators
      for (const indicator of indicatorArray) {
        try {
          technicalData[indicator] = await aiService.getTechnicalIndicators(
            prices,
            indicator.trim()
          );
        } catch (indicatorError) {
          console.warn(`Failed to get ${indicator}:`, indicatorError);
          technicalData[indicator] = {
            error: `Failed to calculate ${indicator}`,
          };
        }
      }

      res.json({
        success: true,
        symbol: symbol,
        period,
        data: technicalData,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Technical analysis error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get technical analysis",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async getPriceHistory(
    symbol: string,
    period: string
  ): Promise<number[]> {
    try {
      // TODO: Implement real price fetching from CoinGecko API
      // For now, return realistic dummy data
      const basePrice =
        symbol.toUpperCase() === "BTC"
          ? 45000
          : symbol.toUpperCase() === "ETH"
          ? 3000
          : 1;

      return Array.from({ length: 30 }, (_, i) => {
        const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
        return basePrice * (1 + variance);
      });
    } catch (error) {
      console.error("Error getting price history:", error);
      // Return default prices if API fails
      return Array.from({ length: 30 }, () => 45000);
    }
  }

  // Health check for AI services
  async healthCheck(req: Request, res: Response) {
    try {
      // Test simple AI call
      const testResult = await aiService.runCrewAI({
        symbol: "BTC",
        user_question: "health check",
      });

      res.json({
        success: true,
        status: "AI services operational",
        python_service: "connected",
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        status: "AI services unavailable",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      });
    }
  }
}

export const aiController = new AIController();
