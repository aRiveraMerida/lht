# La Habitación Tortuga [LHT]

Un archivo editorial sobre inteligencia artificial, estrategia y trabajo real.

## Qué es esto

La Habitación Tortuga es un espacio donde dos profesionales comparten lo que aprenden trabajando con inteligencia artificial en el mundo real. Sin prisas, sin humo. Solo lo que hemos probado, lo que funciona y lo que todavía estamos aprendiendo.

No somos teóricos. Escribimos desde la práctica: las decisiones difíciles, los errores útiles y los atajos que funcionan de verdad.

## Quiénes somos

**Alberto Rivera** — Ayuda a empresas a adoptar IA con criterio. +150 organizaciones, +10.000 profesionales formados. Escribe sobre las decisiones que importan y los errores que enseñan.

**David Dix Hidalgo** — Especialista en automatizaciones, chatbots y agentes IA. Desarrolla soluciones adaptadas a cada cliente para potenciar recursos y optimizar procesos.

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
date: "2025-01-20"
excerpt: "Resumen breve (máx. 160 caracteres)"
author: "Alberto Rivera"
category: "Estrategia"
---

Contenido del post aquí...
```

Categorías disponibles: Laboratorios, Estrategia, Automatizaciones, Sin filtro, Adopción IA, Personas, Notas de campo.

## Seguridad

- Upload API protegida por `UPLOAD_SECRET` + validación de tipo (imágenes/PDF) y tamaño (10MB)
- Validación de email por regex en suscripción y baja
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- `.env.local` en `.gitignore`

## Licencia

Todos los contenidos son propiedad de sus autores. El código está disponible bajo licencia MIT.

---

lahabitaciontortuga.com
