'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

interface AdVideoProps {
  onClose: () => void;
}

export default function AdVideo({ onClose }: AdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }

    // Set a timeout to auto-close the ad after the video duration
    const autoCloseTimeout = setTimeout(() => {
      onClose();
    }, 30000); // 30 seconds max, or the video will close itself when it ends

    return () => {
      clearTimeout(autoCloseTimeout);
    };
  }, [onClose]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Auto-close after video ends
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative max-w-3xl w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full p-1 z-10 hover:bg-gray-200 transition-colors"
          aria-label="Close advertisement"
        >
          <FiX size={24} />
        </button>
        
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 bg-secondary-yellow text-black px-3 py-1 text-sm font-bold rounded-br-lg">
            Advertisement
          </div>
          
          <video 
            ref={videoRef}
            src="/videos/classmate-ad.mp4" 
            className="w-full"
            controls={false}
            muted={false}
            playsInline
            onEnded={handleVideoEnd}
          />
          
          <div className="absolute bottom-4 right-4">
            <button 
              onClick={onClose}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Skip Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
