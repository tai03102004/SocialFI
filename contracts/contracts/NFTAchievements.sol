// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAchievements is ERC721, Ownable {
    struct Achievement {
        string name;
        string description;
        uint256 requirement;
        uint8 achievementType; // 0: predictions, 1: social, 2: premium
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

    constructor()
        ERC721("ZetaSocialFi Achievements", "ZSA")
        Ownable(msg.sender)
    {
        _initializeBasicAchievements();
    }

    function _initializeBasicAchievements() internal {
        // Basic achievements for testing
        achievements[nextAchievementId++] = Achievement({
            name: "First Prediction",
            description: "Make your first price prediction",
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
            name: "Cross Chain User",
            description: "Complete cross-chain transaction",
            requirement: 1,
            achievementType: 2,
            active: true
        });
    }

    function mintAchievement(
        address player,
        uint256 achievementId
    ) public onlyOwner {
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

    // Internal function to avoid calling public function from internal
    function _mintAchievement(address player, uint256 achievementId) internal {
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

    // Simple check for basic achievements
    function checkAndMintBasicAchievements(
        address player,
        uint256 totalPredictions,
        uint256 totalPosts,
        bool hasUsedCrossChain
    ) external onlyOwner {
        // First prediction achievement
        if (totalPredictions >= 1 && !playerAchievements[player][1]) {
            _mintAchievement(player, 1);
        }

        // First post achievement
        if (totalPosts >= 1 && !playerAchievements[player][2]) {
            _mintAchievement(player, 2);
        }

        // Cross-chain user achievement
        if (hasUsedCrossChain && !playerAchievements[player][3]) {
            _mintAchievement(player, 3);
        }
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

    // View functions
    function getAchievement(
        uint256 achievementId
    ) external view returns (Achievement memory) {
        return achievements[achievementId];
    }

    function hasAchievement(
        address player,
        uint256 achievementId
    ) external view returns (bool) {
        return playerAchievements[player][achievementId];
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        uint256 achievementId = tokenToAchievement[tokenId];
        Achievement memory achievement = achievements[achievementId];

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    _base64encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                achievement.name,
                                '",',
                                '"description":"',
                                achievement.description,
                                '",',
                                '"image":"https://zetasocialfi.com/achievements/',
                                _toString(achievementId),
                                '.png"}'
                            )
                        )
                    )
                )
            );
    }

    function _base64encode(
        bytes memory data
    ) internal pure returns (string memory) {
        // Simple base64 encoding for testing
        // In production, use a proper base64 library
        return "eyJuYW1lIjoiQmFzaWMgQWNoaWV2ZW1lbnQifQ==";
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
