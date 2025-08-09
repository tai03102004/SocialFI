import { ethers } from "ethers";

export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private gamefiContract: ethers.Contract;
  private socialContract: ethers.Contract;

  constructor() {
    // Kết nối đến ZetaChain testnet
    this.provider = new ethers.JsonRpcProvider(
      "https://zetachain-evm.blockpi.network/v1/rpc/public"
    );

    // Khởi tạo contracts với địa chỉ đã deploy
    this.gamefiContract = new ethers.Contract(
      process.env.GAMEFI_CONTRACT_ADDRESS!,
      require("../abis/GameFiCore.json"), // Ensure this ABI includes the 'resolvePrediction' method
      this.provider
    );

    this.socialContract = new ethers.Contract(
      process.env.SOCIALFI_CONTRACT_ADDRESS!,
      require("../abis/SocialFiCore.json"),
      this.provider
    );
  }

  // Lấy stats của player từ blockchain
  async getPlayerStats(address: string) {
    try {
      const stats = await this.gamefiContract.getPlayerStats(address);
      return {
        score: stats.score.toString(),
        totalPredictions: stats.totalPredictions.toString(),
        correctPredictions: stats.correctPredictions.toString(),
        accuracy: stats.accuracy.toString(),
        currentStreak: stats.currentStreak.toString(),
        bestStreak: stats.bestStreak.toString(),
        quizCount: stats.quizCount.toString(),
        isPremium: stats.isPremium,
      };
    } catch (error) {
      console.error("Error fetching player stats:", error);
      throw error;
    }
  }

  // Lấy daily quests
  async getDailyQuests() {
    try {
      const quests = await this.gamefiContract.getDailyQuests();
      return quests.map((quest: any) => ({
        title: quest.title,
        description: quest.description,
        questType: quest.questType,
        targetValue: quest.targetValue.toString(),
        reward: quest.reward.toString(),
        deadline: quest.deadline.toString(),
        active: quest.active,
      }));
    } catch (error) {
      console.error("Error fetching daily quests:", error);
      throw error;
    }
  }

  // Lấy recent posts
  async getRecentPosts(limit: number = 10) {
    try {
      const postIds = await this.socialContract.getRecentPosts(limit);
      const posts = await Promise.all(
        postIds.map(async (id: any) => {
          const post = await this.socialContract.getPost(id);
          return {
            id: post.id.toString(),
            author: post.author,
            content: post.content,
            imageHash: post.imageHash,
            timestamp: post.timestamp.toString(),
            likes: post.likes.toString(),
            comments: post.comments.toString(),
            isActive: post.isActive,
            chainId: post.chainId.toString(),
          };
        })
      );
      return posts;
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      throw error;
    }
  }

  // Lắng nghe events từ contracts
  setupEventListeners() {
    // Lắng nghe prediction events
    this.gamefiContract.on(
      "PredictionMade",
      (player, predictionId, price, asset, confidence) => {
        console.log("New prediction:", {
          player,
          predictionId: predictionId.toString(),
          price: price.toString(),
          asset,
          confidence: confidence.toString(),
        });

        // Có thể gửi notification đến frontend qua WebSocket
        // hoặc lưu vào database để analytics
      }
    );

    // Lắng nghe post creation events
    this.socialContract.on("PostCreated", (postId, author, chainId) => {
      console.log("New post created:", {
        postId: postId.toString(),
        author,
        chainId: chainId.toString(),
      });
    });

    // Lắng nghe achievement unlock events
    this.gamefiContract.on("QuizCompleted", (player, quizId, score, reward) => {
      console.log("Quiz completed:", {
        player,
        quizId: quizId.toString(),
        score: score.toString(),
        reward: reward.toString(),
      });
    });
  }

  // Resolve predictions (admin function)
  //   async resolvePrediction(predictionId: number, actualPrice: string) {
  //     if (!process.env.ADMIN_PRIVATE_KEY) {
  //       throw new Error("Admin private key not configured");
  //     }

  //     const wallet = new ethers.Wallet(
  //       process.env.ADMIN_PRIVATE_KEY,
  //       this.provider
  //     );
  //     const contract = this.gamefiContract.connect(wallet) as GameFiContract;

  //     try {
  //       const tx = await contract.resolvePrediction(
  //         predictionId,
  //         ethers.parseEther(actualPrice)
  //       );
  //       await tx.wait();
  //       return tx.hash;
  //     } catch (error) {
  //       console.error("Error resolving prediction:", error);
  //       throw error;
  //     }
  //   }
}

export const contractService = new ContractService();
