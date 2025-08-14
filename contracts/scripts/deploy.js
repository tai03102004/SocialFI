const {
    ethers
} = require("hardhat");

async function main() {
    console.log("🚀 Deploying ZetaSocialFi contracts...");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    // ZetaChain Gateway address (testnet)
    const GATEWAY_ADDRESS = "0x3b188255700eb8fcf4bc8F604441AB3bb4a30163";

    try {
        // 1. Deploy GUI Token
        console.log("\n📄 Deploying GUIToken...");
        const GUIToken = await ethers.getContractFactory("GUIToken");
        const guiToken = await GUIToken.deploy();
        await guiToken.waitForDeployment();
        const guiTokenAddress = await guiToken.getAddress();
        console.log("✅ GUIToken deployed to:", guiTokenAddress);

        // 2. Deploy NFT Achievements
        console.log("\n🏆 Deploying NFTAchievements...");
        const NFTAchievements = await ethers.getContractFactory("NFTAchievements");
        const nftAchievements = await NFTAchievements.deploy(GATEWAY_ADDRESS);
        await nftAchievements.waitForDeployment();
        const nftAchievementsAddress = await nftAchievements.getAddress();
        console.log("✅ NFTAchievements deployed to:", nftAchievementsAddress);

        // 3. Deploy GameFi Core
        console.log("\n🎮 Deploying GameFiCore...");
        const GameFiCore = await ethers.getContractFactory("GameFiCore");
        const gameFiCore = await GameFiCore.deploy(GATEWAY_ADDRESS, guiTokenAddress);
        await gameFiCore.waitForDeployment();
        const gameFiCoreAddress = await gameFiCore.getAddress();
        console.log("✅ GameFiCore deployed to:", gameFiCoreAddress);

        // 4. Deploy SocialFi Core
        console.log("\n📱 Deploying SocialFiCore...");
        const SocialFiCore = await ethers.getContractFactory("SocialFiCore");
        const socialFiCore = await SocialFiCore.deploy(GATEWAY_ADDRESS, guiTokenAddress);
        await socialFiCore.waitForDeployment();
        const socialFiCoreAddress = await socialFiCore.getAddress();
        console.log("✅ SocialFiCore deployed to:", socialFiCoreAddress);

        // 5. Setup permissions
        console.log("\n⚙️ Setting up permissions...");

        // Add contracts as minters for GUI token
        await guiToken.addMinter(gameFiCoreAddress);
        await guiToken.addMinter(socialFiCoreAddress);
        console.log("✅ Minter permissions set");

        // Set NFT achievements address in GameFi
        await gameFiCore.setNFTAchievements(nftAchievementsAddress);
        await socialFiCore.setNFTAchievements(nftAchievementsAddress);
        console.log("✅ NFT achievements linked");

        // 6. Fund contracts with GUI tokens for rewards
        console.log("\n💰 Funding contracts...");
        const fundAmount = ethers.parseEther("1000000"); // 1M GUI tokens
        await guiToken.transfer(gameFiCoreAddress, fundAmount);
        await guiToken.transfer(socialFiCoreAddress, fundAmount);
        console.log("✅ Contracts funded with GUI tokens");

        // 7. Save deployment info
        const deploymentInfo = {
            network: hre.network.name,
            chainId: (await ethers.provider.getNetwork()).chainId.toString(),
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {
                GUIToken: guiTokenAddress,
                NFTAchievements: nftAchievementsAddress,
                GameFiCore: gameFiCoreAddress,
                SocialFiCore: socialFiCoreAddress,
                Gateway: GATEWAY_ADDRESS,
            },
        };

        // Write to file
        const fs = require('fs');
        const deploymentPath = `./deployments/${hre.network.name}.json`;

        // Create deployments directory if it doesn't exist
        if (!fs.existsSync('./deployments')) {
            fs.mkdirSync('./deployments');
        }

        fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

        console.log("\n🎉 Deployment completed successfully!");
        console.log("📄 Contract addresses:");
        console.log(`   GUIToken: ${guiTokenAddress}`);
        console.log(`   NFTAchievements: ${nftAchievementsAddress}`);
        console.log(`   GameFiCore: ${gameFiCoreAddress}`);
        console.log(`   SocialFiCore: ${socialFiCoreAddress}`);
        console.log(`\n📋 Deployment info saved to: ${deploymentPath}`);

        // Verification info
        console.log("\n🔍 To verify contracts, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${guiTokenAddress}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${nftAchievementsAddress} "${GATEWAY_ADDRESS}"`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${gameFiCoreAddress} "${GATEWAY_ADDRESS}" "${guiTokenAddress}"`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${socialFiCoreAddress} "${GATEWAY_ADDRESS}" "${guiTokenAddress}"`);

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });