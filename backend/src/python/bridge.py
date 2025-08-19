import json
import time
import os
from pathlib import Path
from datetime import datetime
from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
import logging

from dotenv import load_dotenv
import os

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger('AIBridge')

class AIBridge:
    def __init__(self):
        # Configuration
        self.rpc_url = "https://zetachain-athens-evm.blockpi.network/v1/rpc/public"
        self.chain_id = 7001
        
        # Đường dẫn
        self.ai_output_dir = Path("./json")
        self.processed_dir = Path("./processed")
        self.processed_dir.mkdir(exist_ok=True)
        
        # Web3 setup
        self.w3 = None
        self.account = None
        self.contracts = {}
        
        # Track processed files
        self.last_processed = {}
        
        # Contract addresses (sẽ được set sau khi deploy)
        self.contract_addresses = {
            'AIOracle': '',
            'GameFi': '',
            'SocialFi': '',
            'NFTAchievements': '',
            'GUIToken': ''
        }
        
        logger.info("🌉 AI Bridge Simple initialized")

    def setup_web3(self, private_key: str):
        """Setup Web3 connection"""
        try:
            self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
            
            if not self.w3.is_connected():
                raise Exception("Cannot connect to blockchain")
            
            self.account = Account.from_key(private_key)
            logger.info(f"✅ Connected to blockchain. Account: {self.account.address}")
            logger.info(f"🏗️ Block number: {self.w3.eth.block_number}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Web3 setup failed: {e}")
            return False

    def set_contract_addresses(self, addresses: dict):
        """Set contract addresses after deployment"""
        self.contract_addresses.update(addresses)
        logger.info(f"📝 Contract addresses updated: {addresses}")

    def load_contract_abis(self):
        """Load contract ABIs (simplified)"""
        # Simplified ABI - chỉ cần functions mình sử dụng
        self.contract_abis = {
            'AIOracle': [
                {
                    "inputs": [
                        {"name": "symbol", "type": "string"},
                        {"name": "dataType", "type": "string"},
                        {"name": "currentPrice", "type": "uint256"},
                        {"name": "predictedPrice", "type": "uint256"},
                        {"name": "sentimentScore", "type": "uint256"},
                        {"name": "outlook", "type": "string"},
                        {"name": "confidence", "type": "uint256"}
                    ],
                    "name": "updateAIData",
                    "type": "function"
                },
                {
                    "inputs": [
                        {"name": "symbol", "type": "string"},
                        {"name": "dataType", "type": "string"}
                    ],
                    "name": "getAIData",
                    "outputs": [
                        {"name": "", "type": "tuple", "components": [
                            {"name": "symbol", "type": "string"},
                            {"name": "currentPrice", "type": "uint256"},
                            {"name": "predictedPrice", "type": "uint256"},
                            {"name": "sentimentScore", "type": "uint256"},
                            {"name": "outlook", "type": "string"},
                            {"name": "confidence", "type": "uint256"},
                            {"name": "timestamp", "type": "uint256"},
                            {"name": "dataType", "type": "string"}
                        ]}
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            'GameFi': [
                {
                    "inputs": [
                        {"name": "title", "type": "string"},
                        {"name": "description", "type": "string"},
                        {"name": "questType", "type": "string"},
                        {"name": "reward", "type": "uint256"},
                        {"name": "duration", "type": "uint256"}
                    ],
                    "name": "createQuest",
                    "type": "function"
                }
            ]
        }

    def load_contracts(self):
        """Load contract instances"""
        try:
            self.load_contract_abis()
            
            for name, address in self.contract_addresses.items():
                if address and name in self.contract_abis:
                    contract = self.w3.eth.contract(
                        address=Web3.to_checksum_address(address),
                        abi=self.contract_abis[name]
                    )
                    self.contracts[name] = contract
                    logger.info(f"✅ Loaded contract {name} at {address}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load contracts: {e}")
            return False

    def monitor_ai_outputs(self):
        """Monitor AI output files và process chúng"""
        
        # Files cần monitor
        target_files = {
            "blockchain_news.json": "market",
            "technical_predictions.json": "technical", 
            "sentiment_analysis.json": "social",
            "strategy_recommendations.json": "strategy",
            "daily_quests.json": "quest",
            "community_support.json": "community"
        }
        
        for filename, data_type in target_files.items():
            file_path = self.ai_output_dir / filename
            
            if file_path.exists():
                # Check if file changed
                current_mtime = file_path.stat().st_mtime
                last_mtime = self.last_processed.get(filename, 0)
                
                if current_mtime > last_mtime:
                    logger.info(f"📄 Processing {filename}")
                    self.process_ai_file(file_path, data_type)
                    self.last_processed[filename] = current_mtime

    def process_ai_file(self, file_path: Path, data_type: str):
        """Process individual AI file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                ai_data = json.load(f)
            
            if data_type == "quest":
                self.process_quest_data(ai_data)
            else:
                self.process_ai_analysis_data(ai_data, data_type)
                
            # Backup processed file
            self.backup_file(file_path)
            
        except Exception as e:
            logger.error(f"❌ Error processing {file_path.name}: {e}")

    def process_ai_analysis_data(self, data: dict, data_type: str):
        """Process AI analysis data and update Oracle"""
        try:
            if 'AIOracle' not in self.contracts:
                logger.warning("⚠️ AIOracle contract not loaded")
                return

            # Extract data based on type
            symbol = data.get('symbol', 'BTC')
            
            # Convert data to contract format
            current_price = 0
            predicted_price = 0
            sentiment_score = 5
            outlook = "NEUTRAL"
            confidence = 50

            if data_type == "market":
                # Process blockchain_news.json
                outlook_text = data.get('market_outlook', '').lower()
                if 'bullish' in outlook_text or 'positive' in outlook_text:
                    outlook = "BULLISH"
                    sentiment_score = 7
                elif 'bearish' in outlook_text or 'negative' in outlook_text:
                    outlook = "BEARISH"
                    sentiment_score = 3
                    
            elif data_type == "technical":
                # Process technical_predictions.json
                if 'technical_analysis' in data and 'market_context' in data['technical_analysis']:
                    context = data['technical_analysis']['market_context']
                    current_price = int(context.get('current_price', 0) * 100)  # Convert to wei-like
                    
                    # Simple prediction logic
                    trend = context.get('trend_strength', '')
                    if 'Strong Uptrend' in trend:
                        predicted_price = int(current_price * 1.05)
                        outlook = "BULLISH"
                        sentiment_score = 8
                    elif 'Downtrend' in trend:
                        predicted_price = int(current_price * 0.95)
                        outlook = "BEARISH"
                        sentiment_score = 3
                    else:
                        predicted_price = current_price
                        
                if 'technical_analysis' in data and 'summary' in data['technical_analysis']:
                    confidence = data['technical_analysis']['summary'].get('confidence', 50)
                    
            elif data_type == "social":
                # Process sentiment_analysis.json
                sentiment_score = data.get('sentiment_score', 5)
                confidence = 75
                if sentiment_score >= 7:
                    outlook = "BULLISH"
                elif sentiment_score <= 3:
                    outlook = "BEARISH"
                    
            elif data_type == "strategy":
                # Process strategy_recommendations.json
                if 'market_strategy' in data:
                    strategy = data['market_strategy']
                    entry_point = strategy.get('entry_point', 0)
                    exit_target = strategy.get('exit_target', 0)
                    
                    if exit_target > entry_point:
                        outlook = "BULLISH"
                        sentiment_score = 7
                        predicted_price = int(exit_target * 100)
                        current_price = int(entry_point * 100)
                    else:
                        outlook = "NEUTRAL"
                        
                confidence = data.get('confidence_score', 50)

            # Send transaction to update AI Oracle
            self.send_ai_update_transaction(
                symbol, data_type, current_price, predicted_price, 
                sentiment_score, outlook, confidence
            )
            
        except Exception as e:
            logger.error(f"❌ Error processing {data_type} data: {e}")

    def process_quest_data(self, data: dict):
        """Process quest data and create quest"""
        try:
            if 'GameFi' not in self.contracts:
                logger.warning("⚠️ GameFi contract not loaded")
                return

            title = data.get('title', 'Daily Challenge')
            description = data.get('description', 'Complete the daily challenge')
            quest_type = data.get('quest_type', 'General')
            reward = int(20 * 1e18)  # 20 GUI tokens
            duration = data.get('time_limit', 24) * 3600  # Convert hours to seconds

            # Send transaction to create quest
            self.send_create_quest_transaction(title, description, quest_type, reward, duration)
            
        except Exception as e:
            logger.error(f"❌ Error processing quest data: {e}")

    def send_ai_update_transaction(self, symbol: str, data_type: str, current_price: int, 
                                 predicted_price: int, sentiment_score: int, 
                                 outlook: str, confidence: int):
        """Send transaction to update AI Oracle"""
        try:
            if 'AIOracle' not in self.contracts:
                return

            oracle_contract = self.contracts['AIOracle']
            
            # Build transaction
            tx = oracle_contract.functions.updateAIData(
                symbol,
                data_type,
                current_price,
                predicted_price,
                sentiment_score,
                outlook,
                confidence
            ).build_transaction({
                'from': self.account.address,
                'gas': 300000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })

            # Sign and send
            signed_txn = self.w3.eth.account.sign_transaction(tx, self.account.key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            logger.info(f"✅ AI data updated: {symbol}/{data_type} - TX: {tx_hash.hex()[:10]}...")
            
        except Exception as e:
            logger.error(f"❌ Failed to update AI data: {e}")

    def send_create_quest_transaction(self, title: str, description: str, 
                                    quest_type: str, reward: int, duration: int):
        """Send transaction to create quest"""
        try:
            if 'GameFi' not in self.contracts:
                return

            gamefi_contract = self.contracts['GameFi']
            
            # Build transaction
            tx = gamefi_contract.functions.createQuest(
                title,
                description,
                quest_type,
                reward,
                duration
            ).build_transaction({
                'from': self.account.address,
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })

            # Sign and send
            signed_txn = self.w3.eth.account.sign_transaction(tx, self.account.key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            logger.info(f"✅ Quest created: {title} - TX: {tx_hash.hex()[:10]}...")
            
        except Exception as e:
            logger.error(f"❌ Failed to create quest: {e}")

    def backup_file(self, file_path: Path):
        """Backup processed file"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_name = f"{timestamp}_{file_path.name}"
            backup_path = self.processed_dir / backup_name
            
            # Copy file content
            backup_path.write_text(file_path.read_text(encoding='utf-8'), encoding='utf-8')
            logger.info(f"📦 Backed up: {backup_name}")
            
        except Exception as e:
            logger.error(f"❌ Backup failed: {e}")

    def run_continuous(self, interval: int = 30):
        """Run bridge continuously"""
        logger.info(f"🔄 Starting continuous monitoring (every {interval}s)")
        
        try:
            while True:
                self.monitor_ai_outputs()
                time.sleep(interval)
                
        except KeyboardInterrupt:
            logger.info("🛑 Bridge stopped by user")
        except Exception as e:
            logger.error(f"❌ Bridge error: {e}")

    def run_once(self):
        """Run bridge once"""
        logger.info("🔄 Running bridge once...")
        self.monitor_ai_outputs()
        logger.info("✅ Bridge run completed")

    def test_connection(self):
        """Test blockchain connection"""
        try:
            if not self.w3 or not self.w3.is_connected():
                logger.error("❌ Not connected to blockchain")
                return False
                
            block = self.w3.eth.block_number
            balance = self.w3.eth.get_balance(self.account.address)
            
            logger.info(f"✅ Connection test passed:")
            logger.info(f"   Block number: {block}")
            logger.info(f"   Account balance: {self.w3.from_wei(balance, 'ether')} ETH")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Connection test failed: {e}")
            return False

# Configuration và CLI
def main():
    import sys
    
    # Load config from environment hoặc file
    private_key = os.getenv('PRIVATE_KEY')
    if not private_key:
        print("❌ PRIVATE_KEY environment variable not set")
        return
    
    # Contract addresses - update these after deployment
    contract_addresses = {
        'AIOracle': os.getenv('AI_ORACLE_ADDRESS', ''),
        'GameFi': os.getenv('GAMEFI_ADDRESS', ''),
        'SocialFi': os.getenv('SOCIALFI_ADDRESS', ''),
        'NFTAchievements': os.getenv('NFT_ADDRESS', ''),
        'GUIToken': os.getenv('GUI_TOKEN_ADDRESS', '')
    }
    
    # Initialize bridge
    bridge = AIBridge()
    
    # Setup
    if not bridge.setup_web3(private_key):
        return
    
    bridge.set_contract_addresses(contract_addresses)
    
    if not bridge.load_contracts():
        logger.warning("⚠️ Some contracts not loaded, continuing anyway...")
    
    # Test connection
    if not bridge.test_connection():
        return
    
    # Run based on command
    command = sys.argv[1] if len(sys.argv) > 1 else "once"
    
    if command == "test":
        logger.info("✅ Test completed successfully")
    elif command == "once":
        bridge.run_once()
    elif command == "continuous":
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        bridge.run_continuous(interval)
    else:
        print("Usage:")
        print("  python ai_bridge_simple.py test           # Test connection")
        print("  python ai_bridge_simple.py once           # Run once")
        print("  python ai_bridge_simple.py continuous [30] # Run continuously")

if __name__ == "__main__":
    main()