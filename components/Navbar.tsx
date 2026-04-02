'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { TurtleLogo } from './TurtleLogo';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 border-b
          ${isScrolled ? 'bg-paper/95 backdrop-blur-sm border-bark/30' : 'bg-paper border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo + name */}
          <Link href="/" className="flex items-center gap-3" aria-label="Ir a inicio">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-bark bg-cream">
              <TurtleLogo className="w-6 h-6 text-bark" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                La Habitación Tortuga
              </div>
              <div className="text-[10px] text-ink/50 tracking-wide">
                Discover slower thinking
              </div>
            </div>
          </Link>

          {/* Desktop search + nav */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bark/50" />
              <input
                type="text"
                placeholder="Buscar estrategia, IA, dudas útiles..."
                className="pl-9 pr-4 py-2 w-64 rounded-full border border-bark/30 bg-cream text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:border-bark"
              />
            </div>
            <Link
              href="/blog"
              className="rounded-full border border-bark bg-cream px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink hover:-translate-y-0.5 transition-transform"
            >
              Archivo
            </Link>
            <a
              href="#suscribete"
              className="rounded-full bg-bark px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-cream hover:-translate-y-0.5 transition-transform"
            >
              Suscríbete
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full border border-bark bg-cream text-bark"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className="fixed inset-0 z-40 bg-paper flex flex-col items-center justify-center gap-8 lg:hidden">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif font-bold text-ink">
            Inicio
          </Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif font-bold text-ink">
            Archivo
          </Link>
          <a href="#suscribete" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-bark px-6 py-3 text-sm font-semibold uppercase text-cream">
            Suscríbete
          </a>
        </nav>
      )}
    </>
  );
};
