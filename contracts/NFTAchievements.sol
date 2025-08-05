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
        uint8 achievementType; // 0: predictions, 1: accuracy, 2: streak, 3: quiz
        bool active;
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    mapping(uint256 => uint256) public tokenToAchievement;

    uint256 public nextTokenId = 1;
    uint256 public nextAchievementId = 1;

    event AchievementUnlocked(
        address indexed player,
        uint256 indexed achievementId,
        uint256 tokenId
    );
    event AchievementCreated(uint256 indexed achievementId, string name);

    constructor(address _gateway) ERC721("GameFi Achievements", "GFA") {
        gateway = IGatewayZEVM(_gateway);
        _initializeAchievements();
    }

    function _initializeAchievements() internal {
        // First Prediction
        _createAchievement(
            "First Steps",
            "Make your first price prediction",
            "ipfs://QmFirstSteps",
            1,
            0
        );

        // 100 Predictions
        _createAchievement(
            "Century Predictor",
            "Make 100 price predictions",
            "ipfs://QmCentury",
            100,
            0
        );

        // High Accuracy
        _createAchievement(
            "Oracle",
            "Achieve 80% prediction accuracy with minimum 50 predictions",
            "ipfs://QmOracle",
            80,
            1
        );

        // Perfect Week
        _createAchievement(
            "Perfect Week",
            "Get 7 correct predictions in a row",
            "ipfs://QmPerfectWeek",
            7,
            2
        );

        // Quiz Master
        _createAchievement(
            "Quiz Master",
            "Complete 30 daily quizzes",
            "ipfs://QmQuizMaster",
            30,
            3
        );
    }

    function _createAchievement(
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 requirement,
        uint8 achievementType
    ) internal {
        achievements[nextAchievementId] = Achievement({
            name: name,
            description: description,
            imageURI: imageURI,
            requirement: requirement,
            achievementType: achievementType,
            active: true
        });

        emit AchievementCreated(nextAchievementId, name);
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

        emit AchievementUnlocked(player, achievementId, tokenId);
    }

    function checkAndMintAchievements(
        address player,
        uint256 totalPredictions,
        uint256 correctPredictions,
        uint256 currentStreak,
        uint256 quizCount
    ) external onlyOwner {
        // Check First Steps
        if (totalPredictions >= 1 && !playerAchievements[player][1]) {
            mintAchievement(player, 1);
        }

        // Check Century Predictor
        if (totalPredictions >= 100 && !playerAchievements[player][2]) {
            mintAchievement(player, 2);
        }

        // Check Oracle (80% accuracy with minimum 50 predictions)
        if (totalPredictions >= 50) {
            uint256 accuracy = (correctPredictions * 100) / totalPredictions;
            if (accuracy >= 80 && !playerAchievements[player][3]) {
                mintAchievement(player, 3);
            }
        }

        // Check Perfect Week
        if (currentStreak >= 7 && !playerAchievements[player][4]) {
            mintAchievement(player, 4);
        }

        // Check Quiz Master
        if (quizCount >= 30 && !playerAchievements[player][5]) {
            mintAchievement(player, 5);
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

        // Count achievements
        for (uint256 i = 1; i < nextAchievementId; i++) {
            if (playerAchievements[player][i]) {
                count++;
            }
        }

        // Fill array
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

    function getAllAchievements() external view returns (Achievement[] memory) {
        Achievement[] memory result = new Achievement[](nextAchievementId - 1);

        for (uint256 i = 1; i < nextAchievementId; i++) {
            result[i - 1] = achievements[i];
        }

        return result;
    }
}
