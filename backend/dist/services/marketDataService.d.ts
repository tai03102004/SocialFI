interface PriceData {
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    lastUpdated: string;
}
interface MarketData {
    btcPrice: number;
    btcChange24h: number;
    ethPrice: number;
    ethChange24h: number;
    totalMarketCap: number;
    fearGreedIndex: number;
    dominance: {
        btc: number;
        eth: number;
    };
}
export declare class MarketDataService {
    private readonly COINGECKO_API;
    private readonly FEAR_GREED_API;
    getCurrentMarketData(): Promise<MarketData>;
    getPrice(symbol: string): Promise<PriceData>;
    getHistoricalData(symbol: string, days?: number): Promise<any[]>;
    getTrendingCoins(): Promise<any[]>;
}
export {};
//# sourceMappingURL=marketDataService.d.ts.map