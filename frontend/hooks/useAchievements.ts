import { useState, useEffect, useCallback } from "react";
import { useNFTAchievements } from "./useNFTAchievements";
import { useGameFi } from "./useEnhancedContract";
import { useSocialFi } from "./useEnhancedContract";
import { useAccount } from "wagmi";

interface Achievement {
  id: number;
  name: string;
  description: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  target: number;
  reward: number;
  unlocked: boolean;
  unlockedAt?: string;
  achievementType: number;
}

interface AchievementStats {
  total: number;
  unlocked: number;
  totalRewards: number;
  completionRate: number;
  streak: number;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    total: 0,
    unlocked: 0,
    totalRewards: 0,
    completionRate: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getPlayerAchievements, hasAchievement, getAchievement } =
    useNFTAchievements();
  const { getPlayerStats } = useGameFi();
  const { getUserProfile } = useSocialFi();
  const { address, isConnected } = useAccount();

  // Define achievement definitions
  const achievementDefinitions = [
    {
      id: 1,
      name: "First Steps",
      description: "Make your first price prediction",
      category: "prediction",
      rarity: "common" as const,
      target: 1,
      reward: 50,
      achievementType: 0,
      getProgress: (gameStats: any, socialStats: any) =>
        Number(gameStats?.totalPredictions || 0),
    },
    {
      id: 2,
      name: "Prediction Novice",
      description: "Make 10 successful predictions",
      category: "prediction",
      rarity: "common" as const,
      target: 10,
      reward: 100,
      achievementType: 0,
      getProgress: (gameStats: any, socialStats: any) =>
        Number(gameStats?.correctPredictions || 0),
    },
    {
      id: 3,
      name: "Oracle",
      description:
        "Achieve 80% prediction accuracy with minimum 50 predictions",
      category: "prediction",
      rarity: "epic" as const,
      target: 80,
      reward: 500,
      achievementType: 0,
      getProgress: (gameStats: any, socialStats: any) => {
        const total = Number(gameStats?.totalPredictions || 0);
        const accuracy = Number(gameStats?.accuracy || 0);
        return total >= 50 ? accuracy : 0;
      },
    },
    {
      id: 4,
      name: "Social Starter",
      description: "Create your first post",
      category: "social",
      rarity: "common" as const,
      target: 1,
      reward: 25,
      achievementType: 1,
      getProgress: (gameStats: any, socialStats: any) =>
        Number(socialStats?.totalPosts || 0),
    },
    {
      id: 5,
      name: "Social Butterfly",
      description: "Create 50 posts and achieve 1000 social score",
      category: "social",
      rarity: "rare" as const,
      target: 50,
      reward: 300,
      achievementType: 1,
      getProgress: (gameStats: any, socialStats: any) => {
        const posts = Number(socialStats?.totalPosts || 0);
        const score = Number(socialStats?.socialScore || 0);
        return posts >= 50 && score >= 1000 ? 50 : Math.min(posts, 49);
      },
    },
    {
      id: 6,
      name: "AI Follower",
      description: "Follow AI recommendations 20 times with high accuracy",
      category: "ai",
      rarity: "rare" as const,
      target: 20,
      reward: 200,
      achievementType: 2,
      getProgress: (gameStats: any, socialStats: any) =>
        Math.floor(Number(gameStats?.aiFollowScore || 0) / 10),
    },
    {
      id: 7,
      name: "Prediction Master",
      description: "Make 100 correct predictions",
      category: "prediction",
      rarity: "epic" as const,
      target: 100,
      reward: 750,
      achievementType: 0,
      getProgress: (gameStats: any, socialStats: any) =>
        Number(gameStats?.correctPredictions || 0),
    },
    {
      id: 8,
      name: "AI Alignment Expert",
      description: "Achieve perfect AI alignment score of 2000+",
      category: "ai",
      rarity: "legendary" as const,
      target: 2000,
      reward: 1000,
      achievementType: 2,
      getProgress: (gameStats: any, socialStats: any) =>
        Number(socialStats?.aiAlignmentScore || 0),
    },
    {
      id: 9,
      name: "Diamond Hands",
      description: "Maintain 90%+ accuracy over 200 predictions",
      category: "prediction",
      rarity: "legendary" as const,
      target: 90,
      reward: 1500,
      achievementType: 0,
      getProgress: (gameStats: any, socialStats: any) => {
        const total = Number(gameStats?.totalPredictions || 0);
        const accuracy = Number(gameStats?.accuracy || 0);
        return total >= 200 ? accuracy : 0;
      },
    },
    {
      id: 10,
      name: "Community Leader",
      description: "Reach 5000 social score and help others",
      category: "social",
      rarity: "legendary" as const,
      target: 5000,
      reward: 2000,
      achievementType: 1,
      getProgress: (gameStats: any, socialStats: any) =>
        Number(socialStats?.socialScore || 0),
    },
  ];

  const loadAchievements = useCallback(async () => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🏆 Loading achievements from blockchain...");

      // Get player stats from different contracts
      const [gameStats, socialProfile] = await Promise.all([
        getPlayerStats(),
        getUserProfile(),
      ]);

      console.log("📊 Player stats:", { gameStats, socialProfile });

      // Process each achievement
      const processedAchievements = await Promise.all(
        achievementDefinitions.map(async (def) => {
          try {
            // Calculate current progress
            const progress = def.getProgress(gameStats, socialProfile);

            // Check if achievement is unlocked on blockchain
            const unlocked = await hasAchievement(def.id);

            // Get unlock date if available
            let unlockedAt: string | undefined;
            if (unlocked) {
              try {
                // Try to get achievement details from blockchain
                const achievement = await getAchievement(def.id);
                unlockedAt = new Date().toISOString().split("T")[0]; // Simplified for now
              } catch (error) {
                console.log(
                  `Could not get unlock date for achievement ${def.id}`
                );
              }
            }

            return {
              ...def,
              progress: Math.min(progress, def.target),
              unlocked,
              unlockedAt,
            };
          } catch (error) {
            console.error(`Error processing achievement ${def.id}:`, error);
            return {
              ...def,
              progress: 0,
              unlocked: false,
            };
          }
        })
      );

      setAchievements(processedAchievements);

      // Calculate stats
      const unlockedCount = processedAchievements.filter(
        (a) => a.unlocked
      ).length;
      const totalRewards = processedAchievements
        .filter((a) => a.unlocked)
        .reduce((sum, a) => sum + a.reward, 0);

      const completionRate = Math.round(
        (unlockedCount / processedAchievements.length) * 100
      );

      // Calculate streak (simplified - consecutive days with achievements)
      const streak = Math.min(unlockedCount, 30); // Max 30 day streak for demo

      setStats({
        total: processedAchievements.length,
        unlocked: unlockedCount,
        totalRewards,
        completionRate,
        streak,
      });

      console.log("✅ Achievements loaded:", {
        total: processedAchievements.length,
        unlocked: unlockedCount,
        completionRate: `${completionRate}%`,
      });
    } catch (error) {
      console.error("Failed to load achievements:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load achievements"
      );
    } finally {
      setLoading(false);
    }
  }, [
    isConnected,
    address,
    getPlayerStats,
    getUserProfile,
    hasAchievement,
    getAchievement,
  ]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  // Filter achievements by category
  const getAchievementsByCategory = useCallback(
    (category: string) => {
      return achievements.filter(
        (achievement) => achievement.category === category
      );
    },
    [achievements]
  );

  // Get achievements by rarity
  const getAchievementsByRarity = useCallback(
    (rarity: string) => {
      return achievements.filter(
        (achievement) => achievement.rarity === rarity
      );
    },
    [achievements]
  );

  // Get next achievements to unlock
  const getNextAchievements = useCallback(
    (limit: number = 3) => {
      return achievements
        .filter((a) => !a.unlocked && a.progress > 0)
        .sort((a, b) => {
          const aProgress = (a.progress / a.target) * 100;
          const bProgress = (b.progress / b.target) * 100;
          return bProgress - aProgress;
        })
        .slice(0, limit);
    },
    [achievements]
  );

  // Get recently unlocked achievements
  const getRecentlyUnlocked = useCallback(
    (limit: number = 5) => {
      return achievements
        .filter((a) => a.unlocked && a.unlockedAt)
        .sort((a, b) => {
          if (!a.unlockedAt || !b.unlockedAt) return 0;
          return (
            new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
          );
        })
        .slice(0, limit);
    },
    [achievements]
  );

  return {
    achievements,
    stats,
    loading,
    error,
    getAchievementsByCategory,
    getAchievementsByRarity,
    getNextAchievements,
    getRecentlyUnlocked,
    refetch: loadAchievements,
  };
}
