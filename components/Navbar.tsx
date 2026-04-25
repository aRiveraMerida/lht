'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/blog', label: 'Archivo' },
  { href: '/#newsletter', label: 'Newsletter' },
  { href: '/#contacto', label: 'Contacto' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[101]"
        style={{
          padding: '22px 28px',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
        }}
      >
        <div
          className="flex items-start justify-between"
          style={{ pointerEvents: 'all' }}
        >
          <Link href="/" className="block leading-none">
            <span
              className="block uppercase font-[var(--font-display)]"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(20px, 1.9vw, 30px)',
                lineHeight: 0.9,
                letterSpacing: '0.01em',
              }}
            >
              La Habitación Tortuga
            </span>
            <span
              className="block font-[var(--font-body)]"
              style={{
                fontSize: 'max(9px, 0.6vw)',
                letterSpacing: '0.2em',
                opacity: 0.65,
                fontWeight: 400,
                marginTop: 4,
                textTransform: 'uppercase',
              }}
            >
              Laboratorio de IA · Sin prisas
            </span>
          </Link>

          <div className="hidden md:flex items-end" style={{ gap: 6 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover-act">
                <span className="brkt">[</span>
                <span>{link.label}</span>
                <span className="brkt">]</span>
                <span className="underliner" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-ink"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            style={{ pointerEvents: 'all' }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <nav
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center gap-8 bg-paper text-ink"
          aria-label="Menú principal"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 inline-flex items-center justify-center w-10 h-10 text-ink"
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="ed-display"
          >
            Inicio
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="ed-display"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};
