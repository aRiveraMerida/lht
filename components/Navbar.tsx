'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { TurtleLogo } from './TurtleLogo';

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className="on-dark sticky top-0 z-50 bg-ink text-paper">
        <div className="ed-container flex items-center justify-between py-4 md:py-5">
          <Link href="/" className="flex items-center gap-3 group">
            <TurtleLogo className="h-8 w-8 text-paper" />
            <span className="ed-display text-[20px] md:text-[24px] leading-none">
              La Habitación Tortuga
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/blog"
              className="ed-btn-label text-paper/80 hover:text-paper transition-colors"
            >
              Lecturas
            </Link>
            <Link
              href="/#suscribete"
              className="ed-btn-label text-paper/80 hover:text-paper transition-colors"
            >
              Comunidad
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-paper hover:text-paper/70 transition-colors"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="on-dark fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-ink text-paper">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="ed-display text-paper"
          >
            Inicio
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="ed-display text-paper"
          >
            Lecturas
          </Link>
          <Link
            href="/#suscribete"
            onClick={() => setOpen(false)}
            className="ed-display text-paper"
          >
            Comunidad
          </Link>
        </nav>
      )}
    </>
  );
};
