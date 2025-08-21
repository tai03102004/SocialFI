// hooks/useEnhancedContract.ts - Updated với addresses mới
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import { MetaMaskInpageProvider } from "@metamask/providers";

// ✅ Contract Configuration - UPDATED với addresses mới
const CONTRACTS_CONFIG = {
  chainId: 7001, // ZetaChain Athens
  rpcUrl: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
  addresses: {
    AIOracle: "0x9CD763b9a34c43123a70e69168C447C3dB1d51b7",
    GameFi: "0x403Af55848d2BE8E351e0F29E8e425aaDB4CBBFE",
    SocialFi: "0x78EB07835f4d9281F85DAB76B353b0F3EEDa6469",
    NFTAchievements: "0xC11531dE0165Aa654292647DF35c3340fB4e21B2",
    GUIToken: "0xD59Da846F02A6C84D79C05F80CFB3B7ae2F21879",
  },
};

// ✅ Simplified Contract ABIs - chỉ functions cần thiết
const CONTRACT_ABIS = {
  AIOracle: [
    "function getAIData(string symbol, string dataType) view returns (tuple(string symbol, uint256 currentPrice, uint256 predictedPrice, uint256 sentimentScore, string outlook, uint256 confidence, uint256 timestamp, string dataType))",
    "function getAllAIData(string symbol) view returns (tuple(string symbol, uint256 currentPrice, uint256 predictedPrice, uint256 sentimentScore, string outlook, uint256 confidence, uint256 timestamp, string dataType) market, tuple(string symbol, uint256 currentPrice, uint256 predictedPrice, uint256 sentimentScore, string outlook, uint256 confidence, uint256 timestamp, string dataType) technical, tuple(string symbol, uint256 currentPrice, uint256 predictedPrice, uint256 sentimentScore, string outlook, uint256 confidence, uint256 timestamp, string dataType) social, tuple(string symbol, uint256 currentPrice, uint256 predictedPrice, uint256 sentimentScore, string outlook, uint256 confidence, uint256 timestamp, string dataType) strategy)",
  ],
  GameFi: [
    "function makeAIPrediction(uint256 predictedPrice, string asset, uint256 confidence)",
    "function getPlayerStats(address player) view returns (uint256 score, uint256 totalPredictions, uint256 correctPredictions, uint256 aiFollowScore, uint256 accuracy)",
    "function getPlayerPredictions(address player) view returns (uint256[])",
    "function getPrediction(uint256 predictionId) view returns (tuple(address player, uint256 predictedPrice, uint256 aiPredictedPrice, uint256 actualPrice, uint256 playerConfidence, uint256 aiConfidence, uint256 timestamp, bool resolved, bool playerCorrect, bool aiCorrect, string asset))",
    "function getActiveQuests() view returns (tuple(uint256 id, string title, string description, string questType, uint256 reward, uint256 deadline, bool active)[])",
    "function completeQuest(uint256 questId)",
    // Thêm quiz functions
    "function submitQuizResults(uint8 category, uint8 difficulty, uint8 score, uint8 totalQuestions)",
    "function getQuizStats(address player) view returns (uint256 totalQuizzes, uint256 averageScore, uint256 bestStreak, uint256 totalRewards)",
    "function canTakeQuiz(address player) view returns (bool)",
    "event QuizCompleted(address indexed player, uint8 category, uint8 difficulty, uint8 score, uint256 reward)",
  ],
  SocialFi: [
    "function createPost(string content)",
    "function likePost(uint256 postId)",
    "function getPost(uint256 postId) view returns (tuple(uint256 id, address author, string content, string imageHash, uint256 timestamp, uint256 likes, uint256 comments, bool isActive, uint256 chainId))",
    "function getTotalPosts() view returns (uint256)",
    "function getRecentPosts(uint256 count) view returns (uint256[])",
    "function getUserProfile(address user) view returns (tuple(address userAddress, uint256 totalPosts, uint256 socialScore, uint256 aiAlignmentScore))",
    // Events
    "event PostCreated(uint256 indexed postId, address indexed author, uint256 chainId)",
    "event PostLiked(uint256 indexed postId, address indexed liker)",
  ],
  NFTAchievements: [
    // Read functions
    "function getPlayerAchievements(address player) view returns (uint256[])",
    "function hasAchievement(address player, uint256 achievementId) view returns (bool)",
    "function getAchievement(uint256 achievementId) view returns (tuple(string name, string description, uint256 requirement, uint8 achievementType, bool active))",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function totalSupply() view returns (uint256)",

    // Write functions
    "function mintAchievement(address player, uint256 achievementId)",
    "function createAchievement(string memory name, string memory description, uint256 requirement, uint8 achievementType)",
    "function setAchievementActive(uint256 achievementId, bool active)",

    // Events
    "event AchievementUnlocked(address indexed player, uint256 indexed achievementId)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ],
  GUIToken: [
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
  ],
};

// ✅ Types for AI Data
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface AIData {
  symbol: string;
  currentPrice: bigint;
  predictedPrice: bigint;
  sentimentScore: bigint;
  outlook: string;
  confidence: bigint;
  timestamp: bigint;
  dataType: string;
}

interface PlayerStats {
  score: bigint;
  totalPredictions: bigint;
  correctPredictions: bigint;
  aiFollowScore: bigint;
  accuracy: bigint;
}

interface Quest {
  id: bigint;
  title: string;
  description: string;
  questType: string;
  reward: bigint;
  deadline: bigint;
  active: boolean;
}

interface Post {
  id: bigint;
  author: string;
  content: string;
  imageHash: string;
  timestamp: bigint;
  likes: bigint;
  comments: bigint;
  isActive: boolean;
  chainId: bigint;
}

interface UserProfile {
  userAddress: string;
  totalPosts: bigint;
  socialScore: bigint;
  aiAlignmentScore: bigint;
}

interface Achievement {
  name: string;
  description: string;
  requirement: bigint;
  achievementType: number;
  active: boolean;
}

// ✅ Main Enhanced Contract Hook
export function useEnhancedContract() {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contracts, setContracts] = useState<Record<string, ethers.Contract>>(
    {}
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected: wagmiConnected } = useAccount();

  // ✅ Initialize provider và contracts
  const initializeProvider = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create provider
      const rpcProvider = new ethers.JsonRpcProvider(CONTRACTS_CONFIG.rpcUrl);
      setProvider(rpcProvider);

      // Get signer if wallet connected
      if (wagmiConnected && window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const browserSigner = await browserProvider.getSigner();
        setSigner(browserSigner);
      }

      // Load contracts
      const loadedContracts: Record<string, ethers.Contract> = {};

      for (const [name, address] of Object.entries(
        CONTRACTS_CONFIG.addresses
      )) {
        if (address && CONTRACT_ABIS[name as keyof typeof CONTRACT_ABIS]) {
          const abi = CONTRACT_ABIS[name as keyof typeof CONTRACT_ABIS];
          const contract = new ethers.Contract(address, abi, rpcProvider);
          loadedContracts[name] = contract;
        }
      }

      setContracts(loadedContracts);
      setIsConnected(Object.keys(loadedContracts).length > 0);

      console.log("✅ Contracts loaded:", Object.keys(loadedContracts));
    } catch (error) {
      console.error("Failed to initialize contracts:", error);
      setError(error instanceof Error ? error.message : "Failed to initialize");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [wagmiConnected]);

  useEffect(() => {
    initializeProvider();
  }, [initializeProvider]);

  return {
    provider,
    signer,
    contracts,
    isConnected,
    isLoading,
    error,
    userAddress: address,
    reconnect: initializeProvider,
  };
}

