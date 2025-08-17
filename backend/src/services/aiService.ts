import { spawn } from "child_process";
import path from "path";
import { promises as fs } from "fs";

interface AIInputs {
  symbol: string;
  user_question?: string;
  current_date?: string;
}

interface AIResults {
  daily_quests?: any;
  blockchain_news?: any;
  sentiment_analysis?: any;
  strategy_recommendations?: any;
  nft_rewards?: any;
  chatbot_responses?: any;
}

export class AIService {
  private pythonPath = path.join(__dirname, "../python");

  async runCrewAI(inputs: AIInputs): Promise<AIResults> {
    return new Promise((resolve, reject) => {
      const python = spawn("python3", [path.join(this.pythonPath, "main.py")], {
        env: {
          ...process.env,
          SYMBOL: inputs.symbol,
          USER_QUESTION: inputs.user_question || "",
          CURRENT_DATE:
            inputs.current_date || new Date().toISOString().split("T")[0],
        },
      });

      let output = "";
      let error = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      python.stderr.on("data", (data) => {
        error += data.toString();
      });

      python.on("close", async (code) => {
        if (code === 0) {
          try {
            const results = await this.parseAIOutput();
            resolve(results);
          } catch (parseError) {
            reject(new Error(`Parse error: ${parseError}`));
          }
        } else {
          reject(new Error(`Python script failed: ${error}`));
        }
      });
    });
  }

  private async parseAIOutput(): Promise<AIResults> {
    const outputDir = path.join(this.pythonPath, "json");

    // Create directory if it doesn't exist
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    const files = [
      "daily_quests.json",
      "blockchain_news.json",
      "sentiment_analysis.json",
      "strategy_recommendations.json",
      "nft_rewards.json",
      "chatbot_responses.json",
    ];

    const results: AIResults = {};

    for (const file of files) {
      try {
        const filePath = path.join(outputDir, file);
        const content = await fs.readFile(filePath, "utf8");
        const key = file.replace(".json", "") as keyof AIResults;
        results[key] = JSON.parse(content);
      } catch (err) {
        console.warn(`Could not read ${file}:`, err);
        // Set default values for missing files
        const key = file.replace(".json", "") as keyof AIResults;
        results[key] = this.getDefaultValue(key);
      }
    }

    return results;
  }

  private getDefaultValue(key: string) {
    switch (key) {
      case "daily_quests":
        return {
          quests: [
            {
              id: "default_quest_1",
              title: "Daily Prediction Challenge",
              description: "Make a price prediction for BTC",
              type: "prediction",
              reward: 100,
              difficulty: 5,
            },
          ],
        };
      case "blockchain_news":
        return {
          news: [
            {
              title: "Market Update",
              summary: "Stay tuned for the latest crypto news",
              source: "Internal",
              date: new Date().toISOString(),
            },
          ],
        };
      case "sentiment_analysis":
        return {
          sentiment_score: 5,
          summary: "Neutral market sentiment",
          confidence: 0.5,
        };
      case "strategy_recommendations":
        return {
          recommendation: "HOLD",
          confidence_score: 5,
          analysis: "Market analysis unavailable",
        };
      case "chatbot_responses":
        return {
          response:
            "I'm here to help! What would you like to know about crypto trading?",
        };
      default:
        return {};
    }
  }

  async getTechnicalIndicators(
    prices: number[],
    indicator: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const python = spawn("python3", [
        path.join(this.pythonPath, "technical_indicators.py"),
        JSON.stringify(prices),
        indicator,
      ]);

      let output = "";
      let error = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      python.stderr.on("data", (data) => {
        error += data.toString();
      });

      python.on("close", (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (err) {
            // Return default technical data if parsing fails
            resolve(this.getDefaultTechnicalData(indicator));
          }
        } else {
          console.error("Technical indicators error:", error);
          resolve(this.getDefaultTechnicalData(indicator));
        }
      });
    });
  }

  private getDefaultTechnicalData(indicator: string) {
    switch (indicator.toLowerCase()) {
      case "rsi":
        return { rsi: 50, signal: "neutral" };
      case "macd":
        return { macd: 0, signal_line: 0, histogram: 0, signal: "neutral" };
      case "bollinger":
        return { upper: 0, middle: 0, lower: 0, signal: "neutral" };
      default:
        return { value: 0, signal: "neutral" };
    }
  }
}

export const aiService = new AIService();
