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
      <header className="sticky top-0 z-50 hairline-b bg-paper/90 backdrop-blur-md">
        <div className="fg-container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <TurtleLogo className="h-7 w-7 text-ink" />
            <span className="fg-body fw-540 tracking-tight">La Habitación Tortuga</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/blog" className="fg-pill">Archivo</Link>
            <Link href="/#suscribete" className="fg-btn fg-btn-primary">
              Suscribirse
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="fg-btn-icon md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-paper">
          <Link href="/" onClick={() => setOpen(false)} className="fg-section-heading">Inicio</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="fg-section-heading">Archivo</Link>
          <Link
            href="/#suscribete"
            onClick={() => setOpen(false)}
            className="fg-btn fg-btn-primary mt-4"
          >
            Suscribirse
          </Link>
        </nav>
      )}
    </>
  );
};
