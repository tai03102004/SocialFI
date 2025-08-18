import mongoose, { Document } from "mongoose";
export interface IMarketNews extends Document {
    symbol: string;
    newsArticles: Array<{
        title: string;
        summary: string;
        source: string;
        url?: string;
        publishedAt: Date;
        sentiment: number;
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
export declare const MarketNews: mongoose.Model<IMarketNews, {}, {}, {}, mongoose.Document<unknown, {}, IMarketNews> & IMarketNews & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=MarketNews.d.ts.map