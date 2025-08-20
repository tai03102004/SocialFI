from .base_bridge import BaseBridge
import json

class QuestBridge(BaseBridge):
    def __init__(self):
        super().__init__()
        self.data_file = "daily_quests.json"
        
    def process_file(self):
        """Process daily quests file"""
        file_path = self.ai_output_dir / self.data_file
        
        if not file_path.exists():
            self.logger.warning(f"⚠️ File not found: {self.data_file}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.logger.info(f"📄 Processing {self.data_file}")
            
            success = self.process_quest_data(data)
            
            if success:
                post_content = self.generate_quest_post(data)
                self.create_social_post(post_content)
                self.logger.info("🎯 QUEST created successfully")
            
            return success
            
        except Exception as e:
            self.logger.error(f"❌ Error processing {self.data_file}: {e}")
            return False
    
    def process_quest_data(self, data):
        """Process quest data and create quest on blockchain"""
        try:
            title = data.get('title', 'Daily Challenge')
            description = data.get('description', 'Complete this challenge to earn rewards')
            quest_type = data.get('quest_type', 'prediction')
            time_limit = data.get('time_limit', 86400)  # 24 hours
            difficulty = data.get('difficulty', 5)
            
            # Calculate reward based on difficulty
            base_reward = 100 * 10**18  # 100 GUI tokens
            reward = base_reward * difficulty
            
            return self.create_quest(title, description, quest_type, reward, time_limit)
            
        except Exception as e:
            self.logger.error(f"❌ Error processing quest data: {e}")
            return False
    
    def generate_quest_post(self, data):
        """Generate quest announcement post"""
        try:
            title = data.get('title', 'Daily Challenge')
            difficulty = data.get('difficulty', 5)
            
            post_content = f"""🎮 New Quest Available!

                🎯 {title}
                ⭐ Difficulty: {difficulty}/10
                ⏰ Time Limit: 24 hours
                💰 Reward: {difficulty * 100} GUI tokens

                Join the challenge and test your skills!

                🤖 AI Quest Designer
                #GameFi #Quests #Challenge #ZetaSocialFi"""
            
            return post_content[:500]
            
        except Exception as e:
            self.logger.error(f"❌ Error generating quest post: {e}")
            return "🎮 New quest available! Join the challenge and earn rewards! #GameFi #Quests"