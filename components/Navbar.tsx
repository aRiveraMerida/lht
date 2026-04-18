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
      {/* Utility bar — black strip */}
      <div className="on-dark bg-ink text-paper">
        <div className="ed-container flex items-center justify-between py-2">
          <div className="ed-meta text-paper/90">La Habitación Tortuga [LHT]</div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="ed-meta text-paper/80 hover:text-paper">Archivo</Link>
            <Link href="/#suscribete" className="ed-meta text-paper/80 hover:text-paper">Newsletter</Link>
          </div>
        </div>
      </div>

      {/* Main nav — paper white */}
      <header className="sticky top-0 z-50 bg-paper ed-rule-b">
        <div className="ed-container flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-3">
            <TurtleLogo className="h-8 w-8 text-ink" />
            <span className="ed-display text-[22px] md:text-[26px] leading-none">
              La Habitación Tortuga
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/blog" className="ed-btn-label hover:text-link transition-colors">
              Archivo
            </Link>
            <Link href="/#suscribete" className="ed-btn">
              Suscribirse
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="ed-btn-icon md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-paper">
          <Link href="/" onClick={() => setOpen(false)} className="ed-display">Inicio</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="ed-display">Archivo</Link>
          <Link
            href="/#suscribete"
            onClick={() => setOpen(false)}
            className="ed-btn"
          >
            Suscribirse
          </Link>
        </nav>
      )}
    </>
  );
};
