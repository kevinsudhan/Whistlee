/**
 * Utility functions for handling blockchain transactions
 * Specifically designed to work with MetaMask mobile wallet
 */

/**
 * Creates a transaction configuration compatible with MetaMask mobile
 * This handles the EIP-1559 transaction format properly
 */
export const createMetaMaskCompatibleConfig = () => {
  return {
    // Use legacy transaction type for MetaMask mobile compatibility
    type: 'legacy' as const,
    
    // Set a reasonable gas limit
    gas: BigInt(300000),
    
    // Don't specify gasPrice, maxFeePerGas, or maxPriorityFeePerGas
    // Let MetaMask handle these values automatically
  };
};
