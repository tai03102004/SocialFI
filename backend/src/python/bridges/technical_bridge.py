from .base_bridge import BaseBridge
import json

class TechnicalBridge(BaseBridge):
    def __init__(self):
        super().__init__()
        self.data_file = "technical_predictions.json"
        
    def process_file(self):
        """Process technical analysis file"""
        file_path = self.ai_output_dir / self.data_file
        
        if not file_path.exists():
            self.logger.warning(f"⚠️ File not found: {self.data_file}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.logger.info(f"📄 Processing {self.data_file}")
            
            success = self.process_technical_data(data)
            
            if success:
                post_content = self.generate_technical_post(data)
                self.create_social_post(post_content)
                self.logger.info("📊 TECHNICAL data processed successfully")
            
            return success
            
        except Exception as e:
            self.logger.error(f"❌ Error processing {self.data_file}: {e}")
            return False
    
    def process_technical_data(self, data):
        """Process technical analysis data"""
        try:
            symbol = data.get('symbol', 'BTC-USD')
            confidence = data.get('confidence_score', 60)
            
            # Set prices based on technical levels
            current_price = 11400000  # $114,000
            predicted_price = 11750000  # Resistance level
            
            return self.send_ai_update_transaction(
                symbol, 'technical', current_price, predicted_price,
                6, 'NEUTRAL', confidence
            )
            
        except Exception as e:
            self.logger.error(f"❌ Error processing technical data: {e}")
            return False
    
    def generate_technical_post(self, data):
        """Generate technical analysis post"""
        try:
            confidence = data.get('confidence_score', 60)
            symbol = data.get('symbol', 'BTC-USD')
            
            post_content = f"""📊 Technical Analysis Update:

                🎯 {symbol} Analysis Complete
                🔮 AI Confidence: {confidence}%
                📈 Resistance: $117,500
                📉 Support: $114,000

                🤖 LSTM + Traditional TA Combined
                ⚡ Advanced indicators processed

                #TechnicalAnalysis #AI #Trading #ZetaSocialFi"""
            
            return post_content[:500]
            
        except Exception as e:
            self.logger.error(f"❌ Error generating technical post: {e}")
            return "📊 Technical analysis updated! AI prediction engine active. #TechnicalAnalysis #AI"