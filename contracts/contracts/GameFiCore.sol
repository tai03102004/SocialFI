// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@zetachain/protocol-contracts/contracts/zevm/GatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface INFTAchievements {
    function checkAndMintAchievements(
        address player,
        uint256 totalPredictions,
        uint256 correctPredictions,
        uint256 currentStreak,
        uint256 quizCount
    ) external;
}

contract GameFiCore is UniversalContract, Ownable, ReentrancyGuard {
    IGatewayZEVM public immutable gateway;
    address public immutable guiToken;
    address public nftAchievements;

    struct Prediction {
        address player;
        uint256 predictedPrice;
        uint256 actualPrice;
        uint256 timestamp;
        bool resolved;
        bool correct;
        uint256 confidence;
        string asset;
    }

    struct Player {
        uint256 score;
        uint256 totalPredictions;
        uint256 correctPredictions;
        uint256 stakedAmount;
        uint256 lastQuizTime;
        uint256 achievements;
        uint256 currentStreak;
        uint256 bestStreak;
        uint256 quizCount;
        uint256 socialScore;
        string preferredAsset;
        bool isPremium;
    }

    struct Quiz {
        uint256 id;
        address player;
        uint256 score;
        uint256 totalQuestions;
        uint256 timestamp;
        string difficulty;
        uint256 timeSpent;
    }

    struct DailyQuest {
        string title;
        string description;
        string questType;
        uint256 targetValue;
        uint256 reward;
        uint256 deadline;
        bool active;
    }

    mapping(address => Player) public players;
    mapping(uint256 => Prediction) public predictions;
    mapping(address => uint256[]) public playerPredictions;
    mapping(uint256 => Quiz) public quizzes;
    mapping(address => uint256[]) public playerQuizzes;
    mapping(uint256 => DailyQuest) public dailyQuests;
    mapping(address => mapping(uint256 => bool)) public completedQuests;

    uint256 public nextPredictionId;
    uint256 public nextQuizId;
    uint256 public nextQuestId;
    uint256 public constant PREDICTION_WINDOW = 1 hours;
    uint256 public constant QUIZ_COOLDOWN = 24 hours;
    uint256 public constant BASE_PREDICTION_REWARD = 20 * 1e18;
    uint256 public constant QUIZ_BASE_REWARD = 30 * 1e18;

    event PredictionMade(
        address indexed player,
        uint256 indexed predictionId,
        uint256 predictedPrice,
        string asset,
        uint256 confidence
    );
    event PredictionResolved(
        uint256 indexed predictionId,
        uint256 actualPrice,
        bool correct,
        uint256 accuracy
    );
    event QuizCompleted(
        address indexed player,
        uint256 indexed quizId,
        uint256 score,
        uint256 reward
    );
    event QuestCompleted(
        address indexed player,
        uint256 indexed questId,
        uint256 reward
    );
    event StreakAchieved(address indexed player, uint256 streakCount);
    event PremiumActivated(address indexed player, uint256 duration);

    constructor(address _gateway, address _guiToken) {
        gateway = IGatewayZEVM(_gateway);
        guiToken = _guiToken;
        _initializeDailyQuests();
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
            (
                uint256 predictedPrice,
                uint256 confidence,
                string memory asset
            ) = abi.decode(data, (uint256, uint256, string));
            _makePrediction(context.sender, predictedPrice, confidence, asset);
        } else if (action == 2) {
            (
                uint256 score,
                uint256 totalQuestions,
                string memory difficulty,
                uint256 timeSpent
            ) = abi.decode(data, (uint256, uint256, string, uint256));
            _completeQuiz(
                context.sender,
                score,
                totalQuestions,
                difficulty,
                timeSpent
            );
        } else if (action == 3) {
            _stakeTokens(context.sender, amount);
        } else if (action == 4) {
            uint256 targetChainId = abi.decode(data, (uint256));
            _claimRewards(context.sender, zrc20, targetChainId);
        } else if (action == 5) {
            uint256 questId = abi.decode(data, (uint256));
            _completeQuest(context.sender, questId);
        } else if (action == 6) {
            uint256 duration = abi.decode(data, (uint256));
            _activatePremium(context.sender, duration, amount);
        }
    }

    function onRevert(
        RevertContext calldata revertContext
    ) external override onlyGateway {
        // Handle revert logic
    }

    function _makePrediction(
        address player,
        uint256 predictedPrice,
        uint256 confidence,
        string memory asset
    ) internal {
        require(predictedPrice > 0, "Invalid price prediction");
        require(
            confidence >= 1 && confidence <= 100,
            "Invalid confidence level"
        );

        uint256 predictionId = nextPredictionId++;

        predictions[predictionId] = Prediction({
            player: player,
            predictedPrice: predictedPrice,
            actualPrice: 0,
            timestamp: block.timestamp,
            resolved: false,
            correct: false,
            confidence: confidence,
            asset: asset
        });

        playerPredictions[player].push(predictionId);
        players[player].totalPredictions++;

        players[player].preferredAsset = asset;

        emit PredictionMade(
            player,
            predictionId,
            predictedPrice,
            asset,
            confidence
        );
    }

    function _completeQuiz(
        address player,
        uint256 score,
        uint256 totalQuestions,
        string memory difficulty,
        uint256 timeSpent
    ) internal {
        Player storage playerData = players[player];
        require(
            block.timestamp >= playerData.lastQuizTime + QUIZ_COOLDOWN,
            "Quiz cooldown active"
        );

        uint256 quizId = nextQuizId++;

        quizzes[quizId] = Quiz({
            id: quizId,
            player: player,
            score: score,
            totalQuestions: totalQuestions,
            timestamp: block.timestamp,
            difficulty: difficulty,
            timeSpent: timeSpent
        });

        playerQuizzes[player].push(quizId);
        playerData.lastQuizTime = block.timestamp;
        playerData.quizCount++;

        uint256 baseReward = QUIZ_BASE_REWARD;
        uint256 accuracyBonus = (score * baseReward) / totalQuestions;

        uint256 difficultyMultiplier = 100;
        if (keccak256(bytes(difficulty)) == keccak256(bytes("hard"))) {
            difficultyMultiplier = 150;
        } else if (keccak256(bytes(difficulty)) == keccak256(bytes("easy"))) {
            difficultyMultiplier = 75;
        }

        uint256 timeBonus = timeSpent < 300 ? 25 : 0;

        uint256 totalReward = (accuracyBonus *
            difficultyMultiplier *
            (100 + timeBonus)) / 10000;

        if (playerData.isPremium) {
            totalReward = (totalReward * 120) / 100;
        }

        playerData.score += totalReward / 1e18;

        if (totalReward > 0) {
            IERC20(guiToken).transfer(player, totalReward);
        }

        if (nftAchievements != address(0)) {
            INFTAchievements(nftAchievements).checkAndMintAchievements(
                player,
                playerData.totalPredictions,
                playerData.correctPredictions,
                playerData.currentStreak,
                playerData.quizCount
            );
        }

        emit QuizCompleted(player, quizId, score, totalReward);
    }

    function _stakeTokens(address player, uint256 amount) internal {
        require(amount > 0, "Invalid stake amount");
        players[player].stakedAmount += amount;
    }

    function _activatePremium(
        address player,
        uint256 duration,
        uint256 amount
    ) internal {
        require(amount >= 100 * 1e18, "Insufficient payment for premium");
        players[player].isPremium = true;

        emit PremiumActivated(player, duration);
    }

    function _completeQuest(address player, uint256 questId) internal {
        require(dailyQuests[questId].active, "Quest not active");
        require(!completedQuests[player][questId], "Quest already completed");
        require(
            block.timestamp <= dailyQuests[questId].deadline,
            "Quest expired"
        );

        DailyQuest storage quest = dailyQuests[questId];
        Player storage playerData = players[player];

        bool questCompleted = false;

        if (
            keccak256(bytes(quest.questType)) == keccak256(bytes("prediction"))
        ) {
            questCompleted = playerData.totalPredictions >= quest.targetValue;
        } else if (
            keccak256(bytes(quest.questType)) == keccak256(bytes("quiz"))
        ) {
            questCompleted = playerData.quizCount >= quest.targetValue;
        } else if (
            keccak256(bytes(quest.questType)) == keccak256(bytes("accuracy"))
        ) {
            uint256 accuracy = playerData.totalPredictions > 0
                ? (playerData.correctPredictions * 100) /
                    playerData.totalPredictions
                : 0;
            questCompleted = accuracy >= quest.targetValue;
        } else if (
            keccak256(bytes(quest.questType)) == keccak256(bytes("streak"))
        ) {
            questCompleted = playerData.currentStreak >= quest.targetValue;
        }

        require(questCompleted, "Quest requirements not met");

        completedQuests[player][questId] = true;

        IERC20(guiToken).transfer(player, quest.reward);
        playerData.score += quest.reward / 1e18;

        emit QuestCompleted(player, questId, quest.reward);
    }

    function resolvePrediction(
        uint256 predictionId,
        uint256 actualPrice
    ) external onlyOwner {
        Prediction storage prediction = predictions[predictionId];
        require(!prediction.resolved, "Already resolved");
        require(
            block.timestamp >= prediction.timestamp + PREDICTION_WINDOW,
            "Too early to resolve"
        );

        prediction.actualPrice = actualPrice;
        prediction.resolved = true;

        Player storage playerData = players[prediction.player];

        uint256 accuracy = calculateAccuracy(
            prediction.predictedPrice,
            actualPrice
        );
        bool correct = accuracy >= 95;

        prediction.correct = correct;

        if (correct) {
            playerData.correctPredictions++;
            playerData.currentStreak++;

            if (playerData.currentStreak > playerData.bestStreak) {
                playerData.bestStreak = playerData.currentStreak;
                emit StreakAchieved(
                    prediction.player,
                    playerData.currentStreak
                );
            }

            uint256 baseReward = BASE_PREDICTION_REWARD;
            uint256 accuracyBonus = (accuracy * baseReward) / 100;
            uint256 confidenceBonus = (prediction.confidence * baseReward) /
                200;
            uint256 streakBonus = playerData.currentStreak > 5
                ? (playerData.currentStreak * baseReward) / 20
                : 0;

            uint256 totalReward = baseReward +
                accuracyBonus +
                confidenceBonus +
                streakBonus;

            if (playerData.isPremium) {
                totalReward = (totalReward * 130) / 100;
            }

            playerData.score += totalReward / 1e18;
            IERC20(guiToken).transfer(prediction.player, totalReward);
        } else {
            playerData.currentStreak = 0;
        }

        if (nftAchievements != address(0)) {
            INFTAchievements(nftAchievements).checkAndMintAchievements(
                prediction.player,
                playerData.totalPredictions,
                playerData.correctPredictions,
                playerData.currentStreak,
                playerData.quizCount
            );
        }

        emit PredictionResolved(predictionId, actualPrice, correct, accuracy);
    }

    function calculateAccuracy(
        uint256 predicted,
        uint256 actual
    ) internal pure returns (uint256) {
        uint256 diff = predicted > actual
            ? predicted - actual
            : actual - predicted;
        uint256 percentage = (diff * 100) / actual;

        if (percentage == 0) return 100;
        if (percentage <= 1) return 99;
        if (percentage <= 2) return 97;
        if (percentage <= 3) return 95;
        if (percentage <= 5) return 90;
        if (percentage <= 10) return 80;
        return percentage > 50 ? 0 : 100 - (percentage * 2);
    }

    function _initializeDailyQuests() internal {
        dailyQuests[nextQuestId++] = DailyQuest({
            title: "First Prediction",
            description: "Make your first price prediction today",
            questType: "prediction",
            targetValue: 1,
            reward: 50 * 1e18,
            deadline: block.timestamp + 1 days,
            active: true
        });

        dailyQuests[nextQuestId++] = DailyQuest({
            title: "Quiz Master",
            description: "Complete 3 quizzes today",
            questType: "quiz",
            targetValue: 3,
            reward: 100 * 1e18,
            deadline: block.timestamp + 1 days,
            active: true
        });
    }

    function getPlayerStats(
        address player
    )
        external
        view
        returns (
            uint256 score,
            uint256 totalPredictions,
            uint256 correctPredictions,
            uint256 stakedAmount,
            uint256 accuracy,
            uint256 currentStreak,
            uint256 bestStreak,
            uint256 quizCount,
            bool isPremium
        )
    {
        Player memory playerData = players[player];
        accuracy = playerData.totalPredictions > 0
            ? (playerData.correctPredictions * 100) /
                playerData.totalPredictions
            : 0;

        return (
            playerData.score,
            playerData.totalPredictions,
            playerData.correctPredictions,
            playerData.stakedAmount,
            accuracy,
            playerData.currentStreak,
            playerData.bestStreak,
            playerData.quizCount,
            playerData.isPremium
        );
    }

    function getPlayerQuizzes(
        address player
    ) external view returns (uint256[] memory) {
        return playerQuizzes[player];
    }

    function getDailyQuests() external view returns (DailyQuest[] memory) {
        DailyQuest[] memory activeQuests = new DailyQuest[](nextQuestId);
        uint256 count = 0;

        for (uint256 i = 0; i < nextQuestId; i++) {
            if (
                dailyQuests[i].active &&
                block.timestamp <= dailyQuests[i].deadline
            ) {
                activeQuests[count] = dailyQuests[i];
                count++;
            }
        }

        DailyQuest[] memory result = new DailyQuest[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeQuests[i];
        }

        return result;
    }

    modifier onlyGateway() {
        require(msg.sender == address(gateway), "Only gateway");
        _;
    }
}
