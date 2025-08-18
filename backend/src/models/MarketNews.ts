import mongoose, { Document, Schema } from "mongoose";

export interface IMarketNews extends Document {
  symbol: string;
  newsArticles: Array<{
    title: string;
    summary: string;
    source: string;
    url?: string;
    publishedAt: Date;
    sentiment: number; // -1 to 1
  }>;
  marketIntelligence: {
    onChainMetrics: any;
    exchangeFlows: string;
    institutionalAdoption: string;
    corporateTreasuryUpdates: string;
  };
  regulatoryUpdates: string[];
  macroFactors: {
    dxy: string;
    interestRates: string;
    inflation: string;
  };
  marketOutlook: string;
  analysisDate: Date;
  createdAt: Date;
  validUntil: Date;
}

const MarketNewsSchema = new Schema<IMarketNews>({
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

export const MarketNews = mongoose.model<IMarketNews>(
  "MarketNews",
  MarketNewsSchema
);
