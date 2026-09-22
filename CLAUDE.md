# lht — La Habitación Tortuga (web)

Sitio de LHT: archivo editorial sobre IA, estrategia y trabajo real. Next.js 16 (App
Router) + React 19 + TypeScript + Tailwind 4, desplegado en Vercel.

## Lo primero que hay que saber

**Este repo no es de Javi.** El remoto es `aRiveraMerida/lht` — es de **Alberto Rivera**, y
los autores declarados del sitio son **Alberto Rivera y David Dix Hidalgo** (ver
`app/layout.tsx`, metadata y JSON-LD). Javi contribuye, no es propietario.

Consecuencias prácticas:

- **Nunca hacer push sin pedirlo explícitamente.** Cualquier push va al repositorio de otra
  persona.
- La rama principal es **`master`**, no `main`. No renombrarla.
- Un cambio de diseño, de tono o de identidad no es una decisión técnica aquí: afecta a la
  marca de Alberto y David, y al equipo de IA de ThePower Education, que es de quien el sitio
  dice ser. Proponer, no ejecutar.

## Al arrancar cualquier tarea

1. `git fetch` y mirar si hay algo nuevo (`git log --oneline master..origin/master`).
2. Comprobar en qué rama estás. Si hay trabajo en curso, está documentado en
   [`REDISENO-TORTUGA.md`](REDISENO-TORTUGA.md).

## Convenciones del repo

- **Commits en español**, verbo en presente, tercera persona: `añade post: …`,
  `edita: …`, `elimina …`, `restructura …`, `unifica …`, `retira …`. Ocasionalmente un
  prefijo `fix:`. **No** se usa Conventional Commits de forma sistemática.
  > Esto contradice la preferencia global de Javi (commits en inglés, Conventional Commits).
  > Manda la del repo: es de Alberto y son 37 commits suyos con ese estilo. Si Javi decide lo
  > contrario, que se actualice esta línea.
- **Contenido en español.** El sitio y los posts son en español.
- **npm, no pnpm.** Hay `package-lock.json`. No mezclar gestores.
- Código, nombres de variables y comentarios **en inglés**.

## Comandos

```bash
npm run dev      # desarrollo en localhost:3000
npm run build    # build + next-sitemap en postbuild
npm run start    # sirve el build
npm run lint
```

`public/sitemap.xml` se regenera en cada `build` y cambia solo por fechas.
**No incluirlo en un commit** salvo que el cambio sea real: ensucia el diff.

## Dónde está cada cosa

| | |
|---|---|
| `app/` | rutas (App Router). Blog en `app/blog/`, con secciones `campaign-hub` y `claude-code` |
| `components/` | Navbar, Footer, TurtleLogo, ThemeToggle, tarjetas y utilidades |
| `content/blog/` | los posts, markdown con front-matter (`gray-matter`) |
| `app/globals.css` | **toda** la capa visual: tokens, base, overlays y componentes |
| `lib/` | lectura de contenido y utilidades |

## El sistema de diseño vive en otro repo

La fuente de verdad de **Tortuga** está en `lht-retos`:
`reto-01-desarrollo-agentico/assets/design-system-tortuga/tokens.css`, con su specimen al
lado. Aquí está portado a Tailwind 4, no duplicado a mano: si cambia allí, se vuelve a
portar. Ver `REDISENO-TORTUGA.md`.

Regla del sistema que es fácil romper sin darse cuenta: **presupuesto de color 60·30·10**.
Papel y tinta dominan, las superficies y reglas estructuran, y el musgo **solo señala** —
enlaces en texto corrido, el único botón relleno de la vista, el estado activo, el foco. Un
estado terminado es historia, no señal: va en el 30, nunca en el acento.

## Trampas conocidas del entorno

- **Chrome headless aquí oscurece automáticamente las páginas servidas en localhost.** Una
  página de control con `background:#eff2e6` fijo se captura como `(44,49,42)`. Cualquier
  medida de color sobre una captura es basura. Para verificar color, leer el CSS compilado
  (`curl` la hoja de `/_next/static/chunks/*.css`) o usar un perfil de Chrome limpio con
  `--user-data-dir`. No usar `--force-dark-mode`: se queda pegado al perfil.
- El Navbar usa `mixBlendMode: difference`, que es un truco pensado para fondo oscuro.
