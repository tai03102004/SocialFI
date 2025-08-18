from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.knowledge.source.json_knowledge_source import JSONKnowledgeSource
from crewai_tools import SerperDevTool, ScrapeWebsiteTool, WebsiteSearchTool, FirecrawlScrapeWebsiteTool
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
import os, json
import warnings
warnings.filterwarnings("ignore") # Suppress unimportant warnings

from tools.technical_analysis_tool import TechnicalAnalysisTool
from tools.lstm_prediction_tool import LSTMPredictionTool

# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = "dummy-key-for-crew-validation"

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL")
GEMINI_REASONING_MODEL = os.environ.get("GEMINI_REASONING_MODEL")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY")

# Create an LLM with a temperature of 0.3 for creative yet focused outputs
try:
    gemini_llm = LLM(
        model=GEMINI_MODEL,  
        api_key=GEMINI_API_KEY,
        temperature=0.3,
        max_tokens=4096,
    )
    print("✅ Gemini LLM initialized successfully")
except Exception as e:
    print(f"❌ Gemini LLM error: {e}")
    # Fallback to stable model
    gemini_llm = LLM(
        model="gemini/gemini-1.5-flash",
        api_key=GEMINI_API_KEY,
        temperature=0.3,
    )

# Create another LLM for reasoning tasks with error handling
try:
    gemini_reasoning_llm = LLM(
        model=GEMINI_REASONING_MODEL,  
        api_key=GEMINI_API_KEY,
        temperature=0.2,
        max_tokens=4096
    )
    print("✅ Gemini Reasoning LLM initialized successfully")
except Exception as e:
    print(f"❌ Gemini Reasoning LLM error: {e}")
    # Fallback to stable model
    gemini_reasoning_llm = LLM(
        model="gemini/gemini-1.5-pro",
        api_key=GEMINI_API_KEY,
        temperature=0.2,
    )

# Initialize the tools for Web3/crypto data collection
try:
    scrape_tool = ScrapeWebsiteTool()
    search_tool = SerperDevTool(
        country="us",
        locale="en",
        location="United States",
        n_results=10  # Giảm từ 20 xuống 10
    ) if SERPER_API_KEY else None
    web_search_tool = None
    print("✅ Tools initialized successfully")
except Exception as e:
    print(f"⚠️ Tool initialization warning: {e}")
    search_tool = None

web_search_tool = None

# Create Pydantic Models for Structured Output
class QuestOutput(BaseModel):
    quest_id: str = Field(..., description="Unique identifier for the quest")
    quest_type: str = Field(..., description="Type of quest (prediction, social, educational, trading)")
    title: str = Field(..., description="Quest title in English")
    description: str = Field(..., description="Detailed quest description")
    completion_criteria: Dict[str, Any] = Field(..., description="Requirements to complete the quest")
    time_limit: int = Field(..., description="Time limit in hours")
    rewards: Dict[str, Any] = Field(..., description="Reward structure (tokens, XP, NFTs)")
    difficulty: int = Field(..., description="Difficulty rating from 1-10")

class MarketAnalysisOutput(BaseModel):
    """Combined news + market intelligence output"""
    news_articles: List[Dict[str, Any]] = Field(..., description="Top 3 impactful news articles")
    market_intelligence: Dict[str, Any] = Field(..., description="On-chain metrics and whale movements")
    regulatory_updates: List[str] = Field(..., description="Latest regulatory developments")
    macro_factors: Dict[str, Any] = Field(..., description="Macro economic impact analysis")
    market_outlook: str = Field(..., description="Short/medium/long-term outlook")
    analysis_date: str = Field(..., description="Date of analysis")

class SentimentOutput(BaseModel):
    symbol: str = Field(..., description="Cryptocurrency symbol analyzed")
    sentiment_score: int = Field(..., description="Sentiment score from 1-10")
    key_themes: List[str] = Field(..., description="Key discussion themes")
    influencer_sentiment: str = Field(..., description="Notable influencer opinions")
    trending_hashtags: List[str] = Field(..., description="Trending hashtags")
    analysis_date: str = Field(..., description="Date of analysis")

class TechnicalPredictionOutput(BaseModel):
    """Combined technical analysis + AI prediction output"""
    symbol: str = Field(..., description="Cryptocurrency symbol")
    technical_analysis: Dict[str, Any] = Field(..., description="Multi-timeframe technical analysis")
    ai_predictions: Dict[str, Any] = Field(..., description="LSTM price predictions with confidence")
    trading_signals: List[Dict[str, Any]] = Field(..., description="Actionable trading signals")
    risk_levels: Dict[str, Any] = Field(..., description="Support/resistance and risk zones")
    confidence_score: int = Field(..., description="Overall analysis confidence 1-10")

