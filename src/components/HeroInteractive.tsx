
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroInteractiveProps {
  youtubeId: string;
}

const HeroInteractive = ({ youtubeId }: HeroInteractiveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Parallax effect using framer-motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, 5]);

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    tl.to('.hero-text', { y: 100, opacity: 0 });
    tl.to('.play-button', { scale: 1.2, opacity: 1 }, "<");

    return () => {
      tl.kill();
    };
  }, []);

  const handlePlayClick = () => {
    setShowVideo(true);
    setVideoPlaying(true);
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* Cinematic background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-[#0a0a0a] z-0"></div>
      
      {/* Grid background pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>
      
      {/* Animated particles background */}
      <div className="absolute inset-0 z-0 particle-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* 3D transforming thumbnail */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          style={{ scale, opacity, y, rotateX }}
          className="max-w-5xl mx-auto relative"
        >
          <motion.div 
            ref={videoRef}
            className="aspect-video relative overflow-hidden rounded-xl glass-effect shadow-2xl transform perspective-1000"
          >
            {showVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${videoPlaying ? 1 : 0}&mute=0&controls=1&rel=0&modestbranding=1`}
                title="Showreel video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <div className="absolute inset-0 bg-black/30"></div>
                <img 
                  src="/lovable-uploads/landing-page.gif" 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover"
                />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center play-button"
                  initial={{ opacity: 0.7, scale: 1 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  onClick={handlePlayClick}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover-lift">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
          
          <motion.div className="mt-8 text-center hero-text">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bebas tracking-tight text-white mb-4">
              <span className="text-gradient">CINEMATIC</span> STORYTELLING
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Transforming ideas into visual masterpieces through the art of video editing and cinematography
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroInteractive;
