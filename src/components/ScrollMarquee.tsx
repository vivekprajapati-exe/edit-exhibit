
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ScrollMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Use the proper easing function from framer-motion
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"], { ease: easeOut });
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"], { ease: easeOut });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative h-[30vh] md:h-[35vh] flex items-center overflow-hidden bg-black py-12"
    >
      <motion.div 
        className="absolute w-full h-full"
        style={{ opacity }}
      >
        {/* First row with more vertical spacing */}
        <div className="flex items-center h-[45%] overflow-hidden mb-4">
          <motion.div 
            className="flex whitespace-nowrap"
            style={{ x: x1 }}
          >
            <div className="flex items-center mx-6">
              <h2 className="text-5xl md:text-7xl lg:text-9xl font-bebas tracking-tight text-white">
                CREATIVITY MAKES MAN GREAT
              </h2>
              <ArrowRight className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 text-white ml-8" />
            </div>
            <div className="flex items-center mx-6">
              <h2 className="text-5xl md:text-7xl lg:text-9xl font-bebas tracking-tight text-white">
                CREATIVITY MAKES MAN GREAT
              </h2>
              <ArrowRight className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 text-white ml-8" />
            </div>
          </motion.div>
        </div>

        {/* Second row with more vertical spacing */}
        <div className="flex items-center h-[45%] overflow-hidden absolute bottom-4 left-0 right-0">
          <motion.div 
            className="flex whitespace-nowrap"
            style={{ x: x2 }}
          >
            <div className="flex items-center mx-6">
              <ArrowRight className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 text-white mr-8 transform rotate-180" />
              <h2 className="text-5xl md:text-7xl lg:text-9xl font-bebas tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                ELEVATE YOUR VISION
              </h2>
            </div>
            <div className="flex items-center mx-6">
              <ArrowRight className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 text-white mr-8 transform rotate-180" />
              <h2 className="text-5xl md:text-7xl lg:text-9xl font-bebas tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                ELEVATE YOUR VISION
              </h2>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollMarquee;
