
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';import AboutInteractive from '@/components/AboutInteractive';
import MainHero from '@/components/MainHero';
import VideoShowcase from '@/components/VideoShowcase';
import ScrollMarquee from '@/components/ScrollMarquee';
import SpotifyEmbed from '@/components/SpotifyEmbed';
const Index = () => {
  // Initialize smooth scrolling
  const lenis = useSmoothScroll();
  
  // Add CSS for particles animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .particle-container {
        overflow: hidden;
        pointer-events: none;
      }
      
      .particle {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        animation: float linear infinite;
      }
      
      @keyframes float {
        0% {
          transform: translateY(0) translateX(0);
        }
        25% {
          transform: translateY(-20px) translateX(10px);
        }
        50% {
          transform: translateY(0) translateX(25px);
        }
        75% {
          transform: translateY(20px) translateX(10px);
        }
        100% {
          transform: translateY(0) translateX(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      className="min-h-screen bg-[#0a0a0a] relative"
    >
      {/* Background gradients */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
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
      
      {/* New Main Hero Section with Call-to-Action */}
      <MainHero />
      
      {/* Video Showcase Section */}
      <VideoShowcase youtubeId="W_YI4a4kQ08" />

      {/* Projects Section - Priority after showreel */}
      <Portfolio />
      
      <SpotifyEmbed/>
      
      {/* Scrolling Marquee Section */}
      <ScrollMarquee />

      
      <Contact />
      <Footer />
    </motion.div>
  );
};

export default Index;
