import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Part } from '@/components/marca/shared'
import { PaletteCompare } from '@/components/marca/estilos/PaletteCompare'

export const metadata: Metadata = { title: 'Estilos · paleta' }

const WHY: { what: string; today: string; fix: string }[] = [
  { what: 'Fondo', today: 'Luz 95,5 % con croma 0,016: un papel verdoso que, al lado del texto, se lee gris.', fix: 'Luz 98,6–99 % y croma casi cero: blanco cálido. El tono lo ponen los acentos, no el papel.' },
  { what: 'Señal (musgo)', today: 'Croma 0,082. Junto a un fondo también verde, el acento apenas se separa.', fix: 'Croma 0,12–0,13 en el mismo tono 135: el mismo musgo, despierto.' },
  { what: 'Segundo tono', today: 'Arcilla para «casa» y para «resalte»: en la práctica, dos colores (verde y arcilla apagados).', fix: 'Tres papeles distintos: musgo señala, teja es la casa, azafrán resalta (etiquetas).' },
  { what: 'Objeto iluminado', today: 'Tinta sobre papel: el único elemento fuerte es negro verdoso.', fix: 'En Huerto pasa a verde bosque; en las demás se queda en tinta, pero rodeado de más color.' },
]

export default function PaletaPage() {
  return (
    <div className="page-width">
      <PageHeader
        crumbs={[{ href: '/marca/estilos', label: 'Estilos' }, { label: 'Paleta' }]}
        eyebrow="Prueba · sin publicar"
        title="Más claro, menos monocromo"
        deck={
          <>
            Mezcla con la cabecera original y cuatro paletas. Todas pasan <strong>WCAG AA en todo el
            texto</strong>, en claro y en oscuro: el contraste está calculado, no estimado.
          </>
        }
      />

      <Part id="diagnostico" n="01 · Diagnóstico" title="Por qué se veía apagado">
        <div className="divide-y divide-rule border-y border-rule">
          {WHY.map((w) => (
            <div key={w.what} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[10rem_1fr_1fr] md:gap-6">
              <strong>{w.what}</strong>
              <p className="text-ink-2"><span className="eyebrow mr-2">Hoy</span>{w.today}</p>
              <p><span className="eyebrow mr-2">Cambio</span>{w.fix}</p>
            </div>
          ))}
        </div>
      </Part>

      <Part
        id="paletas"
        n="02 · Paletas"
        title="Cuatro paletas, la misma página"
        lead="Las capturas son de la página real. En la página viva hay un selector de paleta abajo a la derecha, y la elección queda en la URL para compartirla."
      >
        <PaletteCompare />
      </Part>

      <Part id="propuesta" n="03 · Elegida" title="Papel blanco">
        <div className="flex max-w-[62ch] flex-col gap-4">
          <p>
            <strong>Elegida el 8 de octubre de 2026.</strong> Arregla lo que fallaba (el fondo verdoso que
            se leía gris y el musgo apagado) sin cambiar quién es quién: el musgo señala, la arcilla es la
            casa y el azafrán solo rellena etiquetas. Es la más fiel a Tortuga de las tres propuestas.
          </p>
          <p>
            Huerto y Teja quedan aquí como referencia: Huerto si algún día hace falta más color en el
            objeto iluminado, Teja si se quiere una casa más cálida.
          </p>
          <p className="type-sm">
            Ya está en los tokens del sitio (<code>app/globals.css</code>), con cada pareja de uso
            comprobada: texto AA y bordes de control a 3:1. Falta, si cuaja, llevarla al{' '}
            <code>tokens.css</code> de Tortuga en <code>lht-retos</code>. <Link href="/marca/estilos">Volver a la comparativa de estilos</Link>.
          </p>
        </div>
      </Part>
    </div>
  )
}
