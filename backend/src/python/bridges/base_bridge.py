import json
import time
import os
from datetime import datetime
from pathlib import Path
from web3 import Web3
from web3.middleware.proof_of_authority import ExtraDataToPOAMiddleware
from eth_account import Account
import logging
from dotenv import load_dotenv

load_dotenv()

class BaseBridge:
    def __init__(self):
        self.rpc_url = "https://zetachain-athens-evm.blockpi.network/v1/rpc/public"
        self.chain_id = 7001
        self.ai_output_dir = Path("./json")
        
        # Contract addresses
        self.contract_addresses = {
            "AIOracle": os.getenv('AIOracle', "0x9CD763b9a34c43123a70e69168C447C3dB1d51b7"),
            "GameFi": os.getenv('GameFi', "0x403Af55848d2BE8E351e0F29E8e425aaDB4CBBFE"),
            "SocialFi": os.getenv('SocialFi', "0x6236679Bae564c5c5DaC11156df082dEDfEb7a86"),
            "NFTAchievements": os.getenv('NFTAchievements', "0xC11531dE0165Aa654292647DF35c3340fB4e21B2"),
            "GUIToken": os.getenv('GUIToken', "0xD59Da846F02A6C84D79C05F80CFB3B7ae2F21879")
        }
        
        # Web3 setup
        self.w3 = None
        self.account = None
        self.contracts = {}
        self.current_nonce = None

        self.logger = logging.getLogger(self.__class__.__name__)
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
        
        self.setup_web3()
        self.load_contracts()

    def setup_web3(self):
        """Setup Web3 connection"""
        try:
            private_key = os.getenv('PRIVATE_KEY')
            if not private_key:
                raise Exception("PRIVATE_KEY not found in environment")
            
            self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
            self.w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
            
            if not self.w3.is_connected():
                raise Exception("Cannot connect to blockchain")
            
            self.account = Account.from_key(private_key)
            self.logger.info(f"✅ Connected to blockchain. Account: {self.account.address}")
            
        except Exception as e:
            self.logger.error(f"❌ Web3 setup failed: {e}")
            raise

    def load_contracts(self):
        """Load smart contracts with correct ABI"""
        try:
            # ✅ CORRECT SocialFiCore ABI
            social_abi = [
                {
                    "inputs": [{"name": "content", "type": "string"}],
                    "name": "createPost",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"name": "count", "type": "uint256"}],
                    "name": "getRecentPosts",
                    "outputs": [{"name": "", "type": "uint256[]"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"name": "postId", "type": "uint256"}],
                    "name": "getPost",
                    "outputs": [
                        {"name": "id", "type": "uint256"},
                        {"name": "author", "type": "address"},
                        {"name": "content", "type": "string"},
                        {"name": "timestamp", "type": "uint256"},
                        {"name": "likes", "type": "uint256"},
                        {"name": "aiSentimentScore", "type": "uint256"},
                        {"name": "isAIGenerated", "type": "bool"}
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"name": "postId", "type": "uint256"}],
                    "name": "likePost",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
            
            # AI Oracle ABI (already working)
            ai_oracle_abi = [
                {
                    "inputs": [
                        {"name": "_symbol", "type": "string"},
                        {"name": "_dataType", "type": "string"},
                        {"name": "_currentPrice", "type": "uint256"},
                        {"name": "_predictedPrice", "type": "uint256"},
                        {"name": "_sentimentScore", "type": "uint256"},
                        {"name": "_outlook", "type": "string"},
                        {"name": "_confidence", "type": "uint256"}
                    ],
                    "name": "updateAIData",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
            
            # GameFi ABI (already working)
            gamefi_abi = [
                {
                    "inputs": [
                        {"name": "_title", "type": "string"},
                        {"name": "_description", "type": "string"},
                        {"name": "_questType", "type": "string"},
                        {"name": "_reward", "type": "uint256"},
                        {"name": "_duration", "type": "uint256"}
                    ],
                    "name": "createQuest",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
            
            self.contracts = {
                'AIOracle': self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.contract_addresses['AIOracle']),
                    abi=ai_oracle_abi
                ),
                'SocialFi': self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.contract_addresses['SocialFi']),
                    abi=social_abi
                ),
                'GameFi': self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.contract_addresses['GameFi']),
                    abi=gamefi_abi
                )
            }
            
            self.logger.info("✅ All contracts loaded successfully")
            
        except Exception as e:
            self.logger.error(f"❌ Failed to load contracts: {e}")
            raise

    def get_nonce(self):
        """Get current nonce"""
        try:
            if self.current_nonce is None:
                self.current_nonce = self.w3.eth.get_transaction_count(self.account.address)
            return self.current_nonce
        except Exception as e:
            self.logger.error(f"❌ Error getting nonce: {e}")
            return None

    def increment_nonce(self):
        """Increment nonce"""
        if self.current_nonce is not None:
            self.current_nonce += 1

    def reset_nonce(self):
        """Reset nonce"""
        self.current_nonce = None

    def send_ai_update_transaction(self, symbol, data_type, current_price, predicted_price, sentiment_score, outlook, confidence):
        """Send AI data update to blockchain with improved error handling"""
        max_retries = 2
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                contract = self.contracts['AIOracle']
                nonce = self.get_nonce()
                
                if nonce is None:
                    return False
                
                # Build transaction
                tx = contract.functions.updateAIData(
                    symbol, data_type, current_price, predicted_price,
                    sentiment_score, outlook, confidence
                ).build_transaction({
                    'from': self.account.address,
                    'gas': 500000,
                    'gasPrice': int(self.w3.eth.gas_price * 1.2),
                    'nonce': nonce,
                    'chainId': self.chain_id
                })
                
                # Sign and send
                signed_txn = self.w3.eth.account.sign_transaction(tx, self.account.key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
                
                self.logger.info(f"📤 Transaction sent: {tx_hash.hex()[:10]}... (nonce: {nonce})")
                
                # Wait for confirmation with polling
                receipt = None
                timeout = 60  # Reduced timeout
                start_time = time.time()
                
                while time.time() - start_time < timeout:
                    try:
                        receipt = self.w3.eth.get_transaction_receipt(tx_hash)
                        break
                    except Exception:
                        time.sleep(2)  # Poll every 2 seconds
                
                if receipt and receipt.status == 1:
                    self.increment_nonce()
                    self.logger.info(f"✅ AI data updated: {symbol}/{data_type} - TX: {tx_hash.hex()[:10]}...")
                    return True
                elif receipt and receipt.status == 0:
                    self.logger.error(f"❌ Transaction reverted: {tx_hash.hex()[:10]}...")
                    self.reset_nonce()
                    return False
                else:
                    # Transaction not found or timeout
                    self.logger.warning(f"⏰ Transaction timeout: {tx_hash.hex()[:10]}... (Retry {retry_count + 1}/{max_retries})")
                    retry_count += 1
                    self.reset_nonce()
                    
                    if retry_count < max_retries:
                        time.sleep(5)  # Wait before retry
                        continue
                    else:
                        return False
                
            except Exception as e:
                retry_count += 1
                error_msg = str(e).lower()
                
                if 'nonce' in error_msg:
                    self.logger.warning(f"⚠️ Nonce issue (Retry {retry_count}/{max_retries})")
                    self.reset_nonce()
                else:
                    self.logger.error(f"❌ Transaction error (Retry {retry_count}/{max_retries}): {e}")
                
                if retry_count >= max_retries:
                    return False
                    
                time.sleep(3)
        
        return False

    def create_social_post(self, content):
        """Create social post - ENABLED with new contract"""
        try:
            contract = self.contracts['SocialFi'] 
            nonce = self.get_nonce()
            
            if nonce is None:
                return False
            
            tx = contract.functions.createPost(content).build_transaction({
                'from': self.account.address,
                'gas': 400000,
                'gasPrice': int(self.w3.eth.gas_price * 1.1),
                'nonce': nonce,
                'chainId': self.chain_id
            })
            
            signed_txn = self.w3.eth.account.sign_transaction(tx, self.account.key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            
            self.logger.info(f"📤 Social post TX: {tx_hash.hex()[:10]}... (nonce: {nonce})")
            
            # Wait for receipt
            receipt = None
            for i in range(30):  # 60 seconds max
                try:
                    receipt = self.w3.eth.get_transaction_receipt(tx_hash)
                    if receipt and receipt.status == 1:
                        self.increment_nonce()
                        self.logger.info(f"📱 Social post created - TX: {tx_hash.hex()[:10]}...")
                        return True
                    elif receipt and receipt.status == 0:
                        self.logger.error(f"❌ Social post failed - TX: {tx_hash.hex()[:10]}...")
                        self.reset_nonce()
                        return False
                    break
                except:
                    time.sleep(2)
            
            if not receipt:
                self.logger.warning(f"⏰ Social post timeout - TX: {tx_hash.hex()[:10]}...")
                self.reset_nonce()
            
            return False
                
        except Exception as e:
            self.logger.error(f"❌ Social post failed: {e}")
            self.reset_nonce()
            return False

    def create_quest(self, title, description, quest_type, reward, duration):
        """Create quest with improved error handling"""
        max_retries = 2
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                contract = self.contracts['GameFi']
                nonce = self.get_nonce()
                
                if nonce is None:
                    return False
                
                tx = contract.functions.createQuest(
                    title, description, quest_type, reward, duration
                ).build_transaction({
                    'from': self.account.address,
                    'gas': 500000,
                    'gasPrice': int(self.w3.eth.gas_price * 1.2),
                    'nonce': nonce,
                    'chainId': self.chain_id
                })
                
                signed_txn = self.w3.eth.account.sign_transaction(tx, self.account.key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
                
                self.logger.info(f"📤 Quest TX: {tx_hash.hex()[:10]}... (nonce: {nonce})")
                
                # Polling for receipt
                receipt = None
                timeout = 60
                start_time = time.time()
                
                while time.time() - start_time < timeout:
                    try:
                        receipt = self.w3.eth.get_transaction_receipt(tx_hash)
                        break
                    except Exception:
                        time.sleep(2)
                
                if receipt and receipt.status == 1:
                    self.increment_nonce()
                    self.logger.info(f"🎯 Quest created - TX: {tx_hash.hex()[:10]}...")
                    return True
                else:
                    self.logger.warning(f"⏰ Quest timeout: {tx_hash.hex()[:10]}... (Retry {retry_count + 1}/{max_retries})")
                    retry_count += 1
                    self.reset_nonce()
                    
                    if retry_count < max_retries:
                        time.sleep(5)
                        continue
                    else:
                        return False
                        
            except Exception as e:
                retry_count += 1
                self.logger.error(f"❌ Quest error (Retry {retry_count}/{max_retries}): {e}")
                self.reset_nonce()
                
                if retry_count >= max_retries:
                    return False
                    
                time.sleep(3)
        
        return False