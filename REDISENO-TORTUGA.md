# Rediseño Tortuga — estado

**Rama:** `rediseno-tortuga` (desde `master`). **Última actualización:** 23-sep-2026.
**Sin push.** El port de tokens está en commit; la adopción de la gramática Tortuga (ver abajo) está en el árbol de trabajo.

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
`lib/assets.ts`. `framer-motion` ya no se importa en ningún sitio, pero sigue en
`package.json`.

## Qué falta

- [ ] **Que lo vea Alberto.** Cambia el aspecto de un sitio publicado que es suyo, y Tortuga
      sigue «pendiente de Alberto» en `lht-retos/.../decisiones/design-system/DECISION.md`.
- [ ] **Marca:** `TurtleLogo.tsx` y el favicon siguen siendo los viejos. La exploración de
      logotipo está fuera de repo (`lht-logotipo.html`, escritorio de Javi).
- [ ] **Contenido de guías:** varias guías de laboratorio tienen listas y tablas aplanadas en
      párrafos (`• a • b • c`, p. ej. `prework-terminal`, `prework-git`). Es del markdown.
- [ ] **Siete tamaños de letra por página**, el sistema pide cinco. Revisar si sobra un nivel.
- [ ] Quitar `framer-motion` de `package.json` si nadie lo va a usar.

## Antes de cerrar esto

No es un merge normal: cambia el aspecto de un sitio publicado que **no es nuestro**.
Tiene que verlo Alberto. Lo natural es abrir PR y dejar que el
preview de Vercel hable, en vez de describirlo por escrito.
