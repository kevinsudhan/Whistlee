import { sepolia, polygonMumbai, polygon, type Chain } from "viem/chains";

// Define SEI Atlantic-2 testnet
export const WestendAsset: Chain = {
  id: 420420421,
  name: 'Westend Asset Hub',
  nativeCurrency: {
    decimals: 18,
    name: 'WND',
    symbol: 'WND',
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
    public: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Westend Asset Hub Explorer',
      url: 'https://assethub-westend.subscan.io/',
    },
  },
  testnet: true,
};

// Re-export the chains
export { sepolia, polygonMumbai, polygon, };

// Define the chains we want to support
export const supportedChains = [
  WestendAsset // Only Westend Asset Hub (Polkadot)
] as const satisfies readonly [Chain, ...Chain[]];

// Default chain for development
export const defaultChain = WestendAsset;
