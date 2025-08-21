// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AIOracle.sol"; // Assuming AIOracle is in the same directory

contract GameFiCore is Ownable {
    address public guiToken;
    address public aiOracle;

    struct Player {
        uint256 score;
        uint256 totalPredictions;
        uint256 correctPredictions;
        uint256 stakedAmount;
        uint256 aiFollowScore;
        string preferredAsset;
    }

    struct Prediction {
        address player;
        uint256 predictedPrice;
        uint256 aiPredictedPrice;
        uint256 actualPrice;
        uint256 playerConfidence;
        uint256 aiConfidence;
        uint256 timestamp;
        bool resolved;
        bool playerCorrect;
        bool aiCorrect;
        string asset;
    }

    struct Quest {
        uint256 id;
        string title;
        string description;
        string questType;
        uint256 reward;
        uint256 deadline;
        bool active;
    }

    mapping(address => Player) public players;
    mapping(uint256 => Prediction) public predictions;
    mapping(address => uint256[]) public playerPredictions;
    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => bool)) public completedQuests;

    uint256 public nextPredictionId;
    uint256 public nextQuestId = 1;
    uint256 public constant BASE_REWARD = 20 * 1e18;
    uint256 public constant AI_FOLLOW_BONUS = 10 * 1e18;

    event PredictionMade(
        address indexed player,
        uint256 indexed predictionId,
        uint256 playerPrice,
        uint256 aiPrice,
        string asset
    );

    event QuestCreated(uint256 indexed questId, string title, uint256 reward);
    event QuestCompleted(
        address indexed player,
        uint256 indexed questId,
        uint256 reward
    );
    event AIBonusAwarded(address indexed player, uint256 bonus);

    constructor(address _guiToken, address _aiOracle) Ownable(msg.sender) {
        guiToken = _guiToken;
        aiOracle = _aiOracle;
    }

    // 🎯 Make prediction với AI comparison
    function makeAIPrediction(
        uint256 predictedPrice,
        string memory asset,
        uint256 confidence
    ) external {
        // Get AI prediction từ oracle
        SimpleAIOracle.AIData memory aiTechnical = SimpleAIOracle(aiOracle)
            .getAIData(asset, "technical");

        uint256 predictionId = nextPredictionId++;

        predictions[predictionId] = Prediction({
            player: msg.sender,
            predictedPrice: predictedPrice,
            aiPredictedPrice: aiTechnical.predictedPrice,
            actualPrice: 0,
            playerConfidence: confidence,
            aiConfidence: aiTechnical.confidence,
            timestamp: block.timestamp,
            resolved: false,
            playerCorrect: false,
            aiCorrect: false,
            asset: asset
        });

        playerPredictions[msg.sender].push(predictionId);
        players[msg.sender].totalPredictions++;

        emit PredictionMade(
            msg.sender,
            predictionId,
            predictedPrice,
            aiTechnical.predictedPrice,
            asset
        );
    }

    // 🏆 Create quest from AI agents
    function createQuest(
        string memory title,
        string memory description,
        string memory questType,
        uint256 reward,
        uint256 duration
    ) external onlyOwner {
        uint256 questId = nextQuestId++;

        quests[questId] = Quest({
            id: questId,
            title: title,
            description: description,
            questType: questType,
            reward: reward,
            deadline: block.timestamp + duration,
            active: true
        });

        emit QuestCreated(questId, title, reward);
    }

    // ✅ Complete quest
    function completeQuest(uint256 questId) external {
        Quest storage quest = quests[questId];
        require(quest.active, "Quest not active");
        require(block.timestamp <= quest.deadline, "Quest expired");
        require(!completedQuests[msg.sender][questId], "Already completed");

        completedQuests[msg.sender][questId] = true;

        // Reward player
        IERC20(guiToken).transfer(msg.sender, quest.reward);
        players[msg.sender].score += quest.reward / 1e18;

        emit QuestCompleted(msg.sender, questId, quest.reward);
    }

    // 🎯 Resolve prediction và tính rewards
    function resolvePrediction(
        uint256 predictionId,
        uint256 actualPrice
    ) external onlyOwner {
        Prediction storage prediction = predictions[predictionId];
        require(!prediction.resolved, "Already resolved");

        prediction.actualPrice = actualPrice;
        prediction.resolved = true;

        // Check accuracy (within 5% = correct)
        uint256 playerDiff = prediction.predictedPrice > actualPrice
            ? prediction.predictedPrice - actualPrice
            : actualPrice - prediction.predictedPrice;

        uint256 aiDiff = prediction.aiPredictedPrice > actualPrice
            ? prediction.aiPredictedPrice - actualPrice
            : actualPrice - prediction.aiPredictedPrice;

        bool playerCorrect = (playerDiff * 100) / actualPrice <= 5;
        bool aiCorrect = (aiDiff * 100) / actualPrice <= 5;

        prediction.playerCorrect = playerCorrect;
        prediction.aiCorrect = aiCorrect;

        Player storage player = players[prediction.player];
        uint256 totalReward = 0;

        if (playerCorrect) {
            player.correctPredictions++;
            totalReward += BASE_REWARD;

            // Bonus nếu follow AI và cả 2 đều đúng
            if (
                aiCorrect &&
                _isFollowingAI(
                    prediction.predictedPrice,
                    prediction.aiPredictedPrice
                )
            ) {
                totalReward += AI_FOLLOW_BONUS;
                player.aiFollowScore += 10;
                emit AIBonusAwarded(prediction.player, AI_FOLLOW_BONUS);
            }

            IERC20(guiToken).transfer(prediction.player, totalReward);
            player.score += totalReward / 1e18;
        }
    }

    function _isFollowingAI(
        uint256 playerPrice,
        uint256 aiPrice
    ) internal pure returns (bool) {
        if (aiPrice == 0) return false;
        uint256 diff = playerPrice > aiPrice
            ? playerPrice - aiPrice
            : aiPrice - playerPrice;
        return (diff * 100) / aiPrice <= 10; // Within 10%
    }

    // 📊 View functions for frontend
    function getPlayerStats(
        address player
    )
        external
        view
        returns (
            uint256 score,
            uint256 totalPredictions,
            uint256 correctPredictions,
            uint256 aiFollowScore,
            uint256 accuracy
        )
    {
        Player memory playerData = players[player];
        uint256 accuracyCalc = playerData.totalPredictions > 0
            ? (playerData.correctPredictions * 100) /
                playerData.totalPredictions
            : 0;

        return (
            playerData.score,
            playerData.totalPredictions,
            playerData.correctPredictions,
            playerData.aiFollowScore,
            accuracyCalc
        );
    }

    function getPlayerPredictions(
        address player
    ) external view returns (uint256[] memory) {
        return playerPredictions[player];
    }

    function getPrediction(
        uint256 predictionId
    ) external view returns (Prediction memory) {
        return predictions[predictionId];
    }

    function getActiveQuests() external view returns (Quest[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i < nextQuestId; i++) {
            if (quests[i].active && block.timestamp <= quests[i].deadline) {
                activeCount++;
            }
        }

        Quest[] memory activeQuests = new Quest[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i < nextQuestId; i++) {
            if (quests[i].active && block.timestamp <= quests[i].deadline) {
                activeQuests[index] = quests[i];
                index++;
            }
        }

        return activeQuests;
    }

    function getQuest(uint256 questId) external view returns (Quest memory) {
        return quests[questId];
    }

    // Thêm vào GameFi.sol
    struct QuizStats {
        uint256 totalQuizzes;
        uint256 totalScore;
        uint256 bestStreak;
        uint256 currentStreak;
        uint256 totalRewards;
        uint256 lastQuizTime;
    }

    mapping(address => QuizStats) public playerQuizStats;

    event QuizCompleted(
        address indexed player,
        uint8 category,
        uint8 difficulty,
        uint8 score,
        uint256 reward
    );

    function submitQuizResults(
        uint8 category,
        uint8 difficulty,
        uint8 score,
        uint8 totalQuestions
    ) external {
        require(canTakeQuiz(msg.sender), "Quiz cooldown active");

        QuizStats storage stats = playerQuizStats[msg.sender];

        // Calculate reward
        uint256 baseReward = difficulty == 2
            ? 100 * 1e18
            : difficulty == 1
                ? 50 * 1e18
                : 25 * 1e18;
        uint256 reward = (baseReward * score) / totalQuestions;

        // Update stats
        stats.totalQuizzes++;
        stats.totalScore += score;
        stats.totalRewards += reward;
        stats.lastQuizTime = block.timestamp;

        // Update streak
        if (score >= (totalQuestions * 70) / 100) {
            // 70% threshold
            stats.currentStreak++;
            if (stats.currentStreak > stats.bestStreak) {
                stats.bestStreak = stats.currentStreak;
            }
        } else {
            stats.currentStreak = 0;
        }

        // Transfer reward
        IERC20(guiToken).transfer(msg.sender, reward);

        // Update player score
        players[msg.sender].score += reward / 1e18;

        emit QuizCompleted(msg.sender, category, difficulty, score, reward);
    }

    function canTakeQuiz(address player) public view returns (bool) {
        return
            block.timestamp >= playerQuizStats[player].lastQuizTime + 24 hours;
    }

    function getQuizStats(
        address player
    )
        external
        view
        returns (
            uint256 totalQuizzes,
            uint256 averageScore,
            uint256 bestStreak,
            uint256 totalRewards
        )
    {
        QuizStats memory stats = playerQuizStats[player];

        uint256 avgScore = stats.totalQuizzes > 0
            ? (stats.totalScore * 100) / (stats.totalQuizzes * 5)
            : 0; // Assuming 5 questions max

        return (
            stats.totalQuizzes,
            avgScore,
            stats.bestStreak,
            stats.totalRewards
        );
    }
}
