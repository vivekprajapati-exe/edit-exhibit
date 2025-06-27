import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Play, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { portfolioItems } from '@/components/Portfolio';
import VerticalVideoShowcase from '@/components/VerticalVideoShowcase';

const categories = ['All', 'Film', 'Commercial',  'Motion', 'Vertical'];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const filteredItems = portfolioItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const selectedProjectData = selectedProject 
    ? portfolioItems.find(item => item.id === selectedProject)
    : null;

  const showVerticalVideos = selectedCategory === 'All' || selectedCategory === 'Vertical';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-32 pb-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button 
                variant="ghost" 
                asChild 
                className="mb-4 md:mb-0 hover:bg-white/5 -ml-4"
              >
                <Link to="/" className="flex items-center gap-2 font-boldone">
                  <ChevronLeft size={18} />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bebas uppercase tracking-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              All Projects
            </motion.h1>
          </div>

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
                {showVerticalVideos && selectedCategory === 'Vertical' && (
                  <VerticalVideoShowcase />
                )}
                
                {(selectedCategory !== 'Vertical' && filteredItems.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer relative"
                        onClick={() => setSelectedProject(item.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                        <div className="relative rounded-xl overflow-hidden bg-black transform transition-transform duration-500 group-hover:scale-[1.02]">
                          <AspectRatio ratio={16/9}>
                            <div className="relative w-full h-full">
                              <img 
                                src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center">
                                <Play size={24} className="ml-1" />
                              </div>
                            </div>
                          </AspectRatio>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <h3 className="text-2xl font-boldone text-white mb-2">{item.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {item.tags.slice(0, 2).map((tag, i) => (
                                <Badge key={i} className="bg-white/10 hover:bg-white/20">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 font-roboto">{item.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                    <div className="mt-20">
                      <VerticalVideoShowcase />
                    </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Projects;

// Helper function for class names
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};
