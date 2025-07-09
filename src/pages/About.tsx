import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import AboutInteractive from '@/components/AboutInteractive';
import Footer from '@/components/Footer';

const About = () => {
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
              About Me
            </motion.h1>
          </div>

          <AboutInteractive />
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default About;