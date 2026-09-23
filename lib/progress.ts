'use client'

// Reading progress through the labs, per reader, in their own browser.
// Nothing leaves the device and nothing needs an account: it is a bookmark,
// not a record. Shape: { [labSlug]: { seen: string[], current?: string } }.

import { useMemo, useSyncExternalStore } from 'react'

const KEY = 'lht-progress-v1'

export interface LabProgress {
  seen: string[]
  current?: string
}
type Store = Record<string, LabProgress>

const listeners = new Set<() => void>()

function subscribe(notify: () => void) {
  listeners.add(notify)
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) notify() }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(notify)
    window.removeEventListener('storage', onStorage)
  }
}

// The raw string is the snapshot: a primitive, so React can compare it
// without us caching parsed objects.
function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

function parse(raw: string): Store {
  if (!raw) return {}
  try {
    const value = JSON.parse(raw)
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

function write(update: (store: Store) => void) {
  const store = parse(readRaw())
  update(store)
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* private mode: progress lives only for this page view */
  }
  listeners.forEach((notify) => notify())
}

/** Progress for one lab. Empty on the server and until hydration. */
export function useLabProgress(labSlug: string): LabProgress {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '')
  return useMemo(() => parse(raw)[labSlug] ?? { seen: [] }, [raw, labSlug])
}

export function markCurrent(labSlug: string, guideSlug: string) {
  write((store) => {
    const lab = (store[labSlug] ??= { seen: [] })
    lab.current = guideSlug
  })
}

export function setSeen(labSlug: string, guideSlug: string, seen: boolean) {
  write((store) => {
    const lab = (store[labSlug] ??= { seen: [] })
    const rest = lab.seen.filter((s) => s !== guideSlug)
    lab.seen = seen ? [...rest, guideSlug] : rest
  })
}
