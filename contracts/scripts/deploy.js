// scripts/deploy-with-retry.js
const {
    ethers
} = require("hardhat");

// Helper function để deploy với retry
async function deployWithRetry(contractFactory, args = [], maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`🔄 Deploying ${contractFactory.constructor.name} (attempt ${i + 1}/${maxRetries})...`);

            const contract = await contractFactory.deploy(...args);

            // Thay vì waitForDeployment(), chúng ta sẽ check manually
            console.log(`📤 Transaction sent: ${contract.deploymentTransaction().hash}`);

            // Chờ transaction được mine với timeout
            const receipt = await waitForTransactionWithTimeout(
                contract.deploymentTransaction().hash,
                120000 // 2 minutes timeout
            );

            if (receipt) {
                console.log(`✅ Contract deployed successfully at: ${await contract.getAddress()}`);
                return contract;
            } else {
                throw new Error("Transaction timeout");
            }

        } catch (error) {
            console.log(`❌ Attempt ${i + 1} failed:`, error.message);

            if (i === maxRetries - 1) {
                throw error;
            }

            // Chờ trước khi retry
            console.log("⏳ Waiting before retry...");
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

// Helper function để chờ transaction với timeout
async function waitForTransactionWithTimeout(txHash, timeoutMs = 120000) {
    const provider = ethers.provider;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
        try {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (receipt) {
                console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
                return receipt;
            }
        } catch (error) {
            // Ignore errors and continue polling
        }

        // Chờ 5 giây trước khi check lại
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log("🔍 Checking transaction status...");
    }

    console.log("⏰ Transaction timeout reached");
    return null;
}

// Helper function để thực hiện transaction với retry
async function executeTransactionWithRetry(txPromise, description, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`🔄 ${description} (attempt ${i + 1}/${maxRetries})...`);

            const tx = await txPromise();
            console.log(`📤 Transaction sent: ${tx.hash}`);

            const receipt = await waitForTransactionWithTimeout(tx.hash, 120000);

            if (receipt) {
                console.log(`✅ ${description} completed successfully`);
                return receipt;
            } else {
                throw new Error("Transaction timeout");
            }

        } catch (error) {
            console.log(`❌ Attempt ${i + 1} failed:`, error.message);

            if (i === maxRetries - 1) {
                throw error;
            }

            console.log("⏳ Waiting before retry...");
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

async function main() {
    console.log("🚀 Deploying contracts with retry logic...");

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deploying with account:", deployer.address);

    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

    try {
        // 1. Deploy GUIToken
        const GUIToken = await ethers.getContractFactory("GUIToken");
        const guiToken = await deployWithRetry(GUIToken);

        // 2. Deploy AIOracle
        const AIOracle = await ethers.getContractFactory("SimpleAIOracle");
        const aiOracle = await deployWithRetry(AIOracle);

        // 3. Deploy GameFi
        const GameFi = await ethers.getContractFactory("GameFiCore");
        const gameFi = await deployWithRetry(GameFi, [
            await guiToken.getAddress(),
            await aiOracle.getAddress()
        ]);

        // 4. Deploy SocialFi
        const SocialFi = await ethers.getContractFactory("SocialFiCore");
        const socialFi = await deployWithRetry(SocialFi, [
            await guiToken.getAddress(),
            await aiOracle.getAddress()
        ]);

        // 5. Deploy NFT Achievements
        const NFT = await ethers.getContractFactory("NFTAchievements");
        const nftAchievements = await deployWithRetry(NFT);

        // 6. Setup permissions
        console.log("🔧 Setting up permissions...");

        // Add GameFi and SocialFi as minters for GUI token
        await executeTransactionWithRetry(
            () => guiToken.addMinter(gameFi.target),
            "Adding GameFi as minter"
        );

        await executeTransactionWithRetry(
            () => guiToken.addMinter(socialFi.target),
            "Adding SocialFi as minter"
        );

        // Add bridge as authorized agent for AI Oracle
        await executeTransactionWithRetry(
            () => aiOracle.addAuthorizedAgent(deployer.address),
            "Adding bridge authorization"
        );

        // 7. Save addresses
        const addresses = {
            GUIToken: await guiToken.getAddress(),
            AIOracle: await aiOracle.getAddress(),
            GameFi: await gameFi.getAddress(),
            SocialFi: await socialFi.getAddress(),
            NFTAchievements: await nftAchievements.getAddress(),
            deployer: deployer.address
        };

        console.log("\n📝 Contract Addresses:");
        console.log(JSON.stringify(addresses, null, 2));

        // Save to file
        const fs = require('fs');
        fs.writeFileSync('./contract-addresses.json', JSON.stringify(addresses, null, 2));
        console.log("✅ Addresses saved to contract-addresses.json");

        console.log("\n🎉 All contracts deployed successfully!");

    } catch (error) {
        console.error("\n💥 Deployment failed:", error.message);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });