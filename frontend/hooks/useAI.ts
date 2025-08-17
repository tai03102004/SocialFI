import { useState, useEffect } from "react";
import { contractService } from "../lib/contracts";

export function useAIQuests() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuests = async (difficulty: string = "intermediate") => {
    setLoading(true);
    try {
      const result = await contractService.generateDailyQuests(difficulty);
      if (result.success) {
        setQuests(result.data);
      }
    } catch (error) {
      console.error("Failed to generate quests:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    quests,
    loading,
    generateQuests,
  };
}

export function useMarketAnalysis(symbol: string) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const result = await contractService.getMarketAnalysis(symbol);
        if (result.success) {
          setAnalysis(result.data);
        }
      } catch (error) {
        console.error("Failed to get analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol]);

  return { analysis, loading };
}

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question: string, context?: any) => {
    setLoading(true);
    try {
      const response = await contractService.askChatbot(question, context);
      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            question,
            response: response.data.response,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