class StrategyOutput(BaseModel):
    """Combined strategy + gaming + risk management output"""
    symbol: str = Field(..., description="Cryptocurrency symbol")
    market_strategy: Dict[str, Any] = Field(..., description="Trading/investment strategy")
    gaming_strategy: Dict[str, Any] = Field(..., description="Gaming optimization tactics")
    risk_management: Dict[str, Any] = Field(..., description="Risk assessment and position sizing")
    social_strategy: Dict[str, Any] = Field(..., description="Social engagement tactics")
    portfolio_allocation: Dict[str, Any] = Field(..., description="Asset allocation recommendations")
    timeframe_outlook: Dict[str, str] = Field(..., description="Short/medium/long-term outlook")
    confidence_score: int = Field(..., description="Strategy confidence 1-10")

class ChatbotOutput(BaseModel):
    user_question: str = Field(..., description="Original user question")
    response: str = Field(..., description="AI chatbot response")
    suggested_features: List[str] = Field(..., description="Related features or quests")
    disclaimer: Optional[str] = Field(None, description="Financial advice disclaimer if applicable")

@CrewBase
class SocialFiCrew():
    """Optimized SocialFi AI Agents Crew - 6 Core Agents"""

    # Create type-hinted class attributes
    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def quest_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["quest_agent"],
            verbose=True,
            llm=gemini_llm,
            tools=[search_tool, scrape_tool],
            max_rpm=5,
            max_iter=3
        )

    @agent
    def market_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["market_analyst"],
            verbose=True,
            llm=gemini_llm,
            tools=[search_tool, scrape_tool],
            max_rpm=5,
            max_iter=3
        )

    @agent
    def social_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["social_agent"],
            verbose=True,
            llm=gemini_llm,
            tools=[search_tool, scrape_tool],
            max_rpm=5,
            max_iter=3
        )
    
    @agent
    def strategy_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["strategy_agent"],
            verbose=True,
            llm=gemini_reasoning_llm,
            tools=[TechnicalAnalysisTool(),search_tool, scrape_tool],
            max_rpm=3,
            max_iter=3
        )

    @agent
    def technical_prediction_engine(self) -> Agent:
        """Combined technical analysis + AI price prediction"""
        return Agent(
            config=self.agents_config["technical_prediction_engine"],
            verbose=True,
            llm=gemini_reasoning_llm,
            tools=[TechnicalAnalysisTool(), LSTMPredictionTool(), search_tool],
            max_rpm=5,
            max_iter=3
        )

    @agent
    def community_support_manager(self) -> Agent:
        return Agent(
            config=self.agents_config["community_support_manager"],
            verbose=True,
            tools=[search_tool],
            llm=gemini_llm,
            max_rpm=12,
            max_iter=3
        )
    # Phare1
    @task
    def quest_generation(self) -> Task:
        return Task(
            config=self.tasks_config["quest_generation"],
            agent=self.quest_agent(),
            output_json=QuestOutput,
            output_file="json/daily_quests.json"
        )

    @task
    def markets_collection(self) -> Task:
        return Task(
            config=self.tasks_config["comprehensive_market_analysis"],
            agent=self.market_analyst(),
            output_json=MarketAnalysisOutput,
            output_file="json/blockchain_news.json"
        )

    @task
    def social_sentiment_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["social_sentiment_analysis"],
            agent=self.social_agent(),
            output_json=SentimentOutput,
            output_file="json/sentiment_analysis.json"
        )
    
    # Phare2
    @task
    def technical_prediction_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["technical_prediction_analysis"],
            context=[self.quest_generation()],
            agent=self.technical_prediction_engine(),
            output_json=TechnicalPredictionOutput,
            output_file="json/technical_predictions.json"
        )
    
    @task
    def strategy_recommendation(self) -> Task:
        return Task(
            config=self.tasks_config["strategy_recommendation"],
            context=[self.markets_collection(), self.social_sentiment_analysis()],
            output_json=StrategyOutput,
            agent=self.strategy_agent(),
            output_file="json/strategy_recommendations.json"
        )

    @task
    def community_support_and_rewards(self) -> Task:
        return Task(
            config=self.tasks_config["community_support_and_rewards"],
            agent=self.community_support_manager(),
            async_execution=True,
            context=[self.markets_collection(), self.social_sentiment_analysis()],
            output_json=ChatbotOutput,
            output_file="json/community_support.json"
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SocialFi AI crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            manager_llm=gemini_reasoning_llm,
            max_rpm=10, 
            # memory=True  # Enable memory for learning
        )