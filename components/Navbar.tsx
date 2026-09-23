'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/blog', label: 'Archivo' },
  { href: '/#contacto', label: 'Contacto' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // While the menu is open it is the whole page: lock scroll, move focus in,
  // keep Tab inside, close on Escape, and hand focus back to the toggle.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const menu = menuRef.current;
    document.body.style.overflow = 'hidden';
    menu?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !menu) return;
      const focusable = menu.querySelectorAll<HTMLElement>('a, button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  // Only real routes get an active state; an anchor on the home page does not.
  const isActive = (href: string) =>
    !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="site-header">
        <div className="page-width h-full flex items-center justify-between gap-6">
          <Link href="/" className="block">
            <span className="site-brand">La Habitación Tortuga</span>
            <span className="site-brand-tag eyebrow">Laboratorio de IA · Sin prisas</span>
          </Link>

          <nav className="hidden md:flex items-stretch gap-2 self-stretch" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="tab"
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4 flex items-center">
              <ThemeToggle />
            </div>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden btn-icon"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav
          ref={menuRef}
          className="fixed inset-0 z-[150] flex flex-col bg-paper text-ink"
          aria-label="Menú principal"
        >
          <div className="page-width flex items-center justify-end" style={{ height: 'var(--header-height)' }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-icon"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="page-width flex flex-col gap-6 pt-8">
            {[{ href: '/', label: 'Inicio' }, ...NAV_LINKS].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="type-display"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 flex items-center gap-4">
              <span className="eyebrow">Tema</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </>
  );
};
