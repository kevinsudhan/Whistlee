"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { useState, useEffect } from "react";

export function useWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);
  
  // Get the wallet balance
  const { data: balance } = useBalance({
    address,
  });

  // Handle server-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format the address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    address,
    isConnected: isClient && isConnected,
    chainId,
    connectors,
    connect,
    disconnect,
    isPending,
    balance,
    formatAddress,
  };
}
