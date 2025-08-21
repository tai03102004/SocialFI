# ZetaSocialFi - GameFi Multi-Chain DeFAI Platform

## 🎯 Overview

A revolutionary **GameFi platform** built on **ZetaChain** that combines cross-chain DeFi gaming with **AI-powered assistance**.

Players can:

- Predict crypto prices
- Complete AI-generated quizzes
- Chat with intelligent agents
- Earn NFT rewards

All **seamlessly across multiple blockchains** via **ZetaChain's Universal Smart Contracts**.

---

## 🏆 ZetaChain X Google Cloud Buildathon Features

### 🔗 Cross-Chain Innovation with ZetaChain

- **Universal Smart Contracts** → Game logic runs on ZetaChain, no bridges needed
- **Cross-Chain Asset Management** → Deposit from ETH, BNB, BTC, SOL; withdraw rewards on preferred chains
- **Unified Gaming Experience** → ZetaChain handles complexity, no manual bridging
- **Cross-Chain NFT Achievements** → Mint & transfer NFTs across chains

---

### 🤖 Advanced AI System - Google Gemini Integration (Special Prize)

Our platform features **6 specialized AI agents**, powered by **Google Gemini** and enhanced with **RAG** (Retrieval-Augmented Generation):

1. **Quest Agent** – Daily crypto quests & gamified challenges
2. **Market Analyst** – Blockchain news & on-chain intelligence
3. **Social Agent** – Social sentiment & trend analysis
4. **Technical Prediction Engine** – AI-powered TA & trading signals
5. **Strategy Agent** – Personalized Web3 investment advisor
6. **Community Support Manager** – Rewards & gamified support system

---

### 🧠 RAG-Enhanced AI Chat System

- **Vector Database**: ChromaDB with 18+ crypto knowledge docs
- **Knowledge Base**: Bitcoin, Ethereum, DeFi, GameFi, NFTs, strategies, risk mgmt.
- **GraphRAG Integration**: Entity mapping, graph-based insights
- **Conversational Features**: Real-time chat, memory, multi-modal responses

---

## 🔧 Technical Architecture

### Smart Contracts (Solidity on ZetaChain)

- `GameFiCore.sol` → Cross-chain logic, player stats, rewards
- `NFTAchievements.sol` → Minting, rarity tiers, cross-chain transfer
- `GuiToken.sol` → Utility token (staking, rewards, governance)
- `SocialFiCore.sol` → Leaderboards, social challenges, reputation system

### Python AI Infrastructure

```
src/python/
├── bridges/        # Agent connectors (quest, market, sentiment, etc.)
├── tools/          # LSTM prediction, TA indicators
├── config/         # Agent configs, GCP keys
└── crew.py         # CrewAI orchestrator
```

Pipeline: **Data ingestion → Agent processing → CrewAI orchestration → Gemini response → Smart contract action**

---

## 🎮 Gameplay Features

- **AI-Powered Price Predictions** – BTC/ETH/altcoins with coaching & risk advice
- **Dynamic Education** – Gemini-generated quizzes, adaptive difficulty
- **Social Trading** – Copy strategies, join tournaments
- **Cross-Chain Staking** – GUI tokens unlock premium AI features

---

## 🌐 Multi-Chain Ecosystem

| Blockchain | Integration Type    | Features                         | Status         |
| ---------- | ------------------- | -------------------------------- | -------------- |
| ZetaChain  | Universal Contracts | Core gaming logic, orchestration | ✅ Production  |
| Ethereum   | Universal App       | Deposits, NFT minting, DeFi      | ✅ Production  |
| BNB Chain  | Universal App       | Fast tx, DEX integration         | ✅ Production  |
| Bitcoin    | UniSat              | BTC deposits, Lightning          | ✅ Production  |
| Solana     | Cross-chain Bridge  | Solana NFTs                      | 🔄 Development |
| Polygon    | Layer 2             | Low-cost tx, assets              | 📅 Planned     |

---

## 🏅 Competitive Advantages

- 🚀 **First Universal GameFi App** on ZetaChain
- 🤖 **6 AI Agents** powered by Gemini + RAG
- 🌉 **True Cross-Chain Gaming** (no bridges)
- 📚 **Learn-to-Earn Model** (education + rewards)
- 👥 **Social Trading Integration**

---

## 🛠️ Technology Stack

**Blockchain**

- ZetaChain Universal Smart Contracts
- Solidity + Hardhat + OpenZeppelin

**AI / ML**

- Google Gemini + Vertex AI
- CrewAI (multi-agent orchestration)
- ChromaDB (vector DB)
- LSTM models + TA tools

**Frontend**

- Next.js 14 + TypeScript
- Tailwind CSS + Framer Motion
- Zustand for state mgmt.

**Infra**

- Google Cloud Platform
- PostgreSQL + ChromaDB
- Monitoring & multi-layer security

---

## 📊 Tokenomics

### \$GUI Token

- Rewards → Earn for predictions & quizzes
- Staking → Unlock premium AI & higher rewards
- Governance → Vote on features/agents
- Cross-chain liquidity

### NFT Achievements

- Tiers: Common / Rare / Epic / Legendary
- Cross-chain NFTs with tradable utility
- Unlock exclusive features & content

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Google Cloud + Gemini API keys
- ZetaChain testnet access

### Setup

```bash
# Clone repository
git clone https://github.com/your-repo/ZetaSocialFi
cd ZetaSocialFi

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cp .env.example .env
# Add your API keys and configuration
```

### Deploy Smart Contracts

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network zeta-testnet
```

### Start AI Services

```bash
cd backend/src/python
pip install -r requirements.txt
python crew.py
```

### Launch Frontend

```bash
cd frontend
npm run dev
```

---

## 📈 Roadmap

- **Phase 1 (Now)** → Core contracts, multi-agent AI, NFT system ✅
- **Phase 2 (Q2 2024)** → Advanced prediction, social trading, mobile app 🔄
- **Phase 3 (Q3 2024)** → Solana/Polygon integration, DAO governance 📅
- **Phase 4 (Q4 2024)** → Enterprise licensing, white-label solutions 📅

---

## 🤝 Contributing

We welcome community contributions!
Areas:

- Smart contract security
- AI agent features
- UX/UI improvements
- Cross-chain expansion

---

## 📄 License

MIT License – see `LICENSE` for details.

Built with ❤️ for the **ZetaChain X Google Cloud Buildathon**
