
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex bg-black items-center justify-center px-6 py-20 overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none z-0"></div>
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0"
        style={{
          background: 'black',
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
              <h1 className="font-bebas text-4xl md:text-5xl lg:text-7xl font-bold leading-tight uppercase glow-text  ">
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
              <Button className="rounded-full px-8 py-6 bg-white hover:bg-gray-200 text-black     hover-lift">
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
            <div className=" overflow-x-hidden glass-effect">
              <video 
                className="w-full aspect-video object-cover"
                autoPlay 
                muted 
                loop 
                playsInline
                poster="/lovable-uploads/landing-page.gif"
              >
                <source src="/lovable-uploads/landing-page.gif" type="video/gif" />
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
