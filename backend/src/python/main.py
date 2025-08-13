import sys
import json
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from crew import SocialFiCrew
# from crewai import Task  # Chỉ import khi cần test agent

# Thư mục chứa output
OUTPUT_DIR = Path("json")
OUTPUT_DIR.mkdir(exist_ok=True)

def get_today_str():
    """Lấy ngày hiện tại theo timezone Asia/Bangkok"""
    return datetime.now(ZoneInfo("Asia/Bangkok")).strftime('%Y-%m-%d')

def run():
    """
    Run the SocialFi crew with sample inputs
    """
    inputs = {
        'current_date': get_today_str(),
        'symbol': 'BTC',
        'user_question': 'What is the best strategy for trading BTC today?'
    }
    
    print(f"🚀 Starting SocialFi Crew Analysis for {inputs['current_date']}")
    print(f"📊 Analyzing cryptocurrency: {inputs['symbol']}")
    print("-" * 50)
    
    try:
        # Initialize the crew
        print("Initializing SocialFi Crew...")
        socialfi_crew = SocialFiCrew()
        crew = socialfi_crew.crew()
        
        print(f"✅ Crew initialized with {len(crew.agents)} agents and {len(crew.tasks)} tasks")
        print("Agents:", [agent.role for agent in crew.agents])
        print("Tasks:", [task.description[:50] + "..." for task in crew.tasks])
        
        # Run the crew
        print("🔄 Starting crew execution...")
        result = crew.kickoff(inputs=inputs)
        
        print("✅ Analysis completed successfully!")
        print("-" * 50)
        print("📋 Results:")
        print(result)
        
        # Output files to check
        output_files = [
            "daily_quests.json",
            "blockchain_news.json", 
            "sentiment_analysis.json",
            "strategy_recommendations.json",
            "nft_rewards.json",
            "chatbot_responses.json"
        ]
        
        print("\n📁 Output files generated:")
        for file in output_files:
            file_path = OUTPUT_DIR / file
            try:
                with open(file_path, 'r', encoding="utf-8") as f:
                    content = json.load(f)
                    print(f"  ✅ {file}")
                    print(f"     📝 Preview: {str(content)[:100]}...")
            except FileNotFoundError:
                print(f"  ❌ {file} not found")
            except json.JSONDecodeError:
                with open(file_path, 'r', encoding="utf-8") as f:
                    content = f.read()
                    print(f"  ⚠️ {file} (not valid JSON, {len(content)} chars)")
        
        return result
        
    except Exception as e:
        print(f"❌ Error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_individual_agents():
    """
    Test individual agents separately
    """
    try:
        print("🧪 Testing individual agents...")
        socialfi_crew = SocialFiCrew()
        
        # Danh sách test cho từng agent
        agent_tests = [
            ("Quest Agent", socialfi_crew.quest_agent, "Generate a simple daily quest for BTC prediction"),
            ("News Agent", socialfi_crew.news_agent, "Find latest BTC news from today"),
            ("Social Agent", socialfi_crew.social_agent, "Analyze BTC sentiment on social media"),
            ("Strategy Agent", socialfi_crew.strategy_agent, "Provide BTC trading strategy"),
            ("NFT Reward Agent", socialfi_crew.nft_reward_agent, "Create NFT reward for quest completion"),
            ("Chatbot AI", socialfi_crew.chatbot_ai, "Answer: What is Bitcoin?")
        ]
        
        from crewai import Task
        
        for name, agent_func, test_task in agent_tests:
            print(f"\n🤖 Testing {name}...")
            try:
                agent = agent_func()
                task = Task(
                    description=test_task,
                    expected_output=f"Response from {name}",
                    agent=agent
                )
                result = agent.execute_task(task)
                print(f"  ✅ {name}: {str(result)[:150]}...")
                
            except Exception as e:
                print(f"  ❌ {name} failed: {str(e)}")
        
        print("\n✅ Individual agent tests completed!")
        
    except Exception as e:
        print(f"❌ Individual test error: {str(e)}")
        import traceback
        traceback.print_exc()

def test_output_analysis():
    """
    Analyze existing output files
    """
    try:
        print("📊 Analyzing existing output files...")
        
        sentiment_file = OUTPUT_DIR / 'sentiment_analysis.json'
        with open(sentiment_file, 'r', encoding="utf-8") as f:
            sentiment_data = json.load(f)
            
        print(f"\n📈 Sentiment Analysis Results:")
        print(f"  Symbol: {sentiment_data.get('symbol')}")
        print(f"  Sentiment Score: {sentiment_data.get('sentiment_score')}/10")
        print(f"  Key Themes: {', '.join(sentiment_data.get('key_themes', []))}")
        print(f"  Trending Hashtags: {', '.join(sentiment_data.get('trending_hashtags', []))}")
        
        other_files = [
            "daily_quests.json",
            "blockchain_news.json",
            "strategy_recommendations.json",
            "nft_rewards.json",
            "chatbot_responses.json"
        ]
        
        for file in other_files:
            file_path = OUTPUT_DIR / file
            try:
                with open(file_path, 'r', encoding="utf-8") as f:
                    data = json.load(f)
                    print(f"\n📄 {file}: ✅ Valid JSON")
                    if isinstance(data, dict):
                        print(f"  Keys: {list(data.keys())}")
                    else:
                        print(f"  Type: {type(data).__name__}")
            except FileNotFoundError:
                print(f"\n📄 {file}: ❌ Not found")
            except json.JSONDecodeError as e:
                print(f"\n📄 {file}: ⚠️ Invalid JSON - {str(e)}")
                
    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")

def train():
    """
    Train the crew for better performance
    """
    inputs = {
        'current_date': get_today_str(),
        'symbol': 'ETH',
        'user_question': 'How should I diversify my crypto portfolio?'
    }
    
    try:
        socialfi_crew = SocialFiCrew()
        crew = socialfi_crew.crew()
        
        print("🎓 Training the crew...")
        crew.train(
            n_iterations=2, 
            filename="socialfi_training_data.pkl",
            inputs=inputs
        )
        print("✅ Training completed!")
        
    except Exception as e:
        print(f"❌ Training error: {str(e)}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'train':
            train()
        elif command == 'test':
            test_individual_agents()
        elif command == 'analyze':
            test_output_analysis()
        else:
            print("Available commands:")
            print("  python main_socialfi.py        - Run full crew")
            print("  python main_socialfi.py test   - Test individual agents")
            print("  python main_socialfi.py train  - Train the crew")
            print("  python main_socialfi.py analyze - Analyze output files")
    else:
        run()
