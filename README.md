# La Habitación Tortuga [LHT]

Sitio web oficial de La Habitación Tortuga. Construido con Next.js 16, diseño minimalista y optimizado para rendimiento.

## 🚀 Características

- ⚡ **Next.js 16** con App Router y React Server Components
- 🎨 **Tailwind CSS 4** con diseño minimalista moderno
- 📝 **Blog con Markdown** usando gray-matter y react-markdown
- 🔍 **SEO Optimizado** con metadata dinámica, sitemap y robots.txt
- 📱 **Completamente Responsive** - mobile-first design
- ♿ **Accesible** con semántica HTML adecuada
- 🎭 **Animaciones suaves** con Intersection Observer
- 🚀 **Rendimiento óptimo** con Static Site Generation

## 📦 Tecnologías

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Gray Matter](https://github.com/jonschlinkert/gray-matter)
- [React Markdown](https://remarkjs.github.io/react-markdown/)
- [Lucide React](https://lucide.dev/)

## 🏃 Comenzar

### Instalación

```bash
# Clonar el proyecto
cd lht-web

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Crear un Post de Blog

1. Crea un archivo `.md` en `content/blog/`
2. Añade el frontmatter:

```markdown
---
title: "Título del Post"
date: "2025-01-20"
excerpt: "Resumen breve del post"
author: "Tu Nombre"
category: "Categoría"
---

# Contenido del post aquí...
```

## 📁 Estructura del Proyecto

```
lht-web/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Página de post individual
│   │   └── page.tsx           # Listado de posts
│   ├── layout.tsx             # Layout principal con SEO
│   ├── page.tsx               # Página de inicio
│   ├── sitemap.ts             # Sitemap dinámico
│   └── globals.css            # Estilos globales
├── components/
│   ├── Footer.tsx             # Componente footer
│   ├── Logo.tsx               # Logo SVG
│   ├── Navbar.tsx             # Navegación
│   └── Reveal.tsx             # Animaciones de scroll
├── content/
│   └── blog/                  # Posts en Markdown
├── lib/
│   └── posts.ts               # Utilidades para posts
└── public/
    └── robots.txt             # Configuración SEO
```

## 🎨 Personalización

### Colores

Los colores principales están definidos en `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
}
```

### Tipografía

La fuente Inter está configurada en `app/layout.tsx`. Para cambiarla:

```typescript
import { TuFuente } from 'next/font/google';

const tuFuente = TuFuente({
  subsets: ['latin'],
  display: 'swap',
});
```

## 🔍 SEO

El proyecto incluye:

- ✅ Metadata dinámica por página
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Sitemap.xml automático
- ✅ Robots.txt
- ✅ URLs semánticas
- ✅ Structured data ready
- ✅ Core Web Vitals optimizados

## 📱 Responsive Design

Breakpoints de Tailwind:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Subir la carpeta .next a Netlify
```

### Build para producción

```bash
npm run build
npm run start
```

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Autores

**David, Yona y Alberto** - La Habitación Tortuga

---

Hecho con 🐢 desde La Habitación Tortuga
