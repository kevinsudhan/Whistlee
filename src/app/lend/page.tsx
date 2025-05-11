"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiArrowLeft, FiUser, FiPercent, FiCalendar, FiUsers, FiCheck, FiLoader } from "react-icons/fi";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { WS_Abi, WS_CONTRACT_ADDRESS } from "@/config/WS_Abi";
import { parseEther } from "ethers";
import { createMetaMaskCompatibleConfig } from "@/utils/transactionUtils";

// Dynamic import of Lottie component
const LottiePlayer = dynamic(() => import("lottie-react"), { ssr: false });

// Define the request type
interface LoanRequest {
  id: string;
  borrowerAddress: string;
  purpose: string;
  amount: bigint;
  period: string;
  interestRate: string;
  riskScore: string;
  stakers: number;
  startTime: bigint;
  repaymentAmount: bigint;
  isRepaid: boolean;
}

export default function LendPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [animationData, setAnimationData] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [action, setAction] = useState<'lend' | 'stake'>('lend');
  const [error, setError] = useState<string | null>(null);
  const [approvedRequests, setApprovedRequests] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loanRequestersList, setLoanRequestersList] = useState<string[]>([]);
  
  const { address, isConnected } = useAccount();
  
  // Mock data for loan requesters since the contract doesn't have getAllLoanRequesters function
  const loanRequesters = [
    "0x7F5Ec3a12bCD4282E4E8780f76D13d9AbF2c3a12",
    "0x3A8b9c45F12d7b23E9E3c5f67D2D4a1e89",
    "0xF12d7b23E9E3c5f67D2D4a1e89"
  ];
  const isLoanRequestersError = false;
  
  // Mock interest rate data
  const interestRate = 8.5;
  
  // Write contract function
  const { writeContractAsync } = useWriteContract();

  // Update loan requesters list when data is available
  useEffect(() => {
    if (loanRequesters && Array.isArray(loanRequesters)) {
      // Filter out zero addresses
      const validRequesters = loanRequesters.filter(
        addr => addr !== '0x0000000000000000000000000000000000000000'
      );
      setLoanRequestersList(validRequesters);
      console.log("Loan requesters:", validRequesters);
    }
  }, [loanRequesters]);

  // Fetch loan details for each requester
  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (loanRequestersList.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching details for requesters:", loanRequestersList);
        
        // For now, create mock data based on the actual requesters
        const requests: LoanRequest[] = loanRequestersList.map((requester, index) => {
          // Generate different amounts based on index
          const amount = BigInt(15000 + (index * 10000));
          const repaymentAmount = amount + (amount * BigInt(10) / BigInt(100));
          
          // Determine period based on amount
          let period = "1 month";
          if (Number(amount) > 30000) {
            period = "3 months";
          } else if (Number(amount) > 20000) {
            period = "2 months";
          }
          
          // Determine risk score
          let riskScore = "Low";
          if (index % 3 === 0) {
            riskScore = "Medium";
          } else if (index % 5 === 0) {
            riskScore = "High";
          }
          
          // Generate purpose based on index
          let purpose = "General Loan";
          if (index % 3 === 0) {
            purpose = "Education Fees";
          } else if (index % 3 === 1) {
            purpose = "Business Expansion";
          } else if (index % 3 === 2) {
            purpose = "Medical Emergency";
          }
          
          return {
            id: `req-${index}`,
            borrowerAddress: requester,
            purpose,
            amount,
            period,
            interestRate: interestRate ? `${Number(interestRate)}%` : "8.5%",
            riskScore,
            stakers: Math.floor(Math.random() * 5) + 1, // Random staker count
            startTime: BigInt(Date.now() - (index * 86400000)), // Different start times
            repaymentAmount,
            isRepaid: false
          };
        });
        
        setApprovedRequests(requests);
      } catch (err) {
        console.error("Error creating loan requests:", err);
        setError("Failed to process loan requests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoanDetails();
  }, [loanRequestersList, interestRate]);

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

  // Add fallback mock data if no requesters are found
  useEffect(() => {
    if (!isLoading && approvedRequests.length === 0 && !isLoanRequestersError) {
      console.log("No loan requesters found, adding mock data");
      
      // Add mock data if no loan requesters are found
      setApprovedRequests([
        {
          id: "req1",
          borrowerAddress: "0x1234567890123456789012345678901234567890",
          purpose: "Education Fees",
          amount: BigInt(25000),
          period: "2 months",
          interestRate: interestRate ? `${Number(interestRate)}%` : "8.5%",
          riskScore: "Low",
          stakers: 3,
          startTime: BigInt(Date.now()),
          repaymentAmount: BigInt(27125),
          isRepaid: false
        },
        {
          id: "req2",
          borrowerAddress: "0x2345678901234567890123456789012345678901",
          purpose: "Business Expansion",
          amount: BigInt(50000),
          period: "3 months",
          interestRate: interestRate ? `${Number(interestRate)}%` : "9.2%",
          riskScore: "Medium",
          stakers: 5,
          startTime: BigInt(Date.now()),
          repaymentAmount: BigInt(54600),
          isRepaid: false
        },
        {
          id: "req3",
          borrowerAddress: "0x3456789012345678901234567890123456789012",
          purpose: "Medical Emergency",
          amount: BigInt(15000),
          period: "1 month",
          interestRate: interestRate ? `${Number(interestRate)}%` : "7.8%",
          riskScore: "Low",
          stakers: 2,
          startTime: BigInt(Date.now()),
          repaymentAmount: BigInt(16170),
          isRepaid: false
        }
      ]);
    }
  }, [isLoading, approvedRequests.length, interestRate, isLoanRequestersError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTransactionHash(null);
    setIsTransactionComplete(false);
    
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!selectedRequest) {
      setError("Please select a request first");
      return;
    }
    
    const selectedLoanRequest = approvedRequests.find(r => r.id === selectedRequest);
    if (!selectedLoanRequest) {
      setError("Selected request not found");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (action === 'stake') {
        // Call the stakeForLoan function from the contract
        // For stakeForLoan, the ABI shows it expects a loanId (uint256) parameter
        // Convert the borrowerAddress to a numeric loanId for this example
        // In a real app, you would use the actual loanId
        const loanId = BigInt(1); // Using a placeholder loanId of 1
        
        const hash = await writeContractAsync({
          address: WS_CONTRACT_ADDRESS as `0x${string}`,
          abi: WS_Abi,
          functionName: 'stakeForLoan',
          args: [loanId],
          value: parseEther("0.01"), // Convert to BigInt for value
          // Use the MetaMask compatible configuration
          ...createMetaMaskCompatibleConfig()
        });
        
        console.log("Stake transaction hash:", hash);
        setTransactionHash(hash);
        setIsTransactionComplete(true);
      } else {
        // For lending, we would implement the lending logic here
        // This is a placeholder for now
        console.log("Lending for:", selectedLoanRequest.purpose);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTransactionComplete(true);
      }
      
      // Navigate after animation completes
      setTimeout(() => {
        router.push('/community/svce');
      }, 5000);
    } catch (err) {
      console.error("Error during transaction:", err);
      setError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
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
            <h1 className="text-2xl font-bold cooper-font">
              {action === 'lend' ? 'Lend' : 'Stake'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-1">
              <Image 
                src="/images/token-icon.svg" 
                alt="UC Berkeley Token" 
                width={24} 
                height={24} 
              />
              <span className="ml-2 font-bold">1250</span>
            </div>
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
        <div className="max-w-7xl mx-auto">
          {/* Action Tabs */}
          <motion.div 
            className="flex border-b border-white/10 mb-8"
            variants={fadeIn}
          >
            <button 
              className={`py-3 px-6 font-medium text-lg ${action === 'lend' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setAction('lend')}
            >
              Lend
            </button>
            <button 
              className={`py-3 px-6 font-medium text-lg ${action === 'stake' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setAction('stake')}
            >
              Stake
            </button>
          </motion.div>
          
          {/* Error message */}
          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm"
              variants={fadeIn}
            >
              {error}
            </motion.div>
          )}
          
          {/* Debug info - only in development */}
          <motion.div 
            className="mb-6 p-3 bg-blue-500/20 border border-blue-500 rounded-lg text-white text-sm"
            variants={fadeIn}
          >
            <h3 className="font-bold mb-1">Debug Info:</h3>
            <p>Loan Requesters: {loanRequestersList.length > 0 ? loanRequestersList.join(', ') : 'None found'}</p>
            <p>Interest Rate: {interestRate ? Number(interestRate) : 'Not loaded'}</p>
            <p>Approved Requests: {approvedRequests.length}</p>
          </motion.div>
          
          {/* Approved Requests */}
          <motion.div 
            className="mb-8"
            variants={fadeIn}
          >
            <h2 className="text-xl font-bold mb-6">
              {action === 'lend' ? 'Approved Loan Requests' : 'Stake Opportunities'}
            </h2>
            
            {isLoading ? (
              <div className="glass p-6 rounded-xl flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-secondary-yellow border-t-transparent rounded-full"></div>
                <span className="ml-3">Loading requests...</span>
              </div>
            ) : approvedRequests.length === 0 ? (
              <div className="glass p-6 rounded-xl">
                <p className="text-white/50 italic">No approved requests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedRequests.map((request) => (
                  <div 
                    key={request.id}
                    className={`bg-white/5 rounded-lg border overflow-hidden cursor-pointer transition-colors ${
                      selectedRequest === request.id 
                        ? 'border-secondary-yellow bg-white/10' 
                        : 'border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="p-4">
                      <div className="mb-3">
                        <h5 className="font-bold text-lg mb-1">{request.purpose}</h5>
                        <p className="text-2xl font-bold text-secondary-yellow">${Number(request.amount).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Image 
                            src="/images/token-icon.svg" 
                            alt="UC Berkeley Token" 
                            width={16} 
                            height={16} 
                          />
                          <span className="text-sm text-white/70">1250 Tokens</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUsers className="text-secondary-blue" size={14} />
                          <span className="text-sm text-white/70">{request.stakers} Stakers</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-white/70">
                        <span>Period: {request.period}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.riskScore === 'Low' 
                            ? 'bg-green-500/20 text-green-400' 
                            : request.riskScore === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {request.riskScore} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Action Form */}
          {selectedRequest && (
            <motion.form 
              onSubmit={handleSubmit}
              className="glass p-6 rounded-xl"
              variants={fadeIn}
            >
              <h2 className="text-xl font-bold mb-6">
                {action === 'lend' 
                  ? `Lend for ${approvedRequests.find(r => r.id === selectedRequest)?.purpose}`
                  : `Stake for ${approvedRequests.find(r => r.id === selectedRequest)?.purpose}`
                }
              </h2>
              
              {/* Interest Rate */}
              <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">
                    {action === 'lend' ? 'Expected Return' : 'Potential Reward'}
                  </span>
                  <span className="text-xl font-bold text-secondary-yellow">
                    {approvedRequests.find(r => r.id === selectedRequest)?.interestRate}
                  </span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full whistle-button-primary py-3 rounded-lg text-base font-bold"
                disabled={isSubmitting}
              >
                {action === 'lend' 
                  ? (isSubmitting ? "Processing..." : "Confirm Lending")
                  : (isSubmitting ? "Processing..." : "Confirm Staking")
                }
              </button>
            </motion.form>
          )}
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
              ? `Processing your ${action}...`
              : action === 'lend' 
                ? "Your lending has been confirmed!"
                : "Your staking has been confirmed!"
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
