'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { Reveal } from './Reveal';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  
  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Determinar qué links mostrar según la página actual
  const isHome = pathname === '/';
  const isBlog = pathname?.startsWith('/blog');

  return (
    <footer className="py-20 px-6 md:px-10 max-w-[1800px] mx-auto mt-10 border-t border-gray-100">
      <div className="mb-16">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">LA HABITACIÓN TORTUGA [LHT]</div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl uppercase font-medium mb-8 leading-tight">
              Entra, escucha, prueba<br />
              y quédate si conecta<br />
              con lo que pasa aquí
            </h2>
            <p className="text-base md:text-lg text-gray-500 italic max-w-2xl mx-auto">
              Sin poses. Sin ruido de fondo.<br/>
              Solo dos personas compartiendo su camino mientras intentan entender el suyo... y el de la IA.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="border-t border-gray-100 pt-10">
          <div className="w-full flex flex-col items-start">
            <span className="text-[10vw] md:text-[8vw] leading-[0.85] font-bold tracking-tighter select-none text-black">
              La Habitación
            </span>
            <div className="flex items-baseline gap-4">
              <span className="text-[10vw] md:text-[8vw] leading-[0.85] font-bold tracking-tighter select-none text-black">
                Tortuga
              </span>
              <span className="text-xl md:text-3xl font-bold text-gray-400 mb-2">[LHT]</span>
            </div>
            <Logo className="mt-4 md:mt-6 w-16 h-16 md:w-20 md:h-20 text-black opacity-10" />
          </div>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-col md:flex-row justify-between items-start md:items-end text-xs font-medium tracking-widest text-gray-400 uppercase gap-6">
        <div>
          © 2025 LA HABITACIÓN TORTUGA [LHT]<br />
          DESDE LA HABITACIÓN
        </div>
        <div className="flex flex-wrap gap-6 md:gap-8 text-black">
          {isHome && (
            <a href="#about" onClick={handleScrollToAbout} className="hover:text-gray-600 transition-colors focus:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm px-1 cursor-pointer">Acerca de</a>
          )}
          {isBlog && (
            <Link href="/" className="hover:text-gray-600 transition-colors focus:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm px-1">Inicio</Link>
          )}
          {isHome && (
            <Link href="/blog" className="hover:text-gray-600 transition-colors focus:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm px-1">Blog</Link>
          )}
          <a href="https://www.youtube.com/@LaHabitacionTortuga" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors focus:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm px-1">YouTube</a>
          <a href="https://instagram.com/lahabitaciontortuga" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors focus:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm px-1">Instagram</a>
        </div>
      </div>
    </footer>
  );
};
