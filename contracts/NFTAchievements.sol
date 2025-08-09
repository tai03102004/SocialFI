// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";

contract NFTAchievements is ERC721, Ownable {
    IGatewayZEVM public immutable gateway;

    struct Achievement {
        string name;
        string description;
        string imageURI;
        uint256 requirement;
        uint8 achievementType; // 0: predictions, 1: accuracy, 2: streak, 3: quiz, 4: social, 5: premium
        bool active;
        uint256 rarity; // 1: Common, 2: Rare, 3: Epic, 4: Legendary
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    mapping(uint256 => uint256) public tokenToAchievement;

    uint256 public nextTokenId = 1;
    uint256 public nextAchievementId = 1;

    event AchievementUnlocked(
        address indexed player,
        uint256 indexed achievementId,
        uint256 tokenId,
        uint256 rarity
    );
    event AchievementCreated(
        uint256 indexed achievementId,
        string name,
        uint256 rarity
    );

    constructor(address _gateway) ERC721("ZetaSocialFi Achievements", "ZSA") {
        gateway = IGatewayZEVM(_gateway);
        _initializeAchievements();
    }

    function _initializeAchievements() internal {
        // Prediction Achievements
        _createAchievement(
            "First Steps",
            "Make your first price prediction",
            "ipfs://QmFirstSteps",
            1,
            0,
            1
        );

        _createAchievement(
            "Century Predictor",
            "Make 100 price predictions",
            "ipfs://QmCentury",
            100,
            0,
            2
        );

        _createAchievement(
            "Prediction Master",
            "Make 1000 price predictions",
            "ipfs://QmMaster",
            1000,
            0,
            3
        );

        // Accuracy Achievements
        _createAchievement(
            "Oracle",
            "Achieve 80% prediction accuracy with minimum 50 predictions",
            "ipfs://QmOracle",
            80,
            1,
            3
        );

        _createAchievement(
            "Perfect Prophet",
            "Achieve 95% prediction accuracy with minimum 100 predictions",
            "ipfs://QmProphet",
            95,
            1,
            4
        );

        // Streak Achievements
        _createAchievement(
            "Lucky Seven",
            "Get 7 correct predictions in a row",
            "ipfs://QmLucky7",
            7,
            2,
            2
        );

        _createAchievement(
            "Perfect Month",
            "Get 30 correct predictions in a row",
            "ipfs://QmPerfectMonth",
            30,
            2,
            4
        );

        // Quiz Achievements
        _createAchievement(
            "Quiz Enthusiast",
            "Complete 10 daily quizzes",
            "ipfs://QmQuizFan",
            10,
            3,
            1
        );

        _createAchievement(
            "Quiz Master",
            "Complete 100 daily quizzes",
            "ipfs://QmQuizMaster",
            100,
            3,
            3
        );

        // Social Achievements
        _createAchievement(
            "Social Butterfly",
            "Make 50 posts and get 500 likes",
            "ipfs://QmSocialButterfly",
            50,
            4,
            2
        );

        _createAchievement(
            "Influencer",
            "Get 1000 followers",
            "ipfs://QmInfluencer",
            1000,
            4,
            3
        );

        _createAchievement(
            "Community Leader",
            "Get 10000 total social interactions",
            "ipfs://QmLeader",
            10000,
            4,
            4
        );

        // Premium Achievements
        _createAchievement(
            "Premium Pioneer",
            "Activate premium membership",
            "ipfs://QmPremium",
            1,
            5,
            2
        );

        _createAchievement(
            "Whale Supporter",
            "Stake 10000 GUI tokens",
            "ipfs://QmWhale",
            10000,
            5,
            3
        );
    }

    function _createAchievement(
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 requirement,
        uint8 achievementType,
        uint256 rarity
    ) internal {
        achievements[nextAchievementId] = Achievement({
            name: name,
            description: description,
            imageURI: imageURI,
            requirement: requirement,
            achievementType: achievementType,
            active: true,
            rarity: rarity
        });

        emit AchievementCreated(nextAchievementId, name, rarity);
        nextAchievementId++;
    }

    function mintAchievement(
        address player,
        uint256 achievementId
    ) external onlyOwner {
        require(achievements[achievementId].active, "Achievement not active");
        require(
            !playerAchievements[player][achievementId],
            "Achievement already unlocked"
        );

        playerAchievements[player][achievementId] = true;
        uint256 tokenId = nextTokenId++;
        tokenToAchievement[tokenId] = achievementId;

        _mint(player, tokenId);

        emit AchievementUnlocked(
            player,
            achievementId,
            tokenId,
            achievements[achievementId].rarity
        );
    }

    function checkAndMintAchievements(
        address player,
        uint256 totalPredictions,
        uint256 correctPredictions,
        uint256 currentStreak,
        uint256 quizCount
    ) external onlyOwner {
        // Prediction achievements
        if (totalPredictions >= 1 && !playerAchievements[player][1]) {
            mintAchievement(player, 1);
        }
        if (totalPredictions >= 100 && !playerAchievements[player][2]) {
            mintAchievement(player, 2);
        }
        if (totalPredictions >= 1000 && !playerAchievements[player][3]) {
            mintAchievement(player, 3);
        }

        // Accuracy achievements
        if (totalPredictions >= 50) {
            uint256 accuracy = (correctPredictions * 100) / totalPredictions;
            if (accuracy >= 80 && !playerAchievements[player][4]) {
                mintAchievement(player, 4);
            }
        }
        if (totalPredictions >= 100) {
            uint256 accuracy = (correctPredictions * 100) / totalPredictions;
            if (accuracy >= 95 && !playerAchievements[player][5]) {
                mintAchievement(player, 5);
            }
        }

        // Streak achievements
        if (currentStreak >= 7 && !playerAchievements[player][6]) {
            mintAchievement(player, 6);
        }
        if (currentStreak >= 30 && !playerAchievements[player][7]) {
            mintAchievement(player, 7);
        }

        // Quiz achievements
        if (quizCount >= 10 && !playerAchievements[player][8]) {
            mintAchievement(player, 8);
        }
        if (quizCount >= 100 && !playerAchievements[player][9]) {
            mintAchievement(player, 9);
        }
    }

    function checkAndMintSocialAchievements(
        address player,
        uint256 totalPosts,
        uint256 totalLikes,
        uint256 followers,
        uint256 socialInteractions
    ) external onlyOwner {
        // Social achievements
        if (
            totalPosts >= 50 &&
            totalLikes >= 500 &&
            !playerAchievements[player][10]
        ) {
            mintAchievement(player, 10);
        }
        if (followers >= 1000 && !playerAchievements[player][11]) {
            mintAchievement(player, 11);
        }
        if (socialInteractions >= 10000 && !playerAchievements[player][12]) {
            mintAchievement(player, 12);
        }
    }

    function checkAndMintPremiumAchievements(
        address player,
        bool isPremium,
        uint256 stakedAmount
    ) external onlyOwner {
        // Premium achievements
        if (isPremium && !playerAchievements[player][13]) {
            mintAchievement(player, 13);
        }
        if (stakedAmount >= 10000 * 1e18 && !playerAchievements[player][14]) {
            mintAchievement(player, 14);
        }
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        uint256 achievementId = tokenToAchievement[tokenId];
        Achievement memory achievement = achievements[achievementId];
        return achievement.imageURI;
    }

    function getPlayerAchievements(
        address player
    ) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextAchievementId; i++) {
            if (playerAchievements[player][i]) {
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextAchievementId; i++) {
            if (playerAchievements[player][i]) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }

    function getAchievementsByRarity(
        uint256 rarity
    ) external view returns (Achievement[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextAchievementId; i++) {
            if (achievements[i].rarity == rarity && achievements[i].active) {
                count++;
            }
        }

        Achievement[] memory result = new Achievement[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextAchievementId; i++) {
            if (achievements[i].rarity == rarity && achievements[i].active) {
                result[index] = achievements[i];
                index++;
            }
        }
        return result;
    }

    function getAllAchievements() external view returns (Achievement[] memory) {
        Achievement[] memory result = new Achievement[](nextAchievementId - 1);
        for (uint256 i = 1; i < nextAchievementId; i++) {
            result[i - 1] = achievements[i];
        }
        return result;
    }
}
