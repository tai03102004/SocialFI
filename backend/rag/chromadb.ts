interface KnowledgeDoc {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

interface QueryResult {
  content: string;
  metadata: Record<string, any>;
  distance: number;
}

export class ChromaDB {
  private knowledgeData: KnowledgeDoc[] = [];

  constructor() {
    console.log("💡 Using simple knowledge base (ChromaDB disabled)");
  }

  async initialize(): Promise<void> {
    console.log("🔄 Initializing knowledge base...");
    await this.populateKnowledgeBase();
    console.log(
      "✅ Knowledge base initialized with",
      this.knowledgeData.length,
      "documents"
    );
  }

  private async populateKnowledgeBase(): Promise<void> {
    this.knowledgeData = [
      {
        id: "crypto_basics_1",
        content:
          "Bitcoin is a decentralized digital currency that operates on a peer-to-peer network without central authority. It uses blockchain technology to maintain a distributed ledger of transactions. Bitcoin was created by Satoshi Nakamoto in 2009.",
        metadata: {
          category: "crypto_basics",
          topic: "bitcoin",
          difficulty: "beginner",
        },
      },
      {
        id: "crypto_basics_2",
        content:
          "Ethereum is a blockchain platform that enables smart contracts and decentralized applications (DApps). It has its own cryptocurrency called Ether (ETH). Ethereum was created by Vitalik Buterin and launched in 2015.",
        metadata: {
          category: "crypto_basics",
          topic: "ethereum",
          difficulty: "beginner",
        },
      },
      {
        id: "trading_strategy_1",
        content:
          "Dollar-cost averaging (DCA) is a strategy where you invest a fixed amount regularly regardless of price. This reduces the impact of volatility and can be effective for long-term investors. DCA helps avoid timing the market.",
        metadata: {
          category: "trading",
          topic: "strategy",
          difficulty: "beginner",
        },
      },
      {
        id: "trading_strategy_2",
        content:
          "Technical analysis involves studying price charts and indicators to predict future price movements. Key indicators include RSI, MACD, moving averages, and support/resistance levels. TA helps identify entry and exit points.",
        metadata: {
          category: "trading",
          topic: "technical_analysis",
          difficulty: "intermediate",
        },
      },
      {
        id: "trading_strategy_3",
        content:
          "Risk management is crucial in crypto trading. Never invest more than you can afford to lose. Use stop-losses to limit downside. Diversify your portfolio. Take profits gradually. Position sizing should be 1-2% of portfolio per trade.",
        metadata: {
          category: "trading",
          topic: "risk_management",
          difficulty: "intermediate",
        },
      },
      {
        id: "defi_1",
        content:
          "DeFi (Decentralized Finance) protocols allow users to lend, borrow, and trade cryptocurrencies without traditional intermediaries. Popular DeFi platforms include Uniswap, Aave, Compound, and MakerDAO. DeFi offers higher yields but comes with smart contract risks.",
        metadata: {
          category: "defi",
          topic: "protocols",
          difficulty: "intermediate",
        },
      },
      {
        id: "defi_2",
        content:
          "Yield farming involves providing liquidity to DeFi protocols in exchange for rewards. Liquidity providers earn trading fees and often additional token rewards. However, be aware of impermanent loss when providing liquidity to volatile pairs.",
        metadata: {
          category: "defi",
          topic: "yield_farming",
          difficulty: "advanced",
        },
      },
      {
        id: "gamefi_1",
        content:
          "GameFi combines gaming with decentralized finance, allowing players to earn cryptocurrency and NFTs through gameplay. Popular GameFi features include play-to-earn mechanics, NFT ownership, and in-game economies. Players can earn real value from gaming.",
        metadata: {
          category: "gamefi",
          topic: "basics",
          difficulty: "beginner",
        },
      },
      {
        id: "gamefi_2",
        content:
          "Play-to-earn (P2E) games reward players with cryptocurrency or NFTs for their time and skill. Popular P2E games include Axie Infinity, The Sandbox, and Decentraland. P2E creates new economic opportunities for gamers.",
        metadata: {
          category: "gamefi",
          topic: "play_to_earn",
          difficulty: "beginner",
        },
      },
      {
        id: "nft_1",
        content:
          "NFTs (Non-Fungible Tokens) are unique digital assets stored on blockchain. They can represent art, collectibles, game items, or achievement badges. Each NFT has a unique identifier making it non-interchangeable. NFTs prove digital ownership.",
        metadata: { category: "nft", topic: "basics", difficulty: "beginner" },
      },
      {
        id: "nft_2",
        content:
          "NFT utility goes beyond just digital art. They can represent game items, access passes, membership tokens, achievement certificates, and real-world asset ownership. Utility NFTs provide ongoing value to holders.",
        metadata: {
          category: "nft",
          topic: "utility",
          difficulty: "intermediate",
        },
      },
      {
        id: "blockchain_1",
        content:
          "Blockchain is a distributed ledger technology that maintains a continuously growing list of records. Each block contains a cryptographic hash of the previous block, timestamp, and transaction data. This creates an immutable record.",
        metadata: {
          category: "blockchain",
          topic: "technology",
          difficulty: "beginner",
        },
      },
      {
        id: "web3_1",
        content:
          "Web3 represents the next evolution of the internet, built on blockchain technology. It enables decentralized applications, user ownership of data, and tokenized economies. Web3 gives users more control over their digital lives.",
        metadata: {
          category: "web3",
          topic: "concepts",
          difficulty: "beginner",
        },
      },
      {
        id: "prediction_1",
        content:
          "Successful crypto price prediction requires analyzing multiple factors: technical analysis, fundamental analysis, market sentiment, news events, and on-chain metrics. Combine different approaches for better accuracy.",
        metadata: {
          category: "prediction",
          topic: "strategy",
          difficulty: "intermediate",
        },
      },
      {
        id: "prediction_2",
        content:
          "Market sentiment analysis involves tracking social media mentions, news sentiment, fear and greed index, and community discussions. Sentiment often moves markets in the short term. Use sentiment as one factor in your analysis.",
        metadata: {
          category: "prediction",
          topic: "sentiment",
          difficulty: "intermediate",
        },
      },
      {
        id: "social_trading_1",
        content:
          "Social trading allows users to follow and copy successful traders. This can help beginners learn from experienced traders while building their own knowledge. Always research before following any trader and understand their strategy.",
        metadata: {
          category: "social",
          topic: "trading",
          difficulty: "beginner",
        },
      },
      {
        id: "quiz_education_1",
        content:
          "Regular quizzes and practice help reinforce crypto and trading knowledge. Start with basic concepts, then progress to more advanced topics. Practice helps identify knowledge gaps and improves retention.",
        metadata: {
          category: "education",
          topic: "learning",
          difficulty: "beginner",
        },
      },
      {
        id: "market_analysis_1",
        content:
          "Market analysis combines technical analysis (charts, indicators) with fundamental analysis (project value, adoption, team) and sentiment analysis (social media, news). Use multiple timeframes for better perspective.",
        metadata: {
          category: "analysis",
          topic: "market",
          difficulty: "intermediate",
        },
      },
    ];
  }

  async query(text: string, limit = 5): Promise<QueryResult[]> {
    const lowerText = text.toLowerCase();
    const results: QueryResult[] = [];

    // Calculate relevance score for each document
    for (const doc of this.knowledgeData) {
      const score = this.calculateRelevance(lowerText, doc);
      if (score > 0.1) {
        results.push({
          content: doc.content,
          metadata: doc.metadata,
          distance: 1 - score, // Convert to distance (lower = more relevant)
        });
      }
    }

    // Sort by relevance (lower distance = higher relevance)
    results.sort((a, b) => a.distance - b.distance);
    return results.slice(0, limit);
  }

  private calculateRelevance(query: string, doc: KnowledgeDoc): number {
    const content = doc.content.toLowerCase();
    const metadata = JSON.stringify(doc.metadata).toLowerCase();

    // Split query into words
    const queryWords = query.split(/\s+/).filter((word) => word.length > 2);
    if (queryWords.length === 0) return 0;

    let score = 0;
    const totalWords = queryWords.length;

    for (const word of queryWords) {
      // Check content match
      if (content.includes(word)) {
        score += 1;
      }

      // Check metadata match (category, topic)
      if (metadata.includes(word)) {
        score += 0.5;
      }

      // Check partial matches
      const contentWords = content.split(/\s+/);
      for (const contentWord of contentWords) {
        if (contentWord.includes(word) || word.includes(contentWord)) {
          score += 0.3;
          break;
        }
      }
    }

    // Normalize score
    return Math.min(score / totalWords, 1);
  }

  async addDocument(
    id: string,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    this.knowledgeData.push({ id, content, metadata });
    console.log("✅ Document added:", id);
  }

  async isHealthy(): Promise<boolean> {
    return true; // Always healthy
  }

  getStatus(): {
    isHealthy: boolean;
    usingFallback: boolean;
    documentsCount: number;
  } {
    return {
      isHealthy: true,
      usingFallback: false, // Now this IS the primary system
      documentsCount: this.knowledgeData.length,
    };
  }

  // Get documents by category
  getDocumentsByCategory(category: string): KnowledgeDoc[] {
    return this.knowledgeData.filter(
      (doc) => doc.metadata.category === category
    );
  }

  // Get all categories
  getCategories(): string[] {
    const categories = new Set(
      this.knowledgeData.map((doc) => doc.metadata.category)
    );
    return Array.from(categories);
  }

  // Search by topic
  searchByTopic(topic: string): KnowledgeDoc[] {
    return this.knowledgeData.filter(
      (doc) =>
        doc.metadata.topic?.includes(topic) ||
        doc.content.toLowerCase().includes(topic.toLowerCase())
    );
  }
}
