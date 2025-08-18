interface AIInputs {
    symbol: string;
    user_question?: string;
    current_date?: string;
}
interface AIResults {
    daily_quests?: any;
    blockchain_news?: any;
    sentiment_analysis?: any;
    strategy_recommendations?: any;
    technical_predictions?: any;
    community_support?: any;
}
export declare class AIService {
    private pythonPath;
    runCrewAI(inputs: AIInputs): Promise<AIResults>;
    private parseAIOutput;
    private saveAIResults;
    private saveDailyQuest;
    getLatestAnalysis(symbol: string, type: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/AIAnalysis").IAIAnalysis> & import("../models/AIAnalysis").IAIAnalysis & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getActiveQuests(): Promise<(import("mongoose").Document<unknown, {}, import("../models/DailyQuest").IDailyQuest> & import("../models/DailyQuest").IDailyQuest & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getLatestNews(symbol: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/MarketNews").IMarketNews> & import("../models/MarketNews").IMarketNews & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    cleanupExpiredData(): Promise<void>;
    private getDefaultValue;
}
export declare const aiService: AIService;
export {};
//# sourceMappingURL=aiService.d.ts.map