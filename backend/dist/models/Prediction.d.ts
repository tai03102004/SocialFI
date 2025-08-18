import mongoose, { Document } from "mongoose";
export interface IPrediction extends Document {
    predictionId: number;
    playerAddress: string;
    predictedPrice: string;
    actualPrice?: string;
    asset: string;
    timestamp: Date;
    resolved: boolean;
    correct?: boolean;
    txHash: string;
    blockNumber: number;
    reward?: string;
}
export declare const Prediction: mongoose.Model<IPrediction, {}, {}, {}, mongoose.Document<unknown, {}, IPrediction> & IPrediction & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Prediction.d.ts.map