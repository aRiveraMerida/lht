'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { TurtleLogo } from './TurtleLogo';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border" style={{ background: 'rgba(255,255,255,0.96)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-brown">
              <TurtleLogo className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold uppercase tracking-[0.14em] text-text">
                La Habitación Tortuga
              </div>
              <div className="text-[11px] text-text-muted">
                Archivo editorial
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/blog" className="rounded-full border border-border bg-bg px-4 py-2.5 text-[12px] font-medium text-text transition-transform duration-150 hover:-translate-y-0.5">
              Archivo
            </Link>
            <Link href="/#suscribete" className="rounded-full border border-button bg-button px-4 py-2.5 text-[12px] font-medium text-button-text transition-transform duration-150 hover:-translate-y-0.5">
              Suscribirse
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg text-text md:hidden"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <nav className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg lg:hidden">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold text-text">Inicio</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold text-text">Archivo</Link>
          <Link href="/#suscribete" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-button px-6 py-3 text-sm font-medium text-button-text">Suscribirse</Link>
        </nav>
      )}
    </>
  );
};
