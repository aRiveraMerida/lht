'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMobileMenuOpen(false);
      }
    }
  };

  // Determinar qué links mostrar según la página actual
  const isHome = pathname === '/';
  const isBlog = pathname?.startsWith('/blog');

  const navLinks = isHome 
    ? [
        { name: "Acerca de", href: "#about" },
        { name: "Blog", href: "/blog" },
      ]
    : isBlog
    ? [
        { name: "Inicio", href: "/" },
      ]
    : [
        { name: "Inicio", href: "/" },
        { name: "Blog", href: "/blog" },
      ];

  return (
    <>
      <header className="fixed w-full top-0 z-50 px-6 py-4 md:px-10 md:py-6 flex justify-between items-start pointer-events-none">
        <Link 
          href="/" 
          className="pointer-events-auto text-black z-50 transition-all duration-500 ease-in-out origin-top-left focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-offset-2 rounded-lg"
          aria-label="Ir a la página principal de La Habitación Tortuga"
        >
           <Logo 
             className={`transition-all duration-500 ease-in-out text-black ${isScrolled ? 'w-12 h-12' : 'w-20 h-20 md:w-28 md:h-28'}`}
             aria-hidden="true"
           />
        </Link>

        <nav 
          className={`hidden md:flex pointer-events-auto bg-white/95 backdrop-blur-sm text-black rounded-full px-1 py-1 items-center shadow-sm border border-gray-200 transition-all duration-500 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 md:translate-y-0 md:opacity-100'}`}
          aria-label="Navegación principal"
        >
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-5 py-2 text-xs font-semibold uppercase hover:bg-gray-100 hover:shadow-sm focus:bg-gray-100 focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full transition-all"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden pointer-events-auto z-50 p-2 bg-white rounded-full shadow-lg text-black border border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-600 transition-colors"
          aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <nav 
          className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden animate-fade-in"
          aria-label="Menú de navegación móvil"
        >
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-2xl font-medium uppercase tracking-tight text-black hover:text-gray-600 focus:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-600 rounded px-4 py-2 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};
