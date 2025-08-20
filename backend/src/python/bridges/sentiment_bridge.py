from .base_bridge import BaseBridge
import json

class SentimentBridge(BaseBridge):
    def __init__(self):
        super().__init__()
        self.data_file = "sentiment_analysis.json"
        
    def process_file(self):
        """Process sentiment analysis file"""
        file_path = self.ai_output_dir / self.data_file
        
        if not file_path.exists():
            self.logger.warning(f"⚠️ File not found: {self.data_file}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.logger.info(f"📄 Processing {self.data_file}")
            
            success = self.process_sentiment_data(data)
            
            if success:
                post_content = self.generate_sentiment_post(data)
                self.create_social_post(post_content)
                self.logger.info("📊 SOCIAL data processed successfully")
            
            return success
            
        except Exception as e:
            self.logger.error(f"❌ Error processing {self.data_file}: {e}")
            return False
    
    def process_sentiment_data(self, data):
        """Process social sentiment data"""
        try:
            symbol = data.get('symbol', 'Bitcoin')
            sentiment_score = data.get('sentiment_score', 5)
            
            return self.send_ai_update_transaction(
                symbol, 'social', 11400000, 11400000,
                sentiment_score, 'NEUTRAL', 70
            )
            
        except Exception as e:
            self.logger.error(f"❌ Error processing sentiment data: {e}")
            return False
    
    def generate_sentiment_post(self, data):
        """Generate sentiment post"""
        try:
            sentiment_score = data.get('sentiment_score', 5)
            themes = data.get('key_themes', [])
            
            sentiment_emoji = "🔄"
            if sentiment_score >= 7:
                sentiment_emoji = "🚀"
            elif sentiment_score <= 3:
                sentiment_emoji = "📉"
            
            post_content = f"""💭 Social Sentiment Analysis:

                {sentiment_emoji} Sentiment Score: {sentiment_score}/10
                📱 Social media monitoring complete"""  

            if themes:
                post_content += f"\n🔥 Themes: {', '.join(themes[:2])}"
            
            post_content += f"""

                🤖 AI Social Agent analyzing Web3 communities
                #SentimentAnalysis #SocialFi #Community"""
            
            return post_content[:500]
            
        except Exception as e:
            self.logger.error(f"❌ Error generating sentiment post: {e}")
            return "💭 Social sentiment analysis complete! Community trends analyzed. #Sentiment #SocialFi"
