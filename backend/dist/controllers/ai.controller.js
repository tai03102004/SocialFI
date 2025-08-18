import { aiService } from "../services/aiService";
import { DailyQuest } from "../models/DailyQuest";
export class AIController {
    // Agent 1: Daily Quests
    async generateDailyQuests(req, res) {
        try {
            const { force = false } = req.body;
            if (!force) {
                const activeQuests = await aiService.getActiveQuests();
                if (activeQuests.length > 0) {
                    return res.json({
                        success: true,
                        data: activeQuests,
                        from_cache: true,
                    });
                }
            }
            const { symbol = "BTC", difficulty = "intermediate" } = req.body;
            const aiResults = await aiService.runCrewAI({
                symbol,
                user_question: `Generate daily quests for ${difficulty} player`,
            });
            const quests = await aiService.getActiveQuests();
            res.json({
                success: true,
                data: quests,
                generated_at: new Date(),
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Generate quests error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to generate quests",
            });
        }
    }
    async getActiveQuests(req, res) {
        try {
            const activeQuests = await aiService.getActiveQuests();
            res.json({
                success: true,
                data: activeQuests,
            });
        }
        catch (error) {
            console.error("Get active quests error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get active quests",
            });
        }
    }
    async submitQuestResult(req, res) {
        try {
            const { questId } = req.params;
            const { address, prediction } = req.body;
            if (!address || !prediction) {
                return res.status(400).json({
                    success: false,
                    error: "Address and prediction are required",
                });
            }
            const quest = await DailyQuest.findOne({ questId, active: true });
            if (!quest) {
                return res.status(404).json({
                    success: false,
                    error: "Quest not found or expired",
                });
            }
            // Check if user already participated
            const existingParticipant = quest.participants.find((p) => p.address === address.toLowerCase());
            if (existingParticipant) {
                return res.status(400).json({
                    success: false,
                    error: "Already participated in this quest",
                });
            }
            // Add participant
            quest.participants.push({
                address: address.toLowerCase(),
                status: "pending",
                submittedAt: new Date(),
                prediction,
            });
            await quest.save();
            res.json({
                success: true,
                message: "Quest submission recorded successfully",
            });
        }
        catch (error) {
            console.error("Submit quest error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to submit quest result",
            });
        }
    }
    // Agent 2: Technical Analysis
    async getTechnicalAnalysis(req, res) {
        try {
            const symbol = req.params.symbol || req.query.symbol;
            const { force = false } = req.query;
            if (!symbol) {
                return res.status(400).json({
                    success: false,
                    error: "Symbol parameter is required",
                });
            }
            if (!force) {
                const analysis = await aiService.getLatestAnalysis(symbol, "technical");
                if (analysis) {
                    return res.json({
                        success: true,
                        symbol,
                        data: analysis.data,
                        confidence: analysis.confidence,
                        timestamp: analysis.createdAt,
                        from_cache: true,
                    });
                }
            }
            // Generate fresh technical analysis
            await aiService.runCrewAI({
                symbol: symbol.toUpperCase(),
                user_question: `Provide detailed technical analysis for ${symbol} including indicators, patterns, and price predictions`,
            });
            const analysis = await aiService.getLatestAnalysis(symbol, "technical");
            res.json({
                success: true,
                symbol,
                data: analysis?.data || {},
                confidence: analysis?.confidence || 50,
                timestamp: analysis?.createdAt || new Date(),
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Technical analysis error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get technical analysis",
            });
        }
    }
    // Agent 3: Sentiment Analysis
    async getSentimentAnalysis(req, res) {
        try {
            const { symbol } = req.params;
            const { force = false } = req.query;
            if (!force) {
                const sentiment = await aiService.getLatestAnalysis(symbol, "sentiment");
                if (sentiment) {
                    return res.json({
                        success: true,
                        symbol,
                        data: sentiment.data,
                        confidence: sentiment.confidence,
                        timestamp: sentiment.createdAt,
                        from_cache: true,
                    });
                }
            }
            await aiService.runCrewAI({
                symbol: symbol.toUpperCase(),
                user_question: `Analyze market sentiment for ${symbol} including social media trends, news sentiment, and community mood`,
            });
            const sentiment = await aiService.getLatestAnalysis(symbol, "sentiment");
            res.json({
                success: true,
                symbol,
                data: sentiment?.data || {},
                confidence: sentiment?.confidence || 50,
                timestamp: sentiment?.createdAt || new Date(),
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Sentiment analysis error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get sentiment analysis",
            });
        }
    }
    // Agent 4: Strategy Recommendations
    async getStrategyRecommendations(req, res) {
        try {
            const { symbol } = req.params;
            const { force = false } = req.query;
            if (!force) {
                const strategy = await aiService.getLatestAnalysis(symbol, "strategy");
                if (strategy) {
                    return res.json({
                        success: true,
                        symbol,
                        data: strategy.data,
                        confidence: strategy.confidence,
                        timestamp: strategy.createdAt,
                        from_cache: true,
                    });
                }
            }
            await aiService.runCrewAI({
                symbol: symbol.toUpperCase(),
                user_question: `Provide comprehensive trading and investment strategies for ${symbol} including entry/exit points, risk management, and portfolio allocation`,
            });
            const strategy = await aiService.getLatestAnalysis(symbol, "strategy");
            res.json({
                success: true,
                symbol,
                data: strategy?.data || {},
                confidence: strategy?.confidence || 50,
                timestamp: strategy?.createdAt || new Date(),
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Strategy recommendations error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get strategy recommendations",
            });
        }
    }
    // Agent 5: Blockchain News
    async getBlockchainNews(req, res) {
        try {
            const symbol = req.params.symbol || req.query.symbol || "BTC";
            const { force = false } = req.query;
            if (!force) {
                const news = await aiService.getLatestNews(symbol);
                if (news) {
                    return res.json({
                        success: true,
                        symbol,
                        data: {
                            newsArticles: news.newsArticles,
                            marketIntelligence: news.marketIntelligence,
                            regulatoryUpdates: news.regulatoryUpdates,
                            macroFactors: news.macroFactors,
                            marketOutlook: news.marketOutlook,
                        },
                        timestamp: news.analysisDate,
                        from_cache: true,
                    });
                }
            }
            await aiService.runCrewAI({
                symbol: symbol.toUpperCase(),
                user_question: `Gather latest blockchain news, regulatory updates, and market intelligence for ${symbol}`,
            });
            const news = await aiService.getLatestNews(symbol);
            res.json({
                success: true,
                symbol,
                data: {
                    newsArticles: news?.newsArticles || [],
                    marketIntelligence: news?.marketIntelligence || {},
                    regulatoryUpdates: news?.regulatoryUpdates || [],
                    macroFactors: news?.macroFactors || {},
                    marketOutlook: news?.marketOutlook || "",
                },
                timestamp: news?.analysisDate || new Date(),
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Blockchain news error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get blockchain news",
            });
        }
    }
    // Agent 6: Community Support
    async chatbotResponse(req, res) {
        try {
            const { question, context = {} } = req.body;
            if (!question) {
                return res.status(400).json({
                    success: false,
                    error: "Question is required",
                });
            }
            const aiResults = await aiService.runCrewAI({
                symbol: context.symbol || "BTC",
                user_question: question,
            });
            const response = aiResults.community_support?.answer ||
                aiResults.community_support?.response ||
                "I'm here to help! What would you like to know?";
            res.json({
                success: true,
                data: {
                    response,
                    question,
                    context: aiResults.community_support,
                    timestamp: new Date(),
                },
            });
        }
        catch (error) {
            console.error("Chatbot error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get response",
            });
        }
    }
    async getCommunitySupport(req, res) {
        try {
            const { question, symbol = "BTC" } = req.body;
            if (!question) {
                return res.status(400).json({
                    success: false,
                    error: "Question is required",
                });
            }
            const community = await aiService.getLatestAnalysis(symbol, "community");
            if (community) {
                return res.json({
                    success: true,
                    data: community.data,
                    from_cache: true,
                });
            }
            const aiResults = await aiService.runCrewAI({
                symbol: symbol.toUpperCase(),
                user_question: question,
            });
            res.json({
                success: true,
                data: aiResults.community_support || {},
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Community support error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get community support",
            });
        }
    }
    // Combined Analysis (All agents)
    async getMarketAnalysis(req, res) {
        try {
            const { symbol } = req.params;
            const { force = false } = req.query;
            if (!symbol) {
                return res.status(400).json({
                    success: false,
                    error: "Symbol parameter is required",
                });
            }
            // Try cache first
            if (!force) {
                const [sentiment, technical, strategy, news] = await Promise.all([
                    aiService.getLatestAnalysis(symbol, "sentiment"),
                    aiService.getLatestAnalysis(symbol, "technical"),
                    aiService.getLatestAnalysis(symbol, "strategy"),
                    aiService.getLatestNews(symbol),
                ]);
                if (sentiment || technical || strategy || news) {
                    return res.json({
                        success: true,
                        symbol,
                        data: {
                            sentiment: sentiment?.data,
                            technical: technical?.data,
                            strategy: strategy?.data,
                            news: news?.newsArticles || [],
                        },
                        from_cache: true,
                    });
                }
            }
            // Generate fresh comprehensive analysis
            const aiResults = await aiService.runCrewAI({
                symbol: symbol.toUpperCase(),
                user_question: `Provide comprehensive market analysis for ${symbol} including sentiment, technical analysis, strategy recommendations, and latest news`,
            });
            res.json({
                success: true,
                symbol,
                data: {
                    sentiment: aiResults.sentiment_analysis,
                    technical: aiResults.technical_predictions,
                    strategy: aiResults.strategy_recommendations,
                    news: aiResults.blockchain_news,
                },
                from_cache: false,
            });
        }
        catch (error) {
            console.error("Market analysis error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get market analysis",
            });
        }
    }
    async getComprehensiveAnalysis(req, res) {
        try {
            const { symbol } = req.params;
            // Get all analysis types for the symbol
            const [sentiment, technical, strategy, news, community, quests] = await Promise.all([
                aiService.getLatestAnalysis(symbol, "sentiment"),
                aiService.getLatestAnalysis(symbol, "technical"),
                aiService.getLatestAnalysis(symbol, "strategy"),
                aiService.getLatestNews(symbol),
                aiService.getLatestAnalysis(symbol, "community"),
                aiService.getActiveQuests(),
            ]);
            res.json({
                success: true,
                symbol,
                data: {
                    sentiment: sentiment?.data || {},
                    technical: technical?.data || {},
                    strategy: strategy?.data || {},
                    news: news?.newsArticles || [],
                    community: community?.data || {},
                    quests: quests.filter((q) => q.questId.includes(symbol.toUpperCase())) ||
                        [],
                },
                timestamps: {
                    sentiment: sentiment?.createdAt,
                    technical: technical?.createdAt,
                    strategy: strategy?.createdAt,
                    news: news?.analysisDate,
                    community: community?.createdAt,
                },
            });
        }
        catch (error) {
            console.error("Comprehensive analysis error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to get comprehensive analysis",
            });
        }
    }
    async healthCheck(req, res) {
        try {
            const [totalQuests, totalAnalyses, totalNews] = await Promise.all([
                DailyQuest.countDocuments({ active: true }),
                aiService.getLatestAnalysis("BTC", "technical"),
                aiService.getLatestNews("BTC"),
            ]);
            res.json({
                success: true,
                status: "AI services operational",
                stats: {
                    active_quests: totalQuests,
                    has_analysis: !!totalAnalyses,
                    has_news: !!totalNews,
                },
                agents: {
                    daily_quests: "operational",
                    technical_analysis: "operational",
                    sentiment_analysis: "operational",
                    strategy_recommendations: "operational",
                    blockchain_news: "operational",
                    community_support: "operational",
                },
                timestamp: new Date(),
            });
        }
        catch (error) {
            res.status(503).json({
                success: false,
                status: "AI services unavailable",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
export const aiController = new AIController();
//# sourceMappingURL=ai.controller.js.map