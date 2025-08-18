from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import json
import warnings
warnings.filterwarnings('ignore')

class LSTMPredictionInput(BaseModel):
    """Input schema for LSTM prediction tool."""
    symbol: str = Field(..., description="Cryptocurrency symbol (e.g., BTC, ETH)")
    days_ahead: int = Field(default=7, description="Number of days to predict ahead (1-30)")
    training_period: str = Field(default="1y", description="Training data period (3mo, 6mo, 1y, 2y)")

class LSTMPredictionTool(BaseTool):
    name: str = "LSTM Price Prediction Tool"
    description: str = (
        "Uses LSTM deep learning model to predict cryptocurrency prices. "
        "Provides price forecasts, confidence intervals, and trend predictions "
        "based on historical price patterns and market cycles."
    )
    args_schema: Type[BaseModel] = LSTMPredictionInput

    def _run(self, symbol: str, days_ahead: int = 7, training_period: str = "1y") -> str:
        try:
            # Validate inputs
            if days_ahead > 30:
                days_ahead = 30
            if days_ahead < 1:
                days_ahead = 1
                
            # Fetch training data
            ticker = yf.Ticker(f"{symbol}-USD")
            data = ticker.history(period=training_period, interval="1d")
            
            if len(data) < 60:
                return json.dumps({"error": "Insufficient training data"})
            
            # Prepare data for LSTM
            prices = data['Close'].values.reshape(-1, 1)
            
            # Scale the data
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled_data = scaler.fit_transform(prices)
            
            # Create training sequences
            sequence_length = 60  # Use 60 days to predict next day
            X, y = self._create_sequences(scaled_data, sequence_length)
            
            if len(X) < 20:
                return json.dumps({"error": "Not enough data for training"})
            
            # Split data
            train_size = int(len(X) * 0.8)
            X_train, X_test = X[:train_size], X[train_size:]
            y_train, y_test = y[:train_size], y[train_size:]
            
            # Build LSTM model
            model = self._build_lstm_model((X_train.shape[1], 1))
            
            # Train model
            model.fit(X_train, y_train, epochs=50, batch_size=32, verbose=0)
            
            # Make predictions for test set (for validation)
            test_predictions = model.predict(X_test)
            test_predictions = scaler.inverse_transform(test_predictions)
            actual_test = scaler.inverse_transform(y_test.reshape(-1, 1))
            
            # Calculate accuracy metrics
            mse = mean_squared_error(actual_test, test_predictions)
            mae = mean_absolute_error(actual_test, test_predictions)
            accuracy = max(0, 100 - (mae / actual_test.mean()) * 100)
            
            # Predict future prices
            last_sequence = scaled_data[-sequence_length:]
            future_predictions = []
            current_sequence = last_sequence.copy()
            
            for _ in range(days_ahead):
                next_pred = model.predict(current_sequence.reshape(1, sequence_length, 1), verbose=0)
                future_predictions.append(next_pred[0, 0])
                
                # Update sequence for next prediction
                current_sequence = np.append(current_sequence[1:], next_pred[0, 0]).reshape(-1, 1)
            
            # Inverse transform predictions
            future_predictions = np.array(future_predictions).reshape(-1, 1)
            future_prices = scaler.inverse_transform(future_predictions).flatten()
            
            # Calculate confidence intervals (simplified)
            current_price = prices[-1][0]
            volatility = np.std(prices[-30:]) if len(prices) >= 30 else np.std(prices)
            
            predictions_with_confidence = []
            for i, price in enumerate(future_prices):
                confidence_range = volatility * np.sqrt(i + 1) * 0.1  # Increasing uncertainty over time
                predictions_with_confidence.append({
                    "day": i + 1,
                    "predicted_price": round(float(price), 2),
                    "confidence_lower": round(float(price - confidence_range), 2),
                    "confidence_upper": round(float(price + confidence_range), 2),
                    "price_change": round(((price - current_price) / current_price) * 100, 2)
                })
            
            # Trend analysis
            trend_direction = "Bullish" if future_prices[-1] > current_price else "Bearish"
            trend_strength = abs((future_prices[-1] - current_price) / current_price) * 100
            
            if trend_strength > 10:
                trend_intensity = "Strong"
            elif trend_strength > 5:
                trend_intensity = "Moderate"
            else:
                trend_intensity = "Weak"
            
            # Market cycle analysis
            cycle_analysis = self._analyze_market_cycle(prices.flatten())
            
            result = {
                "symbol": symbol,
                "current_price": round(float(current_price), 2),
                "prediction_period": f"{days_ahead} days",
                "model_accuracy": round(float(accuracy), 2),
                "model_metrics": {
                    "mse": round(float(mse), 2),
                    "mae": round(float(mae), 2)
                },
                "predictions": predictions_with_confidence,
                "trend_analysis": {
                    "direction": trend_direction,
                    "intensity": trend_intensity,
                    "strength_percentage": round(float(trend_strength), 2)
                },
                "market_cycle": cycle_analysis,
                "summary": {
                    "target_price": round(float(future_prices[-1]), 2),
                    "total_change": round(((future_prices[-1] - current_price) / current_price) * 100, 2),
                    "confidence_level": min(90, accuracy),
                    "recommendation": self._generate_recommendation(trend_direction, trend_strength, accuracy)
                },
                "disclaimer": "AI predictions are not financial advice. Past performance doesn't guarantee future results."
            }
            
            return json.dumps(result, ensure_ascii=False, indent=2)
            
        except Exception as e:
            return json.dumps({"error": f"LSTM prediction failed: {str(e)}"})
    
    def _create_sequences(self, data, seq_length):
        """Create sequences for LSTM training"""
        X, y = [], []
        for i in range(seq_length, len(data)):
            X.append(data[i-seq_length:i, 0])
            y.append(data[i, 0])
        return np.array(X), np.array(y)
    
    def _build_lstm_model(self, input_shape):
        """Build LSTM model architecture"""
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def _analyze_market_cycle(self, prices):
        """Analyze current market cycle position"""
        if len(prices) < 100:
            return {"cycle": "Unknown", "position": "Insufficient data"}
        
        # Simple cycle analysis based on moving averages
        short_ma = np.mean(prices[-20:])
        long_ma = np.mean(prices[-100:])
        current_price = prices[-1]
        
        # Calculate cycle metrics
        price_vs_short = (current_price - short_ma) / short_ma * 100
        price_vs_long = (current_price - long_ma) / long_ma * 100
        
        if price_vs_long > 20 and price_vs_short > 5:
            cycle = "Bull Market"
            position = "Late Stage"
        elif price_vs_long > 10 and price_vs_short > 0:
            cycle = "Bull Market"
            position = "Early-Mid Stage"
        elif price_vs_long < -20 and price_vs_short < -5:
            cycle = "Bear Market"
            position = "Late Stage"
        elif price_vs_long < -10 and price_vs_short < 0:
            cycle = "Bear Market"
            position = "Early-Mid Stage"
        else:
            cycle = "Consolidation"
            position = "Sideways Movement"
        
        return {
            "cycle": cycle,
            "position": position,
            "price_vs_short_ma": round(price_vs_short, 2),
            "price_vs_long_ma": round(price_vs_long, 2)
        }
    
    def _generate_recommendation(self, direction, strength, accuracy):
        """Generate trading recommendation based on prediction"""
        if accuracy < 60:
            return "Low confidence - Monitor closely"
        
        if direction == "Bullish":
            if strength > 10:
                return "Strong Buy Signal - High upside potential"
            elif strength > 5:
                return "Buy Signal - Moderate upside expected"
            else:
                return "Weak Buy - Consider accumulating"
        else:
            if strength > 10:
                return "Strong Sell Signal - Significant downside risk"
            elif strength > 5:
                return "Sell Signal - Moderate downside expected"
            else:
                return "Weak Sell - Consider reducing position"