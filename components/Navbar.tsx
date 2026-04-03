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
      <header className="sticky top-0 z-50 border-b-2 border-lht-line bg-lht-bg">
        <div className="lht-container flex items-center justify-between py-3 md:py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center border-2 border-lht-line bg-lht-paper">
              <TurtleLogo className="h-7 w-7 text-lht-ink" />
            </div>
            <div>
              <div className="lht-kicker">La Habitación Tortuga</div>
              <div className="text-[11px] text-lht-muted">Archivo editorial</div>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/blog" className="lht-btn lht-btn-secondary">Archivo</Link>
            <Link href="/#suscribete" className="lht-btn lht-btn-primary">Suscribirse</Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center border-2 border-lht-line bg-lht-paper md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-lht-bg">
          <Link href="/" onClick={() => setOpen(false)} className="lht-title">Inicio</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="lht-title">Archivo</Link>
          <Link href="/#suscribete" onClick={() => setOpen(false)} className="lht-btn lht-btn-primary">Suscribirse</Link>
        </nav>
      )}
    </>
  );
};
