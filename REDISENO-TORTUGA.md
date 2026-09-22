# Rediseño Tortuga — estado

**Rama:** `rediseno-tortuga` (desde `master`). **Última actualización:** 23-sep-2026.
**Sin commit y sin push.** Los cambios están en el árbol de trabajo.

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

**Capa de tokens reescrita** en `app/globals.css`. Los valores viven en `:root` y se
sobreescriben por modo; `@theme inline` solo los referencia. Ese rodeo es lo que permite
cambiar de tema en caliente: si los valores vivieran dentro de `@theme`, Tailwind los
hornearía en las utilidades y el conmutador no tendría nada que mover.

**Alias heredados.** `--color-don-red`, `--color-link`, `--color-hairline`,
`--color-black`, `--color-light`, `--color-muted-strong`, `--color-unselected` y
`--color-disabled` apuntan ahora a tokens de Tortuga. Así los **46 usos** del rojo
cambiaron a musgo sin tocar un solo componente. Son andamio, no destino: se retiran a
medida que se revise cada uso.

**Tipografía.** Saira Extra Condensed + Sofia + JetBrains Mono → **Fraunces + Karla + IBM
Plex Mono**, por `next/font` con los ejes ópticos de Fraunces (`SOFT`, `WONK`, `opsz`).

**Tamaños grandes rebajados.** `--font-size-display-xl` de `12rem` a `6rem`, y hero y
section en proporción. Saira Extra Condensed cabía a 12rem en una línea; Fraunces, de
ancho normal, no.

**Conmutador de tema** — `components/ThemeToggle.tsx`, en el Navbar. Tres estados
(sistema / claro / oscuro) porque la capa de tokens distingue «sin preferencia» de una
elección explícita. En `app/layout.tsx` hay un script que aplica el tema guardado antes
del primer pintado, para que la página no parpadee.

**Grano enganchado al tema.** `.lht-noise` lee `--t-noise-opacity` y `--t-noise-blend`:
grano claro sobre papel claro solo ensucia, así que en claro casi no se ve y multiplica en
vez de sumar.

## Qué falta

- [ ] **Mirarlo con ojos.** No hay ninguna captura fiable todavía — ver la trampa de Chrome
      en [`CLAUDE.md`](CLAUDE.md). Lo verificado hasta ahora es que el CSS compilado emite
      la cascada correcta (`:root` claro · `@media dark :root:not([data-theme=light])` ·
      `[data-theme=dark]`), no que la página se vea bien.
- [ ] **Los 46 usos de acento son demasiados.** El presupuesto 60·30·10 dice que el musgo
      solo señala. Hay que decidir uno a uno cuáles son acento y cuáles estructura. No se
      puede hacer con un reemplazo masivo.
- [ ] **`mixBlendMode: difference` en el Navbar** dará colores raros en claro.
- [ ] **Revisar los tamaños grandes con la página delante.** Están rebajados a ojo.
- [ ] **Contraste:** Tortuga viene verificado, pero los componentes propios de esta web
      (`.brkt`, `.underliner`, `.ed-*`, tarjetas) no se han medido sobre los tonos nuevos.
- [ ] **Decidir qué se hace con la marca.** El `TurtleLogo.tsx` actual y el favicon siguen
      siendo los viejos. La exploración de logotipo está fuera de repo, en el escritorio de
      Javi (`lht-logotipo.html`).

## Antes de cerrar esto

No es un merge normal: cambia el aspecto de un sitio publicado que **no es nuestro**.
Tiene que verlo Alberto, y probablemente David. Lo natural es abrir PR y dejar que el
preview de Vercel hable, en vez de describirlo por escrito.
