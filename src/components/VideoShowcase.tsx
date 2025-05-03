
import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface VideoShowcaseProps {
  youtubeId: string;
}

const VideoShowcase = ({ youtubeId }: VideoShowcaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <div 
      ref={containerRef}
      className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="aspect-video w-full relative rounded-xl overflow-hidden shadow-2xl"
        >
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&controls=1&showinfo=0&autoplay=0`}
            title="Showreel video"
            className="absolute w-full h-full top-0 left-0 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 md:mt-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bebas tracking-tight text-white mb-4">
            MY LATEST <span className="text-gradient">SHOWREEL</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A collection of my best work showcasing my skills in editing, 
            color grading, and visual storytelling.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoShowcase;
