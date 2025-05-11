import { createConfig, http } from "wagmi";
import { supportedChains } from "./chains";
import { injected, metaMask  } from "wagmi/connectors";

// Create wagmi config
export const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    420420421: http(),    // Westend Asset Hub
    11155111: http(), // Sepolia
    80001: http(),    // Polygon Mumbai
    137: http(),      // Polygon Mainnet
  },
});
