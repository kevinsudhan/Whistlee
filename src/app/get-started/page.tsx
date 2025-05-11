"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnect, useSwitchChain, useAccount } from "wagmi";
import { WestendAsset } from "../../config/chains";

export default function GetStarted() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  
  const { connect, connectors, isPending } = useConnect();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { isConnected, chainId } = useAccount();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Check if wallet is connected and on the right chain
  useEffect(() => {
    if (isConnected && chainId === WestendAsset.id && connectionSuccess) {
      // Add a small delay to ensure UI updates before navigation
      const timer = setTimeout(() => {
        router.push('/my-communities');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, chainId, connectionSuccess, router]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    setConnectionSuccess(false);
    
    try {
      // Find the MetaMask connector
      const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
      
      if (!metaMaskConnector) {
        throw new Error("MetaMask connector not found. Please install MetaMask extension.");
      }
      
      // Connect to MetaMask
      await connect({ connector: metaMaskConnector });
      
      // Wait a moment to ensure connection is established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we're connected
      if (!isConnected) {
        throw new Error("Failed to connect to MetaMask. Please try again.");
      }
      
      // Switch to SEI Atlantic-2 testnet
      await switchChain({ chainId: WestendAsset.id });
      
      // Wait a moment to ensure chain switch is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we're on the right chain
      if (chainId !== WestendAsset.id) {
        throw new Error("Failed to switch to WestendAsset network. Please try again.");
      }
      
      // Mark connection as successful
      setConnectionSuccess(true);
      
      // Navigation is now handled by the useEffect
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectionError(error instanceof Error ? error.message : "Failed to connect wallet");
      setConnectionSuccess(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login process
    setTimeout(() => {
      router.push('/my-communities');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="absolute inset-0 -z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Grid background with less visible lines */}
          <div 
            className="absolute inset-0 z-[1]" 
            style={{ 
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary-yellow opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-blue opacity-10 blur-3xl" />
        </motion.div>

        <motion.div 
          className="text-center max-w-3xl mx-auto"
          variants={fadeIn}
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image 
              src="/images/whistle-logo.svg" 
              alt="Whistle Logo" 
              width={100} 
              height={100} 
              priority
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-white cooper-font"
            variants={fadeIn}
          >
            Connect Your Wallet
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Link your wallet or sign in with Gmail to get started
          </motion.p>
          
          <motion.div 
            className="flex flex-col items-center gap-8 mt-12"
            variants={fadeIn}
          >
            {/* MetaMask Wallet Connection */}
            <div className="w-full max-w-md">
              <div className="glass p-8 rounded-xl flex flex-col items-center">
                <div className="w-64 h-64 bg-white/10 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-white/30">
                  {isConnecting || isPending || isSwitchingChain ? (
                    <div className="animate-spin w-12 h-12 border-4 border-secondary-yellow border-t-transparent rounded-full"></div>
                  ) : connectionSuccess ? (
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <p className="text-green-400">Successfully connected!</p>
                    </div>
                  ) : (
                    <Image 
                      src="/images/token-icon.svg" 
                      alt="MetaMask" 
                      width={80} 
                      height={80}
                    />
                  )}
                </div>
                {connectionError && (
                  <div className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-4 text-sm text-white">
                    {connectionError}
                  </div>
                )}
                {connectionSuccess && (
                  <div className="bg-green-500/20 border border-green-500 p-3 rounded-lg mb-4 text-sm text-white">
                    Wallet connected successfully! Redirecting...
                  </div>
                )}
                <button 
                  onClick={handleConnectWallet}
                  disabled={isConnecting || isPending || isSwitchingChain || connectionSuccess}
                  className="whistle-button-primary w-full py-3 rounded-full text-lg mb-4 flex items-center justify-center gap-2"
                >
                  {isConnecting || isPending 
                    ? "Connecting..." 
                    : isSwitchingChain 
                      ? "Switching to SEI Network..." 
                      : connectionSuccess
                        ? "Connected!"
                        : "Connect MetaMask Wallet"}
                </button>
                <p className="text-xs text-white/50 text-center">
                  Will connect to Westend Asset Hub (Polkadot)
                </p>
              </div>
            </div>

            <div className="flex items-center w-full max-w-md my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <p className="mx-4 text-white/50">OR</p>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Gmail Login */}
            <div className="w-full max-w-md mb-8">
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-center">Continue with Gmail</h3>
                <form onSubmit={handleGmailLogin} className="flex flex-col gap-4">
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-yellow"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="whistle-button-secondary w-full py-3 rounded-full text-lg relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin w-5 h-5 border-2 border-secondary-blue border-t-transparent rounded-full mr-2"></span>
                        Signing in...
                      </span>
                    ) : (
                      "Continue with Gmail"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
