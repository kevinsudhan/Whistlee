"use client";

import { useState, useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function CountUp({ 
  end, 
  duration = 2, 
  prefix = "", 
  suffix = "",
  decimals = 0
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const steps = 60 * duration; // 60fps * duration in seconds
    const increment = end / steps;
    let currentCount = 0;
    
    countRef.current = setInterval(() => {
      currentCount += increment;
      if (currentCount >= end) {
        if (countRef.current) clearInterval(countRef.current);
        setCount(end);
      } else {
        setCount(currentCount);
      }
    }, 1000 / 60); // 60fps
    
    return () => {
      if (countRef.current) clearInterval(countRef.current);
    };
  }, [end, duration]);

  const formatNumber = (num: number) => {
    return prefix + num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
  };

  return <>{formatNumber(count)}</>;
}
