// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SocialFiCore is UniversalContract, Ownable {
    IGatewayZEVM public immutable gateway;
    address public immutable guiToken;

    struct Post {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        uint256 chainId;
    }

    struct UserProfile {
        address userAddress;
        string username;
        uint256 followers;
        uint256 totalPosts;
        uint256 socialScore;
    }

    mapping(uint256 => Post) public posts;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => mapping(uint256 => bool)) public hasLikedPost;
    mapping(address => uint256[]) public userPosts;

    uint256 public nextPostId = 1;
    uint256 public constant POST_REWARD = 10 * 1e18; // 10 GUI tokens
    uint256 public constant LIKE_REWARD = 1 * 1e18; // 1 GUI token

    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        uint256 chainId
    );
    event PostLiked(uint256 indexed postId, address indexed liker);
    event CrossChainSocialReward(
        address indexed user,
        uint256 amount,
        uint256 targetChain
    );

    constructor(address _gateway, address _guiToken) Ownable(msg.sender) {
        gateway = IGatewayZEVM(_gateway);
        guiToken = _guiToken;
    }

    // Cross-chain entry point
    function onCall(
        MessageContext calldata context,
        address zrc20,
        uint256 amount,
        bytes calldata message
    ) external onlyGateway {
        (uint8 action, bytes memory data) = abi.decode(message, (uint8, bytes));

        // Convert bytes to address properly
        address sender = address(
            uint160(uint256(keccak256(context.sender)) >> 96)
        );

        if (action == 1) {
            // Create post
            string memory content = abi.decode(data, (string));
            _createPost(sender, content, context.chainID);
        } else if (action == 2) {
            // Like post
            uint256 postId = abi.decode(data, (uint256));
            _likePost(sender, postId);
        } else if (action == 3) {
            // Claim social rewards cross-chain
            uint256 targetChain = abi.decode(data, (uint256));
            _claimSocialRewardsCrossChain(sender, zrc20, targetChain);
        }
    }

    function onRevert(
        RevertContext calldata revertContext
    ) external onlyGateway {
        // Handle revert logic for cross-chain operations
    }

    // Direct functions for same-chain interactions
    function createPost(string memory content) external {
        _createPost(msg.sender, content, block.chainid);
    }

    function likePost(uint256 postId) external {
        _likePost(msg.sender, postId);
    }

    function _createPost(
        address author,
        string memory content,
        uint256 chainId
    ) internal {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(bytes(content).length <= 280, "Content too long");

        uint256 postId = nextPostId++;

        posts[postId] = Post({
            id: postId,
            author: author,
            content: content,
            timestamp: block.timestamp,
            likes: 0,
            chainId: chainId
        });

        userPosts[author].push(postId);
        userProfiles[author].totalPosts++;
        userProfiles[author].socialScore += 10;

        // Reward user for creating post
        IERC20(guiToken).transfer(author, POST_REWARD);

        emit PostCreated(postId, author, chainId);
    }

    function _likePost(address liker, uint256 postId) internal {
        require(posts[postId].id != 0, "Post not found");
        require(!hasLikedPost[liker][postId], "Already liked");

        hasLikedPost[liker][postId] = true;
        posts[postId].likes++;

        // Reward both liker and post author
        IERC20(guiToken).transfer(liker, LIKE_REWARD);
        IERC20(guiToken).transfer(posts[postId].author, LIKE_REWARD);

        userProfiles[posts[postId].author].socialScore += 2;

        emit PostLiked(postId, liker);
    }

    function _claimSocialRewardsCrossChain(
        address user,
        address zrc20,
        uint256 targetChain
    ) internal {
        uint256 socialReward = userProfiles[user].socialScore * 1e18;
        require(socialReward > 0, "No social rewards to claim");

        // Reset social score after claiming
        userProfiles[user].socialScore = 0;

        // Prepare call options
        CallOptions memory callOptions = CallOptions({
            gasLimit: 100000,
            isArbitraryCall: false
        });

        // Prepare revert options
        RevertOptions memory revertOptions = RevertOptions({
            revertAddress: user,
            callOnRevert: false,
            abortAddress: address(0),
            revertMessage: abi.encode("Social reward claim failed"),
            onRevertGasLimit: 1
        });

        // Send rewards cross-chain
        gateway.call(
            abi.encodePacked(user),
            zrc20,
            abi.encode(socialReward),
            callOptions,
            revertOptions
        );

        emit CrossChainSocialReward(user, socialReward, targetChain);
    }

    // View functions
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

    function getPostsByAuthor(
        address author
    ) external view returns (Post[] memory) {
        uint256[] memory postIds = userPosts[author];
        Post[] memory result = new Post[](postIds.length);

        for (uint256 i = 0; i < postIds.length; i++) {
            result[i] = posts[postIds[i]];
        }

        return result;
    }

    modifier onlyGateway() {
        require(msg.sender == address(gateway), "Only gateway");
        _;
    }
}
