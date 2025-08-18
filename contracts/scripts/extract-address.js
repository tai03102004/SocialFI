// scripts/extract-address.js
const {
    ethers
} = require("hardhat");

async function main() {
    const txHash = "0x6746874c7b413fb032d720d65607713e8c7e969b5f42e49e981a814a747b56a8";

    console.log("🔍 Extracting GUIToken address...");

    try {
        const receipt = await ethers.provider.getTransactionReceipt(txHash);

        if (receipt && receipt.contractAddress) {
            const guiTokenAddress = receipt.contractAddress;
            console.log("✅ GUIToken Address:", guiTokenAddress);

            // Test contract
            const contract = new ethers.Contract(
                guiTokenAddress,
                ["function name() view returns (string)", "function symbol() view returns (string)"],
                ethers.provider
            );

            const name = await contract.name();
            const symbol = await contract.symbol();
            console.log("Name:", name);
            console.log("Symbol:", symbol);

            console.log("\n📋 Update your CONTRACT_ADDRESSES:");
            console.log(`GUIToken: "${guiTokenAddress}",`);

            return guiTokenAddress;
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main().catch(console.error);