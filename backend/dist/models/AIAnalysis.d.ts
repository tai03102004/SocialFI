import mongoose, { Document } from "mongoose";
export interface IAIAnalysis extends Document {
    symbol: string;
    analysisType: "technical" | "sentiment" | "strategy" | "news" | "community";
    data: any;
    confidence: number;
    createdAt: Date;
    validUntil: Date;
    source: string;
}
export declare const AIAnalysis: mongoose.Model<IAIAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IAIAnalysis> & IAIAnalysis & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=AIAnalysis.d.ts.map