import { GoogleGenerativeAI } from "@google/generative-ai";
import { MarketDataService } from "./marketDataService.js";
export class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.marketService = new MarketDataService();
    }
    async generateChatResponse(message, context) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const systemPrompt = this.buildSystemPrompt(context);
            const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error("Error generating chat response:", error);
            throw new Error("Failed to generate AI response");
        }
    }
    async generateQuiz(difficulty = "medium") {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Generate 5 cryptocurrency and blockchain quiz questions with ${difficulty} difficulty.
        
        Format the response as a JSON array with this structure:
        [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Explanation of the correct answer",
            "difficulty": "${difficulty}"
          }
        ]

        Topics to cover:
        - Bitcoin and cryptocurrency basics
        - Blockchain technology
        - DeFi concepts
        - Trading strategies
        - Market analysis
        - Smart contracts
        - Cross-chain technology

        Make questions educational and relevant to crypto trading and GameFi.
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error("Invalid quiz format from AI");
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error("Error generating quiz:", error);
            throw new Error("Failed to generate quiz");
        }
    }
    async analyzeMarketSentiment() {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const marketData = await this.marketService.getCurrentMarketData();
            const prompt = `
        Analyze the current cryptocurrency market sentiment based on this data:
        
        Bitcoin Price: $${marketData.btcPrice}
        24h Change: ${marketData.btcChange24h}%
        Ethereum Price: $${marketData.ethPrice}
        24h Change: ${marketData.ethChange24h}%
        Fear & Greed Index: ${marketData.fearGreedIndex}
        Market Cap: $${marketData.totalMarketCap}
        
        Provide analysis in this JSON format:
        {
          "sentiment": "bullish|bearish|neutral",
          "confidence": 85,
          "recommendation": "Brief trading recommendation",
          "keyFactors": ["Factor 1", "Factor 2", "Factor 3"]
        }
        
        Consider technical indicators, market trends, and overall crypto ecosystem health.
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Invalid sentiment analysis format");
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error("Error analyzing market sentiment:", error);
            throw new Error("Failed to analyze market sentiment");
        }
    }
    async generateTradingStrategy(playerStats) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Generate a personalized trading strategy for a GameFi player with these stats:
        - Accuracy: ${playerStats.accuracy}%
        - Total Predictions: ${playerStats.totalPredictions}
        - Correct Predictions: ${playerStats.correctPredictions}
        - Experience Level: ${this.getExperienceLevel(playerStats)}
        
        Provide specific, actionable advice for improving their prediction accuracy and overall performance.
        Include both technical analysis tips and risk management strategies.
        Keep the response educational and engaging, suitable for a gaming environment.
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error("Error generating trading strategy:", error);
            throw new Error("Failed to generate trading strategy");
        }
    }
    async generateDailyQuest() {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Generate a daily quest for a GameFi platform focused on crypto prediction and learning.
        
        Format as JSON:
        {
          "title": "Quest Title",
          "description": "Detailed description of the quest",
          "objective": "What the player needs to do",
          "reward": 50,
          "type": "prediction|quiz|analysis|social"
        }
        
        Make it engaging, educational, and relevant to current market conditions.
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Invalid quest format");
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error("Error generating daily quest:", error);
            throw new Error("Failed to generate daily quest");
        }
    }
    buildSystemPrompt(context) {
        let prompt = `
      You are an AI coach for a GameFi platform focused on cryptocurrency prediction and education.
      You have expertise in:
      - Cryptocurrency trading and analysis
      - Technical indicators and chart patterns
      - Risk management strategies
      - Blockchain technology and DeFi
      - Market psychology and sentiment analysis
      
      Guidelines:
      - Be helpful, educational, and encouraging
      - Provide specific, actionable advice
      - Explain complex concepts simply
      - Never provide financial advice as investment recommendations
      - Focus on education and skill improvement
      - Keep responses engaging and suitable for a gaming environment
    `;
        if (context.playerStats) {
            prompt += `
        
        Player Context:
        - Accuracy: ${context.playerStats.accuracy}%
        - Total Predictions: ${context.playerStats.totalPredictions}
        - Experience Level: ${this.getExperienceLevel(context.playerStats)}
      `;
        }
        return prompt;
    }
    getExperienceLevel(playerStats) {
        if (playerStats.totalPredictions < 10)
            return "Beginner";
        if (playerStats.totalPredictions < 50)
            return "Intermediate";
        if (playerStats.totalPredictions < 200)
            return "Advanced";
        return "Expert";
    }
}
