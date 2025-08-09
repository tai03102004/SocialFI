import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { contractService } from "../lib/contracts";

export function useContract() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const connect = async () => {
      if (address) {
        setIsLoading(true);
        try {
          const connected = await contractService.connect();
          setIsConnected(connected);
        } catch (error) {
          console.error("Failed to connect to contracts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    connect();
  }, [address]);

  return {
    contractService,
    isConnected,
    isLoading,
  };
}

// Hook for GameFi data
export function useGameFiData() {
  const [playerStats, setPlayerStats] = useState(null);
  const [dailyQuests, setDailyQuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { contractService, isConnected } = useContract();

  const fetchData = async () => {
    if (!isConnected || !address) return;

    setLoading(true);
    try {
      const [stats, quests] = await Promise.all([
        contractService.getPlayerStats(address),
        contractService.getDailyQuests(),
      ]);

      setPlayerStats(stats);
      setDailyQuests(quests);
    } catch (error) {
      console.error("Failed to fetch GameFi data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isConnected, address]);

  return {
    playerStats,
    dailyQuests,
    loading,
    refetch: fetchData,
  };
}

// Hook for Social data
export function useSocialData() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { contractService, isConnected } = useContract();

  const fetchPosts = async () => {
    if (!isConnected) return;

    setLoading(true);
    try {
      const postIds = await contractService.getRecentPosts(10);
      const postDetails = await Promise.all(
        postIds.map((id) => contractService.getPost(id))
      );
      setPosts(postDetails);
    } catch (error) {
      console.error("Failed to fetch social data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [isConnected]);

  return {
    posts,
    loading,
    refetch: fetchPosts,
  };
}
