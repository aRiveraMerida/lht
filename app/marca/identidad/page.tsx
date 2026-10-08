import type { CSSProperties } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Brand, BrandSmall, M1, U1b, X, type Mark } from '@/components/marca/marks'
import { Lockup, Part, Tile, TONES, toneStyle, type Tone } from '@/components/marca/shared'

const DOWNLOADS = [
  { file: 'caparazon', name: 'Placa · marca principal', Mark: Brand },
  { file: 'caparazon-pequeno', name: 'Placa pequeña · ≤ 24 px', Mark: BrandSmall },
  { file: 'panal', name: 'Panal · ilustración', Mark: X.panal },
  { file: 'umbral', name: 'Umbral · símbolo secundario', Mark: U1b },
  { file: 'h-habitacion', name: 'H-habitación · sello', Mark: M1 },
]

const SUFFIXES = [
  { suffix: '', label: 'color' },
  { suffix: '-oscuro', label: 'fondo oscuro' },
  { suffix: '-una-tinta', label: 'una tinta' },
  { suffix: '-adaptable', label: 'sigue el tema' },
]

const MISUSES: { label: string; why: string; style?: CSSProperties; className?: string; tone?: Tone }[] = [
  { label: 'Estirar', why: 'La retícula es cuadrada y el arco es un semicírculo.', style: { transform: 'scale(1.6, 1)' } },
  { label: 'Girar', why: 'Una puerta inclinada deja de ser una puerta.', style: { transform: 'rotate(-18deg)' } },
  { label: 'Cambiar el acento', why: 'El punto es musgo o es tinta. Nada más.', style: { ['--logo-accent' as string]: 'oklch(58% 0.2 25)' } },
  { label: 'Añadir sombra', why: 'El sistema es plano: cero sombras.', style: { filter: 'drop-shadow(3px 4px 3px rgb(0 0 0 / 0.45))' } },
  { label: 'Rellenar', why: 'Solo el punto va relleno.', className: '[&_g>path]:fill-current' },
  { label: 'Sobre imagen ruidosa', why: 'Necesita un fondo de la paleta, liso.', tone: 'paper' },
]

function Stage({ tone, children, className = '' }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[var(--radius-md)] border border-rule ${className}`} style={toneStyle(tone)}>
      {children}
    </div>
  )
}

function BrowserTab({ tone, title }: { tone: Tone; title: string }) {
  const t = TONES[tone]
  return (
    <Stage tone={tone} className="px-3 pt-3">
      <div
        className="flex max-w-[15rem] items-center gap-2 rounded-t-[10px] px-3 py-2 text-[0.8125rem]"
        style={{ background: tone === 'ink' ? 'oklch(25% 0.016 135)' : 'oklch(99% 0.006 118)', color: t.fg }}
      >
        <BrandSmall className="h-4 w-4 shrink-0" />
        <span className="truncate">{title}</span>
      </div>
      <div className="h-6" style={{ background: tone === 'ink' ? 'oklch(25% 0.016 135)' : 'oklch(99% 0.006 118)' }} />
    </Stage>
  )
}

function Header({ tone }: { tone: Tone }) {
  return (
    <Stage tone={tone}>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <Lockup Mark={Brand} markClass="h-9 w-9" />
        <span className="hidden gap-6 text-[0.9375rem] sm:flex">
          <span>Archivo</span>
          <span>Contacto</span>
        </span>
      </div>
      <div className="h-px" style={{ background: TONES[tone].rule }} />
    </Stage>
  )
}

function Avatar({ Mark, tone, size }: { Mark: Mark; tone: Tone; size: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-rule ${size}`}
      style={toneStyle(tone)}
    >
      <Mark className="h-3/5 w-3/5" />
    </div>
  )
}

