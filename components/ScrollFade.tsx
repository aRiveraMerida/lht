'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollFade: React.FC<ScrollFadeProps> = ({ children, className = "" }) => {
  const [opacity, setOpacity] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Fade in cuando entra desde abajo
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Elemento visible en viewport
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const elementHeight = rect.height;
        const visibilityRatio = visibleHeight / elementHeight;
        
        // Fade in desde abajo
        if (rect.top > windowHeight * 0.7) {
          const fadeProgress = (windowHeight - rect.top) / (windowHeight * 0.3);
          setOpacity(Math.max(0, Math.min(1, fadeProgress)));
        }
        // Fade out cuando sale por arriba
        else if (rect.bottom < windowHeight * 0.3) {
          const fadeProgress = rect.bottom / (windowHeight * 0.3);
          setOpacity(Math.max(0, Math.min(1, fadeProgress)));
        }
        // Totalmente visible en el centro
        else {
          setOpacity(1);
        }
      } else {
        setOpacity(0);
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity,
        transition: 'opacity 0.3s ease-out',
      }} 
      className={className}
    >
      {children}
    </div>
  );
};
