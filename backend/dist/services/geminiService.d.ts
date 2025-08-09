interface ChatContext {
    playerStats?: any;
    marketData?: any;
    context: string;
    socialProfile?: any;
    recentPosts?: any[];
}
interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    category: string;
    timeLimit: number;
}
interface DailyQuest {
    title: string;
    description: string;
    objective: string;
    reward: number;
    type: "prediction" | "quiz" | "social" | "accuracy" | "streak";
    deadline: string;
    difficulty: "easy" | "medium" | "hard";
}
interface MarketInsight {
    sentiment: "bullish" | "bearish" | "neutral";
    confidence: number;
    recommendation: string;
    keyFactors: string[];
    predictedPriceRange: {
        asset: string;
        low: number;
        high: number;
        timeframe: string;
    };
    riskLevel: "low" | "medium" | "high";
}
interface SocialContentSuggestion {
    title: string;
    content: string;
    hashtags: string[];
    engagementTips: string[];
    optimalPostTime: string;
}
export declare class GeminiService {
    private genAI;
    private marketService;
    constructor();
    generateChatResponse(message: string, context: ChatContext): Promise<string>;
    generateQuiz(difficulty?: "easy" | "medium" | "hard", category?: string): Promise<QuizQuestion[]>;
    analyzeMarketSentiment(): Promise<MarketInsight>;
    generateTradingStrategy(playerStats: any): Promise<string>;
    generateDailyQuest(): Promise<DailyQuest>;
    generateSocialContent(topic: string, userProfile: any): Promise<SocialContentSuggestion>;
    analyzeUserPerformance(playerStats: any): Promise<{
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
        nextMilestone: string;
        projectedGrowth: string;
    }>;
    generateNewsDigest(): Promise<{
        summary: string;
        keyEvents: string[];
        marketImpact: string;
        recommendations: string[];
    }>;
    private buildSystemPrompt;
    private getExperienceLevel;
}
export {};
//# sourceMappingURL=geminiService.d.ts.map