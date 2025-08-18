import mongoose, { Document } from "mongoose";
export interface IDailyQuest extends Document {
    questId: string;
    questType: string;
    title: string;
    description: string;
    completionCriteria: any;
    timeLimit: number;
    rewards: {
        points?: number;
        tokens?: number;
        nft?: string;
    };
    difficulty: number;
    active: boolean;
    createdAt: Date;
    expiresAt: Date;
    participants: Array<{
        address: string;
        status: "pending" | "completed" | "failed";
        submittedAt?: Date;
        result?: any;
        prediction?: string;
        actualResult?: string;
    }>;
}
export declare const DailyQuest: mongoose.Model<IDailyQuest, {}, {}, {}, mongoose.Document<unknown, {}, IDailyQuest> & IDailyQuest & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=DailyQuest.d.ts.map