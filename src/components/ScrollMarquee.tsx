
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ScrollMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative h-[25vh] md:h-[25vh] flex items-center overflow-hidden bg-black py-10"
    >
      <motion.div 
        className="absolute w-full h-full"
        style={{ opacity }}
      >
        <div className="flex items-center h-full">
          <motion.div 
            className="flex whitespace-nowrap"
            style={{ x: x1 }}
          >
            <div className="flex items-center mx-4">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-bebas tracking-tight text-white">
                CREATIVITY MAKES MAN GREAT
              </h2>
              <ArrowRight className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white ml-8" />
            </div>
            <div className="flex items-center mx-4">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-bebas tracking-tight text-white">
                CREATIVITY MAKES MAN GREAT
              </h2>
              <ArrowRight className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white ml-8" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="flex whitespace-nowrap absolute top-1/2 -translate-y-1/2"
          style={{ x: x2 }}
        >
          <div className="flex items-center mx-4">
            <ArrowRight className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white mr-8 transform rotate-180" />
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bebas tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              ELEVATE YOUR VISION
            </h2>
          </div>
          <div className="flex items-center mx-4">
            <ArrowRight className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white mr-8 transform rotate-180" />
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bebas tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              ELEVATE YOUR VISION
            </h2>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScrollMarquee;
