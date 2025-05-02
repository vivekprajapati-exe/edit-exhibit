
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass-effect backdrop-blur-xl shadow-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bebas tracking-wider glow-text">
          VIVEK<span className="text-gray-400">PRAJAPATI</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {isHomePage ? (
            <>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              <Link to="/projects" className="font-boldone relative font-medium text-gray-300 hover:text-white transition-colors duration-200">Projects</Link>
            </>
          ) : (
            <>
              <Link to="/" className="font-boldone relative font-medium text-gray-300 hover:text-white transition-colors duration-200">Home</Link>
              <Link to="/#about" className="font-boldone relative font-medium text-gray-300 hover:text-white transition-colors duration-200">About</Link>
              <Link to="/#contact" className="font-boldone relative font-medium text-gray-300 hover:text-white transition-colors duration-200">Contact</Link>
            </>
          )}
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-effect backdrop-blur-xl w-full overflow-hidden"
          >
            <div className="flex flex-col items-center space-y-6 py-8">
              {isHomePage ? (
                <>
                  <MobileNavLink href="#portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</MobileNavLink>
                  <MobileNavLink href="#about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
                  <MobileNavLink href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
                  <Link to="/projects" className="text-xl font-boldone font-medium text-white py-2 px-6" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="text-xl font-boldone font-medium text-white py-2 px-6" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                  <Link to="/#portfolio" className="text-xl font-boldone font-medium text-white py-2 px-6" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
                  <Link to="/#about" className="text-xl font-boldone font-medium text-white py-2 px-6" onClick={() => setMobileMenuOpen(false)}>About</Link>
                  <Link to="/#contact" className="text-xl font-boldone font-medium text-white py-2 px-6" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      className="relative font-boldone font-medium text-gray-300 hover:text-white transition-colors duration-200
                after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 
                after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right 
                after:transition-transform after:duration-300 hover:after:scale-x-100 
                hover:after:origin-bottom-left"
    >
      {children}
    </a>
  );
};

const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  return (
    <motion.a 
      href={href} 
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="text-xl font-boldone font-medium text-white py-2 px-6"
    >
      {children}
    </motion.a>
  );
};

export default Navbar;
