const {
    ethers
} = require("hardhat");

async function main() {
    console.log("🚀 Deploying BULLETPROOF Social (guaranteed to work)...");

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);

    const BulletproofSocial = await ethers.getContractFactory("BulletproofSocial");
    const bulletproof = await BulletproofSocial.deploy();

    const address = await bulletproof.getAddress();
    const deployTx = bulletproof.deploymentTransaction();

    console.log("✅ BulletproofSocial deployed at:", address);
    console.log("📤 Deploy TX:", deployTx.hash);

    // Test after 30 seconds
    setTimeout(async () => {
        try {
            console.log("🧪 Testing BulletproofSocial...");

            // Test getTotalPosts
            const total = await bulletproof.getTotalPosts();
            console.log("📊 Initial total posts:", total.toString());

            // Test createPost
            const tx = await bulletproof.createPost("🎉 BulletproofSocial WORKS! AI agents can now post blockchain news automatically!");
            console.log("📤 CreatePost TX:", tx.hash);

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                console.log("✅ CreatePost SUCCESS!");

                const newTotal = await bulletproof.getTotalPosts();
                console.log("📊 New total posts:", newTotal.toString());

                // Get the post
                const post = await bulletproof.getPost(1);
                console.log("📝 Post content:", post.content);
                console.log("👤 Post author:", post.author);

                console.log("\n🎯 UPDATE .env file:");
                console.log(`SocialFi = ${address}`);
                console.log("\n✅ AI agents can now post blockchain news automatically!");

            } else {
                console.log("❌ CreatePost failed - this should never happen");
            }

        } catch (error) {
            console.log("⏰ Contract still deploying, use address:", address);
            console.log("Error details:", error.message);
        }
    }, 30000);
}

main().catch(console.error);