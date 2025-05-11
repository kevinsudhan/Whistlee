"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiArrowLeft, FiClock, FiCheck, FiArrowUp, FiArrowDown } from "react-icons/fi";
import CountUp from "@/components/CountUp";

// Dynamic imports for charts
const BarChart = dynamic(() => import('react-apexcharts'), { ssr: false });
const LineChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function MyActivities() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for user activities
  const activities = [
    {
      id: 1,
      type: "lend",
      amount: 25000,
      recipient: "Rahul S.",
      date: "Apr 15, 2025",
      status: "active",
      repaymentProgress: 65,
      dueDate: "Jun 15, 2025"
    },
    {
      id: 2,
      type: "request",
      amount: 15000,
      lender: "Community Pool",
      date: "Mar 10, 2025",
      status: "active",
      repaymentProgress: 80,
      dueDate: "May 10, 2025"
    },
    {
      id: 3,
      type: "lend",
      amount: 10000,
      recipient: "Priya M.",
      date: "Feb 20, 2025",
      status: "completed",
      repaymentProgress: 100,
      dueDate: "Apr 20, 2025"
    },
    {
      id: 4,
      type: "request",
      amount: 30000,
      lender: "Ankit P.",
      date: "Jan 05, 2025",
      status: "completed",
      repaymentProgress: 100,
      dueDate: "Mar 05, 2025"
    }
  ];

  // Monthly earnings data
  const monthlyEarnings = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1500 },
    { month: "Mar", amount: 1800 },
    { month: "Apr", amount: 2200 },
    { month: "May", amount: 2500 },
    { month: "Jun", amount: 0 },
    { month: "Jul", amount: 0 },
    { month: "Aug", amount: 0 },
    { month: "Sep", amount: 0 },
    { month: "Oct", amount: 0 },
    { month: "Nov", amount: 0 },
    { month: "Dec", amount: 0 }
  ];

  // Loan type distribution
  const loanTypeDistribution = [
    { type: "Education", count: 3 },
    { type: "Business", count: 2 },
    { type: "Personal", count: 1 }
  ];

  // Line chart options for earnings
  const lineChartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#4D94FF'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: monthlyEarnings.map(item => item.month),
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        },
        formatter: function(value: number) {
          return '$' + value;
        }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    tooltip: {
      theme: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#FFD700'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    }
  };

  const lineChartSeries = [
    {
      name: 'Interest Earned',
      data: monthlyEarnings.map(item => item.amount)
    }
  ];

  // Bar chart options for loan types
  const barChartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#FFD700'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: loanTypeDistribution.map(item => item.type),
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const barChartSeries = [
    {
      name: 'Loans',
      data: loanTypeDistribution.map(item => item.count)
    }
  ];

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

  // Filter activities based on active tab
  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeTab);

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
            <h1 className="text-2xl font-bold cooper-font">My Activities</h1>
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
          {/* Summary Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={fadeIn}
          >
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Total Lent</h3>
              <p className="text-3xl font-bold">
                <CountUp end={35000} prefix="$" duration={2.5} />
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Total Borrowed</h3>
              <p className="text-3xl font-bold">
                <CountUp end={45000} prefix="$" duration={2.5} />
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Interest Earned</h3>
              <p className="text-3xl font-bold">
                <CountUp end={9200} prefix="$" duration={2.5} />
              </p>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Earnings Chart */}
            <motion.div 
              className="glass p-6 rounded-xl"
              variants={fadeIn}
            >
              <h3 className="text-xl font-bold mb-4">Monthly Earnings</h3>
              <div className="h-80">
                {typeof window !== 'undefined' && (
                  <LineChart
                    options={lineChartOptions as any}
                    series={lineChartSeries as any}
                    type="area"
                    height="100%"
                  />
                )}
              </div>
            </motion.div>
            
            {/* Loan Types Chart */}
            <motion.div 
              className="glass p-6 rounded-xl"
              variants={fadeIn}
            >
              <h3 className="text-xl font-bold mb-4">Loan Types</h3>
              <div className="h-80">
                {typeof window !== 'undefined' && (
                  <BarChart
                    options={barChartOptions as any}
                    series={barChartSeries as any}
                    type="bar"
                    height="100%"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Activities Section */}
          <motion.div 
            className="glass p-6 rounded-xl"
            variants={fadeIn}
          >
            <h3 className="text-xl font-bold mb-4">Activity History</h3>
            
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              <button 
                className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`py-2 px-4 font-medium ${activeTab === 'lend' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
                onClick={() => setActiveTab('lend')}
              >
                Lending
              </button>
              <button 
                className={`py-2 px-4 font-medium ${activeTab === 'request' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
                onClick={() => setActiveTab('request')}
              >
                Borrowing
              </button>
            </div>
            
            {/* Activity List */}
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'lend' ? 'bg-secondary-yellow/20' : 'bg-secondary-blue/20'}`}>
                        {activity.type === 'lend' ? (
                          <FiArrowUp className="text-secondary-yellow" size={18} />
                        ) : (
                          <FiArrowDown className="text-secondary-blue" size={18} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold">
                          {activity.type === 'lend' ? `Lent to ${activity.recipient}` : `Borrowed from ${activity.lender}`}
                        </h4>
                        <p className="text-sm text-white/70">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${activity.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-sm">
                        {activity.status === 'active' ? (
                          <>
                            <FiClock className="text-yellow-400" size={14} />
                            <span className="text-yellow-400">Active</span>
                          </>
                        ) : (
                          <>
                            <FiCheck className="text-green-400" size={14} />
                            <span className="text-green-400">Completed</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for repayment */}
                  {activity.status === 'active' && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Repayment Progress</span>
                        <span>{activity.repaymentProgress}%</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-secondary-yellow to-secondary-blue"
                          style={{ width: `${activity.repaymentProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-white/70">
                        <span>Due: {activity.dueDate}</span>
                        <span>
                          {activity.type === 'lend' ? 'Receiving' : 'Paying'}: 
                          ${Math.round(activity.amount * 0.085).toLocaleString()} interest
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
