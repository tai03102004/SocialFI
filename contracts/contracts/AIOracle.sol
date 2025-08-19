// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleAIOracle is Ownable {
    struct AIData {
        string symbol;
        uint256 currentPrice;
        uint256 predictedPrice;
        uint256 sentimentScore; // 1-10
        string outlook; // "BULLISH", "BEARISH", "NEUTRAL"
        uint256 confidence; // 1-100
        uint256 timestamp;
        string dataType; // "market", "technical", "social", "strategy"
    }

    mapping(string => mapping(string => AIData)) public aiData; // symbol => dataType => data
    mapping(address => bool) public authorizedAgents;

    uint256 public totalUpdates;

    event AIDataUpdated(
        string indexed symbol,
        string indexed dataType,
        uint256 predictedPrice,
        uint256 confidence,
        string outlook
    );

    constructor() Ownable(msg.sender) {}

    modifier onlyAuthorizedAgent() {
        require(
            authorizedAgents[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    function addAuthorizedAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
    }

    // 📊 Update AI data - Compatible với JSON từ AI agents
    function updateAIData(
        string memory symbol,
        string memory dataType, // "market", "technical", "social", "strategy"
        uint256 currentPrice,
        uint256 predictedPrice,
        uint256 sentimentScore,
        string memory outlook,
        uint256 confidence
    ) external onlyAuthorizedAgent {
        aiData[symbol][dataType] = AIData({
            symbol: symbol,
            currentPrice: currentPrice,
            predictedPrice: predictedPrice,
            sentimentScore: sentimentScore,
            outlook: outlook,
            confidence: confidence,
            timestamp: block.timestamp,
            dataType: dataType
        });

        totalUpdates++;

        emit AIDataUpdated(
            symbol,
            dataType,
            predictedPrice,
            confidence,
            outlook
        );
    }

    // 📖 Get AI data for frontend
    function getAIData(
        string memory symbol,
        string memory dataType
    ) external view returns (AIData memory) {
        return aiData[symbol][dataType];
    }

    // 📖 Get all AI data for a symbol
    function getAllAIData(
        string memory symbol
    )
        external
        view
        returns (
            AIData memory market,
            AIData memory technical,
            AIData memory social,
            AIData memory strategy
        )
    {
        return (
            aiData[symbol]["market"],
            aiData[symbol]["technical"],
            aiData[symbol]["social"],
            aiData[symbol]["strategy"]
        );
    }
}
