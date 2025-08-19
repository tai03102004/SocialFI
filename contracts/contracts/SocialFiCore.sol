// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AIOracle.sol"; // Assuming AIOracle is in the same directory

contract SocialFiCore is Ownable {
    address public guiToken;
    address public aiOracle;

    struct Post {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        uint256 aiSentimentScore;
        bool isAIGenerated;
    }

    struct UserProfile {
        address userAddress;
        uint256 totalPosts;
        uint256 socialScore;
        uint256 aiAlignmentScore;
    }

    mapping(uint256 => Post) public posts;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) public userPosts;
    mapping(address => mapping(uint256 => bool)) public hasLikedPost;

    uint256 public nextPostId = 1;
    uint256 public constant POST_REWARD = 10 * 1e18;
    uint256 public constant LIKE_REWARD = 1 * 1e18;

    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        uint256 aiSentiment
    );
    event PostLiked(uint256 indexed postId, address indexed liker);

    constructor(address _guiToken, address _aiOracle) Ownable(msg.sender) {
        guiToken = _guiToken;
        aiOracle = _aiOracle;
    }

    function createPost(string memory content) external {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(bytes(content).length <= 280, "Content too long");

        // Get AI sentiment
        SimpleAIOracle.AIData memory aiSocial = SimpleAIOracle(aiOracle)
            .getAIData("BTC", "social"); // Default to BTC social sentiment

        uint256 postId = nextPostId++;

        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp,
            likes: 0,
            aiSentimentScore: aiSocial.sentimentScore,
            isAIGenerated: false
        });

        userPosts[msg.sender].push(postId);
        userProfiles[msg.sender].totalPosts++;
        userProfiles[msg.sender].socialScore += 10;

        uint256 reward = POST_REWARD;

        // Bonus for bullish sentiment alignment
        if (aiSocial.sentimentScore >= 7) {
            reward += 5 * 1e18;
            userProfiles[msg.sender].aiAlignmentScore += 5;
        }

        IERC20(guiToken).transfer(msg.sender, reward);

        emit PostCreated(postId, msg.sender, aiSocial.sentimentScore);
    }

    function likePost(uint256 postId) external {
        require(posts[postId].id != 0, "Post not found");
        require(!hasLikedPost[msg.sender][postId], "Already liked");

        hasLikedPost[msg.sender][postId] = true;
        posts[postId].likes++;

        // Reward both liker and author
        IERC20(guiToken).transfer(msg.sender, LIKE_REWARD);
        IERC20(guiToken).transfer(posts[postId].author, LIKE_REWARD);

        userProfiles[posts[postId].author].socialScore += 2;

        emit PostLiked(postId, msg.sender);
    }

    // 📊 View functions
    function getPost(uint256 postId) external view returns (Post memory) {
        return posts[postId];
    }

    function getUserProfile(
        address user
    ) external view returns (UserProfile memory) {
        return userProfiles[user];
    }

    function getUserPosts(
        address user
    ) external view returns (uint256[] memory) {
        return userPosts[user];
    }

    function getRecentPosts(
        uint256 count
    ) external view returns (uint256[] memory) {
        uint256 totalPosts = nextPostId - 1;
        uint256 returnCount = count > totalPosts ? totalPosts : count;

        uint256[] memory recentPosts = new uint256[](returnCount);

        for (uint256 i = 0; i < returnCount; i++) {
            recentPosts[i] = totalPosts - i;
        }

        return recentPosts;
    }
}
