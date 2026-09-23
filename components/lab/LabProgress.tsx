'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { Badge, Button, Progress } from '@/components/tortuga'
import { markCurrent, setSeen, useLabProgress } from '@/lib/progress'

interface GuideRef {
  slug: string
  title: string
  order: number
}

/** Status of one lesson in a list: history in the 30, the current one in the 10. */
export function LessonStatus({ lab, slug }: { lab: string; slug: string }) {
  const { seen, current } = useLabProgress(lab)
  if (seen.includes(slug)) return <Badge status="done">Vista</Badge>
  if (current === slug) return <Badge status="progress">En curso</Badge>
  return null
}

/** A small check next to a lesson tab once it is seen. */
export function SeenMark({ lab, slug }: { lab: string; slug: string }) {
  const { seen } = useLabProgress(lab)
  if (!seen.includes(slug)) return null
  return (
    <>
      <Check aria-hidden="true" />
      <span className="sr-only">(vista)</span>
    </>
  )
}

/** Whole-lab state for its card in the archive. */
export function LabStatus({ lab, total }: { lab: string; total: number }) {
  const { seen, current } = useLabProgress(lab)
  if (total > 0 && seen.length >= total) return <Badge status="done">Completado</Badge>
  if (seen.length > 0 || current) return <Badge status="progress">En curso</Badge>
  return null
}

/**
 * Progress bar plus the page's one filled call to action: continue where
 * the reader left off, or start at chapter one.
 */
export function LabResume({ lab, urlBase, sequence }: { lab: string; urlBase: string; sequence: GuideRef[] }) {
  const { seen, current } = useLabProgress(lab)
  const seenCount = sequence.filter((g) => seen.includes(g.slug)).length
  const resume =
    sequence.find((g) => g.slug === current && !seen.includes(g.slug)) ??
    sequence.find((g) => !seen.includes(g.slug))
  const started = seenCount > 0 || Boolean(current)

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <Progress
        name="Progreso del laboratorio"
        value={seenCount}
        max={sequence.length}
        label={`${seenCount} de ${sequence.length} capítulos vistos`}
      />
      {resume ? (
        <Button variant="primary" href={`${urlBase}/${resume.slug}`}>
          {started
            ? `Continuar: ${String(resume.order).padStart(2, '0')} · ${resume.title}`
            : 'Empezar por el capítulo 01'}
        </Button>
      ) : (
        <Badge status="done">Laboratorio completado</Badge>
      )}
    </div>
  )
}

/** Records the visit, and lets the reader mark the chapter as seen. */
export function ChapterProgress({ lab, slug }: { lab: string; slug: string }) {
  const { seen } = useLabProgress(lab)
  const isSeen = seen.includes(slug)

  useEffect(() => {
    markCurrent(lab, slug)
    // On narrow screens the lesson strip scrolls; bring the current tab into view.
    document
      .querySelector('.subnav [aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [lab, slug])

  return (
    <div className="card md:flex-row md:items-center md:justify-between">
      <div>
        <span className="eyebrow">Tu progreso</span>
        <p className="card-desc mt-1">
          {isSeen
            ? 'Marcado como visto. Se guarda solo en este navegador.'
            : '¿Terminado? Márcalo y el índice del laboratorio lo recordará.'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isSeen ? (
          <>
            <span className="btn btn--secondary" data-state="success" role="status">
              <Check aria-hidden="true" /> Visto
            </span>
            <Button variant="ghost" onClick={() => setSeen(lab, slug, false)}>
              Desmarcar
            </Button>
          </>
        ) : (
          <Button onClick={() => setSeen(lab, slug, true)}>Marcar como visto</Button>
        )}
      </div>
    </div>
  )
}

/** Progress bar inside a lab's card, only once the reader has started it. */
export function LabCardProgress({ lab, total }: { lab: string; total: number }) {
  const { seen } = useLabProgress(lab)
  if (seen.length === 0) return null
  return <Progress name="Progreso del laboratorio" value={seen.length} max={total} label={`${seen.length} de ${total} capítulos vistos`} />
}
