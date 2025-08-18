// 🎉 COMPLETE CONTRACT DEPLOYMENT - 2025-08-18T04:11:33.574Z
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ✅ ALL CONTRACTS DEPLOYED SUCCESSFULLY
export const CONTRACT_ADDRESSES = {
  ZETA_TESTNET: {
    GUIToken: "0x61385a29749dE1Ad27BC350db5bcb1Fc294090cb",
    GameFiCore: "0xcB2D52Cf3eC99fC72f45fbb19BF5DEc1C5422839",
    SocialFiCore: "0xd51Fd45521961ED907063e7e9E36F6B9b00f834c",
    NFTAchievements: "0xBb892705CE7a6d1890Bb4A1e6f8Ea020557471A6",
    Gateway: "0x6c533f7fe93fae114d0954697069df33c9b74fd7",
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
  deployer: "0x3b188255700eb8fcf4bc8F604441AB3bb4a30163",
  timestamp: "2025-08-18T04:11:33.574Z",
  transactions: {
  "GUIToken": "0x6746874c7b413fb032d720d65607713e8c7e969b5f42e49e981a814a747b56a8",
  "NFTAchievements": "0xe61a585bb402da7a9be7426ce9f8abb1f5c017670cbc6a62fe7d2251f84ad08c",
  "GameFiCore": "0x1b25892d7d29a565e28ba4ec005e9ef15f31852dc4bc863bc2fea72794b70011",
  "SocialFiCore": "0x16b0f30f006e1384ab9f05cf0894280cdd5f5b7514f2e917bf5f5b078bb26b3e"
},
  blockExplorer: {
    GUIToken: "https://zetachain-athens-3.blockscout.com/address/0x61385a29749dE1Ad27BC350db5bcb1Fc294090cb",
    GameFiCore: "https://zetachain-athens-3.blockscout.com/address/0xcB2D52Cf3eC99fC72f45fbb19BF5DEc1C5422839",
    SocialFiCore: "https://zetachain-athens-3.blockscout.com/address/0xd51Fd45521961ED907063e7e9E36F6B9b00f834c",
    NFTAchievements: "https://zetachain-athens-3.blockscout.com/address/0xBb892705CE7a6d1890Bb4A1e6f8Ea020557471A6",
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
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
