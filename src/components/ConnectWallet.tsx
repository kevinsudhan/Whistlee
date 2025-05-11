"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ConnectWallet() {
  const { address, isConnected, connectors, connect, disconnect, isPending, formatAddress } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      connect({ connector });
    }
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isConnected ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="whistle-button-primary py-2 px-4 rounded-full text-sm flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          {formatAddress(address)}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="whistle-button-primary py-2 px-4 rounded-full text-sm"
          disabled={isPending}
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden z-50"
        >
          <div className="p-2">
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Disconnect
              </button>
            ) : (
              <>
                <div className="px-4 py-2 text-sm text-white/70">Connect with</div>
                <button
                  onClick={() => handleConnect("metaMask")}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Image src="/images/metamask.svg" alt="MetaMask" width={20} height={20} />
                  MetaMask
                </button>
                <button
                  onClick={() => handleConnect("coinbaseWallet")}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Image src="/images/coinbase.svg" alt="Coinbase Wallet" width={20} height={20} />
                  Coinbase Wallet
                </button>
                <button
                  onClick={() => handleConnect("walletConnect")}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Image src="/images/walletconnect.svg" alt="WalletConnect" width={20} height={20} />
                  WalletConnect
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