// ✅ AI Oracle Hook
export function useAIOracle() {
  const { contracts, isConnected } = useEnhancedContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAIData = useCallback(
    async (symbol: string, dataType: string): Promise<AIData | null> => {
      if (!isConnected || !contracts.AIOracle) return null;

      try {
        setLoading(true);
        setError(null);

        const result = await contracts.AIOracle.getAIData(symbol, dataType);
        return result;
      } catch (error) {
        console.error(
          `Failed to get AI data for ${symbol}/${dataType}:`,
          error
        );
        setError(
          error instanceof Error ? error.message : "Failed to fetch AI data"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.AIOracle]
  );

  const getAllAIData = useCallback(
    async (symbol: string) => {
      if (!isConnected || !contracts.AIOracle) return null;

      try {
        setLoading(true);
        setError(null);

        const [market, technical, social, strategy] =
          await contracts.AIOracle.getAllAIData(symbol);

        return { market, technical, social, strategy };
      } catch (error) {
        console.error(`Failed to get all AI data for ${symbol}:`, error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch AI data"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.AIOracle]
  );

  return {
    getAIData,
    getAllAIData,
    loading,
    error,
  };
}

// ✅ GameFi Hook
export function useGameFi() {
  const { contracts, signer, isConnected } = useEnhancedContract();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlayerStats = useCallback(async (): Promise<PlayerStats | null> => {
    if (!isConnected || !contracts.GameFi || !address) return null;

    try {
      setLoading(true);
      setError(null);

      const stats = await contracts.GameFi.getPlayerStats(address);
      return {
        score: stats[0],
        totalPredictions: stats[1],
        correctPredictions: stats[2],
        aiFollowScore: stats[3],
        accuracy: stats[4],
      };
    } catch (error) {
      console.error("Failed to get player stats:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch player stats"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, contracts.GameFi, address]);

  const makeAIPrediction = useCallback(
    async (predictedPrice: string, asset: string, confidence: number) => {
      if (!isConnected || !contracts.GameFi || !signer) {
        throw new Error("Not connected or signer not available");
      }

      try {
        setLoading(true);
        setError(null);

        const contractWithSigner = contracts.GameFi.connect(signer) as any;
        const priceInWei = ethers.parseUnits(predictedPrice, 18);

        const tx = await contractWithSigner.makeAIPrediction(
          priceInWei,
          asset,
          confidence
        );

        const receipt = await tx.wait();
        return receipt;
      } catch (error) {
        console.error("Failed to make prediction:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to make prediction";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.GameFi, signer]
  );

  const getActiveQuests = useCallback(async (): Promise<Quest[]> => {
    if (!isConnected || !contracts.GameFi) return [];

    try {
      setLoading(true);
      setError(null);

      const quests = await contracts.GameFi.getActiveQuests();
      return quests.map((quest: any) => ({
        id: quest[0],
        title: quest[1],
        description: quest[2],
        questType: quest[3],
        reward: quest[4],
        deadline: quest[5],
        active: quest[6],
      }));
    } catch (error) {
      console.error("Failed to get active quests:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch quests"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [isConnected, contracts.GameFi]);

  const completeQuest = useCallback(
    async (questId: number) => {
      if (!isConnected || !contracts.GameFi || !signer) {
        throw new Error("Not connected or signer not available");
      }

      try {
        setLoading(true);
        setError(null);

        const contractWithSigner = contracts.GameFi.connect(signer) as any;
        const tx = await contractWithSigner.completeQuest(questId);

        const receipt = await tx.wait();
        return receipt;
      } catch (error) {
        console.error("Failed to complete quest:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to complete quest";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.GameFi, signer]
  );

  return {
    getPlayerStats,
    makeAIPrediction,
    getActiveQuests,
    completeQuest,
    loading,
    error,
  };
}

// ✅ SocialFi Hook
export function useSocialFi() {
  const { contracts, signer, isConnected } = useEnhancedContract();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecentPosts = useCallback(
    async (count: number = 10): Promise<any[]> => {
      if (!isConnected || !contracts.SocialFi) {
        console.log("❌ Not connected or no SocialFi contract");
        return [];
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Checking SocialFi contract methods...");

        // Thử approach khác - fetch posts trực tiếp từ ID 1 đến một số cao
        const posts: any[] = [];
        const maxPostsToCheck = 50; // Check tối đa 50 posts

        for (let postId = 1; postId <= maxPostsToCheck; postId++) {
          try {
            console.log(`📖 Fetching post ${postId}...`);
            const post = await contracts.SocialFi.getPost(postId);

            // Check nếu post tồn tại và active
            if (
              post &&
              post.isActive &&
              post.author !== "0x0000000000000000000000000000000000000000"
            ) {
              posts.push({
                id: post.id,
                author: post.author,
                content: post.content,
                imageHash: post.imageHash,
                timestamp: post.timestamp,
                likes: post.likes,
                comments: post.comments,
                isActive: post.isActive,
                chainId: post.chainId,
              });

              console.log(`✅ Found post ${postId}:`, {
                id: Number(post.id),
                author: post.author,
                content: post.content.substring(0, 50) + "...",
              });
            }
          } catch (postError) {
            // Nếu post không tồn tại, có thể đã hết posts
            console.log(`⚠️ Post ${postId} not found or error:`, postError);
            if (postId > 10 && posts.length === 0) {
              // Nếu đã check 10 posts đầu mà không có gì, có thể không có posts
              break;
            }
            continue;
          }
        }

        // Sắp xếp posts theo thời gian (mới nhất trước)
        posts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

        // Lấy số lượng posts yêu cầu
        const limitedPosts = posts.slice(0, count);

        console.log(`✅ Loaded ${limitedPosts.length} posts from blockchain`);
        return limitedPosts;
      } catch (error) {
        console.error("Failed to get recent posts:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch posts"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.SocialFi]
  );

  const createPost = useCallback(
    async (content: string) => {
      if (!isConnected || !contracts.SocialFi || !signer) {
        throw new Error("Not connected or signer not available");
      }

      try {
        setLoading(true);
        setError(null);

        const contractWithSigner = contracts.SocialFi.connect(signer) as any;
        const tx = await contractWithSigner.createPost(content);

        const receipt = await tx.wait();
        return receipt;
      } catch (error) {
        console.error("Failed to create post:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create post";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.SocialFi, signer]
  );

  const likePost = useCallback(
    async (postId: number) => {
      if (!isConnected || !contracts.SocialFi || !signer) {
        throw new Error("Not connected or signer not available");
      }

      try {
        setLoading(true);
        setError(null);

        const contractWithSigner = contracts.SocialFi.connect(signer) as any;
        const tx = await contractWithSigner.likePost(postId);

        const receipt = await tx.wait();
        return receipt;
      } catch (error) {
        console.error("Failed to like post:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to like post";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.SocialFi, signer]
  );

  const getUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!isConnected || !contracts.SocialFi || !address) return null;

    try {
      setLoading(true);
      setError(null);

      const profile = await contracts.SocialFi.getUserProfile(address);
      return {
        userAddress: profile[0],
        totalPosts: profile[1],
        socialScore: profile[2],
        aiAlignmentScore: profile[3],
      };
    } catch (error) {
      console.error("Failed to get user profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, contracts.SocialFi, address]);

  return {
    createPost,
    likePost,
    getRecentPosts,
    getUserProfile,
    loading,
    error,
  };
}

// ✅ Token Balance Hook
export function useTokenBalance() {
  const { contracts, isConnected } = useEnhancedContract();
  const { address } = useAccount();
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !contracts.GUIToken || !address) {
      setBalance("0");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const balanceWei = await contracts.GUIToken.balanceOf(address);
      const balanceFormatted = ethers.formatEther(balanceWei);
      setBalance(balanceFormatted);
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch balance"
      );
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [isConnected, contracts.GUIToken, address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [isConnected, fetchBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  };
}

// ✅ Combined Hook cho convenience
export function useAIIntegratedApp() {
  const contract = useEnhancedContract();
  const aiOracle = useAIOracle();
  const gameFi = useGameFi();
  const socialFi = useSocialFi();
  const tokenBalance = useTokenBalance();

  const isLoading =
    contract.isLoading ||
    aiOracle.loading ||
    gameFi.loading ||
    socialFi.loading ||
    tokenBalance.loading;

  const hasError = !!(
    contract.error ||
    aiOracle.error ||
    gameFi.error ||
    socialFi.error ||
    tokenBalance.error
  );

  const refetchAll = useCallback(async () => {
    await Promise.all([tokenBalance.refetch()]);
  }, [tokenBalance.refetch]);

  return {
    // Connection status
    isConnected: contract.isConnected,
    userAddress: contract.userAddress,

    // Loading states
    isLoading,
    hasError,

    // Data fetching functions
    getAIData: aiOracle.getAIData,
    getAllAIData: aiOracle.getAllAIData,
    getPlayerStats: gameFi.getPlayerStats,
    getActiveQuests: gameFi.getActiveQuests,
    getRecentPosts: socialFi.getRecentPosts,
    getUserProfile: socialFi.getUserProfile,

    // Action functions
    makeAIPrediction: gameFi.makeAIPrediction,
    completeQuest: gameFi.completeQuest,
    createPost: socialFi.createPost,
    likePost: socialFi.likePost,

    // Token data
    tokenBalance: tokenBalance.balance,

    // Utility functions
    refetchAll,
  };
}

// ✅ Helper functions
export const formatTokenAmount = (
  amount: bigint | string,
  decimals: number = 18
): string => {
  try {
    if (typeof amount === "string") {
      return parseFloat(amount).toFixed(4);
    }
    return parseFloat(ethers.formatUnits(amount, decimals)).toFixed(4);
  } catch {
    return "0.0000";
  }
};

export const formatPrice = (price: bigint): string => {
  try {
    // Prices are stored as integers (multiplied by 100)
    const priceNumber = Number(price) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceNumber);
  } catch {
    return "$0";
  }
};

export const formatTimeAgo = (timestamp: bigint): string => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const time = Number(timestamp);
    const diff = now - time;

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "Unknown";
  }
};

export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getConfidenceColor = (confidence: bigint | number): string => {
  const conf = typeof confidence === "bigint" ? Number(confidence) : confidence;
  if (conf >= 80) return "text-green-400";
  if (conf >= 60) return "text-blue-400";
  if (conf >= 40) return "text-yellow-400";
  return "text-red-400";
};

export const getOutlookColor = (outlook: string): string => {
  switch (outlook.toUpperCase()) {
    case "BULLISH":
      return "text-green-400";
    case "BEARISH":
      return "text-red-400";
    default:
      return "text-yellow-400";
  }
};

export const getOutlookIcon = (outlook: string): string => {
  switch (outlook.toUpperCase()) {
    case "BULLISH":
      return "🚀";
    case "BEARISH":
      return "📉";
    default:
      return "🔄";
  }
};
