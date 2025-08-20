from .base_bridge import BaseBridge
import json

class MarketBridge(BaseBridge):
    def __init__(self):
        super().__init__()
        self.data_file = "blockchain_news.json"
        
    def process_file(self):
        """Process blockchain news file and update smart contracts"""
        file_path = self.ai_output_dir / self.data_file
        
        if not file_path.exists():
            self.logger.warning(f"⚠️ File not found: {self.data_file}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.logger.info(f"📄 Processing {self.data_file}")
            
            # Process market intelligence
            success = self.process_market_data(data)
            
            if success:
                # Create engaging social post
                post_content = self.generate_market_post(data)
                self.create_social_post(post_content)
                self.logger.info("📊 MARKET data processed successfully")
            
            return success
            
        except Exception as e:
            self.logger.error(f"❌ Error processing {self.data_file}: {e}")
            return False
    
    def process_market_data(self, data):
        """Extract and process market intelligence data"""
        try:
            # Extract institutional data
            institutional = data.get('market_intelligence', {}).get('institutional_adoption_and_corporate_treasury_updates', '')
            market_outlook = data.get('market_outlook', '')
            
            # Calculate sentiment based on market outlook
            sentiment_score = self.calculate_market_sentiment(data)
            
            # Set prices (you can make these dynamic based on real data)
            current_price = 11400000  # $114,000 * 100
            predicted_price = 11700000  # Based on resistance levels
            confidence = 75
            
            # Determine outlook
            outlook = "MIXED"
            if "positive" in market_outlook.lower():
                outlook = "BULLISH"
            elif "negative" in market_outlook.lower():
                outlook = "BEARISH"
            
            # Send to smart contract
            return self.send_ai_update_transaction(
                'BTC', 'market', current_price, predicted_price,
                sentiment_score, outlook, confidence
            )
            
        except Exception as e:
            self.logger.error(f"❌ Error processing market data: {e}")
            return False
    
    def calculate_market_sentiment(self, data):
        """Calculate sentiment score from market data"""
        sentiment = 5  # Neutral default
        
        market_outlook = data.get('market_outlook', '').lower()
        if 'positive' in market_outlook or 'bullish' in market_outlook:
            sentiment += 2
        elif 'negative' in market_outlook or 'bearish' in market_outlook:
            sentiment -= 2
        
        # Adjust for institutional adoption
        institutional = data.get('market_intelligence', {}).get('institutional_adoption_and_corporate_treasury_updates', '')
        if '$414 billion' in institutional:
            sentiment += 1
        
        # Adjust for regulatory developments
        regulatory = data.get('regulatory_updates', [])
        if any('Strategic Bitcoin Reserve' in update for update in regulatory):
            sentiment += 1
            
        return min(10, max(1, sentiment))
    
    def generate_market_post(self, data):
        """Generate engaging social post from market data"""
        try:
            news_articles = data.get('news_articles', [])
            regulatory_updates = data.get('regulatory_updates', [])
            
            post_parts = ["📰 Market Intelligence Update:"]
            
            # Add institutional insight
            post_parts.append(f"\n💼 Institutional: $414B invested (15% of total supply)")
            post_parts.append(f"\n🏛️ MicroStrategy: 629,376 BTC")
            post_parts.append(f"\n🔷 BlackRock IBIT: $70B+ AUM")
            
            # Add regulatory updates
            if any('Strategic Bitcoin Reserve' in update for update in regulatory_updates):
                post_parts.append(f"\n🇺🇸 US Strategic Bitcoin Reserve established!")
            
            # Add market outlook
            market_outlook = data.get('market_outlook', '')
            if 'mixed' in market_outlook.lower():
                post_parts.append(f"\n📊 Mixed outlook: Institutional strength vs macro headwinds")
            
            post_parts.extend([
                f"\n🤖 AI Market Analyst - {data.get('analysis_date', '2025-08-20')}",
                "\n#MarketNews #Bitcoin #Institutional #ZetaSocialFi"
            ])
            
            return "".join(post_parts)[:500]
            
        except Exception as e:
            self.logger.error(f"❌ Error generating market post: {e}")
            return "📰 Fresh market intelligence available! Institutional adoption continues strong. #MarketNews #Bitcoin"