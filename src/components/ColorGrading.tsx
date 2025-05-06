
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Play } from 'lucide-react';

const ColorGrading = () => {
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  
  // Sample before/after images - replace with your own
  const beforeImage = "/lovable-uploads/img1.jpg";
  const afterImage = "/lovable-uploads/img2.jpg";

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">      
      <main className="container mx-auto px-4 py-16 md:py-24 relative z-10">


        {/* Video Showcase Section */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bebas tracking-tight text-white mb-8 text-center">
            VIDEO <span className="text-gradient">SHOWCASE</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <VideoCard 
              title="Cinematic Drama Scene" 
              thumbnail="/lovable-uploads/d380a5b4-2251-4e2e-9ebc-b44dd1eff3e7.png"
              youtubeId="W_YI4a4kQ08"
            />
            <VideoCard 
              title="Commercial Project" 
              thumbnail="/lovable-uploads/0707e3f5-5651-4118-99c3-17649f36ae0d.png"
              youtubeId="W_YI4a4kQ08"
            />
            <VideoCard 
              title="Music Video" 
              thumbnail="/lovable-uploads/b29d5b77-5e28-4b18-9a5e-90e7c5986410.png"
              youtubeId="W_YI4a4kQ08"
            />
            <VideoCard 
              title="Documentary Style" 
              thumbnail="/lovable-uploads/9c60a2bc-3a08-4e10-9094-84fe1f2d40e3.png"
              youtubeId="W_YI4a4kQ08" 
            />
          </div>
          
          <p className="text-sm text-gray-400 text-center mt-6">
            Replace these with your own videos by editing the VideoCard component props
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

// Video Card Component
interface VideoCardProps {
  title: string;
  thumbnail: string;
  youtubeId: string;
}

const VideoCard = ({ title, thumbnail, youtubeId }: VideoCardProps) => {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <motion.div 
      className="rounded-lg overflow-hidden bg-gray-900 hover-card h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video">
        {showVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            className="absolute w-full h-full top-0 left-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="relative w-full h-full">
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer"
              onClick={() => setShowVideo(true)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center"
              >
                <Play size={24} />
              </motion.div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-boldone text-white">{title}</h3>
        <p className="text-gray-400 text-sm mt-2">
          Click to play video
        </p>
      </div>
    </motion.div>
  );
};

export default ColorGrading;
