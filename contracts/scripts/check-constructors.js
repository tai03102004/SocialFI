// scripts/check-constructors.js
const {
    ethers
} = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🔍 Checking contract constructors...");

    try {
        // Get contract factories to inspect constructors
        const contracts = [
            'GUIToken',
            'NFTAchievements',
            'GameFiCore',
            'SocialFiCore'
        ];

        for (const contractName of contracts) {
            try {
                console.log(`\n📋 ${contractName} Constructor:`);

                const ContractFactory = await ethers.getContractFactory(contractName);
                const contractInterface = ContractFactory.interface;

                // Get constructor function
                const constructor = contractInterface.getFunction('constructor');
                if (constructor) {
                    console.log(`   Parameters (${constructor.inputs.length}):`);
                    constructor.inputs.forEach((input, index) => {
                        console.log(`     ${index + 1}. ${input.name || 'param' + index}: ${input.type}`);
                    });
                } else {
                    console.log("   No explicit constructor (default)");
                }

                // Check if artifacts exist
                const artifactPath = `./artifacts/contracts/${contractName}.sol/${contractName}.json`;
                if (fs.existsSync(artifactPath)) {
                    console.log("   ✅ Artifact exists");
                } else {
                    console.log("   ❌ Artifact missing");
                }

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        }

        // Check specific contracts that might have issues
        console.log("\n🔧 Deployment suggestions:");

        // Try to get more details about NFTAchievements
        try {
            const NFTAchievements = await ethers.getContractFactory("NFTAchievements");
            const deployTransaction = await NFTAchievements.getDeployTransaction();
            console.log("NFTAchievements deploy data length:", deployTransaction.data.length);
        } catch (error) {
            console.log("NFTAchievements deploy check failed:", error.message);
        }

    } catch (error) {
        console.error("❌ Constructor check failed:", error.message);
    }
}

main().catch(console.error);