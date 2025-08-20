from .base_bridge import BaseBridge
import json

class StrategyBridge(BaseBridge):
    def __init__(self):
        super().__init__()
        self.data_file = "strategy_recommendations.json"
        
    def process_file(self):
        """Process strategy recommendations file"""
        file_path = self.ai_output_dir / self.data_file
        
        if not file_path.exists():
            self.logger.warning(f"⚠️ File not found: {self.data_file}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.logger.info(f"📄 Processing {self.data_file}")
            
            success = self.process_strategy_data(data)
            
            if success:
                post_content = self.generate_strategy_post(data)
                self.create_social_post(post_content)
                self.logger.info("📊 STRATEGY data processed successfully")
            
            return success
            
        except Exception as e:
            self.logger.error(f"❌ Error processing {self.data_file}: {e}")
            return False
    
    def process_strategy_data(self, data):
        """Process strategy recommendations"""
        try:
            symbol = data.get('symbol', 'BTC-USD')
            confidence = data.get('confidence_score', 75)
            
            # Determine outlook from timeframe analysis
            timeframe = data.get('timeframe_outlook', {})
            long_term = timeframe.get('long_term', '').lower()
            
            outlook = "NEUTRAL"
            if 'bullish' in long_term:
                outlook = "BULLISH"
            elif 'bearish' in long_term:
                outlook = "BEARISH"
            
            return self.send_ai_update_transaction(
                symbol, 'strategy', 11400000, 12000000,
                7, outlook, confidence
            )
            
        except Exception as e:
            self.logger.error(f"❌ Error processing strategy data: {e}")
            return False
    
    def generate_strategy_post(self, data):
        """Generate strategy post"""
        try:
            confidence = data.get('confidence_score', 75)
            
            post_content = f"""🎯 Strategy Update:

                📈 Investment + GameFi Strategy Aligned
                🎮 SocialFi Platform Optimization
                💼 Portfolio: Mixed allocation recommended

                🔸 Short-term: Cautious (volatility expected)
                🔸 Long-term: Bullish (institutional growth)

                🤖 AI Strategy Agent - Confidence: {confidence}%
                #Strategy #GameFi #Investment #AI"""
            
            return post_content[:500]
            
        except Exception as e:
            self.logger.error(f"❌ Error generating strategy post: {e}")
            return "🎯 Strategy recommendations updated! GameFi + investment alignment optimized. #Strategy #GameFi"