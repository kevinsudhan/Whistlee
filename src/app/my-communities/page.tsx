"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MyCommunities() {
  const [activeTab, setActiveTab] = useState("my-communities");
  const router = useRouter();

  // Mock data for communities
  const myCommunities = [
    {
      id: "berkeley",
      name: "UC Berkeley",
      fullName: "University of California, Berkeley",
      members: 1250,
      image: "/images/token-icon.svg"
    }
  ];

  const exploreCommunities = [
    {
      id: "stanford",
      name: "Stanford",
      fullName: "Stanford University",
      members: 3500,
      image: "/images/token-icon.svg"
    },
    {
      id: "harvard",
      name: "Harvard",
      fullName: "Harvard University",
      members: 2800,
      image: "/images/token-icon.svg"
    },
    {
      id: "mit",
      name: "MIT",
      fullName: "Massachusetts Institute of Technology",
      members: 2200,
      image: "/images/token-icon.svg"
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
            <Image 
              src="/images/whistle-logo.svg" 
              alt="Whistle Logo" 
              width={40} 
              height={40} 
            />
            <h1 className="text-2xl font-bold cooper-font">Whistle!</h1>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-bold">KD</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Communities</h2>
          
          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-8">
            <button 
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'my-communities' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setActiveTab('my-communities')}
            >
              My Communities
            </button>
            <button 
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'explore' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setActiveTab('explore')}
            >
              Explore
            </button>
          </div>
          
          {/* My Communities Tab */}
          {activeTab === 'my-communities' && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {myCommunities.map((community) => (
                <motion.div 
                  key={community.id}
                  className="glass p-6 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                  variants={item}
                  onClick={() => router.push(`/community/${community.id}`)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Image 
                        src={community.image} 
                        alt={community.name} 
                        width={32} 
                        height={32} 
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{community.name}</h3>
                      <p className="text-white/70">{community.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-white/70">Members</p>
                      <p className="text-lg font-bold">{community.members}</p>
                    </div>
                    
                    <button 
                      className="whistle-button-primary py-2 px-4 rounded-full text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/community/${community.id}`);
                      }}
                    >
                      View Community
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {exploreCommunities.map((community) => (
                <motion.div 
                  key={community.id}
                  className="glass p-6 rounded-xl"
                  variants={item}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Image 
                        src={community.image} 
                        alt={community.name} 
                        width={32} 
                        height={32} 
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{community.name}</h3>
                      <p className="text-white/70">{community.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-white/70">Members</p>
                      <p className="text-lg font-bold">{community.members}</p>
                    </div>
                    
                    <button className="whistle-button-secondary py-2 px-4 rounded-full text-sm">
                      Join Community
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
