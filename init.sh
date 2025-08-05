#!/bin/bash

echo "🚀 Initializing GameFi Multi-Chain DeFAI Platform..."

# Create main project directory
mkdir -p GameFi
cd GameFi

# Initialize main package.json
npm init -y

# Create directory structure
mkdir -p contracts
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/hooks
mkdir -p frontend/src/utils
mkdir -p backend/src/services
mkdir -p backend/src/routes
mkdir -p scripts
mkdir -p docs

echo "📁 Directory structure created"

# Install Hardhat and dependencies
echo "📦 Installing Hardhat and blockchain dependencies..."
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @typechain/hardhat typescript ts-node
npm install @zetachain/protocol-contracts @zetachain/toolkit @openzeppelin/contracts
npm install ethers dotenv

# Initialize Hardhat project
npx hardhat init --typescript

echo "⚡ Hardhat initialized"

# Create frontend
echo "🎨 Setting up Next.js frontend..."
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install frontend dependencies
npm install wagmi viem @rainbow-me/rainbowkit
npm install @google/generative-ai
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs

cd ..

# Create backend
echo "🔧 Setting up Express backend..."
cd backend
npm init -y
npm install express cors helmet morgan dotenv
npm install @google/generative-ai axios
npm install --save-dev @types/express @types/cors @types/node typescript ts-node nodemon

cd ..

echo "✅ Project initialization complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the .env.example and configure your environment variables"
echo "2. Add your private keys and API keys to .env"
echo "3. Deploy contracts: npm run deploy"
echo "4. Start development: npm run dev"
