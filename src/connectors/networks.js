export const networkParams = {
  goearli: {
    chainId: 5,
    rpcUrls: ["https://goerli.infura.io/v3/3750a6550bab4b3c8580782f6fa0f09b"],
    chainName: "Goerli Testnet",
    nativeCurrency: { name: "ETH", decimals: 18, symbol: "eth" },
    blockExplorerUrls: ["https://goerli.etherscan.io"],
  },
  ropsten: {
    chainId: 3,
    rpcUrls: ["https://ropsten.infura.io/v3/3750a6550bab4b3c8580782f6fa0f09b"],
    chainName: "Ropsten Testnet",
    nativeCurrency: { name: "ETH", decimals: 18, symbol: "eth" },
    blockExplorerUrl: ["https://ropsten.etherscan.io"],
  },
};
