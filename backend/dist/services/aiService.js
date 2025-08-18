import { spawn } from "child_process";
import path from "path";
import { promises as fs } from "fs";
import { AIAnalysis } from "../models/AIAnalysis";
import { DailyQuest } from "../models/DailyQuest";
import { MarketNews } from "../models/MarketNews";
export class AIService {
    constructor() {
        this.pythonPath = path.join(__dirname, "../python");
    }
    async runCrewAI(inputs) {
        return new Promise((resolve, reject) => {
            const python = spawn("python3", [path.join(this.pythonPath, "main.py")], {
                env: {
                    ...process.env,
                    SYMBOL: inputs.symbol,
                    USER_QUESTION: inputs.user_question || "",
                    CURRENT_DATE: inputs.current_date || new Date().toISOString().split("T")[0],
                },
            });
            let output = "";
            let error = "";
            python.stdout.on("data", (data) => {
                output += data.toString();
            });
            python.stderr.on("data", (data) => {
                error += data.toString();
            });
            python.on("close", async (code) => {
                if (code === 0) {
                    try {
                        const results = await this.parseAIOutput();
                        await this.saveAIResults(inputs.symbol, results);
                        resolve(results);
                    }
                    catch (parseError) {
                        reject(new Error(`Parse error: ${parseError}`));
                    }
                }
                else {
                    reject(new Error(`Python script failed: ${error}`));
                }
            });
        });
    }
    async parseAIOutput() {
        const outputDir = path.join(this.pythonPath, "json");
        try {
            await fs.mkdir(outputDir, { recursive: true });
        }
        catch (err) {
            // Directory exists
        }
        const fileMap = {
            daily_quests: "daily_quests.json",
            blockchain_news: "blockchain_news.json",
            sentiment_analysis: "sentiment_analysis.json",
            strategy_recommendations: "strategy_recommendations.json",
            technical_predictions: "technical_predictions.json",
            community_support: "community_support.json",
        };
        const results = {};
        for (const [key, filename] of Object.entries(fileMap)) {
            try {
                const filePath = path.join(outputDir, filename);
                const content = await fs.readFile(filePath, "utf8");
                results[key] = JSON.parse(content);
            }
            catch (err) {
                console.warn(`Could not read ${filename}:`, err);
                results[key] = this.getDefaultValue(key);
            }
        }
        return results;
    }
    async saveAIResults(symbol, results) {
        try {
            const now = new Date();
            const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            // Save AI analyses in bulk
            const analysisData = [
                {
                    type: "technical",
                    data: results.technical_predictions,
                    confidence: results.technical_predictions?.confidence_score || 50,
                },
                {
                    type: "sentiment",
                    data: results.sentiment_analysis,
                    confidence: (results.sentiment_analysis?.sentiment_score || 5) * 10,
                },
                {
                    type: "strategy",
                    data: results.strategy_recommendations,
                    confidence: results.strategy_recommendations?.confidence_score || 50,
                },
                {
                    type: "community",
                    data: results.community_support,
                    confidence: 70,
                },
            ];
            // Bulk upsert AI analyses
            const analysisPromises = analysisData
                .filter((item) => item.data)
                .map((item) => AIAnalysis.findOneAndUpdate({ symbol, analysisType: item.type }, {
                symbol,
                analysisType: item.type,
                data: item.data,
                confidence: item.confidence,
                validUntil,
                source: "crewai",
            }, { upsert: true, new: true }));
            await Promise.all(analysisPromises);
            // Save blockchain news
            if (results.blockchain_news) {
                await MarketNews.findOneAndUpdate({
                    symbol,
                    analysisDate: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    },
                }, {
                    symbol,
                    newsArticles: results.blockchain_news.news_articles || [],
                    marketIntelligence: results.blockchain_news.market_intelligence || {},
                    regulatoryUpdates: results.blockchain_news.regulatory_updates || [],
                    macroFactors: results.blockchain_news.macro_factors || {},
                    marketOutlook: results.blockchain_news.market_outlook || "",
                    analysisDate: now,
                    validUntil,
                }, { upsert: true, new: true });
            }
            // Save daily quest (only if new)
            if (results.daily_quests) {
                await this.saveDailyQuest(results.daily_quests, now);
            }
        }
        catch (error) {
            console.error("Error saving AI results:", error);
        }
    }
    async saveDailyQuest(questData, now) {
        const questId = questData.quest_id || `QD-${Date.now()}`;
        const existingQuest = await DailyQuest.findOne({
            questId,
            active: true,
        });
        if (!existingQuest) {
            const expiresAt = new Date(now.getTime() + (questData.time_limit || 24) * 60 * 60 * 1000);
            await DailyQuest.create({
                questId,
                questType: questData.quest_type || "prediction",
                title: questData.title || "Daily Challenge",
                description: questData.description || "Complete the daily challenge",
                completionCriteria: questData.completion_criteria || {},
                timeLimit: questData.time_limit || 24,
                rewards: {
                    points: questData.rewards?.points || 100,
                    tokens: questData.rewards?.tokens,
                    nft: questData.rewards?.nft,
                },
                difficulty: questData.difficulty || 5,
                expiresAt,
                participants: [],
            });
        }
    }
    // Simplified getters
    async getLatestAnalysis(symbol, type) {
        return await AIAnalysis.findOne({
            symbol: symbol.toUpperCase(),
            analysisType: type,
            validUntil: { $gt: new Date() },
        }).sort({ createdAt: -1 });
    }
    async getActiveQuests() {
        return await DailyQuest.find({
            active: true,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });
    }
    async getLatestNews(symbol) {
        return await MarketNews.findOne({
            symbol: symbol.toUpperCase(),
            validUntil: { $gt: new Date() },
        }).sort({ analysisDate: -1 });
    }
    async cleanupExpiredData() {
        try {
            const now = new Date();
            await Promise.all([
                AIAnalysis.deleteMany({ validUntil: { $lt: now } }),
                MarketNews.deleteMany({ validUntil: { $lt: now } }),
                DailyQuest.updateMany({ expiresAt: { $lt: now }, active: true }, { active: false }),
            ]);
            console.log("✅ Cleanup completed successfully");
        }
        catch (error) {
            console.error("❌ Error during cleanup:", error);
        }
    }
    getDefaultValue(key) {
        const defaults = {
            daily_quests: {
                quest_id: `QD-${Date.now()}`,
                quest_type: "prediction",
                title: "Daily BTC Prediction",
                description: "Predict BTC price movement",
                time_limit: 24,
                difficulty: 5,
                rewards: { points: 100 },
            },
            sentiment_analysis: {
                sentiment_score: 5,
                key_themes: ["Market uncertainty"],
                analysis_date: new Date().toISOString().split("T")[0],
            },
        };
        return defaults[key] || {};
    }
}
export const aiService = new AIService();
//# sourceMappingURL=aiService.js.map