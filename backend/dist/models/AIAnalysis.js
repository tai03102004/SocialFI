import mongoose, { Schema } from "mongoose";
const AIAnalysisSchema = new Schema({
    symbol: { type: String, required: true, uppercase: true },
    analysisType: {
        type: String,
        required: true,
        enum: ["technical", "sentiment", "strategy", "news", "community"],
    },
    data: { type: Schema.Types.Mixed, required: true },
    confidence: { type: Number, min: 0, max: 100, default: 50 },
    createdAt: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    source: { type: String, default: "crewai" },
});
AIAnalysisSchema.index({ symbol: 1, analysisType: 1, createdAt: -1 });
AIAnalysisSchema.index({ validUntil: 1 }); // For TTL cleanup
export const AIAnalysis = mongoose.model("AIAnalysis", AIAnalysisSchema);
//# sourceMappingURL=AIAnalysis.js.map