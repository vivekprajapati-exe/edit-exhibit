
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  aspectRatio?: "16:9" | "1:1" | "4:3" | "21:9";
  className?: string;
}

const VideoPlayer = ({ 
  youtubeId, 
  title, 
  aspectRatio = "16:9", 
  className 
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
    "21:9": "aspect-[21/9]",
  }[aspectRatio];

  const handlePlay = () => {
    // YouTube iframe API to control playback
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    // YouTube iframe API to control playback
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    // Clear existing timeout if there is one
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(false);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return (
    <motion.div 
      className={cn("custom-video-player group", aspectRatioClass, className)}
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <iframe
        ref={playerRef}
        className="absolute w-full h-full top-0 left-0"
        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <div className="text-white text-sm font-medium ml-2 hidden sm:block">
                {title}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                aria-label="Toggle volume"
              >
                <Volume2 size={16} />
              </button>
              
              <button 
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                aria-label="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer;
