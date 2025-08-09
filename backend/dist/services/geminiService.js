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
    async generateQuiz(difficulty = "medium", category = "general") {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const marketData = await this.marketService.getCurrentMarketData();
            const prompt = `
        Generate 5 cryptocurrency and blockchain quiz questions with ${difficulty} difficulty in the ${category} category.
        
        Current market context:
        - BTC Price: $${marketData.btcPrice}
        - ETH Price: $${marketData.ethPrice}
        - Market sentiment: ${marketData.fearGreedIndex > 50 ? "Greedy" : "Fearful"}
        
        Format the response as a JSON array with this structure:
        [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Detailed explanation of the correct answer",
            "difficulty": "${difficulty}",
            "category": "${category}",
            "timeLimit": 30
          }
        ]

        Categories and topics:
        - general: Basic crypto concepts, Bitcoin, Ethereum
        - defi: DeFi protocols, yield farming, liquidity pools
        - nft: NFT marketplaces, minting, utility
        - trading: Technical analysis, strategies, risk management
        - technology: Blockchain tech, consensus mechanisms, scalability
        - market: Market trends, economics, institutional adoption

        Make questions educational, current, and relevant to ${category}.
        Include time-sensitive questions based on current market conditions.
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
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
        Analyze the current cryptocurrency market sentiment and provide detailed insights based on this data:
        
        Bitcoin Price: $${marketData.btcPrice}
        24h Change: ${marketData.btcChange24h}%
        Ethereum Price: $${marketData.ethPrice}
        24h Change: ${marketData.ethChange24h}%
        Fear & Greed Index: ${marketData.fearGreedIndex}
        Total Market Cap: $${marketData.totalMarketCap}
        
        Provide analysis in this JSON format:
        {
          "sentiment": "bullish|bearish|neutral",
          "confidence": 85,
          "recommendation": "Detailed trading recommendation with specific actions",
          "keyFactors": ["Factor 1", "Factor 2", "Factor 3"],
          "predictedPriceRange": {
            "asset": "BTC",
            "low": 45000,
            "high": 52000,
            "timeframe": "7 days"
          },
          "riskLevel": "low|medium|high"
        }
        
        Consider:
        - Technical indicators and chart patterns
        - Market trends and institutional sentiment
        - Macroeconomic factors affecting crypto
        - Recent news and developments
        - Volume and liquidity metrics
        - Cross-chain activity and adoption
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
            const marketData = await this.marketService.getCurrentMarketData();
            const prompt = `
        Generate a personalized trading strategy for a GameFi player with these stats:
        - Accuracy: ${playerStats.accuracy}%
        - Total Predictions: ${playerStats.totalPredictions}
        - Correct Predictions: ${playerStats.correctPredictions}
        - Current Streak: ${playerStats.currentStreak}
        - Experience Level: ${this.getExperienceLevel(playerStats)}
        - Preferred Asset: ${playerStats.preferredAsset || "BTC"}
        - Premium Status: ${playerStats.isPremium ? "Active" : "None"}
        
        Current market conditions:
        - BTC: $${marketData.btcPrice} (${marketData.btcChange24h}%)
        - ETH: $${marketData.ethPrice} (${marketData.ethChange24h}%)
        - Fear & Greed: ${marketData.fearGreedIndex}
        
        Provide specific, actionable advice that includes:
        1. Technical analysis tips specific to their preferred asset
        2. Risk management strategies based on their accuracy
        3. Position sizing recommendations
        4. Entry and exit strategies
        5. How to improve prediction accuracy
        6. GameFi-specific tips for maximizing rewards
        7. Cross-chain opportunities
        
        Keep the response educational, engaging, and suitable for a gaming environment.
        Tailor complexity to their experience level.
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
            const marketData = await this.marketService.getCurrentMarketData();
            const prompt = `
        Generate a daily quest for a SocialFi GameFi platform focused on crypto prediction and learning.
        
        Current market context:
        - BTC Price: $${marketData.btcPrice}
        - Market sentiment: ${marketData.fearGreedIndex > 50 ? "Greedy" : "Fearful"}
        - Volatility: ${Math.abs(marketData.btcChange24h) > 5 ? "High" : "Low"}
        
        Format as JSON:
        {
          "title": "Engaging Quest Title",
          "description": "Detailed description that motivates participation",
          "objective": "Clear, measurable objective with specific requirements",
          "reward": 75,
          "type": "prediction|quiz|social|accuracy|streak",
          "deadline": "24 hours",
          "difficulty": "easy|medium|hard"
        }
        
        Quest types:
        - prediction: Make accurate price predictions
        - quiz: Complete knowledge challenges
        - social: Create engaging social content
        - accuracy: Achieve specific accuracy targets
        - streak: Maintain prediction streaks
        
        Make it:
        - Relevant to current market conditions
        - Educational and engaging
        - Achievable but challenging
        - Rewarding for completion
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
    async generateSocialContent(topic, userProfile) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const marketData = await this.marketService.getCurrentMarketData();
            const prompt = `
        Generate engaging social media content for a crypto/GameFi platform user.
        
        Topic: ${topic}
        User Profile:
        - Experience Level: ${this.getExperienceLevel(userProfile)}
        - Followers: ${userProfile.followers || 0}
        - Social Score: ${userProfile.socialScore || 0}
        
        Current Market Context:
        - BTC: $${marketData.btcPrice} (${marketData.btcChange24h}%)
        - ETH: $${marketData.ethPrice} (${marketData.ethChange24h}%)
        - Market Sentiment: ${marketData.fearGreedIndex > 50 ? "Optimistic" : "Cautious"}
        
        Generate content in this JSON format:
        {
          "title": "Catchy title",
          "content": "Engaging post content (max 280 chars)",
          "hashtags": ["#crypto", "#gamefi", "#web3"],
          "engagementTips": ["Tip 1", "Tip 2"],
          "optimalPostTime": "Best time to post for engagement"
        }
        
        Make it:
        - Relevant to current market conditions
        - Educational yet entertaining
        - Suitable for the user's experience level
        - Likely to generate engagement
        - Include actionable insights
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Invalid content suggestion format");
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error("Error generating social content:", error);
            throw new Error("Failed to generate social content");
        }
    }
    async analyzeUserPerformance(playerStats) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Analyze this GameFi player's performance and provide detailed insights:
        
        Player Stats:
        - Accuracy: ${playerStats.accuracy}%
        - Total Predictions: ${playerStats.totalPredictions}
        - Correct Predictions: ${playerStats.correctPredictions}
        - Current Streak: ${playerStats.currentStreak}
        - Best Streak: ${playerStats.bestStreak}
        - Quiz Count: ${playerStats.quizCount}
        - Social Score: ${playerStats.socialScore || 0}
        - Premium Status: ${playerStats.isPremium ? "Active" : "None"}
        
        Provide analysis in JSON format:
        {
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Area for improvement 1", "Area 2"],
          "recommendations": ["Specific action 1", "Action 2", "Action 3"],
          "nextMilestone": "Clear next goal to work towards",
          "projectedGrowth": "Realistic growth projection"
        }
        
        Focus on:
        - Performance patterns and trends
        - Skill development opportunities
        - Strategic recommendations for improvement
        - Motivation and goal setting
        - GameFi-specific optimization tips
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Invalid performance analysis format");
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error("Error analyzing user performance:", error);
            throw new Error("Failed to analyze user performance");
        }
    }
    async generateNewsDigest() {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        Generate a crypto news digest for GameFi platform users based on current market conditions and recent developments.
        
        Create a comprehensive but concise digest in JSON format:
        {
          "summary": "Brief overview of current crypto landscape",
          "keyEvents": ["Major event 1", "Event 2", "Event 3"],
          "marketImpact": "How these events might affect markets",
          "recommendations": ["Action users should consider", "Opportunity to watch"]
        }
        
        Focus on:
        - Major cryptocurrency developments
        - Regulatory news and updates
        - DeFi and GameFi sector developments
        - Technology improvements and upgrades
        - Institutional adoption news
        - Cross-chain and interoperability updates
        
        Keep it educational, actionable, and relevant for crypto gamers.
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Invalid news digest format");
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error("Error generating news digest:", error);
            throw new Error("Failed to generate news digest");
        }
    }
    buildSystemPrompt(context) {
        let prompt = `
      You are ZETA-AI, an advanced AI coach for ZetaSocialFi - a cross-chain SocialFi platform that combines GameFi, NFT achievements, and social networking.
      
      Your expertise includes:
      - Multi-chain cryptocurrency trading and analysis (ZetaChain Universal Apps)
      - Technical indicators, chart patterns, and market psychology
      - Cross-chain DeFi strategies and opportunities
      - GameFi mechanics, NFT utilities, and social token economics
      - Risk management and portfolio optimization
      - Social media engagement and content creation
      
      Platform Features you can help with:
      - Price predictions and trading strategies
      - Daily quizzes and educational content
      - Social media post optimization
      - Achievement tracking and goal setting
      - Cross-chain asset management
      - Premium feature utilization
      
      Guidelines:
      - Be helpful, educational, and encouraging
      - Provide specific, actionable advice
      - Explain complex concepts in gaming terms when appropriate
      - Never provide financial advice as investment recommendations
      - Focus on education, skill improvement, and platform engagement
      - Emphasize the benefits of cross-chain functionality
      - Keep responses engaging and suitable for a social gaming environment
      - Promote healthy competition and community building
    `;
        if (context.playerStats) {
            prompt += `
        
        Player Context:
        - Accuracy: ${context.playerStats.accuracy}%
        - Total Predictions: ${context.playerStats.totalPredictions}
        - Current Streak: ${context.playerStats.currentStreak || 0}
        - Experience Level: ${this.getExperienceLevel(context.playerStats)}
        - Premium Status: ${context.playerStats.isPremium ? "Active" : "Standard"}
      `;
        }
        if (context.socialProfile) {
            prompt += `
        
        Social Profile:
        - Followers: ${context.socialProfile.followers || 0}
        - Posts: ${context.socialProfile.totalPosts || 0}
        - Social Score: ${context.socialProfile.socialScore || 0}
      `;
        }
        return prompt;
    }
    getExperienceLevel(playerStats) {
        const totalPredictions = playerStats.totalPredictions || 0;
        const accuracy = playerStats.accuracy || 0;
        if (totalPredictions < 10)
            return "Beginner";
        if (totalPredictions < 50)
            return "Intermediate";
        if (totalPredictions < 200)
            return "Advanced";
        if (totalPredictions >= 200 && accuracy >= 80)
            return "Expert";
        if (totalPredictions >= 500 && accuracy >= 85)
            return "Master";
        return "Pro";
    }
}
//# sourceMappingURL=geminiService.js.map