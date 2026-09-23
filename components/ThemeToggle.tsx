'use client';

import React, { useId, useSyncExternalStore } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'system', label: 'Sistema', Icon: Monitor },
  { value: 'dark', label: 'Oscuro', Icon: Moon },
];

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
 * Three real radios, as in the Tortuga specimen. Three states on purpose:
 * the token layer distinguishes "no preference" (follow the OS) from an
 * explicit choice, and collapsing that into a two-way switch would strand
 * anyone whose OS flips at sunset.
 */
export const ThemeToggle: React.FC = () => {
  // The server cannot know the stored choice, so it renders "system" and the
  // client corrects it on hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'system' as Theme);
  const name = useId();

  const apply = (next: Theme) => {
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
    <fieldset className="theme-switch">
      <legend className="sr-only">Tema</legend>
      {OPTIONS.map(({ value, label, Icon }) => (
        <label key={value} title={label}>
          <input
            type="radio"
            name={name}
            value={value}
            checked={theme === value}
            onChange={() => apply(value)}
          />
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  );
};
