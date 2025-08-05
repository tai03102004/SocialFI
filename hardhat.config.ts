import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@zetachain/toolkit/tasks";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "zetachain-testnet": {
      url: "https://zetachain-evm.blockpi.network/v1/rpc/public",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 7001,
    },
    "zetachain-mainnet": {
      url: "https://zetachain-evm.blockpi.network/v1/rpc/public",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 7000,
    },
    ethereum: {
      url: process.env.ETHEREUM_RPC || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    bitcoin: {
      url: process.env.BITCOIN_RPC || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  etherscan: {
    apiKey: {
      zetachain: process.env.ZETASCAN_API_KEY || "",
      ethereum: process.env.ETHERSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "zetachain",
        chainId: 7000,
        urls: {
          apiURL: "https://zetachain.blockscout.com/api",
          browserURL: "https://zetachain.blockscout.com",
        },
      },
    ],
  },
};

export default config;
