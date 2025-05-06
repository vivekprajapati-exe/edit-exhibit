
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  title: string;
  youtubeId: string;
  category: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Cinematogprhy Showreel',
    youtubeId: 'W_YI4a4kQ08',
    category: 'Film',
    description: 'A breathtaking journey through the cinematics captured with just phone.',
    tags: ['Cinematic', 'Travel', '4K', 'Landscape'],
    featured: true
  },
  {
    id: '2',
    title: 'Cinematic Lightings',
    youtubeId: 'hqu91-Trsnc',
    category: 'Film',
    description: 'Played with a great lighting and color grading',
    tags: ['Color Grading'],
    featured: true
  },
  {
    id: '3',
    title: 'Corporate Brand Story',
    youtubeId: 'SlPhMPnQ58k',
    category: 'Corporate',
    description: 'Storytelling that connects your brand values with your audience.',
    tags: ['Corporate', 'Storytelling', 'Brand', 'Narrative'],
    featured: true
  },
  {
    id: '4',
    title: 'Music Video Edit',
    youtubeId: 'kJQP7kiw5Fk',
    category: 'Music',
    description: 'Dynamic editing synchronized perfectly with the rhythm and mood of the music.',
    tags: ['Music Video', 'Rhythm Editing', 'Visual Effects', 'Dynamic']
  },
  {
    id: '5',
    title: 'Documentary Style Feature',
    youtubeId: 'pRpeEdMmmQ0',
    category: 'Film',
    description: 'In-depth storytelling that captures authentic moments and emotions.',
    tags: ['Documentary', 'Storytelling', 'Interview', 'Authentic']
  },
  {
    id: '6',
    title: 'Motion Graphics Showreel',
    youtubeId: '6ONRf7h3Mdk',
    category: 'Motion',
    description: 'Visual showcase of dynamic motion graphics and animation work.',
    tags: ['Motion Graphics', 'Animation', 'Visual Effects', 'Showreel']
  }
];

const Portfolio = () => {
  const isMobile = useIsMobile();
  const featuredItems = portfolioItems.filter(item => item.featured);

  return (
    <section id="portfolio" className="py-24 px-6 bg-[#0a0a0a] relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#150a0a] to-[#0a0a0a] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="mb-16 scroll-reveal"
        >
          <h2 className="text-7xl md:text-8xl font-bebas uppercase tracking-tight text-white">
            MY<span className="text-gradient">PROJECTS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg font-roboto">
            A curated selection of my finest video editing work across various genres and styles.
          </p>
        </motion.div>

        <div className={cn(
          "grid grid-cols-1 gap-12",
          isMobile ? "" : "md:grid-cols-2 lg:grid-cols-3"
        )}>
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative scroll-reveal"
            >
              <Link to={`/projects#${item.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 opacity-80"></div>
                  <AspectRatio ratio={16/9} className="relative z-0">
                    <div className="relative w-full h-full">
                      <img 
                        src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center"
                        >
                          <Play size={24} className="ml-1" />
                        </motion.div>
                      </div>
                    </div>
                  </AspectRatio>
                
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-2xl font-boldone text-white mb-2">{item.title}</h3>
                    <div className="flex gap-2 mb-3">
                      {item.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-16 scroll-reveal"
        >
          <Link to="/projects" className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
            <span className="text-lg font-boldone">View All Projects</span>
            <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
