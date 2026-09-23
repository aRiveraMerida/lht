'use client';

import React, { useSyncExternalStore } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const LABEL: Record<Theme, string> = { system: 'sistema', light: 'claro', dark: 'oscuro' };
const ICON = { system: Monitor, light: Sun, dark: Moon };

const listeners = new Set<() => void>();

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => { listeners.delete(notify); };
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('lht-theme');
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system'; /* private mode, blocked storage */
  }
}

/**
 * One button that cycles system → light → dark. Three states on purpose:
 * the token layer distinguishes "no preference" (follow the OS) from an
 * explicit choice, and a two-way switch would strand anyone whose OS flips
 * at sunset.
 */
export const ThemeToggle: React.FC = () => {
  // The server cannot know the stored choice, so it renders "system" and the
  // client corrects it on hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'system' as Theme);
  const next = NEXT[theme];
  const Icon = ICON[theme];

  const apply = () => {
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
    listeners.forEach((notify) => notify());
  };

  return (
    <button
      type="button"
      onClick={apply}
      className="btn-icon"
      aria-label={`Tema: ${LABEL[theme]}. Cambiar a ${LABEL[next]}.`}
      title={`Tema: ${LABEL[theme]}`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </button>
  );
};
