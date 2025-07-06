
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import RiveCharacter from './RiveCharacter';

const MainHero = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[100vh] flex items-center justify-center px-4 sm:px-6 py-20 relative bg-black overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas tracking-tight font-bold text-white mb-4 glow-text">
                <span className="text-gradient">VISUAL STORYTELLER</span> &<br />
                VIDEO EDITOR
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-400 max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              I transform ideas into captivating visual experiences. With expertise in editing, 
              color grading, and motion graphics, I bring stories to life that engage viewers 
              and elevate your brand.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8"
            >
              <Button 
                onClick={scrollToContact} 
                className="rounded-full px-8 py-6 bg-white hover:bg-gray-200 text-black hover:scale-105 transition-all"
              >
                <span className="mr-2">Hire Me</span>
                <ArrowRight size={20} />
              </Button>
            </motion.div>
          </div>

          {/* Right side - Animated character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
              <RiveCharacter className="hover:scale-105 transition-transform duration-300" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MainHero;
