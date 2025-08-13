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

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL")
GEMINI_REASONING_MODEL = os.environ.get("GEMINI_REASONING_MODEL")
SERPER_API_KEY = os.environ.get("SERPER_API_KEY")
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY")

# Create an LLM with a temperature of 0.3 for creative yet focused outputs
gemini_llm = LLM(
    model=GEMINI_MODEL,
    api_key=GEMINI_API_KEY,
    temperature=0.3,
    max_tokens=4096
)

# Create another LLM for reasoning tasks
gemini_reasoning_llm = LLM(
    model=GEMINI_REASONING_MODEL,
    api_key=GEMINI_API_KEY,
    temperature=0.2,
    max_tokens=4096
)

# Initialize the tools for Web3/crypto data collection
scrape_tool = ScrapeWebsiteTool()
search_tool = SerperDevTool(
    country="us",
    locale="en",
    location="United States",
    n_results=20
)
web_search_tool = WebsiteSearchTool(
    config=dict(
        llm={
            "provider": "google",
            "config": {
                "model": GEMINI_MODEL,
                "api_key": GEMINI_API_KEY
            }
        },
        embedder={
            "provider": "google",
            "config": {
                "model": "models/text-embedding-004",
                "task_type": "retrieval_document"
            }
        }
    )
)

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

class NewsOutput(BaseModel):
    articles: List[Dict[str, Any]] = Field(..., description="List of 3 most impactful news articles")
    summary: str = Field(..., description="Overall market impact summary")
    date_collected: str = Field(..., description="Date when news was collected")

class SentimentOutput(BaseModel):
    symbol: str = Field(..., description="Cryptocurrency symbol analyzed")
    sentiment_score: int = Field(..., description="Sentiment score from 1-10")
    key_themes: List[str] = Field(..., description="Key discussion themes")
    influencer_sentiment: str = Field(..., description="Notable influencer opinions")
    trending_hashtags: List[str] = Field(..., description="Trending hashtags")
    analysis_date: str = Field(..., description="Date of analysis")

class StrategyOutput(BaseModel):
    symbol: str = Field(..., description="Cryptocurrency symbol")
    market_overview: str = Field(..., description="Current market trend analysis")
    entry_strategy: Dict[str, Any] = Field(..., description="Entry/exit recommendations")
    risk_management: Dict[str, Any] = Field(..., description="Risk management advice")
    social_strategy: str = Field(..., description="Social engagement recommendations")
    timeframe: Dict[str, str] = Field(..., description="Short-term and long-term outlook")
    confidence_score: int = Field(..., description="Strategy confidence from 1-10")

class NFTRewardOutput(BaseModel):
    eligible_players: List[Dict[str, Any]] = Field(..., description="Players eligible for NFT rewards")
    nft_metadata: List[Dict[str, Any]] = Field(..., description="NFT metadata for rewards")
    minting_status: Dict[str, Any] = Field(..., description="Minting transaction details")
    distribution_confirmations: List[str] = Field(..., description="Distribution confirmations")

class ChatbotOutput(BaseModel):
    user_question: str = Field(..., description="Original user question")
    response: str = Field(..., description="AI chatbot response")
    suggested_features: List[str] = Field(..., description="Related features or quests")
    disclaimer: Optional[str] = Field(None, description="Financial advice disclaimer if applicable")

@CrewBase
class SocialFiCrew():
    """SocialFi AI Agents Crew"""

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
            max_rpm=10
        )

    @agent
    def news_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["news_agent"],
            verbose=True,
            llm=gemini_llm,
            tools=[search_tool, scrape_tool, web_search_tool],
            max_rpm=10
        )

    @agent
    def social_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["social_agent"],
            verbose=True,
            llm=gemini_llm,
            tools=[search_tool, scrape_tool],
            max_rpm=10
        )
    
    @agent
    def strategy_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["strategy_agent"],
            verbose=True,
            llm=gemini_reasoning_llm,
            tools=[search_tool, scrape_tool],
            max_rpm=5
        )

    @agent
    def nft_reward_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["nft_reward_agent"],
            verbose=True,
            llm=gemini_llm,
            max_rpm=5
        )

    @agent
    def chatbot_ai(self) -> Agent:
        return Agent(
            config=self.agents_config["chatbot_ai"],
            verbose=True,
            llm=gemini_llm,
            tools=[search_tool, web_search_tool],
            max_rpm=15
        )

    @task
    def quest_generation(self) -> Task:
        return Task(
            config=self.tasks_config["quest_generation"],
            async_execution=True,
            output_json=QuestOutput,
            output_file="daily_quests.json"
        )

    @task
    def news_collection(self) -> Task:
        return Task(
            config=self.tasks_config["news_collection"],
            async_execution=True,
            output_json=NewsOutput,
            output_file="blockchain_news.json"
        )

    @task
    def social_sentiment_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["social_sentiment_analysis"],
            async_execution=True,
            output_json=SentimentOutput,
            output_file="sentiment_analysis.json"
        )
    
    @task
    def strategy_recommendation(self) -> Task:
        return Task(
            config=self.tasks_config["strategy_recommendation"],
            context=[self.news_collection(), self.social_sentiment_analysis()],
            output_json=StrategyOutput,
            output_file="strategy_recommendations.json"
        )

    @task
    def nft_reward_management(self) -> Task:
        return Task(
            config=self.tasks_config["nft_reward_management"],
            async_execution=True,
            output_json=NFTRewardOutput,
            output_file="nft_rewards.json"
        )

    @task
    def chatbot_response_generation(self) -> Task:
        return Task(
            config=self.tasks_config["chatbot_response_generation"],
            context=[self.news_collection(), self.social_sentiment_analysis(), self.strategy_recommendation()],
            output_json=ChatbotOutput,
            output_file="chatbot_responses.json"
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SocialFi AI crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.hierarchical,
            verbose=True,
            manager_llm=gemini_reasoning_llm
        )