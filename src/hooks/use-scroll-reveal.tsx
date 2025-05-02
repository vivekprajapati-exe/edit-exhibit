
import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Select all elements with scroll-reveal class
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      scrollElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return null;
};

export default useScrollReveal;