export default function IdentidadPage() {
  return (
    <div className="page-width">
      <PageHeader
        eyebrow="Apartado 04 · En construcción"
        title="Identidad en uso"
        deck="Las reglas para que la marca aguante fuera de esta página: cuánto aire, cuánto mide como mínimo, qué no se le hace y cómo queda donde vive."
      />

      <Part
        id="espacio"
        n="01 · Espacio y tamaño"
        title="Un cuarto de aire"
        lead="El espacio de respeto es un cuarto del alto de la marca en los cuatro lados. Nada entra ahí: ni texto, ni bordes, ni otra marca."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Tile tone="paper" className="min-h-64 p-8">
            <div className="relative" style={{ padding: 16 }}>
              <div className="absolute inset-0 border border-dashed" style={{ borderColor: TONES.clay.accent }} aria-hidden="true" />
              <div className="absolute left-0 top-0 h-4 w-4 border-b border-r border-dashed" style={{ borderColor: TONES.clay.accent }} aria-hidden="true" />
              <Brand className="h-16 w-16" />
              <span className="absolute -bottom-6 left-0 font-mono text-[0.6875rem]" style={{ color: TONES.clay.accent }}>x = ¼ del alto</span>
            </div>
          </Tile>
          <div className="card !gap-4">
            <h3 className="type-md">Tamaños mínimos</h3>
            <div className="grid grid-cols-1 gap-3">
              <Tile tone="paper" className="h-16 gap-4"><BrandSmall className="h-4 w-4" /><span className="font-mono text-[0.6875rem]">16 px · placa pequeña</span></Tile>
              <Tile tone="paper" className="h-16"><Lockup Mark={Brand} variant="nombre" markClass="h-6 w-6" /></Tile>
            </div>
            <ul className="list-disc pl-5 text-ink-2">
              <li>Placa: <strong>24 px</strong> (pantalla) o <strong>8 mm</strong> (impreso). Por debajo, placa pequeña, hasta <strong>16 px</strong>.</li>
              <li>Lockup con lema: <strong>140 px</strong> de ancho. Por debajo, sin lema.</li>
              <li>Lockup sin lema: <strong>110 px</strong>. Por debajo, solo símbolo.</li>
            </ul>
          </div>
        </div>
      </Part>

      <Part
        id="usos"
        n="02 · Usos incorrectos"
        title="Lo que la marca no hace"
        lead="Seis maneras habituales de estropear una marca simple. Se ven aquí para reconocerlas, no para usarlas."
      >
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MISUSES.map((m) => (
            <li key={m.label} className="card !gap-3 !p-4">
              <Tile tone={m.tone ?? 'paper'} className="aspect-[4/3]" label={`Uso incorrecto: ${m.label}`}>
                {m.label === 'Sobre imagen ruidosa' && (
                  <span
                    className="absolute inset-0"
                    style={{ background: 'repeating-conic-gradient(oklch(72% 0.12 40) 0 12deg, oklch(45% 0.14 250) 12deg 24deg, oklch(80% 0.1 120) 24deg 36deg)' }}
                    aria-hidden="true"
                  />
                )}
                <span className={`relative inline-flex ${m.className ?? ''}`} style={m.style}>
                  <Brand className="h-20 w-20" />
                </span>
                <span className="absolute right-2 top-2 rounded-full px-2 py-0.5 font-mono text-[0.6875rem]" style={{ background: 'var(--color-error)', color: 'white' }}>✕ No</span>
              </Tile>
              <div>
                <p className="font-display text-[var(--text-md)]">{m.label}</p>
                <p className="type-sm mt-1">{m.why}</p>
              </div>
            </li>
          ))}
        </ul>
      </Part>

      <Part id="aplicaciones" n="03 · Aplicaciones" title="Donde vive" lead="Los sitios donde la marca se encuentra con quien lee. Todo con las medidas y los colores reales de la casa.">
        <h3 className="type-lg">Pestaña y favicon</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <BrowserTab tone="paper" title="La Habitación Tortuga — La IA, despacio" />
          <BrowserTab tone="ink" title="La Habitación Tortuga — La IA, despacio" />
        </div>

        <h3 className="type-lg mt-12">Cabecera</h3>
        <div className="mt-4 grid gap-4">
          <Header tone="paper" />
          <Header tone="ink" />
        </div>

        <h3 className="type-lg mt-12">Tarjeta al compartir (1200 × 630)</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Stage tone="paper" className="aspect-[1200/630]">
            <div className="flex h-full flex-col justify-between p-[6%]">
              <Lockup Mark={Brand} variant="nombre" markClass="h-9 w-9" />
              <div>
                <p className="font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight" style={{ fontVariationSettings: '"opsz" 96' }}>
                  La IA, despacio.
                </p>
                <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em]" style={{ color: TONES.clay.accent }}>
                  Laboratorio de IA · sin prisas
                </p>
              </div>
            </div>
          </Stage>
          <Stage tone="ink" className="aspect-[1200/630]">
            <div className="flex h-full flex-col items-center justify-center gap-4 p-[6%] text-center">
              <Brand className="h-1/3 w-auto" />
              <p className="font-display text-[clamp(1.25rem,3vw,2rem)] font-medium leading-none tracking-tight" style={{ fontVariationSettings: '"opsz" 72' }}>
                La Habitación Tortuga
              </p>
            </div>
          </Stage>
        </div>

        <h3 className="type-lg mt-12">Avatar y sello</h3>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <Avatar Mark={Brand} tone="paper" size="h-24 w-24" />
          <Avatar Mark={Brand} tone="ink" size="h-16 w-16" />
          <Avatar Mark={BrandSmall} tone="moss" size="h-10 w-10" />
          <Avatar Mark={M1} tone="paper2" size="h-24 w-24" />
          <Avatar Mark={M1} tone="clay" size="h-16 w-16" />
          <p className="type-sm max-w-[30ch]">
            El símbolo, centrado y a tres quintos del círculo. La H-habitación queda como sello
            alternativo para firmar documentos.
          </p>
        </div>

        <h3 className="type-lg mt-12">Firma de correo</h3>
        <Stage tone="paper" className="mt-4 max-w-xl p-6">
          <div className="flex items-start gap-4">
            <Brand className="mt-1 h-10 w-10 shrink-0" />
            <div className="leading-snug">
              <p className="font-display text-[1.125rem] font-medium">Javier Carreira</p>
              <p className="text-[0.9375rem]">La Habitación Tortuga · equipo IA de ThePower Education</p>
              <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em]" style={{ color: TONES.clay.accent }}>
                LHT · La IA, despacio
              </p>
            </div>
          </div>
        </Stage>
      </Part>

      <Part
        id="descargas"
        n="04 · Descargas"
        title="Los archivos"
        lead="SVG de los cinco símbolos en cuatro versiones: color, para fondo oscuro, una tinta y adaptable (cambia sola con el tema del sistema). Sirven como favicon tal cual."
      >
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {DOWNLOADS.map((d) => (
            <li key={d.file} className="card !gap-3 !p-4">
              <div className="grid grid-cols-2 gap-2">
                <Tile tone="paper" className="aspect-square"><d.Mark className="h-1/2 w-1/2" /></Tile>
                <Tile tone="ink" className="aspect-square"><d.Mark className="h-1/2 w-1/2" /></Tile>
              </div>
              <p className="font-display text-[var(--text-md)]">{d.name}</p>
              <ul className="type-sm flex flex-col gap-1">
                {SUFFIXES.map((s) => (
                  <li key={s.suffix}>
                    <a href={`/marca/${d.file}${s.suffix}.svg`} download>{d.file}{s.suffix}.svg</a> · {s.label}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Part>
    </div>
  )
}
