type PlayerStats = {
  accuracy?: number;
  totalPredictions: number;
  currentStreak: number;
};

type Interaction = {
  id: string;
  question: string;
  answer: string;
  playerStats: PlayerStats;
  timestamp: Date;
  feedback: string | null;
};

type LearningData = {
  count: number;
  avgAccuracy: number;
  commonQuestions: string[];
};

export class KnowledgeBase {
  private interactions: Interaction[];
  private learningData: Map<string, LearningData>;

  constructor() {
    this.interactions = [];
    this.learningData = new Map();
  }

  async initialize() {
    console.log("🧠 Knowledge base initialized");
  }

  async storeInteraction(
    question: string,
    answer: string,
    playerStats: PlayerStats
  ) {
    const interaction: Interaction = {
      id: Date.now().toString(),
      question,
      answer,
      playerStats,
      timestamp: new Date(),
      feedback: null,
    };

    this.interactions.push(interaction);

    // Learn from interaction patterns
    await this.updateLearningData(question, playerStats);

    console.log("📝 Interaction stored:", interaction.id);
  }

  async updateLearningData(question: string, playerStats: PlayerStats) {
    // Extract topics from question
    const topics = this.extractTopics(question);

    topics.forEach((topic) => {
      if (!this.learningData.has(topic)) {
        this.learningData.set(topic, {
          count: 0,
          avgAccuracy: 0,
          commonQuestions: [],
        });
      }

      const data = this.learningData.get(topic)!;
      data.count++;

      if (playerStats.accuracy) {
        data.avgAccuracy = (data.avgAccuracy + playerStats.accuracy) / 2;
      }

      // Store popular questions
      if (
        !data.commonQuestions.includes(question) &&
        data.commonQuestions.length < 10
      ) {
        data.commonQuestions.push(question);
      }
    });
  }

  extractTopics(text: string): string[] {
    const topics: string[] = [];
    const keywords: Record<string, string[]> = {
      bitcoin: ["bitcoin", "btc"],
      ethereum: ["ethereum", "eth", "smart contract"],
      trading: ["trading", "buy", "sell", "price", "market"],
      defi: ["defi", "decentralized finance", "lending", "borrowing"],
      gamefi: ["gamefi", "game", "nft", "play to earn"],
      strategy: ["strategy", "how to", "best way", "tips"],
    };

    const lowerText = text.toLowerCase();

    Object.entries(keywords).forEach(([topic, words]) => {
      if (words.some((word) => lowerText.includes(word))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  async getPersonalizedInsights(playerStats: PlayerStats): Promise<string[]> {
    const insights: string[] = [];

    if ((playerStats.accuracy ?? 0) < 70) {
      insights.push(
        "Consider focusing on fundamental analysis to improve prediction accuracy"
      );
    }

    if (playerStats.totalPredictions < 10) {
      insights.push(
        "Try making more predictions to build experience and confidence"
      );
    }

    if (playerStats.currentStreak > 5) {
      insights.push(
        "Great streak! Consider documenting your successful strategies"
      );
    }

    return insights;
  }

  async getPopularTopics() {
    const topicStats = Array.from(this.learningData.entries())
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5);

    return topicStats.map(([topic, data]) => ({
      topic,
      popularity: data.count,
      avgAccuracy: Math.round(data.avgAccuracy),
      sampleQuestions: data.commonQuestions.slice(0, 3),
    }));
  }
}
