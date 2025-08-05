import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting deployment to ZetaChain...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // ZetaChain Gateway address (testnet)
  const GATEWAY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  // Deploy GUI Token first
  console.log("\n📄 Deploying GUIToken...");
  const GUIToken = await ethers.getContractFactory("GUIToken");
  const guiToken = await GUIToken.deploy();
  await guiToken.waitForDeployment();
  const guiTokenAddress = await guiToken.getAddress();
  console.log("✅ GUIToken deployed to:", guiTokenAddress);

  // Deploy GameFiCore
  console.log("\n📄 Deploying GameFiCore...");
  const GameFiCore = await ethers.getContractFactory("GameFiCore");
  const gameFiCore = await GameFiCore.deploy(GATEWAY_ADDRESS, guiTokenAddress);
  await gameFiCore.waitForDeployment();
  const gameFiCoreAddress = await gameFiCore.getAddress();
  console.log("✅ GameFiCore deployed to:", gameFiCoreAddress);

  // Deploy NFTAchievements
  console.log("\n📄 Deploying NFTAchievements...");
  const NFTAchievements = await ethers.getContractFactory("NFTAchievements");
  const nftAchievements = await NFTAchievements.deploy(GATEWAY_ADDRESS);
  await nftAchievements.waitForDeployment();
  const nftAchievementsAddress = await nftAchievements.getAddress();
  console.log("✅ NFTAchievements deployed to:", nftAchievementsAddress);

  // Set up permissions
  console.log("\n🔧 Setting up permissions...");

  // Add GameFiCore as minter for GUI token
  await guiToken.addMinter(gameFiCoreAddress);
  console.log("✅ GameFiCore added as GUI token minter");

  // Save deployment addresses
  const deploymentInfo = {
    network: "zetachain-testnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      GUIToken: guiTokenAddress,
      GameFiCore: gameFiCoreAddress,
      NFTAchievements: nftAchievementsAddress,
      Gateway: GATEWAY_ADDRESS,
    },
    transactionHashes: {
      GUIToken: guiToken.deploymentTransaction()?.hash,
      GameFiCore: gameFiCore.deploymentTransaction()?.hash,
      NFTAchievements: nftAchievements.deploymentTransaction()?.hash,
    },
  };

  // Save to file
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, "zetachain-testnet.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Create .env template with deployment addresses
  const envContent = `
# Contract Addresses (Auto-generated)
NEXT_PUBLIC_GUI_TOKEN_ADDRESS=${guiTokenAddress}
NEXT_PUBLIC_GAMEFI_CORE_ADDRESS=${gameFiCoreAddress}
NEXT_PUBLIC_NFT_ACHIEVEMENTS_ADDRESS=${nftAchievementsAddress}
NEXT_PUBLIC_GATEWAY_ADDRESS=${GATEWAY_ADDRESS}
NEXT_PUBLIC_ZETACHAIN_CHAIN_ID=7001

# Add your private keys and API keys below
PRIVATE_KEY=your_private_key_here
GOOGLE_AI_API_KEY=your_gemini_api_key
`;

  fs.writeFileSync(path.join(__dirname, "..", ".env.deployment"), envContent);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Deployment summary:");
  console.log("   - GUIToken:", guiTokenAddress);
  console.log("   - GameFiCore:", gameFiCoreAddress);
  console.log("   - NFTAchievements:", nftAchievementsAddress);
  console.log("\n📄 Deployment info saved to:", deploymentFile);
  console.log("📄 Environment template saved to: .env.deployment");
  console.log("\n🔧 Next steps:");
  console.log("   1. Copy .env.deployment to .env and add your API keys");
  console.log("   2. Update frontend/backend with contract addresses");
  console.log("   3. Start the development server: npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
