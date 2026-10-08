'use client'

import { useEffect } from 'react'

/**
 * Everything that moves on the home page. Plain DOM work on server-rendered
 * markup: it only toggles classes, so without JS or under reduced motion the
 * page is complete and still. Reveals only hide content once .is-motion is set.
 */
export function HomeMotion({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root) return
    const cleanups: (() => void)[] = []
    const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── chapters: rail state and J/K (these work with or without motion)
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.home-rail a'))
    let current = 0
    const setCurrent = (i: number) => {
      current = i
      links.forEach((a, j) => {
        if (j === i) a.setAttribute('aria-current', 'true')
        else a.removeAttribute('aria-current')
        a.classList.toggle('seen', j < i)
      })
    }
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setCurrent(chapters.indexOf(e.target as HTMLElement)) }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    chapters.forEach((c) => spy.observe(c))
    setCurrent(0)
    cleanups.push(() => spy.disconnect())

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
      const k = e.key.toLowerCase()
      if (k !== 'j' && k !== 'k') return
      const next = Math.min(chapters.length - 1, Math.max(0, current + (k === 'j' ? 1 : -1)))
      chapters[next]?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' })
    }
    window.addEventListener('keydown', onKey)
    cleanups.push(() => window.removeEventListener('keydown', onKey))

    // ── reading progress
    const bar = root.querySelector<HTMLElement>('.home-progress i')
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        bar?.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    cleanups.push(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) })

    if (!motion) return () => cleanups.forEach((c) => c())
    root.classList.add('is-motion')
    cleanups.push(() => root.classList.remove('is-motion'))

    // ── reveals
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    root.querySelectorAll('[data-reveal], .home-hero').forEach((el) => reveal.observe(el))
    cleanups.push(() => reveal.disconnect())

    // ── hero: the outcome cycles slowly, only while the piece is on screen
    const outs = Array.from(root.querySelectorAll<HTMLElement>('.home-outs li'))
    const seam = root.querySelector<HTMLElement>('.home-seam')
    let timer: number | undefined
    let step = 0
    const tick = () => {
      outs.forEach((o, j) => o.classList.toggle('active', j === step % outs.length))
      step++
    }
    const heroWatch = new IntersectionObserver(([e]) => {
      window.clearInterval(timer)
      seam?.classList.toggle('paused', !e.isIntersecting)
      if (e.isIntersecting) { tick(); timer = window.setInterval(tick, 3200) }
    })
    const piece = root.querySelector('.home-hv')
    if (piece) heroWatch.observe(piece)
    seam?.classList.add('live')
    cleanups.push(() => { heroWatch.disconnect(); window.clearInterval(timer) })

    // ── labs: one packet walks the blocks once, the first time they are seen
    const timeouts: number[] = []
    const pipeWatch = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      pipeWatch.unobserve(e.target)
      const stages = Array.from(e.target.querySelectorAll<HTMLElement>('.home-stage'))
      stages.forEach((s, j) => {
        timeouts.push(window.setTimeout(() => s.classList.add('hit'), 450 + j * 380))
        if (j < stages.length - 1) timeouts.push(window.setTimeout(() => s.classList.remove('hit'), 450 + (j + 1) * 380 + 120))
      })
    }), { threshold: 0.5 })
    root.querySelectorAll('.home-pipe').forEach((p) => pipeWatch.observe(p))
    cleanups.push(() => { pipeWatch.disconnect(); timeouts.forEach((t) => window.clearTimeout(t)) })

    return () => cleanups.forEach((c) => c())
  }, [rootId])

  return null
}
