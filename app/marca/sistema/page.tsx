import { PageHeader } from '@/components/PageHeader'
import { Part, Tile } from '@/components/marca/shared'
import { Brand } from '@/components/marca/marks'

// Tokens are read from the live theme (var(--color-*)) so this page also proves the theme switch.
const SWATCHES: { name: string; token: string; role: string; share: string }[] = [
  { name: 'Papel', token: '--color-paper', role: 'El fondo. Domina.', share: '60' },
  { name: 'Tinta', token: '--color-ink', role: 'El texto y el trazo de la marca.', share: '60' },
  { name: 'Superficie', token: '--color-paper-2', role: 'Tarjetas y bandas que estructuran.', share: '30' },
  { name: 'Regla', token: '--color-rule', role: 'Líneas: estructuran sin llamar.', share: '30' },
  { name: 'Musgo', token: '--color-accent', role: 'Solo señala: enlaces, único botón relleno, foco… y el punto.', share: '10' },
  { name: 'Arcilla', token: '--color-clay', role: 'Tono de la casa (etiquetas, citas). Pendiente de Alberto.', share: '—' },
]

const SCALE = [
  { name: 'Display', cls: 'type-display', sample: 'La IA, despacio', spec: 'Fraunces · 60/63 · opsz máx.' },
  { name: 'Título', cls: 'type-xl', sample: 'Probamos antes de opinar', spec: 'Fraunces · 31/36' },
  { name: 'Subtítulo', cls: 'type-md', sample: 'Sin humo, sin FOMO', spec: 'Fraunces · 20/23' },
  { name: 'Cuerpo', cls: 'type-base', sample: 'Una habitación donde se piensa antes de opinar.', spec: 'Karla · 17/27' },
  { name: 'Etiqueta', cls: 'eyebrow', sample: 'Laboratorio de IA · sin prisas', spec: 'Karla · 12 · mayúsculas' },
]

const VOICE: { say: string; not: string }[] = [
  { say: 'Probamos antes de opinar.', not: 'La revolución de la IA ya está aquí.' },
  { say: 'Esto funcionó; esto no.', not: 'Los 10 prompts que lo cambian todo.' },
  { say: 'Despacio, con las manos.', not: 'No te quedes atrás.' },
]

export default function SistemaPage() {
  return (
    <div className="page-width">
      <PageHeader
        eyebrow="Apartado 03 · Decidido (arcilla pendiente)"
        title="Color y tipografía"
        deck="No se inventa un sistema nuevo: el logo hereda Tortuga tal cual. Esta página fija cómo lo usa la marca y qué no puede hacer."
      />

      <Part
        id="color"
        n="01 · Color"
        title="60 · 30 · 10"
        lead="Papel y tinta dominan, las superficies y las reglas estructuran, y el musgo solo señala. La marca cumple la misma regla: el trazo es tinta y el punto es el único musgo."
      >
        <div className="flex h-16 overflow-hidden rounded-[var(--radius-md)] border border-rule" role="img" aria-label="Proporción 60, 30 y 10">
          <div style={{ flex: 60, background: 'var(--color-paper)' }} className="flex items-end p-2 type-xs">60 · papel y tinta</div>
          <div style={{ flex: 30, background: 'var(--color-paper-3)' }} className="flex items-end p-2 type-xs">30 · estructura</div>
          <div style={{ flex: 10, background: 'var(--color-accent)', color: 'var(--color-paper)' }} className="flex items-end p-2 type-xs">10</div>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWATCHES.map((s) => (
            <li key={s.name} className="card !gap-3 !p-4">
              <div className="h-16 rounded-[var(--radius-sm)] border border-rule" style={{ background: `var(${s.token})` }} />
              <div className="flex items-baseline justify-between">
                <p className="font-display text-[var(--text-md)]">{s.name}</p>
                <span className="eyebrow">{s.share === '—' ? 'apoyo' : `${s.share}`}</span>
              </div>
              <p className="type-sm">{s.role}</p>
              <code className="type-xs">{s.token}</code>
            </li>
          ))}
        </ul>

        <h3 className="type-lg mt-12">La marca sobre cada fondo</h3>
        <p className="mt-2 max-w-[62ch] text-ink-2">
          Sobre musgo el punto pasa a papel y la marca queda en una tinta: el musgo no puede señalar
          sobre sí mismo.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {(['paper', 'paper2', 'ink', 'moss', 'clay'] as const).map((t) => (
            <Tile key={t} tone={t} className="aspect-[4/3]" label={`Marca sobre ${t}`}>
              <Brand className="h-1/2 w-1/2" />
              <span className="absolute bottom-2 left-3 font-mono text-[0.6875rem] uppercase tracking-widest">{t}</span>
            </Tile>
          ))}
        </div>
        <p className="type-sm mt-2">Colores fijos de los tokens, claro y oscuro; independientes del tema con que se lea esta página.</p>
      </Part>

      <Part
        id="tipografia"
        n="02 · Tipografía"
        title="Fraunces habla, Karla explica"
        lead="Tres familias, ninguna nueva. Fraunces para lo que la casa dice; Karla para lo que explica; IBM Plex Mono para lo que es código o etiqueta técnica."
      >
        <div className="divide-y divide-rule border-y border-rule">
          {SCALE.map((s) => (
            <div key={s.name} className="grid grid-cols-1 items-baseline gap-2 py-5 md:grid-cols-[8rem_1fr_16rem]">
              <span className="eyebrow">{s.name}</span>
              <p className={s.cls}>{s.sample}</p>
              <span className="type-sm">{s.spec}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card">
            <h3 className="type-md">El nombre</h3>
            <p className="mt-3 font-display text-[1.75rem] font-medium leading-none tracking-tight" style={{ fontVariationSettings: '"opsz" 36' }}>
              La Habitación Tortuga
            </p>
            <p className="type-sm mt-3">Fraunces medio, seguimiento −0,01 em, opsz 36. Nunca en negrita, nunca en cursiva, nunca todo en mayúsculas.</p>
          </div>
          <div className="card">
            <h3 className="type-md">El lema</h3>
            <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em]">LHT · La IA, despacio</p>
            <p className="type-sm mt-3">IBM Plex Mono a 11 px, mayúsculas, seguimiento 0,14 em. Siempre debajo del nombre, a un tercio de su tamaño.</p>
          </div>
        </div>
      </Part>

      <Part id="voz" n="03 · Voz" title="Lo que decimos y lo que no" lead="La marca habla como la lentitud: en voz baja y con pruebas.">
        <div className="divide-y divide-rule border-y border-rule">
          {VOICE.map((v) => (
            <div key={v.say} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-2">
              <p><span className="eyebrow mr-3">Sí</span>{v.say}</p>
              <p className="text-neutral"><span className="eyebrow mr-3">No</span><s>{v.not}</s></p>
            </div>
          ))}
        </div>
      </Part>
    </div>
  )
}
