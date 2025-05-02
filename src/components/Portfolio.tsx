
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Play, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PortfolioItem {
  id: string;
  title: string;
  youtubeId: string;
  category: string;
  description: string;
  tags: string[];
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Cinematic Travel Film',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'Film',
    description: 'A breathtaking journey through the landscapes of Iceland, capturing the beauty of nature.',
    tags: ['Cinematic', 'Travel', '4K', 'Landscape']
  },
  {
    id: '2',
    title: 'Commercial Product Showcase',
    youtubeId: '3tmd-ClpJxA',
    category: 'Commercial',
    description: 'Elegant product showcase with smooth transitions and professional color grading.',
    tags: ['Commercial', 'Product', 'Transitions', 'Color Grading']
  },
  {
    id: '3',
    title: 'Corporate Brand Story',
    youtubeId: 'SlPhMPnQ58k',
    category: 'Corporate',
    description: 'Storytelling that connects your brand values with your audience.',
    tags: ['Corporate', 'Storytelling', 'Brand', 'Narrative']
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

const categories = ['All', 'Film', 'Commercial', 'Corporate', 'Music', 'Motion'];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  const filteredItems = portfolioItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }
    },
    hover: {
      y: -10,
      boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="portfolio" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gradient">
            Portfolio Showcase
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A curated selection of my finest video editing work across various genres and styles.
          </p>
        </motion.div>

        {isMobile ? (
          // Mobile view with carousel
          <div className="px-4">
            <Tabs defaultValue="All" className="w-full mb-10">
              <TabsList className="flex w-full h-auto p-1 bg-black/20 glass-effect overflow-x-auto gap-1 justify-start no-scrollbar">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-4 py-2 whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Carousel className="w-full">
              <CarouselContent>
                {filteredItems.map((item, index) => (
                  <CarouselItem key={item.id}>
                    <motion.div 
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden border-0 bg-black/40 glass-effect rounded-xl h-full">
                        <CardContent className="p-0 flex flex-col h-full">
                          <div className="relative group">
                            <AspectRatio ratio={16/9}>
                              <VideoPlayer
                                youtubeId={item.youtubeId}
                                title={item.title}
                                aspectRatio="16:9"
                              />
                            </AspectRatio>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center"
                              >
                                <Play size={20} className="ml-1" />
                              </motion.div>
                            </div>
                          </div>
                          <div className="p-5 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {item.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="bg-white/5 hover:bg-white/10">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-2">
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
              </div>
            </Carousel>
          </div>
        ) : (
          // Desktop view with grid
          <>
            <Tabs defaultValue="All" className="w-full mb-12">
              <TabsList className="grid grid-cols-6 max-w-3xl mx-auto p-1 bg-black/20 glass-effect">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {filteredItems.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      whileHover="hover"
                      className={cn(
                        "cursor-pointer transform transition-all duration-500",
                        "hover:z-10"
                      )}
                      onClick={() => handleItemClick(index)}
                    >
                      <Card className="overflow-hidden border-0 bg-black/40 glass-effect rounded-xl h-full">
                        <CardContent className="p-0 flex flex-col h-full">
                          <div className="relative group">
                            <AspectRatio ratio={16/9}>
                              <VideoPlayer
                                youtubeId={item.youtubeId}
                                title={item.title}
                                aspectRatio="16:9"
                              />
                            </AspectRatio>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center"
                              >
                                <Play size={20} className="ml-1" />
                              </motion.div>
                            </div>
                          </div>
                          <div className="p-5 flex-grow flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-white">{item.title}</h3>
                              <Badge className="bg-white/10 text-xs hover:bg-white/20">{item.category}</Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {item.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="bg-white/5 hover:bg-white/10">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </AnimatePresence>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-16"
        >
          <a href="#contact" className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <span className="text-lg">Ready to work together?</span>
            <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
