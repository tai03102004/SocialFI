// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAchievements is ERC721, Ownable {
    struct Achievement {
        string name;
        string description;
        uint256 requirement;
        uint8 achievementType; // 0: predictions, 1: social, 2: ai_following
        bool active;
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    mapping(uint256 => uint256) public tokenToAchievement;

    uint256 public nextTokenId = 1;
    uint256 public nextAchievementId = 1;

    event AchievementUnlocked(
        address indexed player,
        uint256 indexed achievementId
    );

    constructor()
        ERC721("ZetaSocialFi AI Achievements", "ZSAA")
        Ownable(msg.sender)
    {
        _initializeAchievements();
    }

    function _initializeAchievements() internal {
        achievements[nextAchievementId++] = Achievement({
            name: "First Prediction",
            description: "Make your first AI-guided prediction",
            requirement: 1,
            achievementType: 0,
            active: true
        });

        achievements[nextAchievementId++] = Achievement({
            name: "Social Starter",
            description: "Create your first post",
            requirement: 1,
            achievementType: 1,
            active: true
        });

        achievements[nextAchievementId++] = Achievement({
            name: "AI Follower",
            description: "Follow AI recommendations 5 times",
            requirement: 5,
            achievementType: 2,
            active: true
        });
    }

    function mintAchievement(
        address player,
        uint256 achievementId
    ) external onlyOwner {
        require(achievements[achievementId].active, "Achievement not active");
        require(!playerAchievements[player][achievementId], "Already unlocked");

        playerAchievements[player][achievementId] = true;
        uint256 tokenId = nextTokenId++;
        tokenToAchievement[tokenId] = achievementId;

        _mint(player, tokenId);
        emit AchievementUnlocked(player, achievementId);
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

    function hasAchievement(
        address player,
        uint256 achievementId
    ) external view returns (bool) {
        return playerAchievements[player][achievementId];
    }

    function getAchievement(
        uint256 achievementId
    ) external view returns (Achievement memory) {
        return achievements[achievementId];
    }
}
