import sys
import json
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from crew import SocialFiCrew

# Thư mục chứa output
OUTPUT_DIR = Path("json")
OUTPUT_DIR.mkdir(exist_ok=True)

def get_today_str():
    """Lấy ngày hiện tại theo timezone Asia/Bangkok"""
    return datetime.now(ZoneInfo("Asia/Bangkok")).strftime('%Y-%m-%d')

def run_full_crew():
    """Run the complete SocialFi crew analysis"""
    inputs = {
        'current_date': get_today_str(),
        'symbol': 'BTC',
        'user_question': 'What is the best strategy for trading BTC today?'
    }
    
    print(f"🚀 SocialFi Crew Analysis - {inputs['current_date']} | Symbol: {inputs['symbol']}")
    
    try:
        socialfi_crew = SocialFiCrew()
        crew = socialfi_crew.crew()
        
        print(f"✅ Initialized: {len(crew.agents)} agents, {len(crew.tasks)} tasks")
        
        result = crew.kickoff(inputs=inputs)
        
        print("✅ Analysis completed!")
        print(f"📋 Result: {str(result)[:200]}...")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def test_single_agent(agent_name="quest_agent"):
    """Test a single agent quickly"""
    try:
        print(f"🧪 Testing {agent_name}...")
        
        socialfi_crew = SocialFiCrew()
        
        # Get the agent method
        agent_method = getattr(socialfi_crew, agent_name)
        agent = agent_method()
        
        # Simple test task
        from crewai import Task
        test_task = Task(
            description=f"Generate a brief analysis for BTC on {get_today_str()}",
            expected_output="Brief analysis response",
            agent=agent
        )
        
        result = agent.execute_task(test_task)
        print(f"✅ {agent_name}: {str(result)[:150]}...")
        
        return result
        
    except Exception as e:
        print(f"❌ {agent_name} test failed: {str(e)}")
        return None

def check_outputs():
    """Quick check of output files"""
    output_files = [
        "daily_quests.json",
        "market_analysis.json",
        "sentiment_analysis.json", 
        "strategy_recommendations.json",
        "technical_predictions.json",
        "community_support.json"
    ]
    
    print("📁 Output Status:")
    for file in output_files:
        file_path = OUTPUT_DIR / file
        if file_path.exists():
            try:
                with open(file_path, 'r', encoding="utf-8") as f:
                    data = json.load(f)
                print(f"  ✅ {file}")
            except json.JSONDecodeError:
                print(f"  ⚠️ {file} (invalid JSON)")
        else:
            print(f"  ❌ {file} (missing)")

def quick_test():
    """Quick test with minimal agents"""
    inputs = {
        'current_date': get_today_str(),
        'symbol': 'ETH', 
        'user_question': 'Should I buy ETH now?'
    }
    
    print(f"⚡ Quick Test - {inputs['symbol']}")
    
    try:
        # Test just quest and sentiment agents
        test_single_agent("quest_agent")
        test_single_agent("social_agent")
        
        print("✅ Quick test completed!")
        
    except Exception as e:
        print(f"❌ Quick test error: {str(e)}")

def main():
    """Main function with simple command handling"""
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'full':
            run_full_crew()
        elif command == 'test':
            agent_name = sys.argv[2] if len(sys.argv) > 2 else "quest_agent"
            test_single_agent(agent_name)
        elif command == 'quick':
            quick_test()
        elif command == 'check':
            check_outputs()
        else:
            print("Usage:")
            print("  python main.py full                    - Run complete crew")
            print("  python main.py test [agent_name]       - Test single agent")
            print("  python main.py quick                   - Quick test 2 agents")
            print("  python main.py check                   - Check output files")
    else:
        # Default: run full crew
        run_full_crew()

if __name__ == '__main__':
    main()