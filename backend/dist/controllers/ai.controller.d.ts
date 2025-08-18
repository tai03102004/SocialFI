import { Request, Response } from "express";
export declare class AIController {
    generateDailyQuests(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getActiveQuests(req: Request, res: Response): Promise<void>;
    submitQuestResult(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTechnicalAnalysis(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSentimentAnalysis(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getStrategyRecommendations(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBlockchainNews(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    chatbotResponse(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCommunitySupport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMarketAnalysis(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getComprehensiveAnalysis(req: Request, res: Response): Promise<void>;
    healthCheck(req: Request, res: Response): Promise<void>;
}
export declare const aiController: AIController;
//# sourceMappingURL=ai.controller.d.ts.map