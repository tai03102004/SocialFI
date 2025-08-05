// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@zetachain/protocol-contracts/contracts/zevm/GatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GameFiCore is UniversalContract, Ownable, ReentrancyGuard {
    IGatewayZEVM public immutable gateway;

    // Game token
    address public immutable guiToken;

    // Game state
    struct Prediction {
        address player;
        uint256 predictedPrice;
        uint256 actualPrice;
        uint256 timestamp;
        bool resolved;
        bool correct;
    }

    struct Player {
        uint256 score;
        uint256 totalPredictions;
        uint256 correctPredictions;
        uint256 stakedAmount;
        uint256 lastQuizTime;
        uint256 achievements;
    }

    mapping(address => Player) public players;
    mapping(uint256 => Prediction) public predictions;
    mapping(address => uint256[]) public playerPredictions;

    uint256 public nextPredictionId;
    uint256 public constant PREDICTION_WINDOW = 1 hours;
    uint256 public constant QUIZ_COOLDOWN = 24 hours;

    // Events
    event PredictionMade(
        address indexed player,
        uint256 indexed predictionId,
        uint256 predictedPrice
    );
    event PredictionResolved(
        uint256 indexed predictionId,
        uint256 actualPrice,
        bool correct
    );
    event QuizCompleted(address indexed player, uint256 score, uint256 reward);
    event RewardDistributed(
        address indexed player,
        uint256 amount,
        uint256 chainId
    );
    event TokensStaked(address indexed player, uint256 amount);

    constructor(address _gateway, address _guiToken) {
        gateway = IGatewayZEVM(_gateway);
        guiToken = _guiToken;
    }

    // Universal contract function for cross-chain calls
    function onCall(
        MessageContext calldata context,
        address zrc20,
        uint256 amount,
        bytes calldata message
    ) external override onlyGateway {
        // Decode message to determine action
        (uint8 action, bytes memory data) = abi.decode(message, (uint8, bytes));

        if (action == 1) {
            // Make prediction
            uint256 predictedPrice = abi.decode(data, (uint256));
            _makePrediction(context.sender, predictedPrice);
        } else if (action == 2) {
            // Complete quiz
            (uint256 score, uint256 answers) = abi.decode(
                data,
                (uint256, uint256)
            );
            _completeQuiz(context.sender, score, answers);
        } else if (action == 3) {
            // Stake tokens
            _stakeTokens(context.sender, amount);
        } else if (action == 4) {
            // Claim rewards
            uint256 targetChainId = abi.decode(data, (uint256));
            _claimRewards(context.sender, zrc20, targetChainId);
        }
    }

    function onRevert(
        RevertContext calldata revertContext
    ) external override onlyGateway {
        // Handle revert logic
    }

    function _makePrediction(address player, uint256 predictedPrice) internal {
        require(predictedPrice > 0, "Invalid price prediction");

        uint256 predictionId = nextPredictionId++;

        predictions[predictionId] = Prediction({
            player: player,
            predictedPrice: predictedPrice,
            actualPrice: 0,
            timestamp: block.timestamp,
            resolved: false,
            correct: false
        });

        playerPredictions[player].push(predictionId);
        players[player].totalPredictions++;

        emit PredictionMade(player, predictionId, predictedPrice);
    }

    function _completeQuiz(
        address player,
        uint256 score,
        uint256 answers
    ) internal {
        Player storage playerData = players[player];
        require(
            block.timestamp >= playerData.lastQuizTime + QUIZ_COOLDOWN,
            "Quiz cooldown active"
        );

        playerData.lastQuizTime = block.timestamp;
        playerData.score += score;

        // Calculate reward based on score
        uint256 reward = (score * 100) / answers; // Base reward calculation
        if (playerData.stakedAmount > 0) {
            reward = (reward * 150) / 100; // 50% bonus for stakers
        }

        // Mint rewards
        if (reward > 0) {
            IERC20(guiToken).transfer(player, reward * 1e18);
        }

        emit QuizCompleted(player, score, reward);
    }

    function _stakeTokens(address player, uint256 amount) internal {
        require(amount > 0, "Invalid stake amount");

        players[player].stakedAmount += amount;

        emit TokensStaked(player, amount);
    }

    function _claimRewards(
        address player,
        address zrc20,
        uint256 targetChainId
    ) internal {
        Player storage playerData = players[player];
        uint256 rewards = calculatePendingRewards(player);

        require(rewards > 0, "No rewards to claim");

        // Reset pending rewards
        playerData.score = 0;

        // Cross-chain reward distribution
        if (targetChainId != 0) {
            bytes memory message = abi.encode(player, rewards);
            gateway.call(
                abi.encodePacked(player),
                zrc20,
                message,
                CallOptions(50000, false) // gasLimit, isArbitraryCall
            );
        } else {
            // Local reward
            IERC20(guiToken).transfer(player, rewards);
        }

        emit RewardDistributed(player, rewards, targetChainId);
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

        // Check if prediction is correct (within 5% range)
        uint256 tolerance = (actualPrice * 5) / 100;
        bool correct = prediction.predictedPrice >= actualPrice - tolerance &&
            prediction.predictedPrice <= actualPrice + tolerance;

        prediction.correct = correct;

        if (correct) {
            players[prediction.player].correctPredictions++;
            players[prediction.player].score += 10; // Base score for correct prediction

            // Bonus for accuracy
            uint256 accuracy = calculateAccuracy(
                prediction.predictedPrice,
                actualPrice
            );
            players[prediction.player].score += accuracy;
        }

        emit PredictionResolved(predictionId, actualPrice, correct);
    }

    function calculateAccuracy(
        uint256 predicted,
        uint256 actual
    ) internal pure returns (uint256) {
        uint256 diff = predicted > actual
            ? predicted - actual
            : actual - predicted;
        uint256 percentage = (diff * 100) / actual;

        if (percentage <= 1) return 10; // Perfect prediction
        if (percentage <= 2) return 7;
        if (percentage <= 3) return 5;
        if (percentage <= 5) return 2;
        return 0;
    }

    function calculatePendingRewards(
        address player
    ) public view returns (uint256) {
        Player memory playerData = players[player];
        return playerData.score * 1e18; // Convert score to token amount
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
            uint256 accuracy
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
            accuracy
        );
    }

    function getPlayerPredictions(
        address player
    ) external view returns (uint256[] memory) {
        return playerPredictions[player];
    }

    modifier onlyGateway() {
        require(msg.sender == address(gateway), "Only gateway");
        _;
    }
}
