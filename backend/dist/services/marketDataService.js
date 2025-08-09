import axios from "axios";
export class MarketDataService {
    constructor() {
        this.COINGECKO_API = "https://api.coingecko.com/api/v3";
        this.FEAR_GREED_API = "https://api.alternative.me/fng/";
    }
    async getCurrentMarketData() {
        try {
            // Get price data for major cryptocurrencies
            const priceResponse = await axios.get(`${this.COINGECKO_API}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`);
            // Get global market data
            const globalResponse = await axios.get(`${this.COINGECKO_API}/global`);
            // Get Fear & Greed Index
            const fearGreedResponse = await axios.get(`${this.FEAR_GREED_API}?limit=1`);
            const btcData = priceResponse.data.bitcoin;
            const ethData = priceResponse.data.ethereum;
            const globalData = globalResponse.data.data;
            const fearGreedData = fearGreedResponse.data.data[0];
            return {
                btcPrice: btcData.usd,
                btcChange24h: btcData.usd_24h_change,
                ethPrice: ethData.usd,
                ethChange24h: ethData.usd_24h_change,
                totalMarketCap: globalData.total_market_cap.usd,
                fearGreedIndex: parseInt(fearGreedData.value),
                dominance: {
                    btc: globalData.market_cap_percentage.btc,
                    eth: globalData.market_cap_percentage.eth,
                },
            };
        }
        catch (error) {
            console.error("Error fetching market data:", error);
            // Return fallback data
            return {
                btcPrice: 45000,
                btcChange24h: 2.5,
                ethPrice: 2800,
                ethChange24h: -1.2,
                totalMarketCap: 1800000000000,
                fearGreedIndex: 65,
                dominance: { btc: 52, eth: 17 },
            };
        }
    }
    async getPrice(symbol) {
        try {
            const response = await axios.get(`${this.COINGECKO_API}/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
            const data = response.data[symbol];
            return {
                symbol: symbol.toUpperCase(),
                price: data.usd,
                change24h: data.usd_24h_change,
                volume24h: data.usd_24h_vol,
                marketCap: data.usd_market_cap,
                lastUpdated: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            throw new Error(`Failed to fetch price for ${symbol}`);
        }
    }
    async getHistoricalData(symbol, days = 30) {
        try {
            const response = await axios.get(`${this.COINGECKO_API}/coins/${symbol}/market_chart?vs_currency=usd&days=${days}`);
            return response.data.prices.map(([timestamp, price]) => ({
                timestamp: new Date(timestamp).toISOString(),
                price,
            }));
        }
        catch (error) {
            console.error(`Error fetching historical data for ${symbol}:`, error);
            throw new Error(`Failed to fetch historical data for ${symbol}`);
        }
    }
    async getTrendingCoins() {
        try {
            const response = await axios.get(`${this.COINGECKO_API}/search/trending`);
            return response.data.coins.map((coin) => ({
                id: coin.item.id,
                name: coin.item.name,
                symbol: coin.item.symbol,
                thumb: coin.item.thumb,
                rank: coin.item.market_cap_rank,
            }));
        }
        catch (error) {
            console.error("Error fetching trending coins:", error);
            return [];
        }
    }
}
//# sourceMappingURL=marketDataService.js.map