import { useState, useCallback } from "react";
import { useEnhancedContract } from "./useEnhancedContract";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

interface Achievement {
  id: number;
  name: string;
  description: string;
  requirement: number;
  achievementType: number;
  active: boolean;
}

interface NFTData {
  tokenId: number;
  achievementId: number;
  achievement: Achievement;
}

export function useNFTAchievements() {
  const { contracts, signer, isConnected } = useEnhancedContract();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get player's NFT achievements
  const getPlayerAchievements = useCallback(async (): Promise<NFTData[]> => {
    if (!isConnected || !contracts.NFTAchievements || !address) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🏆 Fetching player achievements...");

      // Type assertion for contract methods
      const contract = contracts.NFTAchievements as any;
      const achievementIds = await contract.getPlayerAchievements(address);

      const nftData: NFTData[] = [];

      for (const achievementId of achievementIds) {
        const achievement = await contract.getAchievement(achievementId);

        nftData.push({
          tokenId: Number(achievementId),
          achievementId: Number(achievementId),
          achievement: {
            id: Number(achievementId),
            name: achievement.name,
            description: achievement.description,
            requirement: Number(achievement.requirement),
            achievementType: achievement.achievementType,
            active: achievement.active,
          },
        });
      }

      console.log("✅ Player achievements loaded:", nftData);
      return nftData;
    } catch (error: any) {
      console.error("Failed to get player achievements:", error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isConnected, contracts.NFTAchievements, address]);

  // Check if player has specific achievement
  const hasAchievement = useCallback(
    async (achievementId: number): Promise<boolean> => {
      if (!isConnected || !contracts.NFTAchievements || !address) {
        return false;
      }

      try {
        const contract = contracts.NFTAchievements as any;
        return await contract.hasAchievement(address, achievementId);
      } catch (error) {
        console.error("Failed to check achievement:", error);
        return false;
      }
    },
    [isConnected, contracts.NFTAchievements, address]
  );

  // Get achievement info
  const getAchievement = useCallback(
    async (achievementId: number): Promise<Achievement | null> => {
      if (!isConnected || !contracts.NFTAchievements) {
        return null;
      }

      try {
        const contract = contracts.NFTAchievements as any;
        const achievement = await contract.getAchievement(achievementId);

        return {
          id: achievementId,
          name: achievement.name,
          description: achievement.description,
          requirement: Number(achievement.requirement),
          achievementType: achievement.achievementType,
          active: achievement.active,
        };
      } catch (error) {
        console.error("Failed to get achievement:", error);
        return null;
      }
    },
    [isConnected, contracts.NFTAchievements]
  );

  // Mint achievement (only owner can call this)
  const mintAchievement = useCallback(
    async (playerAddress: string, achievementId: number): Promise<boolean> => {
      if (!isConnected || !contracts.NFTAchievements || !signer) {
        throw new Error("Not connected to blockchain");
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🎯 Minting achievement NFT...", {
          playerAddress,
          achievementId,
        });

        // Type assertion for contract with signer
        const contract = contracts.NFTAchievements as any;
        const tx = await contract
          .connect(signer)
          .mintAchievement(playerAddress, achievementId);

        console.log("📤 Transaction sent:", tx.hash);
        await tx.wait();

        console.log("✅ Achievement NFT minted successfully!");
        toast.success("Achievement NFT minted!");

        return true;
      } catch (error: any) {
        console.error("Failed to mint achievement:", error);
        setError(error.message);
        toast.error(error.message || "Failed to mint achievement");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, contracts.NFTAchievements, signer]
  );

  return {
    getPlayerAchievements,
    hasAchievement,
    getAchievement,
    mintAchievement,
    loading,
    error,
    isConnected,
  };
}
