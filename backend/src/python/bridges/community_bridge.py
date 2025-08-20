from .base_bridge import BaseBridge
import json

class CommunityBridge(BaseBridge):
    def __init__(self):
        super().__init__()
        self.data_file = "community_support.json"
        
    def process_file(self):
        """Process community support file"""
        file_path = self.ai_output_dir / self.data_file
        
        if not file_path.exists():
            self.logger.warning(f"⚠️ File not found: {self.data_file}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.logger.info(f"📄 Processing {self.data_file}")
            
            success = self.process_community_data(data)
            
            if success:
                post_content = self.generate_community_post(data)
                self.create_social_post(post_content)
                self.logger.info("📊 COMMUNITY data processed successfully")
            
            return success
            
        except Exception as e:
            self.logger.error(f"❌ Error processing {self.data_file}: {e}")
            return False
    
    def process_community_data(self, data):
        """Process community support data"""
        try:
            return self.send_ai_update_transaction(
                'BTC', 'community', 11400000, 11400000,
                6, 'NEUTRAL', 70
            )
            
        except Exception as e:
            self.logger.error(f"❌ Error processing community data: {e}")
            return False
    
    def generate_community_post(self, data):
        """Generate community support post"""
        try:
            question = data.get('user_question', '')
            features = data.get('suggested_features', [])
            
            post_content = f"""🤝 Community Support Update:

                ❓ Latest Q&A: "{question[:100]}..."
                🎯 Trading strategy guidance provided
                💎 NFT rewards distributed based on performance

                🆕 Available features:"""
            
            if features:
                for feature in features[:2]:
                    post_content += f"\n• {feature}"
            
            post_content += f"""

                🤖 AI Community Manager - 24/7 Support
                #Community #Support #NFTRewards"""
                            
            return post_content[:500]
            
        except Exception as e:
            self.logger.error(f"❌ Error generating community post: {e}")
            return "🤝 Community support active! AI assistant ready to help. #Community #Support"
