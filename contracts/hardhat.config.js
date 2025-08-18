require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.26",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        // ZetaChain Testnet
        "zeta-testnet": {
            url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 7001,
            gasPrice: 20000000000, // 20 gwei
            gas: 2100000,
            timeout: 120000,
        },
        // ZetaChain Mainnet
        "zeta-mainnet": {
            url: "https://zetachain-evm.blockpi.network/v1/rpc/public",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 7000,
            gasPrice: 20000000000, // 20 gwei
            gas: 2100000,
            timeout: 120000,
        },
        // Ethereum Sepolia (for testing cross-chain)
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111,
        },
        // BSC Testnet
        "bsc-testnet": {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 97,
        },
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY,
            mainnet: process.env.ETHERSCAN_API_KEY,
            bscTestnet: process.env.BSCSCAN_API_KEY,
            bsc: process.env.BSCSCAN_API_KEY,
        },
        customChains: [{
            network: "zeta-testnet",
            chainId: 7001,
            urls: {
                apiURL: "https://zetachain-athens-3.blockscout.com/api",
                browserURL: "https://zetachain-athens-3.blockscout.com"
            }
        }]
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
};