# Guía de Inicio Rápido - M3D Web

## 🚀 Ejecutar el Proyecto

### 1. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 2. Ver el Blog

Navega a [http://localhost:3000/blog](http://localhost:3000/blog) para ver los posts existentes.

## 📝 Añadir Nuevo Contenido

### Crear un Post de Blog

1. **Navega a la carpeta de contenido:**
   ```bash
   cd content/blog
   ```

2. **Crea un nuevo archivo `.md`:**
   ```bash
   touch mi-nuevo-post.md
   ```

3. **Añade el contenido con frontmatter:**
   ```markdown
   ---
   title: "Mi Nuevo Post Increíble"
   date: "2025-01-22"
   excerpt: "Una descripción corta pero atractiva de tu post"
   author: "Tu Nombre"
   category: "Desarrollo"
   ---

   # Mi Nuevo Post Increíble

   Aquí va el contenido de tu post en Markdown.

   ## Sección 1

   Puedes usar:
   - Listas
   - **Negrita**
   - *Cursiva*
   - [Enlaces](https://ejemplo.com)

   ```javascript
   // Bloques de código
   console.log('Hola mundo');
   ```

   ## Conclusión

   Tu post finaliza aquí.
   ```

4. **Guarda el archivo** y reinicia el servidor si es necesario.

5. **Ve tu post** en [http://localhost:3000/blog/mi-nuevo-post](http://localhost:3000/blog/mi-nuevo-post)

## 🎨 Personalizar Estilos

### Cambiar Colores

Edita `app/globals.css`:

```css
:root {
  --background: #ffffff;  /* Color de fondo */
  --foreground: #000000;  /* Color de texto */
}
```

### Modificar Componentes

Los componentes están en la carpeta `components/`:

- `Navbar.tsx` - Barra de navegación
- `Footer.tsx` - Pie de página
- `Logo.tsx` - Logo SVG
- `Reveal.tsx` - Animaciones de scroll

## 📱 Testing Responsive

### Prueba en Diferentes Dispositivos

1. **Chrome DevTools:**
   - `Cmd/Ctrl + Shift + M` para toggle device toolbar
   - Prueba en iPhone, iPad, Android

2. **Breakpoints de Tailwind:**
   - Mobile: < 640px
   - Tablet: 640px - 1024px
   - Desktop: > 1024px

## 🔍 Optimización SEO

### Configurar Metadata

Edita `app/layout.tsx` para cambiar metadata global:

```typescript
export const metadata: Metadata = {
  title: "Tu Título - M3D Web",
  description: "Tu descripción aquí",
  // ... más opciones
};
```

### Generar Sitemap

El sitemap se genera automáticamente en `/sitemap.xml` basado en tus posts.

### Configurar robots.txt

Edita `public/robots.txt` para permitir/denegar crawlers.

## 🚢 Deploy en Vercel

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Deploy automático

3. **Variables de entorno (opcional):**
   ```bash
   NEXT_PUBLIC_BASE_URL=https://tudominio.com
   ```

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Limpia node_modules y reinstala
rm -rf node_modules
npm install
npm run dev
```

### Los cambios no se reflejan

```bash
# Limpia caché de Next.js
rm -rf .next
npm run dev
```

### Errores de TypeScript

```bash
# Verifica tipos
npm run lint
```

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [React Documentation](https://react.dev/)

## 💡 Tips Profesionales

1. **Usa lazy loading para imágenes:**
   ```jsx
   <Image src="/path" alt="..." loading="lazy" />
   ```

2. **Optimiza el rendimiento:**
   - Usa `next/image` para imágenes
   - Minimiza JavaScript innecesario
   - Implementa ISR (Incremental Static Regeneration) si necesitas

3. **Mantén consistencia:**
   - Usa la misma estructura en todos los posts
   - Mantén categorías consistentes
   - Sigue la guía de estilo establecida

## 🤝 Contribuir

Si encuentras bugs o tienes sugerencias:

1. Crea un issue describiendo el problema
2. Fork el proyecto
3. Crea tu feature branch
4. Commit tus cambios
5. Push y crea un Pull Request

---

¡Disfruta construyendo tu blog minimalista! 🎉
