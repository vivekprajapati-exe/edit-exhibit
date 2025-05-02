
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effect for background elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  // Disable overflow on mount and restore on unmount
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      {/* Progress bar at the top of the page */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 to-purple-500 z-50 origin-left"
        style={{ scaleX }}
      />
      
      {/* Background gradients */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ y: backgroundY }}
      >
        {/* Top-right gradient */}
        <motion.div 
          className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full opacity-20 blur-[120px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(225,125,125,0.3) 0%, rgba(125,125,225,0) 70%)',
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Bottom-left gradient */}
        <motion.div 
          className="absolute bottom-0 left-0 w-[40vw] h-[40vh] rounded-full opacity-10 blur-[120px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(125,125,225,0.3) 0%, rgba(125,125,225,0) 70%)',
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </motion.div>
      
      <Navbar />
      <Hero />
      <Portfolio />
      <About />
      <Contact />
      <Footer />
    </motion.div>
  );
};

export default Index;
