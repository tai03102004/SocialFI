from bridges.market_bridge import MarketBridge
from bridges.technical_bridge import TechnicalBridge
from bridges.strategy_bridge import StrategyBridge
from bridges.sentiment_bridge import SentimentBridge
from bridges.quest_bridge import QuestBridge
from bridges.community_bridge import CommunityBridge
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger('BridgeOrchestrator')

class BridgeOrchestrator:
    def __init__(self):
        self.logger = logging.getLogger('BridgeOrchestrator')
        self.bridges = {}
    def initialize_bridges(self):
        """Initialize bridges one by one"""
        bridge_classes = [
            ('market', MarketBridge),
            ('technical', TechnicalBridge),
            ('strategy', StrategyBridge),
            ('sentiment', SentimentBridge),
            ('quest', QuestBridge),
            ('community', CommunityBridge)
        ]
        
        for name, bridge_class in bridge_classes:
            try:
                self.logger.info(f"🔧 Initializing {name} bridge...")
                self.bridges[name] = bridge_class()
                time.sleep(1)  # Small delay between initializations
            except Exception as e:
                self.logger.error(f"❌ Failed to initialize {name} bridge: {e}")
        
    def run_all_bridges(self):
        """Run all AI agent bridges sequentially"""
        self.logger.info("🌉 Starting AI Bridge Orchestrator...")
        
        # Initialize bridges
        self.initialize_bridges()
        
        results = {}
        
        for bridge_name, bridge in self.bridges.items():
            try:
                self.logger.info(f"🔄 Processing {bridge_name.upper()} agent...")
                success = bridge.process_file()
                results[bridge_name] = success
                
                if success:
                    self.logger.info(f"✅ {bridge_name.upper()} processed successfully")
                else:
                    self.logger.warning(f"⚠️ {bridge_name.upper()} processing failed")
                
                # Longer wait between bridges to avoid conflicts
                self.logger.info(f"⏳ Waiting 15 seconds before next bridge...")
                time.sleep(15)
                
            except Exception as e:
                self.logger.error(f"❌ Error processing {bridge_name}: {e}")
                results[bridge_name] = False
        
        # Summary
        successful = sum(1 for success in results.values() if success)
        total = len(results)
        
        self.logger.info(f"🎉 Bridge run completed: {successful}/{total} successful")
        
        # Show details
        for bridge_name, success in results.items():
            status = "✅" if success else "❌"
            self.logger.info(f"{status} {bridge_name.upper()}: {'Success' if success else 'Failed'}")
        
        return results

def main():
    orchestrator = BridgeOrchestrator()
    orchestrator.run_all_bridges()

if __name__ == "__main__":
    main()