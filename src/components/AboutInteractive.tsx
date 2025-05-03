
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { FileVideo, Video, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SoftwareItem {
  name: string;
  icon: string;
  proficiency: number;
  description: string;
}

const software: SoftwareItem[] = [
  {
    name: "Adobe Premiere Pro",
    icon: "/lovable-uploads/9c60a2bc-3a08-4e10-9094-84fe1f2d40e3.png",
    proficiency: 90,
    description: "Professional video editing and color grading"
  },
  {
    name: "Adobe After Effects",
    icon: "/lovable-uploads/0707e3f5-5651-4118-99c3-17649f36ae0d.png",
    proficiency: 85,
    description: "Motion graphics and visual effects"
  },
  {
    name: "Adobe Photoshop",
    icon: "/lovable-uploads/9c60a2bc-3a08-4e10-9094-84fe1f2d40e3.png",
    proficiency: 80,
    description: "Image editing and compositing"
  },
  {
    name: "DaVinci Resolve",
    icon: "/lovable-uploads/0707e3f5-5651-4118-99c3-17649f36ae0d.png",
    proficiency: 75,
    description: "Professional color grading and finishing"
  }
];

const AboutInteractive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up automatic rotation of software cards
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % software.length);
    }, 5000);

    // Clear interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle mouse movement for 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setMousePosition({
      x: (x - centerX) / centerX * 10, // -10 to 10 degrees
      y: (y - centerY) / centerY * -10, // -10 to 10 degrees
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#080808] py-24 px-6 overflow-hidden"
      id="about"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a0b] to-[#080808] z-0"></div>
      
      {/* Title */}
      <div className="container mx-auto mb-16 relative z-10">
        <motion.h2 
          className="text-7xl md:text-8xl font-bold mb-8 tracking-tight text-white"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ABOUT <span className="text-gradient">ME</span>
        </motion.h2>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 3D Interactive Card - Fixed position */}
          <div className="relative">
            <motion.div
              ref={cardRef}
              className="about-card relative max-w-md mx-auto"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl blur-lg opacity-70"></div>
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/80 p-8 backdrop-blur-md">
                <div className="mb-6 flex justify-center">
                  <img 
                    src={software[activeIndex].icon} 
                    alt={software[activeIndex].name} 
                    className="w-32 h-32 object-contain" 
                    style={{ filter: "invert(1)" }}
                  />
                </div>
                <h3 className="text-center text-2xl font-boldone mb-2 text-white">{software[activeIndex].name}</h3>
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${software[activeIndex].proficiency}%` }}
                  ></div>
                </div>
                <p className="text-center text-gray-400">{software[activeIndex].description}</p>
                
                {/* Card selection dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {software.map((_, i) => (
                    <button 
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i === activeIndex ? "bg-white scale-125" : "bg-white/30"
                      )}
                      onClick={() => setActiveIndex(i)}
                    ></button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Text content */}
          <div className="flex flex-col justify-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-white">VIVEK PRAJAPATI</h3>
              <p className="text-gray-400 leading-relaxed">
                I'm a professional video editor and cinematographer with a passion for turning ideas into captivating visual experiences. My work combines technical expertise with creative vision to produce content that truly engages viewers.
              </p>
              <p className="text-gray-400 leading-relaxed">
                With over 2 years of experience, I've honed my skills in editing, color grading, and motion graphics to deliver cinematic quality that exceeds expectations.
              </p>
              
              <div className="mt-10">
                <h4 className="text-2xl font-bold mb-4 text-white">MY TOOLKIT</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <FileVideo className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white">Premier Pro & After Effects</h5>
                      <p className="text-gray-400">Advanced editing and motion graphics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white">DaVinci Resolve</h5>
                      <p className="text-gray-400">Professional color grading</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white">Photoshop & Lightroom</h5>
                      <p className="text-gray-400">Visual asset creation and photo editing</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutInteractive;
