'use client';

import React, { useEffect, useState } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

const NEXT: Record<Theme, Theme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const LABEL: Record<Theme, string> = {
  system: 'sistema',
  light: 'claro',
  dark: 'oscuro',
};

/**
 * Three states on purpose: the token layer distinguishes "no preference"
 * (follow the OS) from an explicit choice, and collapsing that into a
 * two-way switch would strand anyone whose OS flips at sunset.
 */
export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('lht-theme');
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    } catch {
      /* private mode, blocked storage: stay on system */
    }
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    const root = document.documentElement;
    try {
      if (next === 'system') {
        root.removeAttribute('data-theme');
        localStorage.removeItem('lht-theme');
      } else {
        root.setAttribute('data-theme', next);
        localStorage.setItem('lht-theme', next);
      }
    } catch {
      /* the attribute still applies for this session */
    }
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => apply(NEXT[theme])}
      className="inline-flex items-center justify-center w-9 h-9 text-ink"
      style={{ pointerEvents: 'all' }}
      aria-label={`Tema: ${LABEL[theme]}. Cambiar a ${LABEL[NEXT[theme]]}.`}
      title={`Tema: ${LABEL[theme]}`}
    >
      {/* Rendered blank until mounted: the stored theme is only known on
          the client, and guessing it server-side desyncs the markup. */}
      {mounted ? <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
               : <span className="block h-[18px] w-[18px]" aria-hidden="true" />}
    </button>
  );
};
