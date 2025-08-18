import mongoose, { Schema } from "mongoose";
const MarketNewsSchema = new Schema({
    symbol: { type: String, required: true, uppercase: true },
    newsArticles: [
        {
            title: String,
            summary: String,
            source: String,
            url: String,
            publishedAt: Date,
            sentiment: { type: Number, min: -1, max: 1 },
        },
    ],
    marketIntelligence: {
        onChainMetrics: Schema.Types.Mixed,
        exchangeFlows: String,
        institutionalAdoption: String,
        corporateTreasuryUpdates: String,
    },
    regulatoryUpdates: [String],
    macroFactors: {
        dxy: String,
        interestRates: String,
        inflation: String,
    },
    marketOutlook: String,
    analysisDate: Date,
    createdAt: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
});
MarketNewsSchema.index({ symbol: 1, analysisDate: -1 });
export const MarketNews = mongoose.model("MarketNews", MarketNewsSchema);
//# sourceMappingURL=MarketNews.js.map