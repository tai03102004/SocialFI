export const CONTRACT_ADDRESSES = {
    ZETA_TESTNET: {
        GameFiCore: process.env.GAMEFI_CONTRACT_ADDRESS || "0x...",
        SocialFiCore: process.env.SOCIALFI_CONTRACT_ADDRESS || "0x...",
        GUIToken: process.env.GUITOKEN_CONTRACT_ADDRESS || "0x...",
        NFTAchievements: process.env.NFT_CONTRACT_ADDRESS || "0x...",
        Gateway: "0x6c533f7fe93fae114d0954697069df33c9b74fd7",
    },
};
// Simplified ABIs - chỉ những functions cần thiết
export const GAMEFI_ABI = [
    "function getPlayerStats(address player) external view returns (uint256 score, uint256 totalPredictions, uint256 stakedAmount, string memory preferredAsset)",
    "function getPrediction(uint256 predictionId) external view returns (address player, uint256 predictedPrice, uint256 actualPrice, uint256 timestamp, bool resolved, bool correct, string memory asset)",
    "function getPlayerPredictions(address player) external view returns (uint256[] memory)",
    "function makePrediction(uint256 predictedPrice, string memory asset) external",
    "function nextPredictionId() external view returns (uint256)",
    "event PredictionMade(address indexed player, uint256 indexed predictionId, uint256 predictedPrice, string asset)",
    "event PredictionResolved(uint256 indexed predictionId, uint256 actualPrice, bool correct)",
];
export const SOCIALFI_ABI = [
    "function getPost(uint256 postId) external view returns (uint256 id, address author, string memory content, uint256 timestamp, uint256 likes, uint256 chainId)",
    "function createPost(string memory content) external",
    "function likePost(uint256 postId) external",
    "function nextPostId() external view returns (uint256)",
    "event PostCreated(uint256 indexed postId, address indexed author, uint256 chainId)",
    "event PostLiked(uint256 indexed postId, address indexed liker)",
];
//# sourceMappingURL=contracts.js.map