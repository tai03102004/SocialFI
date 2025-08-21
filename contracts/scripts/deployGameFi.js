const {
    ethers
} = require("hardhat");

async function main() {
    console.log("🚀 Simple GameFi deployment...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ZETA");

    const guiTokenAddress = "0xD59Da846F02A6C84D79C05F80CFB3B7ae2F21879";
    const aiOracleAddress = "0x9CD763b9a34c43123a70e69168C447C3dB1d51b7";

    try {
        // Deploy without waiting for full confirmation
        const GameFi = await ethers.getContractFactory("GameFiCore");
        console.log("📦 Deploying contract...");

        const gameFi = await GameFi.deploy(guiTokenAddress, aiOracleAddress, {
            gasLimit: 5000000,
            gasPrice: ethers.parseUnits("50", "gwei") // Higher gas price
        });

        const txHash = gameFi.deploymentTransaction().hash;
        console.log("Transaction hash:", txHash);

        // Get address immediately
        const gameFiAddress = await gameFi.getAddress();
        console.log("✅ Contract address:", gameFiAddress);

        console.log("\n🔧 Update frontend NOW with this address:");
        console.log(`GameFi: "${gameFiAddress}"`);

        console.log("\n⏳ You can check transaction status on:");
        console.log(`https://athens.explorer.zetachain.com/tx/${txHash}`);

        // Try to wait but don't fail if it times out
        try {
            console.log("⏳ Attempting to wait for confirmation (30s timeout)...");
            await Promise.race([
                gameFi.waitForDeployment(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), 30000)
                )
            ]);
            console.log("✅ Deployment confirmed!");
        } catch (waitError) {
            console.log("⚠️ Timeout waiting for confirmation, but contract address should be valid");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main().catch(console.error);