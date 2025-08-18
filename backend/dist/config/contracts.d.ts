export declare const CONTRACT_ADDRESSES: {
    ZETA_TESTNET: {
        GameFiCore: string;
        SocialFiCore: string;
        GUIToken: string;
        NFTAchievements: string;
        Gateway: string;
    };
};
export declare const GAMEFI_ABI: readonly ["function getPlayerStats(address player) external view returns (uint256 score, uint256 totalPredictions, uint256 stakedAmount, string memory preferredAsset)", "function getPrediction(uint256 predictionId) external view returns (address player, uint256 predictedPrice, uint256 actualPrice, uint256 timestamp, bool resolved, bool correct, string memory asset)", "function getPlayerPredictions(address player) external view returns (uint256[] memory)", "function makePrediction(uint256 predictedPrice, string memory asset) external", "function nextPredictionId() external view returns (uint256)", "event PredictionMade(address indexed player, uint256 indexed predictionId, uint256 predictedPrice, string asset)", "event PredictionResolved(uint256 indexed predictionId, uint256 actualPrice, bool correct)"];
export declare const SOCIALFI_ABI: readonly ["function getPost(uint256 postId) external view returns (uint256 id, address author, string memory content, uint256 timestamp, uint256 likes, uint256 chainId)", "function createPost(string memory content) external", "function likePost(uint256 postId) external", "function nextPostId() external view returns (uint256)", "event PostCreated(uint256 indexed postId, address indexed author, uint256 chainId)", "event PostLiked(uint256 indexed postId, address indexed liker)"];
//# sourceMappingURL=contracts.d.ts.map