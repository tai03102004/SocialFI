from crewai.tools import BaseTool
from typing import Type, List, Dict, Any, Optional
from pydantic import BaseModel, Field
import json
import requests
from tools.technical_indicators import TechnicalIndicators
import yfinance as yf
import pandas as pd

class TechnicalAnalysisInput(BaseModel):
    """Input schema for technical analysis tool."""
    symbol: str = Field(..., description="Cryptocurrency symbol (e.g., BTC-USD, ETH-USD)")
    indicators: List[str] = Field(default=["rsi", "macd", "bollinger", "ema"], 
                                description="List of indicators to calculate")
    period: str = Field(default="30d", description="Time period for data (1d, 7d, 30d, 90d)")
    interval: str = Field(default="1h", description="Data interval (1m, 5m, 15m, 1h, 1d)")

class TechnicalAnalysisTool(BaseTool):
    name: str = "Technical Analysis Tool"
    description: str = (
        "Performs comprehensive technical analysis on cryptocurrency prices. "
        "Calculates RSI, MACD, Bollinger Bands, EMA, SMA, Stochastic, and provides trading signals. "
        "Also includes volume analysis and trend detection."
    )
    args_schema: Type[BaseModel] = TechnicalAnalysisInput

    def _run(self, symbol: str, indicators: List[str] = None, 
             period: str = "30d", interval: str = "1h") -> str:
        try:
            if indicators is None:
                indicators = ["rsi", "macd", "bollinger", "ema", "sma"]
            
            # Fetch price data từ Yahoo Finance
            ticker = yf.Ticker(f"{symbol}-USD" if not symbol.endswith("-USD") else symbol)
            data = ticker.history(period=period, interval=interval)
            
            if data.empty:
                return json.dumps({"error": f"No data found for {symbol}"})
            
            # Prepare data
            prices = data['Close'].tolist()
            volumes = data['Volume'].tolist() if 'Volume' in data.columns else None
            highs = data['High'].tolist() if 'High' in data.columns else None
            lows = data['Low'].tolist() if 'Low' in data.columns else None
            
            # Calculate technical indicators
            ta = TechnicalIndicators()
            results = ta.calculate_multiple_indicators(
                prices=prices,
                volumes=volumes,
                highs=highs,
                lows=lows,
                indicators=indicators
            )
            
            # Add current price and market context
            current_price = prices[-1]
            price_change = ((prices[-1] - prices[-2]) / prices[-2] * 100) if len(prices) > 1 else 0
            
            # Add advanced analysis
            results['market_context'] = {
                "current_price": round(current_price, 2),
                "price_change_24h": round(price_change, 2),
                "volatility": round(pd.Series(prices).pct_change().std() * 100, 2),
                "volume_trend": self._analyze_volume_trend(volumes) if volumes else "N/A",
                "support_resistance": self._find_support_resistance(prices),
                "trend_strength": self._calculate_trend_strength(prices)
            }
            
            return json.dumps(results, ensure_ascii=False, indent=2)
            
        except Exception as e:
            return json.dumps({"error": f"Technical analysis failed: {str(e)}"})
    
    def _analyze_volume_trend(self, volumes: List[float]) -> str:
        """Analyze volume trend over the period"""
        if len(volumes) < 10:
            return "Insufficient data"
        
        recent_vol = sum(volumes[-5:]) / 5
        older_vol = sum(volumes[-15:-10]) / 5
        
        if recent_vol > older_vol * 1.2:
            return "Increasing"
        elif recent_vol < older_vol * 0.8:
            return "Decreasing"
        else:
            return "Stable"
    
    def _find_support_resistance(self, prices: List[float]) -> Dict[str, float]:
        """Find basic support and resistance levels"""
        if len(prices) < 20:
            return {"support": None, "resistance": None}
        
        recent_prices = prices[-20:]
        support = min(recent_prices)
        resistance = max(recent_prices)
        
        return {
            "support": round(support, 2),
            "resistance": round(resistance, 2)
        }
    
    def _calculate_trend_strength(self, prices: List[float]) -> str:
        """Calculate trend strength based on price momentum"""
        if len(prices) < 10:
            return "Unknown"
        
        # Calculate linear regression slope
        x = list(range(len(prices[-10:])))
        y = prices[-10:]
        
        n = len(x)
        slope = (n * sum(x[i] * y[i] for i in range(n)) - sum(x) * sum(y)) / (n * sum(x[i]**2 for i in range(n)) - sum(x)**2)
        
        if slope > 0.5:
            return "Strong Uptrend"
        elif slope > 0.1:
            return "Weak Uptrend"
        elif slope < -0.5:
            return "Strong Downtrend"
        elif slope < -0.1:
            return "Weak Downtrend"
        else:
            return "Sideways"