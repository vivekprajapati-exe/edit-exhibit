import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Play, ChevronLeft, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { portfolioItems } from '@/components/Portfolio';
import VerticalVideoShowcase from '@/components/VerticalVideoShowcase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const categories = ['All', 'Film', 'Commercial', 'Motion', 'Vertical'];

interface VideoPost {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  video_url: string;
  post_type: string;
}

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadAllVideos = async () => {
      setIsLoading(true);
      
      // Load all published videos from database
      const { data: videoData, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('post_type', 'video')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && videoData) {
        const dbVideos = videoData
          .map((video: any) => {
            const youtubeId = extractYouTubeId(video.video_url);
            if (!youtubeId) return null;
            
            return {
              id: video.id,
              title: video.title,
              description: video.summary,
              youtubeId,
              tags: video.tags || [],
              category: 'Video',
              featured: video.featured
            };
          })
          .filter(Boolean);

        // Combine with legacy items
        const allItems = [...dbVideos, ...portfolioItems];
        setAllVideos(allItems);
      } else {
        setAllVideos(portfolioItems);
      }
      
      setIsLoading(false);
    };

    loadAllVideos();
  }, []);

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const filteredItems = selectedCategory === 'Vertical' 
    ? [] // Don't show any regular videos for Vertical category
    : allVideos.filter(item => 
        selectedCategory === 'All' || item.category === selectedCategory
      );

  const selectedProjectData = selectedProject 
    ? allVideos.find(item => item.id === selectedProject)
    : null;

  const showVerticalVideos = selectedCategory === 'All' || selectedCategory === 'Vertical';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-32 pb-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                asChild 
                className="hover:bg-white/5 -ml-4"
              >
                <Link to="/" className="flex items-center gap-2 font-boldone">
                  <ChevronLeft size={18} />
                  <span>Back to Home</span>
                </Link>
              </Button>
              
              <div className="flex items-center gap-4">
                <Grid className="w-5 h-5 text-white" />
                <List className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
              <div>
                <h1 className="text-6xl lg:text-8xl font-bold text-white mb-6 leading-none">
                  Our Work
                </h1>
                <div className="w-24 h-0.5 bg-white mb-8"></div>
              </div>
              
              <div className="max-w-md text-right">
                <p className="text-gray-300 text-lg leading-relaxed">
                  IT DOESN'T MATTER WHETHER YOU'RE REVOLUTIONIZING EVS, BUILDING AN AI EMPIRE, 
                  DISRUPTING INSURTECH, OR SIMPLY THE SOLID DENTIST DOWN THE STREET. WE APPROACH 
                  EVERY PROJECT WITH A MISSION TO TELL A COMPELLING STORY THAT STANDS OUT FROM THE REST.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mb-10 overflow-x-auto scrollbar-hide">
            <Tabs 
              defaultValue="All" 
              className="w-full"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <TabsList className={cn(
                " bg-linear-to-r from-gray-800 via-blue-950 h-auto p-1  backdrop-blur-sm border  border-white/5 rounded-full w-auto inline-flex",
                isMobile ? "flex overflow-x-auto gap-1 justify-start pb-1 px-1 flex-nowrap min-w-full" : ""
              )}>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    className="px-4 py-2 rounded-full text-white  to-gray-900 data-[state=active]:bg-white data-[state=active]:text-black font-boldone whitespace-nowrap flex-shrink-0"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key="project-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {selectedProjectData && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedProject(null)}
                      className="mb-6 font-boldone text-white rounded-full"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 text-white" /> Back to projects
                    </Button>
                    
                    {/* YouTube iframe implementation */}
                    <div className="w-full rounded-xl overflow-hidden relative">
                      <AspectRatio ratio={16/9} className="bg-black border border-white/10">
                        <iframe
                          className="w-full h-full absolute top-0 left-0"
                          src={`https://www.youtube.com/embed/${selectedProjectData.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                          title={selectedProjectData.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </AspectRatio>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <h2 className="text-3xl font-bebas uppercase text-white mb-4">{selectedProjectData.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedProjectData.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="bg-white/5 text-white hover:bg-white/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-gray-400 font-roboto">{selectedProjectData.description}</p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm border border-white/5 p-6 rounded-xl">
                        <h3 className="text-xl font-boldone text-white mb-4">Project Details</h3>
                        <div className="space-y-4 text-sm font-roboto">
                          <div>
                            <p className="text-gray-500">Category</p>
                            <p className="text-white">{selectedProjectData.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Techniques Used</p>
                            <p className="text-white">Color Grading, Motion Graphics, Sound Design</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Software</p>
                            <p className="text-white">Adobe Premiere Pro, After Effects, DaVinci Resolve</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="project-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {selectedCategory === 'Vertical' ? (
                  <VerticalVideoShowcase />
                ) : (
                  <>
                    {filteredItems.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedProject(item.id)}
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 aspect-[4/3] mb-6 transform transition-transform duration-500 group-hover:scale-[1.02]">
                          <img 
                            src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`} 
                            alt={item.title}
                            className="w-full h-full object-cover mix-blend-overlay"
                          />
                          
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center">
                              <Play size={24} className="ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                            {item.title}
                          </h3>
                          
                          <p className="text-gray-400 text-sm uppercase tracking-wider">
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="rounded-full px-4 py-1 text-xs uppercase tracking-wider border-gray-300 text-gray-300 hover:bg-white/10"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                      </div>
                    )}
                    
                    {selectedCategory === 'All' && (
                      <div className="mt-20">
                        <VerticalVideoShowcase />
                      </div>
                    )}
                   </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Projects;

// Helper function for class names
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};
