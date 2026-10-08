import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import Link from 'next/link'
import { Part } from '@/components/marca/shared'
import { StyleCompare } from '@/components/marca/estilos/StyleCompare'

export const metadata: Metadata = { title: 'Estilos · comparativa' }

type Mark = 'sí' | 'a medias' | 'no'

const ROWS: { q: string; tortuga: Mark; noir: Mark; mezcla: Mark; why: string }[] = [
  { q: 'Se reconoce como LHT', tortuga: 'sí', noir: 'no', mezcla: 'sí', why: 'Noir se lleva la paleta y las letras de otro proyecto; Mezcla conserva la cabecera, el musgo y Fraunces (con la paleta Papel blanco).' },
  { q: 'Primera pantalla con presencia', tortuga: 'no', noir: 'sí', mezcla: 'sí', why: 'Tortuga abre con un titular y una lista. Las otras dos abren con un titular grande y una pieza que explica cómo trabaja la habitación.' },
  { q: 'Se lee como blog', tortuga: 'sí', noir: 'a medias', mezcla: 'a medias', why: 'La estructura por capítulos empuja hacia «presentación». Para la portada funciona; para un artículo, no.' },
  { q: 'Coherente con «despacio»', tortuga: 'sí', noir: 'a medias', mezcla: 'sí', why: 'Noir es frío y tecnológico. Mezcla mantiene la calma de Tortuga con el ritmo de Noir.' },
  { q: 'Movimiento', tortuga: 'no', noir: 'sí', mezcla: 'sí', why: 'Entradas con resorte, un solo bucle lento que se pausa fuera de pantalla, nada con reducir movimiento.' },
  { q: 'Coste de llevarlo al sitio', tortuga: 'sí', noir: 'no', mezcla: 'a medias', why: 'Noir obliga a rehacer tipografía, paleta y componentes. Mezcla reutiliza los tokens y cambia la maquetación.' },
]

const badge = (m: Mark) => (
  <span className={`badge ${m === 'sí' ? 'badge--progress' : 'badge--locked'}`}>{m}</span>
)

export default function EstilosPage() {
  return (
    <div className="page-width">
      <PageHeader
        eyebrow="Prueba · sin publicar"
        title="Tres portadas, el mismo contenido"
        deck={
          <>
            Tortuga es el sitio de hoy. <strong>Noir</strong> es la presentación de referencia aplicada a
            LHT. <strong>Mezcla</strong> es la misma maquetación de Noir con la identidad de Tortuga. Noir
            y Mezcla comparten maquetación, así que lo que cambia entre ellas es solo la piel.
          </>
        }
      />

      <p className="mt-6">
        <Link href="/marca/estilos/paleta" className="font-medium">Siguiente: la paleta de Mezcla, más clara y menos monocroma →</Link>
      </p>

      <Part id="comparar" n="01 · Ver" title="Compáralas">
        <StyleCompare />
      </Part>

      <Part id="criterios" n="02 · Juicio" title="Con la misma vara" lead="Es mi lectura, para discutirla: la decisión es tuya y de Alberto.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">Comparativa de los tres estilos</caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="eyebrow py-2 pr-4">Criterio</th>
                <th scope="col" className="py-2 pr-4 font-display text-[var(--text-md)]">Tortuga</th>
                <th scope="col" className="py-2 pr-4 font-display text-[var(--text-md)]">Noir</th>
                <th scope="col" className="py-2 pr-4 font-display text-[var(--text-md)]">Mezcla</th>
                <th scope="col" className="eyebrow py-2">Por qué</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.q} className="border-b border-rule align-top">
                  <th scope="row" className="py-3 pr-4 font-medium">{r.q}</th>
                  <td className="py-3 pr-4">{badge(r.tortuga)}</td>
                  <td className="py-3 pr-4">{badge(r.noir)}</td>
                  <td className="py-3 pr-4">{badge(r.mezcla)}</td>
                  <td className="type-sm py-3">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Part>
    </div>
  )
}
