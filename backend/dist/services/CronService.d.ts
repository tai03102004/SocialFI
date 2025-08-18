export declare class CronService {
    private isRunning;
    initializeCronJobs(): void;
    private runDailyAIProcessing;
    private resolveExpiredQuests;
    private evaluateQuestResult;
    private awardQuestRewards;
    private sleep;
    triggerDailyProcessing(): Promise<void>;
    triggerQuestResolution(): Promise<void>;
}
export declare const cronService: CronService;
//# sourceMappingURL=CronService.d.ts.map