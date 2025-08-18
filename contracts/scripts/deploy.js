const {
    ethers
} = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🎯 Final deployment - fixing GameFiCore deployment...");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Known addresses
    const deployedContracts = {
        GUIToken: "0x61385a29749dE1Ad27BC350db5bcb1Fc294090cb",
        Gateway: "0x6c533f7fe93fae114d0954697069df33c9b74fd7"
    };

    const transactions = {
        GUIToken: "0x6746874c7b413fb032d720d65607713e8c7e969b5f42e49e981a814a747b56a8"
    };

    console.log("✅ GUIToken already deployed:", deployedContracts.GUIToken);
    console.log("✅ Gateway already deployed:", deployedContracts.Gateway);

    try {
        // Deploy NFTAchievements (no parameters)
        console.log("\n🏆 Deploying NFTAchievements...");
        const NFTAchievements = await ethers.getContractFactory("NFTAchievements");
        const nftAchievements = await NFTAchievements.deploy({
            gasLimit: 3000000,
            gasPrice: ethers.parseUnits("25", "gwei")
        });

        const nftAddress = await nftAchievements.getAddress();
        const nftTxHash = nftAchievements.deploymentTransaction().hash;

        console.log("📍 NFTAchievements Address:", nftAddress);
        console.log("📍 Transaction:", nftTxHash);

        deployedContracts.NFTAchievements = nftAddress;
        transactions.NFTAchievements = nftTxHash;

        // Wait before next deployment
        console.log("⏳ Waiting 10 seconds...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Deploy GameFiCore (WITH REQUIRED PARAMETERS)
        console.log("\n🎮 Deploying GameFiCore...");
        const GameFiCore = await ethers.getContractFactory("GameFiCore");

        // GameFiCore constructor requires: address _gateway, address _guiToken
        const gameFiCore = await GameFiCore.deploy(
            deployedContracts.Gateway, // _gateway parameter
            deployedContracts.GUIToken, // _guiToken parameter
            {
                gasLimit: 3000000,
                gasPrice: ethers.parseUnits("25", "gwei")
            }
        );

        const gameFiAddress = await gameFiCore.getAddress();
        const gameFiTxHash = gameFiCore.deploymentTransaction().hash;

        console.log("📍 GameFiCore Address:", gameFiAddress);
        console.log("📍 Transaction:", gameFiTxHash);
        console.log("📍 Gateway used:", deployedContracts.Gateway);
        console.log("📍 GUIToken used:", deployedContracts.GUIToken);

        deployedContracts.GameFiCore = gameFiAddress;
        transactions.GameFiCore = gameFiTxHash;

        // Wait before next deployment
        console.log("⏳ Waiting 10 seconds...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Deploy SocialFiCore (no parameters)
        console.log("\n📱 Deploying SocialFiCore...");
        const SocialFiCore = await ethers.getContractFactory("SocialFiCore");
        const socialFiCore = await SocialFiCore.deploy(
            deployedContracts.Gateway, // _gateway
            deployedContracts.GUIToken, // _guiToken
            {
                gasLimit: 3000000,
                gasPrice: ethers.parseUnits("25", "gwei")
            }
        );

        const socialFiAddress = await socialFiCore.getAddress();
        const socialFiTxHash = socialFiCore.deploymentTransaction().hash;

        console.log("📍 SocialFiCore Address:", socialFiAddress);
        console.log("📍 Transaction:", socialFiTxHash);

        deployedContracts.SocialFiCore = socialFiAddress;
        transactions.SocialFiCore = socialFiTxHash;

        // Save deployment info
        const deploymentInfo = {
            network: "zeta-testnet",
            chainId: "7001",
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: deployedContracts,
            transactions: transactions,
            status: "completed"
        };

        // Create deployments directory
        if (!fs.existsSync('./deployments')) {
            fs.mkdirSync('./deployments');
        }

        // Save deployment JSON
        fs.writeFileSync('./deployments/zeta-testnet.json', JSON.stringify(deploymentInfo, null, 2));

        // Generate Frontend Config
        const frontendConfig = `// 🎉 COMPLETE CONTRACT DEPLOYMENT - ${new Date().toISOString()}
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ✅ ALL CONTRACTS DEPLOYED SUCCESSFULLY
export const CONTRACT_ADDRESSES = {
  ZETA_TESTNET: {
    GUIToken: "${deployedContracts.GUIToken}",
    GameFiCore: "${deployedContracts.GameFiCore}",
    SocialFiCore: "${deployedContracts.SocialFiCore}",
    NFTAchievements: "${deployedContracts.NFTAchievements}",
    Gateway: "${deployedContracts.Gateway}",
  },
};

// Network Configuration
export const ZETA_TESTNET_CONFIG = {
  chainId: 7001,
  name: "ZetaChain Athens Testnet",
  rpcUrl: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
  blockExplorer: "https://zetachain-athens-3.blockscout.com",
  nativeCurrency: {
    name: "ZETA",
    symbol: "ZETA", 
    decimals: 18
  }
};

// Contract ABIs (essential functions only)
export const GAMEFI_ABI = [
  "function getPlayerStats(address player) view returns (uint256 score, uint256 totalPredictions, uint256 stakedAmount, string preferredAsset)",
  "function makePrediction(uint256 predictedPrice, string asset)",
  "function stakeTokens(uint256 amount)",
  "function getPrediction(uint256 predictionId) view returns (tuple(address player, uint256 predictedPrice, uint256 actualPrice, uint256 timestamp, bool resolved, bool correct, string asset))",
  "function getPlayerPredictions(address player) view returns (uint256[])",
  "event PredictionMade(address indexed player, uint256 indexed predictionId, uint256 predictedPrice, string asset)",
  "event PredictionResolved(uint256 indexed predictionId, uint256 actualPrice, bool correct)",
  "event CrossChainReward(address indexed player, uint256 amount, uint256 targetChain)",
];

export const SOCIALFI_ABI = [
  "function getRecentPosts(uint256 limit) view returns (uint256[])",
  "function getPost(uint256 postId) view returns (tuple(uint256 id, address author, string content, string imageHash, uint256 timestamp, uint256 likes, uint256 comments, bool isActive, uint256 chainId))",
  "function getUserProfile(address user) view returns (tuple(address userAddress, string username, string bio, string avatarHash, uint256 followers, uint256 following, uint256 totalPosts, uint256 socialScore, uint256 joinedAt, bool isVerified))",
  "event PostCreated(uint256 indexed postId, address indexed author, uint256 chainId)",
  "event PostLiked(uint256 indexed postId, address indexed liker, uint256 totalLikes)",
];

export const GUI_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

export const NFT_ACHIEVEMENTS_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

// Deployment Information
export const DEPLOYMENT_INFO = {
  network: "zeta-testnet",
  chainId: "7001",
  deployer: "${deployer.address}",
  timestamp: "${new Date().toISOString()}",
  transactions: ${JSON.stringify(transactions, null, 2)},
  blockExplorer: {
    GUIToken: "https://zetachain-athens-3.blockscout.com/address/${deployedContracts.GUIToken}",
    GameFiCore: "https://zetachain-athens-3.blockscout.com/address/${deployedContracts.GameFiCore}",
    SocialFiCore: "https://zetachain-athens-3.blockscout.com/address/${deployedContracts.SocialFiCore}",
    NFTAchievements: "https://zetachain-athens-3.blockscout.com/address/${deployedContracts.NFTAchievements}",
  }
};

// Contract Service Class
export class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connect() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      return true;
    }
    return false;
  }

  async addZetaNetwork() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x1B59', // 7001 in hex
            chainName: ZETA_TESTNET_CONFIG.name,
            nativeCurrency: ZETA_TESTNET_CONFIG.nativeCurrency,
            rpcUrls: [ZETA_TESTNET_CONFIG.rpcUrl],
            blockExplorerUrls: [ZETA_TESTNET_CONFIG.blockExplorer],
          }],
        });
        return true;
      } catch (error) {
        console.error('Failed to add ZetaChain network:', error);
        return false;
      }
    }
    return false;
  }

  getGameFiContract() {
    if (!this.signer) throw new Error("Not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.ZETA_TESTNET.GameFiCore,
      GAMEFI_ABI,
      this.signer
    );
  }

  getSocialFiContract() {
    if (!this.signer) throw new Error("Not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.ZETA_TESTNET.SocialFiCore,
      SOCIALFI_ABI,
      this.signer
    );
  }

  getGUITokenContract() {
    if (!this.signer) throw new Error("Not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.ZETA_TESTNET.GUIToken,
      GUI_TOKEN_ABI,
      this.signer
    );
  }

  getNFTAchievementsContract() {
    if (!this.signer) throw new Error("Not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.ZETA_TESTNET.NFTAchievements,
      NFT_ACHIEVEMENTS_ABI,
      this.signer
    );
  }

  // Token Functions
  async getTokenBalance(address: string): Promise<string> {
    const contract = this.getGUITokenContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async transferTokens(to: string, amount: string) {
    const contract = this.getGUITokenContract();
    const tx = await contract.transfer(to, ethers.parseEther(amount));
    return await tx.wait();
  }

  // GameFi Functions
  async getPlayerStats(address: string) {
    const contract = this.getGameFiContract();
    return await contract.getPlayerStats(address);
  }

  async makePrediction(predictedPrice: string, asset: string) {
    const contract = this.getGameFiContract();
    const tx = await contract.makePrediction(
      ethers.parseUnits(predictedPrice, 8), // Assuming price has 8 decimals
      asset
    );
    return await tx.wait();
  }

  async stakeTokens(amount: string) {
    const contract = this.getGameFiContract();
    const tx = await contract.stakeTokens(ethers.parseEther(amount));
    return await tx.wait();
  }

  async getPrediction(predictionId: number) {
    const contract = this.getGameFiContract();
    return await contract.getPrediction(predictionId);
  }

  async getPlayerPredictions(address: string) {
    const contract = this.getGameFiContract();
    return await contract.getPlayerPredictions(address);
  }

  // SocialFi Functions
  async getRecentPosts(limit: number = 10) {
    const contract = this.getSocialFiContract();
    return await contract.getRecentPosts(limit);
  }

  async getPost(postId: number) {
    const contract = this.getSocialFiContract();
    return await contract.getPost(postId);
  }

  async getUserProfile(address: string) {
    const contract = this.getSocialFiContract();
    return await contract.getUserProfile(address);
  }

  // NFT Functions
  async getNFTBalance(address: string): Promise<number> {
    const contract = this.getNFTAchievementsContract();
    const balance = await contract.balanceOf(address);
    return Number(balance);
  }

  async getUserNFTs(address: string): Promise<string[]> {
    const contract = this.getNFTAchievementsContract();
    const balance = await this.getNFTBalance(address);
    const nfts = [];
    
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const tokenURI = await contract.tokenURI(tokenId);
      nfts.push(tokenURI);
    }
    
    return nfts;
  }
}

// Export singleton instance
export const contractService = new ContractService();

// Helper functions
export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  return ethers.formatUnits(amount, decimals);
};

export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return ethers.parseUnits(amount, decimals);
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
};
`;

        // Save frontend config
        fs.writeFileSync('./deployments/frontend-contracts.ts', frontendConfig);

        console.log("\n🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
        console.log("📄 Final Contract Addresses:");
        console.log(`   ✅ GUIToken: ${deployedContracts.GUIToken}`);
        console.log(`   ✅ GameFiCore: ${deployedContracts.GameFiCore}`);
        console.log(`   ✅ SocialFiCore: ${deployedContracts.SocialFiCore}`);
        console.log(`   ✅ NFTAchievements: ${deployedContracts.NFTAchievements}`);
        console.log(`   ✅ Gateway: ${deployedContracts.Gateway}`);

        console.log("\n📁 Files Generated:");
        console.log("   📄 ./deployments/zeta-testnet.json");
        console.log("   📄 ./deployments/frontend-contracts.ts");

        console.log("\n🔗 Block Explorer Links:");
        Object.entries(deployedContracts).forEach(([name, address]) => {
            console.log(`   ${name}: https://zetachain-athens-3.blockscout.com/address/${address}`);
        });

        console.log("\n⏳ Transaction Status:");
        Object.entries(transactions).forEach(([name, hash]) => {
            console.log(`   ${name}: https://zetachain-athens-3.blockscout.com/tx/${hash}`);
        });

        console.log("\n📋 For Frontend Integration:");
        console.log("Copy the content from ./deployments/frontend-contracts.ts");
        console.log("to your frontend contracts configuration file!");

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        console.error("📍 Error details:", error);

        // Save partial deployment
        const partialInfo = {
            network: "zeta-testnet",
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: deployedContracts,
            transactions: transactions,
            status: "partial",
            error: error.message
        };

        if (!fs.existsSync('./deployments')) {
            fs.mkdirSync('./deployments');
        }

        fs.writeFileSync('./deployments/zeta-testnet-partial.json', JSON.stringify(partialInfo, null, 2));
        console.log("💾 Partial deployment saved");
        console.log("🔧 Try deploying remaining contracts manually");
    }
}

main().catch(console.error);