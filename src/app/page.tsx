"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import of Lottie component
const LottiePlayer = dynamic(() => import("lottie-react"), { ssr: false });

// CountUp component for animated number display
const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    let animationFrame: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * end));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isInView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

// Floating element component
const FloatingElement = ({ 
  children, 
  className = "", 
  delay = 0,
  duration = 5,
  type = "move-ud"
}: { 
  children?: React.ReactNode; 
  className?: string;
  delay?: number;
  duration?: number;
  type?: "move-ud" | "move-lr" | "rotate" | "fade";
}) => {
  const animationClass = `animate-${type}`;
  
  return (
    <div 
      className={`absolute ${animationClass} ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Particle component
const Particle = ({ 
  size, 
  color = "white", 
  top, 
  left, 
  delay = 0 
}: { 
  size: number; 
  color?: string; 
  top: string; 
  left: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      className="particle particle-animation"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        top,
        left,
        opacity: Math.random() * 0.5 + 0.1,
        animationDelay: `${delay}s`
      }}
      animate={{
        y: [0, -20, 20, -10, 0],
        x: [0, 15, -15, 10, 0],
        scale: [1, 1.2, 0.8, 1.1, 1],
        opacity: [0.2, 0.5, 0.3, 0.6, 0.2]
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  // Load animation data
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Using the specific animation file provided by the user
        const response = await fetch('/animations/Animation - 1746433301187.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Failed to load animation:", error);
      }
    };
    
    loadAnimation();
  }, []);

  // Function to handle button click and transition
  const handleGetStarted = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonDimensions({
        width: rect.width,
        height: rect.height,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
      });
    }
    
    setIsLoading(true);
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push('/get-started');
    }, 2000);
  };

  // Stats data with values for count-up animation
  const stats = [
    { title: "Communities", value: 150, suffix: "+" },
    { title: "Users", value: 25000, suffix: "+" },
    { title: "Loans Funded", value: 75, prefix: "$", suffix: "M" },
    { title: "Success Rate", value: 98, suffix: "%" }
  ];
  
  // How it works steps
  const howItWorks = [
    { 
      title: "Join a Community",
      description: "Connect with your college or corporate community"
    },
    { 
      title: "Request Funding",
      description: "Create a funding request with your decentralized identity"
    },
    { 
      title: "Gain Trust Stakes",
      description: "Community members stake their trust to vouch for you"
    },
    { 
      title: "Receive & Repay",
      description: "Get funded and repay with interest shared among stakeholders"
    }
  ];

  // Generate random particles
  const particles = Array.from({ length: 50 }).map((_, index) => ({
    id: index,
    size: Math.random() * 4 + 1,
    color: Math.random() > 0.5 ? "rgba(255, 215, 0, 0.4)" : "rgba(0, 102, 204, 0.4)",
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5
  }));

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
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

      {/* Particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          size={particle.size}
          color={particle.color}
          top={particle.top}
          left={particle.left}
          delay={particle.delay}
        />
      ))}

      {/* Floating animated elements */}
      <FloatingElement className="top-[10%] left-[5%] w-8 h-8 md:w-12 md:h-12 bg-secondary-yellow rounded-full opacity-20 blur-md z-[2]" type="move-ud" duration={6}>
        <div className="w-full h-full rounded-full" />
      </FloatingElement>
      
      <FloatingElement className="top-[20%] right-[8%] w-6 h-6 md:w-10 md:h-10 bg-secondary-blue rounded-full opacity-20 blur-md z-[2]" type="move-lr" duration={7} delay={1}>
        <div className="w-full h-full rounded-full" />
      </FloatingElement>
      
      <FloatingElement className="bottom-[15%] left-[12%] w-10 h-10 md:w-16 md:h-16 bg-secondary-yellow rounded-full opacity-15 blur-md z-[2]" type="move-lr" duration={8} delay={2}>
        <div className="w-full h-full rounded-full" />
      </FloatingElement>
      
      <FloatingElement className="bottom-[25%] right-[15%] w-8 h-8 md:w-14 md:h-14 bg-secondary-blue rounded-full opacity-15 blur-md z-[2]" type="move-ud" duration={9} delay={3}>
        <div className="w-full h-full rounded-full" />
      </FloatingElement>
      
      <FloatingElement className="top-[30%] left-[25%] w-20 h-20 md:w-32 md:h-32 opacity-5 z-[2]" type="rotate" duration={40}>
        <div className="w-full h-full border-2 border-white/10 rounded-full"></div>
      </FloatingElement>
      
      <FloatingElement className="bottom-[40%] right-[20%] w-16 h-16 md:w-24 md:h-24 opacity-5 z-[2]" type="rotate" duration={30} delay={2}>
        <div className="w-full h-full border-2 border-white/10 rounded-full"></div>
      </FloatingElement>

      {/* Loading overlay for button transition */}
      {isLoading && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300"
          style={{ 
            opacity: isLoading ? 1 : 0,
          }}
        >
          <motion.div
            initial={{ 
              width: buttonDimensions.width, 
              height: buttonDimensions.height,
              borderRadius: "9999px",
              background: "linear-gradient(90deg, var(--secondary-yellow) 0%, var(--secondary-blue) 100%)"
            }}
            animate={{ 
              width: 200, 
              height: 200,
              borderRadius: "50%",
              background: "transparent"
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {animationData && (
              <LottiePlayer 
                animationData={animationData} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 relative"
          >
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-secondary-yellow/20 to-secondary-blue/20 blur-md"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Image
              src="/images/whistle-logo.svg"
              alt="Whistle Logo"
              width={180}
              height={180}
              priority
              className="mx-auto drop-shadow-xl relative"
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-7xl font-bold mb-6 text-white drop-shadow-md cooper-font"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Whistle!
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl mb-12 text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Decentralized microfinance for communities on Westend Asset Hub (Polkadot), powered by trust and blockchain technology
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-20"
          >
            <button
              ref={buttonRef}
              onClick={handleGetStarted}
              disabled={isLoading}
              className="whistle-button-primary rounded-full px-16 py-5 text-2xl font-bold inline-block shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <motion.span 
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear"
                }}
              />
            </button>
          </motion.div>
        </motion.div>

        {/* Stats cards with glassmorphism and count-up animation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl px-4 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 } 
              }}
              className="glass rounded-2xl py-5 px-3 md:py-6 md:px-4 text-center flex flex-col items-center justify-center aspect-square"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 font-mono tracking-tight">
                {stat.prefix && <span className="mr-1">{stat.prefix}</span>}
                <CountUp end={stat.value} duration={2500} />
                {stat.suffix && <span>{stat.suffix}</span>}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-secondary-yellow to-secondary-blue rounded-full mb-3">
                <motion.div 
                  className="h-full w-1/3 bg-white rounded-full"
                  animate={{ x: [0, 24, 0] }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <h4 className="text-sm md:text-lg font-medium text-white/80 tracking-wide uppercase text-sm">{stat.title}</h4>
            </motion.div>
          ))}
        </motion.div>
        
        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-6xl px-4"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-12 text-white text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + (index * 0.1) }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 } 
                }}
                className="glass-dark rounded-2xl p-6 text-center relative"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-secondary-yellow flex items-center justify-center font-bold text-black text-lg shadow-lg">
                  {index + 1}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-secondary-yellow"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white mt-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="mt-16 text-center"
          >
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="whistle-button-primary rounded-full px-8 py-4 text-lg md:px-10 md:py-4 md:text-xl font-bold inline-block relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started Now</span>
              <motion.span 
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear"
                }}
              />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
