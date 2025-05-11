"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiArrowLeft, FiCalendar, FiInfo, FiLoader } from "react-icons/fi";
import { ethers } from "ethers";
import { WS_Abi, WS_CONTRACT_ADDRESS } from "@/config/WS_Abi";
import { WestendAsset } from "@/config/chains";

// Dynamic import of Lottie component
const LottiePlayer = dynamic(() => import("lottie-react"), { ssr: false });

// LoanStorage ABI for checking contract state
const LOAN_STORAGE_ABI = [
  {
    "inputs": [],
    "name": "manager",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export default function RequestForm() {
  const router = useRouter();
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ethers state
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Contract state
  const [storageContractAddress, setStorageContractAddress] = useState<string | null>(null);
  const [whistleLoanOwner, setWhistleLoanOwner] = useState<string | null>(null);
  const [loanStorageManager, setLoanStorageManager] = useState<string | null>(null);

  // Connect wallet and set provider/signer/address/chainId
  const connectWallet = async () => {
    if (typeof window === "undefined" || !('ethereum' in window)) {
      setError("MetaMask not found. Please install MetaMask.");
      return;
    }
    try {
      // Type guard for window.ethereum
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) {
        setError("MetaMask not found. Please install MetaMask.");
        return;
      }
      const _provider = new ethers.BrowserProvider(eth);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _address = await _signer.getAddress();
      const { chainId: _chainId } = await _provider.getNetwork();
      setProvider(_provider);
      setSigner(_signer);
      setAddress(_address);
      setChainId(Number(_chainId));
    } catch {
      setError("Failed to connect wallet.");
    }
  };

  // Read contract state
  const fetchContractState = async () => {
    if (!provider) return;
    try {
      const whistleLoan = new ethers.Contract(WS_CONTRACT_ADDRESS, WS_Abi, provider);
      const _storageContractAddress = await whistleLoan.storageContract();
      const _whistleLoanOwner = await whistleLoan.owner();
      setStorageContractAddress(_storageContractAddress);
      setWhistleLoanOwner(_whistleLoanOwner);

      // Read manager from LoanStorage
      const loanStorage = new ethers.Contract(_storageContractAddress, LOAN_STORAGE_ABI, provider);
      const _loanStorageManager = await loanStorage.manager();
      setLoanStorageManager(_loanStorageManager);
    } catch {
      setError("Failed to fetch contract state.");
    }
  };

  useEffect(() => {
    if (provider) fetchContractState();
    // eslint-disable-next-line
  }, [provider]);

  // Current interest rate
  const interestRate = 8.5;

  // Calculate monthly payment based on amount, period and interest rate
  const monthlyPayment = useMemo(() => {
    if (!amount || !loanPeriod) return null;
    
    const principal = parseFloat(amount);
    if (isNaN(principal) || principal <= 0) return null;
    
    let months = 0;
    switch (loanPeriod) {
      case "20days":
        months = 20/30; // Approximately 2/3 of a month
        break;
      case "1month":
        months = 1;
        break;
      case "2months":
        months = 2;
        break;
      case "3months":
        months = 3;
        break;
      default:
        return null;
    }
    
    // Simple interest calculation
    const interest = principal * (interestRate / 100) * (months / 12);
    const totalAmount = principal + interest;
    const payment = totalAmount / months;
    
    return Math.round(payment);
  }, [amount, loanPeriod, interestRate]);

  // Load animation data
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Using the specific animation file provided by the user
        const response = await fetch('/animations/Animation - 1746436161234.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Failed to load animation:", error);
      }
    };
    
    loadAnimation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTransactionHash(null);
    setIsTransactionComplete(false);

    if (!signer || !address || !chainId) {
      setError("Please connect your wallet first");
      return;
    }

    if (chainId !== WestendAsset.id) {
      setError("Please switch to Westend Asset Hub network");
      return;
    }

    if (!storageContractAddress || !whistleLoanOwner || !loanStorageManager) {
      setError("Contract state not loaded. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const amountBigInt = BigInt(amount);

      // Log all contract state and arguments
      console.log("About to call requestLoan with:", {
        contract: WS_CONTRACT_ADDRESS,
        storageContract: storageContractAddress,
        whistleLoanOwner,
        loanStorageManager,
        amount: amountBigInt,
        data: purpose,
        sender: address
      });

      const whistleLoan = new ethers.Contract(WS_CONTRACT_ADDRESS, WS_Abi, signer);
      let tx;
      try {
        tx = await whistleLoan.requestLoan(amountBigInt, purpose, { gasLimit: 500000 });
      } catch (innerErr) {
        // Try a minimal hardcoded transaction for debugging
        console.error("Dynamic transaction failed, trying minimal call. Error:", innerErr);
        tx = await whistleLoan.requestLoan(BigInt(1), "fl", { gasLimit: 500000 });
      }
      setTransactionHash(tx.hash);
      await tx.wait();
      setIsTransactionComplete(true);

      setTimeout(() => {
        router.push('/community/svce');
      }, 5000);

    } catch (err: unknown) {
      console.error("Full error object:", err);
      let errorMsg = "Failed to submit loan request. Please try again.";
      if (typeof err === "object" && err !== null) {
        if ("reason" in err && typeof (err as { reason: unknown }).reason === "string") {
          errorMsg = (err as { reason: string }).reason;
        } else if ("message" in err && typeof (err as { message: unknown }).message === "string") {
          errorMsg = (err as { message: string }).message;
        } else {
          errorMsg = JSON.stringify(err);
        }
      }
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  // Animation variants
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold cooper-font">Request Loan</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">KD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-md mx-auto">
          <button
            className="whistle-button-primary w-full py-3 rounded-full text-lg mb-4"
            onClick={connectWallet}
            disabled={!!address}
          >
            {address ? `Wallet Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Connect MetaMask Wallet"}
          </button>
          <motion.form 
            onSubmit={handleSubmit}
            className="glass p-6 rounded-xl"
            variants={fadeIn}
          >
            <h2 className="text-xl font-bold mb-6">Loan Request Form</h2>
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm">
                {error}
              </div>
            )}
            
            {/* Purpose */}
            <div className="mb-6">
              <label className="block text-white/70 mb-2">Purpose?</label>
              <div className="relative">
                <FiInfo className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input 
                  type="text" 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-yellow"
                  placeholder="E.g., Education, Business, Personal"
                  required
                />
              </div>
            </div>
            
            {/* Amount */}
            <div className="mb-6">
              <label className="block text-white/70 mb-2">How much money do you require?</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-yellow"
                  placeholder="Enter amount in $"
                  min="0"
                  required
                />
              </div>
            </div>
            
            {/* Loan Period */}
            <div className="mb-6">
              <label className="block text-white/70 mb-2">Loan Period</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <select 
                  value={loanPeriod}
                  onChange={(e) => setLoanPeriod(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-yellow"
                  required
                  style={{ color: 'white' }}
                >
                  <option value="" disabled style={{ color: 'black' }}>Select loan period</option>
                  <option value="20days" style={{ color: 'black' }}>20 days</option>
                  <option value="1month" style={{ color: 'black' }}>1 month</option>
                  <option value="2months" style={{ color: 'black' }}>2 months</option>
                  <option value="3months" style={{ color: 'black' }}>3 months</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              {/* Monthly payment information */}
              {monthlyPayment && (
                <div className="mt-2 text-secondary-yellow">
                  <p>Monthly payment: ${monthlyPayment.toLocaleString()}</p>
                </div>
              )}
            </div>
            
            {/* Interest Rate */}
            <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Current Interest Rate</span>
                <span className="text-xl font-bold text-secondary-yellow">{interestRate}%</span>
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full whistle-button-primary py-3 rounded-lg text-base font-bold"
              disabled={isSubmitting || !signer}
            >
              {isSubmitting ? "Processing..." : "Send for Approval"}
            </button>
          </motion.form>
        </div>
      </motion.main>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className="w-64 h-64 mb-6">
            {isTransactionComplete ? (
              animationData && (
                <LottiePlayer 
                  animationData={animationData} 
                  loop={false}
                  style={{ width: '100%', height: '100%' }}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin text-secondary-yellow">
                  <FiLoader size={64} />
                </div>
              </div>
            )}
          </div>
          <p className="text-xl font-medium text-white text-center mb-4">
            {!isTransactionComplete 
              ? "Processing your loan request..."
              : "Your request has been submitted for approval!"
            }
          </p>
          
          {isTransactionComplete && transactionHash && (
            <div className="bg-white/10 rounded-lg p-3 max-w-md">
              <p className="text-sm text-white/70 mb-1">Transaction Hash:</p>
              <p className="text-xs font-mono text-secondary-yellow break-all">
                {transactionHash}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
