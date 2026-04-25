# La Habitación Tortuga [LHT]

Un archivo editorial sobre inteligencia artificial, estrategia y trabajo real.

## Qué es esto

La Habitación Tortuga es un espacio donde el equipo de IA de The Power Education comparte lo que aprende trabajando con inteligencia artificial en el mundo real. Sin prisas, sin humo. Solo lo que hemos probado, lo que funciona y lo que todavía estamos aprendiendo.

No somos teóricos. Escribimos desde la práctica: las decisiones difíciles, los errores útiles y los atajos que funcionan de verdad.

## Quiénes somos

**Equipo de IA de The Power Education** — Dirigimos el programa B2B de IA y Tecnología de The Power Education. +150 organizaciones acompañadas, +20.000 profesionales formados.

## Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Estilos**: Tailwind CSS 4
- **Blog**: Markdown con gray-matter + react-markdown
- **Newsletter**: Resend (suscripción y baja)
- **Media**: Vercel Blob
- **Analytics**: Vercel Analytics
- **Deploy**: Vercel

## Estructura

```
app/
  page.tsx              # Home
  blog/
    page.tsx            # Archivo (búsqueda + filtro por categoría)
    blog-grid.tsx       # Grid client con filtrado
    [slug]/page.tsx     # Post individual
  baja/page.tsx         # Darse de baja
  aviso-legal/          # Páginas legales
  politica-privacidad/
  politica-cookies/
  feed.xml/route.ts     # RSS feed
  api/upload/route.ts   # Upload de media (protegido)
  actions/
    subscribe.ts        # Server action: suscripción
    unsubscribe.ts      # Server action: baja
components/
  Navbar.tsx            # Header sticky
  Footer.tsx            # Footer con links legales
  ProductCard.tsx       # Card de artículo con preview
  AssetPreview.tsx      # Previews visuales (cover, window, shell)
  NewsletterForm.tsx    # Formulario de suscripción
  TopicChip.tsx         # Filtro de categorías
  SectionLabel.tsx      # Labels de sección
  TurtleLogo.tsx        # Logo SVG
content/blog/           # Posts en Markdown
lib/
  posts.ts              # Lectura y parseo de posts
  palette.ts            # Paleta de colores y categorías
  assets.ts             # Variantes de preview
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Crear `.env.local` en la raíz:

```bash
RESEND_API_KEY=           # Desde Vercel Marketplace (Resend)
RESEND_AUDIENCE_ID=       # Resend > Audiences > Newsletter LHT > ID
UPLOAD_SECRET=            # Generar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Estas mismas variables deben estar en Vercel Dashboard > Settings > Environment Variables.

## Crear un post

Crear un archivo `.md` en `content/blog/`:

```markdown
---
title: "Título del post"
date: "2026-04-18"
excerpt: "Resumen breve (máx. 160 caracteres)"
authors:
  - alberto-rivera
  - david-dix
category: "Estrategia"
featured: false
---

Contenido del post aquí...
```

Categorías disponibles: Laboratorios, Sin Filtro, Adopción IA, Estrategia, Guías.

Autores disponibles: definidos en `lib/authors.ts` (slugs: `alberto-rivera`, `david-dix`). Un post puede firmarlo más de uno.

## Seguridad

- Upload API protegida por `UPLOAD_SECRET` + validación de tipo (imágenes/PDF) y tamaño (10MB)
- Validación de email por regex en suscripción y baja
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- `.env.local` en `.gitignore`

## Licencia

Todos los contenidos son propiedad de sus autores. El código está disponible bajo licencia MIT.

---

lahabitaciontortuga.com
