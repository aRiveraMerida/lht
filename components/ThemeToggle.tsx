'use client';

import React, { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const LABEL: Record<Theme, string> = { light: 'claro', dark: 'oscuro' };

const DARK_QUERY = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();

function subscribe(notify: () => void) {
  listeners.add(notify);
  // While there is no explicit choice, the OS decides — follow it live.
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', notify);
  return () => {
    listeners.delete(notify);
    media.removeEventListener('change', notify);
  };
}

/** The theme on screen: the stored choice, or the system's when there is none. */
function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('lht-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* private mode, blocked storage: fall back to the system */
  }
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/**
 * Follows the system until the reader chooses; then one button toggles
 * between light and dark, starting from whatever is on screen.
 */
export const ThemeToggle: React.FC = () => {
  // The server cannot know the theme; it renders "light" and the client
  // corrects it on hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Moon : Sun;

  const toggle = () => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('lht-theme', next);
    } catch {
      /* the attribute still applies for this session */
    }
    listeners.forEach((notify) => notify());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon"
      aria-label={`Tema ${LABEL[theme]}. Cambiar a ${LABEL[next]}.`}
      title={`Cambiar a tema ${LABEL[next]}`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </button>
  );
};
