import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract addresses (sẽ được cập nhật sau khi deploy)
export const CONTRACT_ADDRESSES = {
  ZETA_TESTNET: {
    GUIToken: "0x...", // Sẽ được cập nhật
    GameFiCore: "0x...", // Sẽ được cập nhật
    SocialFiCore: "0x...", // Sẽ được cập nhật
    NFTAchievements: "0x...", // Sẽ được cập nhật
    Gateway: "0x6c533f7fe93fae114d0954697069df33c9b74fd7",
  },
};

// Contract ABIs (rút gọn - chỉ các function cần thiết)
export const GAMEFI_ABI = [
  "function getPlayerStats(address player) view returns (uint256 score, uint256 totalPredictions, uint256 correctPredictions, uint256 stakedAmount, uint256 accuracy, uint256 currentStreak, uint256 bestStreak, uint256 quizCount, bool isPremium)",
  "function getDailyQuests() view returns (tuple(string title, string description, string questType, uint256 targetValue, uint256 reward, uint256 deadline, bool active)[])",
  "event PredictionMade(address indexed player, uint256 indexed predictionId, uint256 predictedPrice, string asset, uint256 confidence)",
  "event QuizCompleted(address indexed player, uint256 indexed quizId, uint256 score, uint256 reward)",
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
];

// Contract interaction helpers
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

  // GameFi interactions
  async getPlayerStats(address: string) {
    const contract = this.getGameFiContract();
    return await contract.getPlayerStats(address);
  }

  async getDailyQuests() {
    const contract = this.getGameFiContract();
    return await contract.getDailyQuests();
  }

  // SocialFi interactions
  async getRecentPosts(limit: number = 10) {
    const contract = this.getSocialFiContract();
    return await contract.getRecentPosts(limit);
  }

  async getPost(postId: number) {
    const contract = this.getSocialFiContract();
    return await contract.getPost(postId);
  }

  // Cross-chain interactions via Gateway
  async makePrediction(
    predictedPrice: string,
    confidence: number,
    asset: string
  ) {
    const gateway = new ethers.Contract(
      CONTRACT_ADDRESSES.ZETA_TESTNET.Gateway,
      [
        "function call(bytes calldata recipient, address zrc20, bytes calldata message, tuple(uint256 gasLimit, bool isArbitraryCall) calldata callOptions)",
      ],
      this.signer
    );

    // Encode action and data
    const action = 1; // Make prediction
    const data = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256", "uint256", "string"],
      [ethers.parseEther(predictedPrice), confidence, asset]
    );

    const message = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint8", "bytes"],
      [action, data]
    );

    // Call through gateway
    return await gateway.call(
      CONTRACT_ADDRESSES.ZETA_TESTNET.GameFiCore,
      ethers.ZeroAddress, // No ZRC20 token needed
      message,
      { gasLimit: 500000, isArbitraryCall: false }
    );
  }

  async createPost(content: string, imageHash: string = "") {
    const gateway = new ethers.Contract(
      CONTRACT_ADDRESSES.ZETA_TESTNET.Gateway,
      [
        "function call(bytes calldata recipient, address zrc20, bytes calldata message, tuple(uint256 gasLimit, bool isArbitraryCall) calldata callOptions)",
      ],
      this.signer
    );

    const action = 1; // Create post
    const data = ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      [content, imageHash]
    );

    const message = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint8", "bytes"],
      [action, data]
    );

    return await gateway.call(
      CONTRACT_ADDRESSES.ZETA_TESTNET.SocialFiCore,
      ethers.ZeroAddress,
      message,
      { gasLimit: 500000, isArbitraryCall: false }
    );
  }
}

export const contractService = new ContractService();
