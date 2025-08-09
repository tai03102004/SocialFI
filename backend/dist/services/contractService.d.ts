export declare class ContractService {
    private provider;
    private gamefiContract;
    private socialContract;
    constructor();
    getPlayerStats(address: string): Promise<{
        score: any;
        totalPredictions: any;
        correctPredictions: any;
        accuracy: any;
        currentStreak: any;
        bestStreak: any;
        quizCount: any;
        isPremium: any;
    }>;
    getDailyQuests(): Promise<any>;
    getRecentPosts(limit?: number): Promise<any[]>;
    setupEventListeners(): void;
}
export declare const contractService: ContractService;
//# sourceMappingURL=contractService.d.ts.map