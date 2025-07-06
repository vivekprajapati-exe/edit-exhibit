
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
              className="text-base md:text-lg text-gray-400 max-w-xl lg:max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              I create captivating visual experiences through expert editing, 
              color grading, and motion graphics.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6"
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
          <motion.div className="hidden lg:block absolute bottom-0 right-0 z-10 w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px]">
            <div className="w-full h-full relative">
              <RiveCharacter/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl" />
            </div>
          </motion.div>
          
          {/* Mobile character - smaller and positioned differently */}
          <motion.div className="lg:hidden flex justify-center mt-8">
            <div className="w-48 h-48 sm:w-64 sm:h-64 relative">
              <RiveCharacter/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MainHero;
