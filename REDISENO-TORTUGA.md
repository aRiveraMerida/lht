# Rediseño Tortuga — estado

**Rama:** `master`. Todo mergeado y en producción (PR #5 a #9).
**Última actualización:** 8-oct-2026. Se mergeó directamente para que Alberto lo vea
desplegado; si no lo quiere, se revierte por PR.

## Qué se está haciendo y por qué

Portar el sistema de diseño **Tortuga** (del repo `lht-retos`) a esta web, con modo claro
y oscuro conmutables.

Conviene tener presente de dónde se viene, porque no es un sitio sin diseño: el aspecto
actual lo hizo Alberto en abril y es deliberado — *«rediseña web al estilo "La IA,
despacio" (dark + Saira condensed + acento rojo)»*, después de una iteración previa hacia
«estética WIRED». Y su tesis es **la misma** que la de Tortuga («reposado, antídoto al
hype»): lo que cambia es el registro, no la idea. Esto sustituye una dirección por otra,
no rellena un hueco.

## Qué ha entrado ya

**Tokens** en `app/globals.css`, portados de `tokens.css` tal cual, claro y oscuro. Los
valores viven en `:root` y se sobreescriben por modo; `@theme inline` solo los referencia.
Ese rodeo es lo que permite cambiar de tema en caliente: si los valores vivieran dentro de
`@theme`, Tailwind los hornearía en las utilidades y el conmutador no tendría nada que mover.

**Los componentes del specimen, con sus nombres.** La capa de componentes de `globals.css` es
el CSS del specimen portado sin reinventar: `.btn` (primary · secondary · ghost, 8 estados),
`.card`, `.badge`, `.progress`, `.alert`, `.field`/`.input`, `.tabs`, `.masthead`, `.section`,
`.type-*`, `.eyebrow`, `.lesson-body`. Lo que añade el sitio va marcado como `site` en el CSS
(cabecera, migas, subnavegación, filas de lección, alerta `note`). La capa antigua `ed-*` y los
alias de color heredados ya no existen. Cero `rgba()` y cero `opacity` para atenuar.

**Maquetación editorial, no de catálogo.** La gramática de página del specimen (secciones a dos
columnas con título fijo, todo en tarjetas) leía como documentación, no como blog. Se mantiene el
sistema y cambia la maquetación: portada con los artículos primero en lista tipográfica
(`PostList`: fecha, título, entradilla, regla), laboratorios en tarjetas debajo y «Sobre la
habitación» al final; artículos y capítulos en una columna centrada (`.read-col`) con el cuerpo en
**Fraunces de texto a 20px** (`.article-body`). Esto último es una extensión consciente del
sistema, que reserva Fraunces para titulares. El índice de laboratorio conserva el `.section` a dos
columnas porque ahí es un curso.

**Componentes React** en `components/tortuga/`: `Button`, `Card`, `Badge`, `Progress`, `Alert`.
`PageHeader` (el masthead) y `SectionHeader` montan la estructura de página. `Markdown` renderiza
posts y capítulos.

**Laboratorios como curso.** Progreso por lector en su navegador (`lib/progress.ts`, clave
`lht-progress-v1`), sin cuenta ni servidor: el capítulo abierto queda «En curso», el lector lo
marca como «Visto» al final, el índice muestra la barra de progreso y «Continuar» como único
botón relleno, y el archivo marca el laboratorio «En curso» o «Completado». «Vista» vive en la
capa 30 (es historia); «En curso» en la 10.

**Alertas en markdown.** `> [!NOTE]`, `[!IMPORTANT]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`
se renderizan como alerta Tortuga (`lib/remark-alerts.ts`). Ningún contenido las usa todavía.

**Buscador** como campo Tortuga: etiqueta, recuento en vivo como ayuda («3 de 10 artículos»),
Escape limpia, estado vacío en tarjeta.

**Autores del sitio:** Alberto Rivera y Javier Carreira (metadata, JSON-LD, residentes).
David conserva la firma de `que-buscamos-aqui.md`.

**Eliminados por huérfanos:** `components/AssetPreview.tsx`, `components/TopicChip.tsx`,
`lib/assets.ts` y la dependencia `framer-motion`.

**Tono de apoyo · arcilla** (extensión del sitio, no está en `tokens.css`). El sistema
es monocromo en musgo y el sitio quedaba plano. La arcilla (OKLCH, tono ~50–70) marca lo
que es de la casa: tarjetas de laboratorio, citas, numeración de capítulos, etiquetas y
selección de texto. La acción (enlaces, botón principal, activo, foco, progreso) sigue
siendo del musgo. Pasa AA en los dos temas.

## Segunda vuelta (8-oct-2026, rama `marca-lab`)

**Paleta «Papel blanco».** El papel verdoso (luz 95,5 %) se leía gris y el musgo, apagado. Los
`--t-*` de `globals.css` pasan a papel casi blanco (98,6 %) y musgo y arcilla con más croma, en
los mismos tonos. Cada pareja de uso real está comprobada con script: texto AA, bordes de
control 3:1 (`rule-2`), y la arcilla a 4,5:1 porque numera listas. Se eligió entre cuatro
paletas en `/marca/estilos/paleta`. Tokens nuevos: `surface` (paneles) y `saffron`
(etiquetas de temas de la portada).

**Portada como presentación en cuatro capítulos** (`app/page.tsx`, `components/home/`,
bloque `site: home` en `globals.css`): pieza explicativa en el hero («Probamos» → «antes de
opinar» → lo que funciona / lo que no / lo que todavía no sabemos), último artículo como bloque
destacado, laboratorios como línea de bloques (conserva el progreso por lector), columna de
capítulos, progreso de lectura y `J`/`K`. Movimiento con resortes, un solo bucle lento que se
pausa fuera de pantalla, nada con «reducir movimiento». La cabecera es la de siempre. Sale del
prototipo «Mezcla» de `/marca/estilos`, que mezcla una presentación de referencia («Blueprint
Noir») con la identidad de Tortuga. El resto de páginas conserva su maquetación.

**Fraunces con cursiva real** (`app/layout.tsx`): antes el navegador la sintetizaba.

**Laboratorio de marca en `/marca`** (interno: `noindex`, fuera del menú y del sitemap). Hub,
exploración de logo por rondas, color y tipo, identidad, movimiento, y `/marca/estilos` con los
prototipos Noir y Mezcla, la comparativa y la paleta. Capturas en `public/marca/estilos/`
(se regeneran a mano si cambian los prototipos). Ojo: `.block` del sitio choca con la
utilidad `block` de Tailwind; en código nuevo, no usar `block`.

## Tercera vuelta (8-oct-2026, PR #7 a #9)

**Overscroll** (#7): la cuadrícula de la portada empieza bajo la cabecera, así que al tirar
más allá del borde se ve la barra de menú y no el fondo.

**Columna de lectura a 48rem** (#8): unos 71 caracteres por línea en escritorio. No conviene
ensancharla más: algunas líneas ya llegan a 81.

**Oscuro más claro** (#9): fondo al 22 % de luminosidad (antes 16 %, que se leía casi negro; el
25 % se probó y quedaba lavado). Texto al 92 % (13,6:1) para que deslumbre menos y secundario al
86 % para que siga separándose. Todas las parejas pasan AA.

**Auditoría de lectura** (#9): en móvil el cuerpo baja a 18 px (de 33 a unos 37 caracteres por
línea) y se activa el guionado, salvo en títulos, código y tablas. La negrita pasa a 550 y las
listas van más juntas dentro de cada punto que entre puntos. El justificado se probó y se
descartó: en móvil abría huecos entre palabras y en escritorio estiraba líneas.

## Qué falta

- [ ] **Que lo vea Alberto.** Cambia el aspecto de un sitio publicado que es suyo, y Tortuga
      sigue «pendiente de Alberto» en `lht-retos/.../decisiones/design-system/DECISION.md`.
- [ ] **Marca:** `TurtleLogo.tsx` y el favicon siguen siendo los viejos. La exploración está
      en `/marca/logo` y en `public/marca/banco/`; la dirección que gusta es un caparazón
      orgánico visto desde arriba (tanda 7: S1 sobrio, S5 con espiral). Sin elegir.
- [ ] **Llevar la composición nueva al resto de páginas** (archivo, artículo, laboratorio), si
      se quiere: hoy solo la portada la tiene.
- [ ] **Contenido de guías:** varias guías de laboratorio tienen listas y tablas aplanadas en
      párrafos (`• a • b • c`, p. ej. `prework-terminal`, `prework-git`). Es del markdown.
- [ ] **Exceso de negritas** en algunos posts (por cada 1000 palabras: AI Act 24, Data Lake 21,
      harness 18). Es del contenido; el CSS ya las suaviza.
- [ ] **Avisos del detector de Impeccable** sobre código anterior: la barra de progreso anima
      `width`, las filas de artículos de la portada animan `padding`, y la cuadrícula del fondo
      de la portada cuenta como decorativa.
- [ ] **Siete tamaños de letra por página**, el sistema pide cinco. Revisar si sobra un nivel.
- [ ] **Validar la arcilla con Alberto** y, si se queda, portarla a `tokens.css` del
      design system para que deje de ser una extensión del sitio.
