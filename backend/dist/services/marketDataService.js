import axios from "axios";
export class MarketDataService {
    constructor() {
        this.API_KEY = process.env.COINAPI_KEY;
        this.BASE_URL = "https://api.coingecko.com/api/v3";
    }
    async getPrice(symbol) {
        try {
            const response = await axios.get(`${this.BASE_URL}/simple/price?ids=${this.mapSymbolToId(symbol)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
            const id = this.mapSymbolToId(symbol);
            const data = response.data[id];
            return {
                symbol: symbol.toUpperCase(),
                price: data.usd,
                change24h: data.usd_24h_change || 0,
                volume24h: data.usd_24h_vol || 0,
                marketCap: data.usd_market_cap || 0,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            throw new Error(`Failed to fetch price for ${symbol}`);
        }
    }
    async getCurrentMarketData() {
        try {
            // Fetch BTC and ETH prices
            const [btcData, ethData] = await Promise.all([
                this.getPrice("btc"),
                this.getPrice("eth"),
            ]);
            // Fetch Fear & Greed Index
            const fearGreedResponse = await axios.get("https://api.alternative.me/fng/");
            const fearGreedIndex = parseInt(fearGreedResponse.data.data[0].value);
            // Fetch total market cap
            const globalResponse = await axios.get(`${this.BASE_URL}/global`);
            const totalMarketCap = globalResponse.data.data.total_market_cap.usd;
            return {
                btcPrice: btcData.price,
                btcChange24h: btcData.change24h,
                ethPrice: ethData.price,
                ethChange24h: ethData.change24h,
                fearGreedIndex,
                totalMarketCap,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            console.error("Error fetching market data:", error);
            throw new Error("Failed to fetch market data");
        }
    }
    mapSymbolToId(symbol) {
        const symbolMap = {
            btc: "bitcoin",
            eth: "ethereum",
            bnb: "binancecoin",
            sol: "solana",
            ada: "cardano",
            dot: "polkadot",
            link: "chainlink",
            matic: "matic-network",
        };
        return symbolMap[symbol.toLowerCase()] || symbol.toLowerCase();
    }
    async getPriceHistory(symbol, days = 7) {
        try {
            const id = this.mapSymbolToId(symbol);
            const response = await axios.get(`${this.BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=hourly`);
            return response.data.prices;
        }
        catch (error) {
            console.error(`Error fetching price history for ${symbol}:`, error);
            throw new Error(`Failed to fetch price history for ${symbol}`);
        }
    }
    async getTopCryptos(limit = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`);
            return response.data.map((coin) => ({
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h || 0,
                volume24h: coin.total_volume || 0,
                marketCap: coin.market_cap || 0,
                timestamp: Date.now(),
            }));
        }
        catch (error) {
            console.error("Error fetching top cryptos:", error);
            throw new Error("Failed to fetch top cryptocurrencies");
        }
    }
}
