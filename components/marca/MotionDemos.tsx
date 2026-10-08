'use client'

import { useState } from 'react'
import { Button } from '@/components/tortuga'
import { Brand } from '@/components/marca/marks'
import { Tile } from '@/components/marca/shared'

interface Demo {
  id: string
  cls: string
  name: string
  when: string
  spec: string
  replay?: boolean
}

const DEMOS: Demo[] = [
  { id: 'llegada', cls: 'mk-arrive', name: 'Llegada', when: 'Al cargar la portada, una vez.', spec: 'El arco se traza en 1400 ms; el punto entra desde el lado a los 700 ms y tarda 1800 ms. Luego, quietud.', replay: true },
  { id: 'paseo', cls: 'mk-walk', name: 'Paseo', when: 'Solo mientras algo carga.', spec: 'El punto camina de un lado a otro, 3200 ms por trayecto, sin prisa. Es el único bucle permitido.' },
  { id: 'respira', cls: 'mk-breathe', name: 'Respira', when: 'Página en reposo, si hace falta vida.', spec: 'Escala del punto de 1 a 1,18 cada 5 s. Nunca en el símbolo del favicon.' },
  { id: 'umbral', cls: 'mk-hover', name: 'Umbral', when: 'Al pasar el cursor o enfocar.', spec: 'El punto se desplaza 5 unidades en 700 ms. Vuelve solo al salir.' },
]

function DemoCard({ d }: { d: Demo }) {
  const [run, setRun] = useState(0)
  return (
    <article className="card !gap-4" aria-labelledby={`m-${d.id}`}>
      <div className="flex items-baseline justify-between">
        <h3 id={`m-${d.id}`} className="type-lg">{d.name}</h3>
        <span className="eyebrow">{d.cls.replace('mk-', '')}</span>
      </div>
      <Tile tone="paper" className="aspect-[4/3]">
        <span key={run} className={`${d.cls} inline-flex`} tabIndex={d.id === 'umbral' ? 0 : undefined}>
          <Brand className="h-32 w-32" />
        </span>
      </Tile>
      <p><strong>{d.when}</strong></p>
      <p className="type-sm">{d.spec}</p>
      {d.replay && (
        <div>
          <Button onClick={() => setRun((n) => n + 1)}>Repetir</Button>
        </div>
      )}
    </article>
  )
}

export function MotionDemos() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {DEMOS.map((d) => (
        <DemoCard key={d.id} d={d} />
      ))}
    </div>
  )
}
