
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

// A copy of the original Navbar with an added link to the color grading page
// You can either use this component or modify your existing Navbar
const NavbarWithColorGrading = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-4 sm:px-6',
          scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold font-bebas tracking-wide hover:text-gray-200 transition-colors">
            VIVEK CUTS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
            <NavLink to="/projects" active={location.pathname === '/projects'}>Projects</NavLink>
            <NavLink to="/color-grading" active={location.pathname === '/color-grading'}>Color Grading</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white hover:text-gray-300 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="fixed inset-0 bg-black z-50 md:hidden"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full space-y-8 -mt-16">
              <MobileNavLink to="/" active={location.pathname === '/'}>Home</MobileNavLink>
              <MobileNavLink to="/projects" active={location.pathname === '/projects'}>Projects</MobileNavLink>
              <MobileNavLink to="/color-grading" active={location.pathname === '/color-grading'}>Color Grading</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'text-sm font-medium transition-colors relative',
      active 
        ? 'text-white after:content-[""] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-white' 
        : 'text-gray-400 hover:text-white'
    )}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'text-2xl font-medium transition-colors',
      active ? 'text-white' : 'text-gray-400 hover:text-white'
    )}
  >
    {children}
  </Link>
);

export default NavbarWithColorGrading;
