
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface PortfolioItem {
  id: string;
  title: string;
  youtubeId: string;
  category: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Cinematic Travel Film',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube ID
    category: 'Film',
    description: 'A breathtaking journey through the landscapes of Iceland, capturing the beauty of nature.'
  },
  {
    id: '2',
    title: 'Commercial Product Showcase',
    youtubeId: '3tmd-ClpJxA', // Replace with actual YouTube ID
    category: 'Commercial',
    description: 'Elegant product showcase with smooth transitions and professional color grading.'
  },
  {
    id: '3',
    title: 'Corporate Brand Story',
    youtubeId: 'SlPhMPnQ58k', // Replace with actual YouTube ID
    category: 'Corporate',
    description: 'Storytelling that connects your brand values with your audience.'
  },
  {
    id: '4',
    title: 'Music Video Edit',
    youtubeId: 'kJQP7kiw5Fk', // Replace with actual YouTube ID
    category: 'Music',
    description: 'Dynamic editing synchronized perfectly with the rhythm and mood of the music.'
  },
  {
    id: '5',
    title: 'Documentary Style Feature',
    youtubeId: 'pRpeEdMmmQ0', // Replace with actual YouTube ID
    category: 'Film',
    description: 'In-depth storytelling that captures authentic moments and emotions.'
  },
  {
    id: '6',
    title: 'Motion Graphics Showreel',
    youtubeId: '6ONRf7h3Mdk', // Replace with actual YouTube ID
    category: 'Motion',
    description: 'Visual showcase of dynamic motion graphics and animation work.'
  }
];

const categories = ['All', 'Film', 'Commercial', 'Corporate', 'Music', 'Motion'];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null);
  
  const filteredItems = portfolioItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="portfolio" className="py-24 px-6 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Portfolio Showcase</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A curated selection of my best video editing work across various genres and styles.
          </p>
        </motion.div>

        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-black/50 glass-effect p-1 mb-12 mx-auto max-w-2xl">
            {categories.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white/10 ring-opacity-60 ring-offset-2 ring-offset-[#0c0c0c] focus:outline-none transition-all duration-200',
                    selected
                      ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {filteredItems.map((item) => (
                  <motion.div key={item.id} variants={itemVariants} className="portfolio-item">
                    <Card className="overflow-hidden border-0 bg-black/30 glass-effect rounded-xl">
                      <CardContent className="p-0">
                        <VideoPlayer
                          youtubeId={item.youtubeId}
                          title={item.title}
                          aspectRatio="16:9"
                        />
                        <div className="p-5">
                          <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
};

export default Portfolio;
