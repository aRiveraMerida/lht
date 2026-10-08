import { PageHeader } from '@/components/PageHeader'
import { MotionDemos } from '@/components/marca/MotionDemos'
import { Part } from '@/components/marca/shared'

const TIMING = [
  { token: '--ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Llegadas y respuestas al cursor: arranca decidido y se posa.' },
  { token: '--ease-in-out', value: 'cubic-bezier(0.65, 0, 0.35, 1)', use: 'Bucles: paseo y respiración.' },
  { token: 'Duraciones', value: '700 · 1400 · 1800 · 3200 · 5000 ms', use: 'Nada por debajo de 700 ms: si se ve prisa, sobra.' },
]

export default function MovimientoPage() {
  return (
    <div className="page-width">
      <PageHeader
        eyebrow="Apartado 05 · En construcción"
        title="Se mueve despacio"
        deck="El movimiento de la marca tiene una sola regla: el punto es el único que se mueve, una vez, y luego hay quietud."
      />

      <Part id="regla" n="01 · Regla" title="Una vez y quietud">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card"><h3 className="type-md">Solo el punto</h3><p className="mt-2">El arco se traza al llegar y ya no se mueve. Lo que se mueve es la tortuga.</p></div>
          <div className="card"><h3 className="type-md">Sin prisa</h3><p className="mt-2">Ningún movimiento dura menos de 700 ms. La lentitud es el mensaje, no un defecto.</p></div>
          <div className="card"><h3 className="type-md">Con permiso</h3><p className="mt-2">Con «reducir movimiento» activado en el sistema, todo queda quieto y la marca se ve entera desde el primer fotograma.</p></div>
        </div>
      </Part>

      <Part id="demos" n="02 · Estados" title="Cuatro movimientos, ninguno más" lead="Se pueden repetir o probar aquí. Si tu sistema tiene activado «reducir movimiento», verás las cuatro marcas quietas: es lo esperado.">
        <MotionDemos />
      </Part>

      <Part id="tiempos" n="03 · Tiempos" title="Curvas y duraciones">
        <div className="divide-y divide-rule border-y border-rule">
          {TIMING.map((t) => (
            <div key={t.token} className="grid grid-cols-1 items-baseline gap-2 py-4 md:grid-cols-[10rem_1.2fr_1.6fr]">
              <code>{t.token}</code>
              <code className="type-sm">{t.value}</code>
              <span className="text-ink-2">{t.use}</span>
            </div>
          ))}
        </div>
      </Part>
    </div>
  )
}
