import mongoose, { Document, Schema } from "mongoose";

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

const PredictionSchema = new Schema<IPrediction>({
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

export const Prediction = mongoose.model<IPrediction>(
  "Prediction",
  PredictionSchema
);
