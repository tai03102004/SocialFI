// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameFiCore is UniversalContract, Ownable {
    IGatewayZEVM public immutable gateway;
    address public immutable guiToken;

    struct Player {
        uint256 score;
        uint256 totalPredictions;
        uint256 stakedAmount;
        string preferredAsset;
    }

    struct Prediction {
        address player;
        uint256 predictedPrice;
        uint256 actualPrice;
        uint256 timestamp;
        bool resolved;
        bool correct;
        string asset;
    }

    mapping(address => Player) public players;
    mapping(uint256 => Prediction) public predictions;
    mapping(address => uint256[]) public playerPredictions;

    uint256 public nextPredictionId;
    uint256 public constant BASE_REWARD = 20 * 1e18;

    event PredictionMade(
        address indexed player,
        uint256 indexed predictionId,
        uint256 predictedPrice,
        string asset
    );

    event PredictionResolved(
        uint256 indexed predictionId,
        uint256 actualPrice,
        bool correct
    );

    event CrossChainReward(
        address indexed player,
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
            // Make prediction
            (uint256 predictedPrice, string memory asset) = abi.decode(
                data,
                (uint256, string)
            );
            _makePrediction(sender, predictedPrice, asset);
        } else if (action == 2) {
            // Stake tokens
            _stakeTokens(sender, amount);
        } else if (action == 3) {
            // Claim rewards cross-chain
            uint256 targetChain = abi.decode(data, (uint256));
            _claimRewardsCrossChain(sender, zrc20, targetChain);
        }
    }

    function onRevert(
        RevertContext calldata revertContext
    ) external onlyGateway {
        // Simple revert handling - refund tokens
        // Implementation for handling failed cross-chain transactions
        // Can emit events or refund tokens here
    }

    // Direct functions for same-chain interactions
    function makePrediction(
        uint256 predictedPrice,
        string memory asset
    ) external {
        _makePrediction(msg.sender, predictedPrice, asset);
    }

    function stakeTokens(uint256 amount) external {
        require(
            IERC20(guiToken).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        _stakeTokens(msg.sender, amount);
    }

    function _makePrediction(
        address player,
        uint256 predictedPrice,
        string memory asset
    ) internal {
        require(predictedPrice > 0, "Invalid price prediction");

        uint256 predictionId = nextPredictionId++;

        predictions[predictionId] = Prediction({
            player: player,
            predictedPrice: predictedPrice,
            actualPrice: 0,
            timestamp: block.timestamp,
            resolved: false,
            correct: false,
            asset: asset
        });

        playerPredictions[player].push(predictionId);
        players[player].totalPredictions++;
        players[player].preferredAsset = asset;

        emit PredictionMade(player, predictionId, predictedPrice, asset);
    }

    function _stakeTokens(address player, uint256 amount) internal {
        require(amount > 0, "Invalid stake amount");
        players[player].stakedAmount += amount;
    }

    function _claimRewardsCrossChain(
        address player,
        address zrc20,
        uint256 targetChain
    ) internal {
        uint256 reward = players[player].score * 1e18;
        require(reward > 0, "No rewards to claim");

        // Reset score after claiming
        players[player].score = 0;

        // Prepare call options
        CallOptions memory callOptions = CallOptions({
            gasLimit: 100000,
            isArbitraryCall: false
        });

        // Prepare revert options
        RevertOptions memory revertOptions = RevertOptions({
            revertAddress: player,
            callOnRevert: false,
            abortAddress: address(0),
            revertMessage: abi.encode("Reward claim failed"),
            onRevertGasLimit: 1
        });

        // Send tokens cross-chain via ZetaChain Gateway
        gateway.call(
            abi.encodePacked(player),
            zrc20,
            abi.encode(reward),
            callOptions,
            revertOptions
        );

        emit CrossChainReward(player, reward, targetChain);
    }

    // Owner function to resolve predictions (for testing)
    function resolvePrediction(
        uint256 predictionId,
        uint256 actualPrice
    ) external onlyOwner {
        Prediction storage prediction = predictions[predictionId];
        require(!prediction.resolved, "Already resolved");

        prediction.actualPrice = actualPrice;
        prediction.resolved = true;

        // Simple accuracy check (within 5% = correct)
        uint256 diff = prediction.predictedPrice > actualPrice
            ? prediction.predictedPrice - actualPrice
            : actualPrice - prediction.predictedPrice;

        bool correct = (diff * 100) / actualPrice <= 5; // 5% tolerance
        prediction.correct = correct;

        if (correct) {
            // Reward player
            players[prediction.player].score += BASE_REWARD / 1e18;
            IERC20(guiToken).transfer(prediction.player, BASE_REWARD);
        }

        emit PredictionResolved(predictionId, actualPrice, correct);
    }

    // View functions
    function getPlayerStats(
        address player
    )
        external
        view
        returns (
            uint256 score,
            uint256 totalPredictions,
            uint256 stakedAmount,
            string memory preferredAsset
        )
    {
        Player memory playerData = players[player];
        return (
            playerData.score,
            playerData.totalPredictions,
            playerData.stakedAmount,
            playerData.preferredAsset
        );
    }

    function getPrediction(
        uint256 predictionId
    ) external view returns (Prediction memory) {
        return predictions[predictionId];
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
