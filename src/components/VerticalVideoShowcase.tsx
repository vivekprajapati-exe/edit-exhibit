
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerticalVideo {
  id: string;
  title: string;
  vimeoId: string;
  externalUrl?: string;
  description: string;
  tags: string[];
}

export const verticalVideos: VerticalVideo[] = [
  {
    id: 'v1',
    title: 'Travel Memory Reel',
    vimeoId: '824804199',
    externalUrl: 'https://vimeo.com/824804199',
    description: 'Cinematic vertical travel edit with smooth transitions',
    tags: ['Vertical', 'Travel', 'Transitions']
  },
  {
    id: 'v2',
    title: 'Fashion Lookbook',
    vimeoId: '819737983',
    externalUrl: 'https://vimeo.com/819737983',
    description: 'Urban fashion showcase with creative transitions',
    tags: ['Vertical', 'Fashion', 'Urban']
  },
  {
    id: 'v3',
    title: 'Product Showcase',
    vimeoId: '824804245',
    externalUrl: 'https://vimeo.com/824804245',
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
          Optimized for social media platforms with professional-grade production
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
              <div className="relative mx-auto">
                <AspectRatio ratio={9/16} className="bg-black">
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&autoplay=0&player_id=0&app_id=58479`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  ></iframe>
                </AspectRatio>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-boldone text-white">{video.title}</h3>
                  {video.externalUrl && (
                    <a 
                      href={video.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <Video size={18} />
                    </a>
                  )}
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
