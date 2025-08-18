import mongoose, { Schema } from "mongoose";
const PredictionSchema = new Schema({
    predictionId: { type: Number, required: true, unique: true },
    playerAddress: { type: String, required: true, lowercase: true },
    predictedPrice: { type: String, required: true },
    actualPrice: String,
    asset: { type: String, required: true },
    timestamp: { type: Date, required: true },
    resolved: { type: Boolean, default: false },
    correct: Boolean,
    txHash: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    reward: String,
});
export const Prediction = mongoose.model("Prediction", PredictionSchema);
//# sourceMappingURL=Prediction.js.map