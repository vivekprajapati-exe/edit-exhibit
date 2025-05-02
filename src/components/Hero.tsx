
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(125, 125, 125, 0.15), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-bebas text-4xl md:text-5xl lg:text-7xl font-bold leading-tight uppercase">
                Bringing <span className="text-gradient">Stories to Life</span> Through <span className="relative px-2 py-1 whitespace-nowrap">
                  <span className="relative z-10 glow-text">Expert Editing</span>
                  <span className="absolute inset-0 bg-white/5 rounded-md -z-10 glass-effect"></span>
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Professional video editor specializing in cinematic storytelling, motion graphics, and color grading. Elevate your visuals with precision and creativity.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4"
            >
              <Button className="rounded-full px-8 py-6 bg-white hover:bg-gray-200 text-black font-boldone text-lg hover-lift">
                <a href="#portfolio">View Portfolio</a>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 glass-effect">
              <video 
                className="w-full aspect-video object-cover"
                autoPlay 
                muted 
                loop 
                playsInline
                poster="https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-editing-a-movie-in-a-studio-22728-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
