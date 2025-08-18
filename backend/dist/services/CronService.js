import cron from "node-cron";
import { aiService } from "./aiService";
import { DailyQuest } from "../models/DailyQuest";
import { User } from "../models/User";
export class CronService {
    constructor() {
        this.isRunning = false;
    }
    initializeCronJobs() {
        console.log("🤖 Initializing AI Cron Jobs...");
        // All-in-one daily AI processing at 01:00 UTC
        cron.schedule("0 1 * * *", async () => {
            if (this.isRunning) {
                console.log("⏳ Previous AI job still running, skipping...");
                return;
            }
            console.log("🚀 Starting daily AI processing...");
            await this.runDailyAIProcessing();
        });
        // Quest resolution every 4 hours
        cron.schedule("0 */4 * * *", async () => {
            console.log("✅ Resolving expired quests...");
            await this.resolveExpiredQuests();
        });
        // Daily cleanup at 02:00 UTC
        cron.schedule("0 2 * * *", async () => {
            console.log("🧹 Cleaning up expired data...");
            await aiService.cleanupExpiredData();
        });
        console.log("✅ Cron jobs initialized successfully");
    }
    async runDailyAIProcessing() {
        this.isRunning = true;
        try {
            const symbols = ["BTC", "ETH", "ZETA"];
            const questTypes = ["beginner", "intermediate", "advanced"];
            // Deactivate expired quests first
            await DailyQuest.updateMany({ expiresAt: { $lt: new Date() } }, { active: false });
            for (const symbol of symbols) {
                console.log(`🔍 Processing ${symbol}...`);
                // Generate comprehensive analysis
                await aiService.runCrewAI({
                    symbol,
                    user_question: `Generate comprehensive daily analysis including market sentiment, technical predictions, strategy recommendations, blockchain news, and community insights for ${symbol}`,
                    current_date: new Date().toISOString().split("T")[0],
                });
                await this.sleep(10000); // 10 second delay
                // Generate quests for each difficulty
                for (const difficulty of questTypes) {
                    console.log(`🎮 Generating ${difficulty} quest for ${symbol}...`);
                    await aiService.runCrewAI({
                        symbol,
                        user_question: `Generate a daily ${difficulty} level quest focusing on ${symbol} price prediction and market analysis with appropriate rewards`,
                    });
                    await this.sleep(5000); // 5 second delay
                }
            }
            console.log("✅ Daily AI processing completed");
        }
        catch (error) {
            console.error("❌ Daily AI processing error:", error);
        }
        finally {
            this.isRunning = false;
        }
    }
    async resolveExpiredQuests() {
        try {
            const expiredQuests = await DailyQuest.find({
                active: true,
                expiresAt: { $lt: new Date() },
            });
            if (expiredQuests.length === 0) {
                console.log("📭 No expired quests to resolve");
                return;
            }
            console.log(`🔍 Resolving ${expiredQuests.length} expired quests...`);
            for (const quest of expiredQuests) {
                quest.active = false;
                // Process participants
                for (const participant of quest.participants) {
                    if (participant.status === "pending") {
                        const success = this.evaluateQuestResult(quest, participant);
                        participant.status = success ? "completed" : "failed";
                        if (success) {
                            await this.awardQuestRewards(participant.address, quest.rewards);
                        }
                    }
                }
                await quest.save();
            }
            console.log("✅ Quest resolution completed");
        }
        catch (error) {
            console.error("❌ Quest resolution error:", error);
        }
    }
    evaluateQuestResult(quest, participant) {
        // Simplified evaluation logic
        if (!participant.submittedAt || !participant.prediction) {
            return false;
        }
        const submissionTime = new Date(participant.submittedAt);
        const questDeadline = new Date(quest.expiresAt);
        // Success based on timely submission and basic validation
        const isOnTime = submissionTime < questDeadline;
        const hasValidPrediction = typeof participant.prediction === "string" &&
            participant.prediction.length > 0;
        // Simple success rate (70% for valid submissions)
        return isOnTime && hasValidPrediction && Math.random() > 0.3;
    }
    async awardQuestRewards(address, rewards) {
        try {
            const updateData = {
                lastActive: new Date(),
            };
            if (rewards.points) {
                updateData.$inc = {
                    gameScore: rewards.points,
                    socialScore: Math.floor(rewards.points * 0.2),
                };
            }
            await User.findOneAndUpdate({ address: address.toLowerCase() }, updateData, { upsert: true });
            console.log(`🎉 Awarded ${rewards.points} points to ${address}`);
        }
        catch (error) {
            console.error("❌ Award rewards error:", error);
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // Manual triggers for testing
    async triggerDailyProcessing() {
        console.log("🔧 Manual trigger: Daily AI Processing");
        await this.runDailyAIProcessing();
    }
    async triggerQuestResolution() {
        console.log("🔧 Manual trigger: Quest Resolution");
        await this.resolveExpiredQuests();
    }
}
export const cronService = new CronService();
//# sourceMappingURL=CronService.js.map