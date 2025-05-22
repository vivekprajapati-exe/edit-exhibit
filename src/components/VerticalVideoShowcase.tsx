
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerticalVideo {
  id: string;
  title: string;
  instagramUrl: string;
  embedId: string;
  description: string;
  tags: string[];
}

export const verticalVideos: VerticalVideo[] = [
  {
    id: 'v1',
    title: 'Travel Memory Reel',
    instagramUrl: 'https://www.instagram.com/p/example1/',
    embedId: 'CxLr-HqStuY',
    description: 'Cinematic vertical travel edit with smooth transitions',
    tags: ['Vertical', 'Travel', 'Transitions']
  },
  {
    id: 'v2',
    title: 'Fashion Lookbook',
    instagramUrl: 'https://www.instagram.com/p/example2/',
    embedId: 'CzBDPXOy531',
    description: 'Urban fashion showcase with creative transitions',
    tags: ['Vertical', 'Fashion', 'Urban']
  },
  {
    id: 'v3',
    title: 'Product Showcase',
    instagramUrl: 'https://www.instagram.com/p/example3/',
    embedId: 'CupW3k2N5Ah',
    description: 'Clean minimal product showcase with dynamic angles',
    tags: ['Vertical', 'Product', 'Commercial']
  }
];

const VerticalVideoShowcase = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bebas uppercase tracking-tight text-white mb-4">
          <span className="text-gradient">Vertical Videos</span>
        </h2>
        <p className="text-gray-400 font-roboto">
          Optimized for social media platforms like Instagram and TikTok
        </p>
      </motion.div>

      <div className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
      )}>
        {verticalVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
              <div className="relative mx-auto max-w-[280px]">
                <AspectRatio ratio={9/16} className="bg-black">
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://www.instagram.com/reel/${video.embedId}/embed/`}
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  ></iframe>
                </AspectRatio>
                
                {/* Overlay that appears before video loads */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 pointer-events-none z-10"></div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-boldone text-white">{video.title}</h3>
                  <a 
                    href={video.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <Instagram size={18} />
                  </a>
                </div>
                <p className="text-gray-400 text-sm mb-3 font-roboto">{video.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {video.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VerticalVideoShowcase;
