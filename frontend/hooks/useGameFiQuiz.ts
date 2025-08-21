import { useState, useCallback } from "react";
import { useEnhancedContract } from "./useEnhancedContract";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  bestStreak: number;
  totalRewards: number;
  accuracy: number;
  canTakeQuiz: boolean;
}

interface QuizResult {
  category: number;
  difficulty: number;
  score: number;
  totalQuestions: number;
  reward: number;
}

export function useGameFiQuiz() {
  const { contracts, signer, isConnected } = useEnhancedContract();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit quiz results to blockchain
  const submitQuizResults = useCallback(
    async (
      category: string,
      difficulty: string,
      score: number,
      totalQuestions: number
    ): Promise<boolean> => {
      if (!isConnected || !contracts.GameFi || !signer) {
        throw new Error("Not connected to blockchain");
      }

      try {
        setLoading(true);
        setError(null);

        // Convert category and difficulty to numbers
        const categoryMap: { [key: string]: number } = {
          general: 0,
          defi: 1,
          nft: 2,
          trading: 3,
          technology: 4,
        };

        const difficultyMap: { [key: string]: number } = {
          easy: 0,
          medium: 1,
          hard: 2,
        };

        const categoryNum = categoryMap[category] || 0;
        const difficultyNum = difficultyMap[difficulty] || 1;

        console.log("📝 Submitting quiz results to blockchain...", {
          category: categoryNum,
          difficulty: difficultyNum,
          score,
          totalQuestions,
        });

        // Submit to smart contract
        const tx = await contracts.GameFi.connect(signer).submitQuizResults(
          categoryNum,
          difficultyNum,
          score,
          totalQuestions
        );

        console.log("📤 Transaction sent:", tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log("✅ Quiz results submitted successfully:", receipt.hash);

        return true;
      } catch (error: any) {
        console.error("Failed to submit quiz results:", error);
        setError(error.message || "Failed to submit quiz results");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.GameFi, signer]
  );

  // Get player quiz stats
  const getQuizStats = useCallback(async (): Promise<QuizStats | null> => {
    if (!isConnected || !contracts.GameFi || !address) {
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📊 Fetching quiz stats for:", address);

      const [stats, canTake] = await Promise.all([
        contracts.GameFi.getQuizStats(address),
        contracts.GameFi.canTakeQuiz(address),
      ]);

      const quizStats: QuizStats = {
        totalQuizzes: Number(stats.totalQuizzes),
        averageScore: Number(stats.averageScore),
        bestStreak: Number(stats.bestStreak),
        totalRewards: Number(stats.totalRewards),
        accuracy: Number(stats.averageScore), // Use average score as accuracy
        canTakeQuiz: canTake,
      };

      console.log("✅ Quiz stats loaded:", quizStats);
      return quizStats;
    } catch (error: any) {
      console.error("Failed to get quiz stats:", error);
      setError(error.message || "Failed to fetch quiz stats");
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, contracts.GameFi, address]);

  // Check if player can take quiz (cooldown)
  const checkQuizEligibility = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !contracts.GameFi || !address) {
      return false;
    }

    try {
      const canTake = await contracts.GameFi.canTakeQuiz(address);
      return canTake;
    } catch (error) {
      console.error("Failed to check quiz eligibility:", error);
      return false;
    }
  }, [isConnected, contracts.GameFi, address]);

  return {
    submitQuizResults,
    getQuizStats,
    checkQuizEligibility,
    loading,
    error,
    isConnected,
  };
}
