// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface INFTAchievements {
    function checkAndMintAchievements(
        address player,
        uint256 totalPredictions,
        uint256 correctPredictions,
        uint256 currentStreak,
        uint256 quizCount
    ) external;
}

contract SocialFiCore is UniversalContract, Ownable, ReentrancyGuard {
    IGatewayZEVM public immutable gateway;
    address public immutable guiToken;
    address public nftAchievements;

    struct Post {
        uint256 id;
        address author;
        string content;
        string imageHash;
        uint256 timestamp;
        uint256 likes;
        uint256 comments;
        bool isActive;
        uint256 chainId;
    }

    struct Comment {
        uint256 id;
        uint256 postId;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    struct UserProfile {
        address userAddress;
        string username;
        string bio;
        string avatarHash;
        uint256 followers;
        uint256 following;
        uint256 totalPosts;
        uint256 socialScore;
        uint256 joinedAt;
        bool isVerified;
    }

    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) public comments;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => mapping(address => bool)) public isFollowing;
    mapping(address => mapping(uint256 => bool)) public hasLikedPost;
    mapping(address => mapping(uint256 => bool)) public hasLikedComment;
    mapping(address => uint256[]) public userPosts;
    mapping(uint256 => uint256[]) public postComments;

    uint256 public nextPostId = 1;
    uint256 public nextCommentId = 1;
    uint256 public constant POST_REWARD = 10 * 1e18; // 10 GUI tokens
    uint256 public constant LIKE_REWARD = 1 * 1e18; // 1 GUI token
    uint256 public constant COMMENT_REWARD = 5 * 1e18; // 5 GUI tokens

    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        uint256 chainId
    );
    event PostLiked(
        uint256 indexed postId,
        address indexed liker,
        uint256 totalLikes
    );
    event CommentAdded(
        uint256 indexed commentId,
        uint256 indexed postId,
        address indexed author
    );
    event UserFollowed(address indexed follower, address indexed following);
    event ProfileUpdated(address indexed user);
    event RewardDistributed(
        address indexed user,
        uint256 amount,
        string action
    );

    constructor(address _gateway, address _guiToken) {
        gateway = IGatewayZEVM(_gateway);
        guiToken = _guiToken;
    }

    function setNFTAchievements(address _nftAchievements) external onlyOwner {
        nftAchievements = _nftAchievements;
    }

    function onCall(
        MessageContext calldata context,
        address zrc20,
        uint256 amount,
        bytes calldata message
    ) external override onlyGateway {
        (uint8 action, bytes memory data) = abi.decode(message, (uint8, bytes));

        if (action == 1) {
            // Create post
            (string memory content, string memory imageHash) = abi.decode(
                data,
                (string, string)
            );
            _createPost(context.sender, content, imageHash, context.chainID);
        } else if (action == 2) {
            // Like post
            uint256 postId = abi.decode(data, (uint256));
            _likePost(context.sender, postId);
        } else if (action == 3) {
            // Add comment
            (uint256 postId, string memory content) = abi.decode(
                data,
                (uint256, string)
            );
            _addComment(context.sender, postId, content);
        } else if (action == 4) {
            // Follow user
            address userToFollow = abi.decode(data, (address));
            _followUser(context.sender, userToFollow);
        } else if (action == 5) {
            // Update profile
            (
                string memory username,
                string memory bio,
                string memory avatarHash
            ) = abi.decode(data, (string, string, string));
            _updateProfile(context.sender, username, bio, avatarHash);
        }
    }

    function onRevert(
        RevertContext calldata revertContext
    ) external override onlyGateway {
        // Handle revert logic
    }

    function _createPost(
        address author,
        string memory content,
        string memory imageHash,
        uint256 chainId
    ) internal {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(bytes(content).length <= 280, "Content too long");

        uint256 postId = nextPostId++;

        posts[postId] = Post({
            id: postId,
            author: author,
            content: content,
            imageHash: imageHash,
            timestamp: block.timestamp,
            likes: 0,
            comments: 0,
            isActive: true,
            chainId: chainId
        });

        userPosts[author].push(postId);
        userProfiles[author].totalPosts++;
        userProfiles[author].socialScore += 10;

        // Reward user for creating post
        IERC20(guiToken).transfer(author, POST_REWARD);

        emit PostCreated(postId, author, chainId);
        emit RewardDistributed(author, POST_REWARD, "post_created");
    }

    function _likePost(address liker, uint256 postId) internal {
        require(posts[postId].isActive, "Post not found");
        require(!hasLikedPost[liker][postId], "Already liked");

        hasLikedPost[liker][postId] = true;
        posts[postId].likes++;

        // Reward both liker and post author
        IERC20(guiToken).transfer(liker, LIKE_REWARD);
        IERC20(guiToken).transfer(posts[postId].author, LIKE_REWARD);

        userProfiles[posts[postId].author].socialScore += 2;

        emit PostLiked(postId, liker, posts[postId].likes);
        emit RewardDistributed(liker, LIKE_REWARD, "like_given");
        emit RewardDistributed(
            posts[postId].author,
            LIKE_REWARD,
            "like_received"
        );
    }

    function _addComment(
        address author,
        uint256 postId,
        string memory content
    ) internal {
        require(posts[postId].isActive, "Post not found");
        require(bytes(content).length > 0, "Comment cannot be empty");

        uint256 commentId = nextCommentId++;

        comments[commentId] = Comment({
            id: commentId,
            postId: postId,
            author: author,
            content: content,
            timestamp: block.timestamp,
            likes: 0
        });

        postComments[postId].push(commentId);
        posts[postId].comments++;
        userProfiles[author].socialScore += 5;

        // Reward commenter
        IERC20(guiToken).transfer(author, COMMENT_REWARD);

        emit CommentAdded(commentId, postId, author);
        emit RewardDistributed(author, COMMENT_REWARD, "comment_added");
    }

    function _followUser(address follower, address userToFollow) internal {
        require(follower != userToFollow, "Cannot follow yourself");
        require(!isFollowing[follower][userToFollow], "Already following");

        isFollowing[follower][userToFollow] = true;
        userProfiles[userToFollow].followers++;
        userProfiles[follower].following++;

        // Small reward for social engagement
        IERC20(guiToken).transfer(follower, LIKE_REWARD);

        emit UserFollowed(follower, userToFollow);
        emit RewardDistributed(follower, LIKE_REWARD, "user_followed");
    }

    function _updateProfile(
        address user,
        string memory username,
        string memory bio,
        string memory avatarHash
    ) internal {
        UserProfile storage profile = userProfiles[user];

        if (profile.userAddress == address(0)) {
            profile.userAddress = user;
            profile.joinedAt = block.timestamp;
        }

        profile.username = username;
        profile.bio = bio;
        profile.avatarHash = avatarHash;

        emit ProfileUpdated(user);
    }

    function getPost(uint256 postId) external view returns (Post memory) {
        return posts[postId];
    }

    function getComment(
        uint256 commentId
    ) external view returns (Comment memory) {
        return comments[commentId];
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

    function getPostComments(
        uint256 postId
    ) external view returns (uint256[] memory) {
        return postComments[postId];
    }

    function getRecentPosts(
        uint256 limit
    ) external view returns (uint256[] memory) {
        uint256 total = nextPostId - 1;
        uint256 count = limit > total ? total : limit;
        uint256[] memory result = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = total; i > 0 && index < count; i--) {
            if (posts[i].isActive) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }

    modifier onlyGateway() {
        require(msg.sender == address(gateway), "Only gateway");
        _;
    }
}
