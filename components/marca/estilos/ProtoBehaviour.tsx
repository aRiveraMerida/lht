'use client'

import { useEffect } from 'react'

/**
 * Everything that moves in a style prototype. Vanilla DOM on purpose: the
 * markup is server-rendered and this only toggles classes, so with JS off or
 * reduced motion the page is complete and still.
 */
export function ProtoBehaviour({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root) return
    const html = document.documentElement
    const cleanups: (() => void)[] = []
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dark = window.matchMedia('(prefers-color-scheme: dark)')

    // ── theme: same contract as the site (html[data-theme] wins, else system)
    const applyMode = () => {
      const forced = html.getAttribute('data-theme')
      const mode = forced === 'dark' || forced === 'light' ? forced : dark.matches ? 'dark' : 'light'
      root.setAttribute('data-mode', mode)
    }
    applyMode()
    dark.addEventListener('change', applyMode)
    const themeObserver = new MutationObserver(applyMode)
    themeObserver.observe(html, { attributes: true, attributeFilter: ['data-theme'] })
    cleanups.push(() => { dark.removeEventListener('change', applyMode); themeObserver.disconnect() })

    const toggle = root.querySelector<HTMLButtonElement>('[data-theme-toggle]')
    // Not persisted: a prototype must not change the reader's saved site theme.
    const onToggle = () => html.setAttribute('data-theme', root.getAttribute('data-mode') === 'dark' ? 'light' : 'dark')
    toggle?.addEventListener('click', onToggle)
    cleanups.push(() => toggle?.removeEventListener('click', onToggle))

    const motion = !reduce.matches
    if (motion) root.classList.add('motion')

    // ── reveals
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target) }
      }),
      { root, threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    root.querySelectorAll('[data-reveal], .hero').forEach((el) => reveal.observe(el))
    cleanups.push(() => reveal.disconnect())

    // ── chapters: rail, "now" label, J/K
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.rail a'))
    const now = root.querySelector<HTMLElement>('[data-now]')
    let current = 0
    const setCurrent = (i: number) => {
      current = i
      links.forEach((a, j) => {
        a.toggleAttribute('aria-current', j === i)
        if (j === i) a.setAttribute('aria-current', 'true')
        a.classList.toggle('seen', j < i)
      })
      const c = chapters[i]
      if (now && c) now.innerHTML = `<span>${c.dataset.n}</span> ${c.dataset.chapter}`
    }
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setCurrent(chapters.indexOf(e.target as HTMLElement))
      }),
      { root, rootMargin: '-45% 0px -50% 0px' },
    )
    chapters.forEach((c) => spy.observe(c))
    setCurrent(0)
    cleanups.push(() => spy.disconnect())

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      const k = e.key.toLowerCase()
      if (k !== 'j' && k !== 'k') return
      const next = Math.min(chapters.length - 1, Math.max(0, current + (k === 'j' ? 1 : -1)))
      chapters[next]?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' })
    }
    window.addEventListener('keydown', onKey)
    cleanups.push(() => window.removeEventListener('keydown', onKey))

    // ── scroll progress
    const bar = root.querySelector<HTMLElement>('.progress i')
    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight
      bar?.style.setProperty('--p', String(max > 0 ? root.scrollTop / max : 0))
    }
    root.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    cleanups.push(() => root.removeEventListener('scroll', onScroll))

    if (!motion) return () => cleanups.forEach((c) => c())

    // ── hero: the outcome slot cycles slowly, and only while it is on screen
    const outs = Array.from(root.querySelectorAll<HTMLElement>('.out'))
    const seam = root.querySelector<HTMLElement>('.hero .seam')
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
    }, { root })
    const hv = root.querySelector('.hv')
    if (hv) heroWatch.observe(hv)
    seam?.classList.add('live')
    cleanups.push(() => { heroWatch.disconnect(); window.clearInterval(timer) })

    // ── lab pipelines: one packet walks the stages once, when first seen
    const pipeWatch = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      pipeWatch.unobserve(e.target)
      const stages = Array.from(e.target.querySelectorAll<HTMLElement>('.stage'))
      stages.forEach((s, j) => {
        window.setTimeout(() => s.classList.add('hit'), 450 + j * 380)
        window.setTimeout(() => j < stages.length - 1 && s.classList.remove('hit'), 450 + (j + 1) * 380 + 120)
      })
    }), { root, threshold: 0.5 })
    root.querySelectorAll('.pipe').forEach((p) => pipeWatch.observe(p))
    cleanups.push(() => pipeWatch.disconnect())

    return () => cleanups.forEach((c) => c())
  }, [rootId])

  return null
}
