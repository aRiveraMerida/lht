---
title: "Campaign Hub · Claude Code y la skill"
date: "2026-04-19"
description: "El taller de producción: Claude Code recoge trabajos del buzón, los produce y los deja en Drive. Skill, routine y webhook configurados."
excerpt: "El taller de producción: Claude Code recoge trabajos del buzón, los produce y los deja en Drive. Skill, routine y webhook configurados."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 5
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 4 · Claude Code y la skill de producción

Ahora montamos el **taller**: el lado de Claude Code que recoge trabajos del buzón, los produce, y los deja en Drive.

**Tiempo estimado**: 45 minutos.

**Requisito previo**: haber completado la Parte 3 y tener anotados `WEBAPP_URL` y `WEBAPP_TOKEN`.

## 4.0 Lo que vamos a construir

```
~/projects/campaign-hub-worker/         ← proyecto local en tu máquina
│
├── .claude/
│   └── skills/
│       └── produce-campaign/
│           ├── SKILL.md                ← instrucciones para Claude Code
│           ├── generate_assets.ts      ← funciones de generación
│           └── templates/              ← HTML base de landing y posts
│               ├── landing.html
│               └── social_post.html
│
├── package.json                        ← dependencias Node.js
├── tsconfig.json                       ← config TypeScript
└── .env                                ← secretos (URL, token, API key)
```

## 4.1 Instalar Claude Code

Si ya lo tienes instalado, salta al 4.2.

### 4.1.1 — Comprobar Node.js

Abre un terminal y ejecuta:

```bash
node --version
```

Debe salir `v20.x.x` o superior. Si dice "command not found" o una versión inferior, instala Node 20 desde `nodejs.org` (descarga el LTS) o con un gestor de versiones como `nvm`.

### 4.1.2 — Instalar Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Verifica:

```bash
claude --version
```

### 4.1.3 — Login

```bash
claude login
```

Abrirá una página web, te pedirá autorizar con tu cuenta Claude.ai Pro o Max.

## 4.2 Crear el proyecto local

### 4.2.1 — Crear carpeta del proyecto

```bash
mkdir -p ~/projects/campaign-hub-worker
cd ~/projects/campaign-hub-worker
```

### 4.2.2 — Inicializar proyecto Node

```bash
npm init -y
```

Esto crea `package.json`.

### 4.2.3 — Instalar dependencias

```bash
npm install playwright
npm install -D typescript @types/node tsx
npx playwright install chromium
```

Explicación breve:
- `playwright`: para renderizar HTML como si fuese un navegador y hacer capturas.
- `typescript` y `tsx`: para que podamos escribir código en TypeScript y ejecutarlo.
- `playwright install chromium`: descarga el navegador que usará Playwright.

### 4.2.4 — Crear `tsconfig.json`

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  }
}
EOF
```

### 4.2.5 — Crear `.env` con tus secretos

```bash
cat > .env << 'EOF'
WEBAPP_URL=PEGA_AQUI_TU_WEBAPP_URL
WEBAPP_TOKEN=PEGA_AQUI_TU_WEBAPP_TOKEN
ANTHROPIC_API_KEY=PEGA_AQUI_TU_SK_ANT
EOF
```

Edita el archivo y sustituye los tres valores por los tuyos (los anotaste en las Partes 2 y 3).

### 4.2.6 — Asegurar que `.env` no se sube a git (si usas git)

```bash
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo "/tmp/" >> .gitignore
```

---

## 4.3 Crear la estructura de la skill

```bash
mkdir -p .claude/skills/produce-campaign/templates
```

Ahora crearemos los archivos uno a uno.

### Archivo 1 · `.claude/skills/produce-campaign/SKILL.md`

Este archivo es **las instrucciones que Claude Code leerá** cuando active la skill.

```markdown
# produce-campaign

## Descripción
Procesa el siguiente job en la cola del Campaign Hub. Para cada job:
1. Descarga el payload desde el WebApp.
2. Genera los assets solicitados (hero_image, landing_page, copy_variants, social_posts).
3. Los sube a Drive vía WebApp.
4. Marca el job como done (o failed si algo sale mal).

## Cuándo usar esta skill
- Llamada por la routine programada cada 5 minutos.
- Llamada manual por el usuario: "produce-campaign run"

## Variables de entorno necesarias
- WEBAPP_URL: URL del WebApp Apps Script (desde .env)
- WEBAPP_TOKEN: token secreto (desde .env)
- ANTHROPIC_API_KEY: para llamar a Claude desde el generador (desde .env)

## Flujo de ejecución

### Paso 1 — Obtener siguiente job
- GET {WEBAPP_URL}?action=next_job&token={WEBAPP_TOKEN}
- Si la respuesta tiene {empty: true}, termina silenciosamente con el mensaje "idle".
- Si devuelve un job, guarda su id y parsea el campo payload (JSON).

### Paso 2 — Marcar como running
- POST {WEBAPP_URL} body: {action: "mark_running", job_id, token}

### Paso 3 — Generar assets
Para cada tipo en payload.assets_needed, ejecuta la función correspondiente del archivo generate_assets.ts:

- "hero_image" → generateHeroImage (3 variants)
- "landing_page" → generateLandingPage (1 variant)
- "copy_variants" → generateCopyVariants (3 variants por canal)
- "social_posts" → generateSocialPosts (3 variants)

Cada función devuelve un array de assets ya subidos a Drive con {drive_url, preview_url, variant}.

### Paso 4 — Registrar cada asset
Por cada asset generado, POST al WebApp:
{
  action: "create_asset",
  token: WEBAPP_TOKEN,
  asset: {
    campaign_id: payload.campaign_id,
    type: "hero_image",
    variant: 1,
    drive_url: "...",
    preview_url: "..."
  }
}

### Paso 5 — Cerrar job
- Si todo OK: POST action=mark_done con job_id
- Si falló: POST action=mark_failed con job_id y error (el stack trace truncado)

## Reglas de seguridad
- NUNCA leer o escribir directamente en Google Sheets. Siempre por el WebApp.
- Si una llamada al WebApp devuelve `{error: ...}`, trátalo como fallo del job.
- Nunca dejes un job en "Running" si algo sale mal — siempre marca failed en el catch.
- Si un asset individual falla pero otros salen bien, continúa con los demás y marca mark_failed solo si el 100% falló.

## Comandos útiles para depurar
- `tsx .claude/skills/produce-campaign/generate_assets.ts --test` para probar generación sin tocar el WebApp.
- `curl "{WEBAPP_URL}?action=ping&token={TOKEN}"` para verificar que el buzón responde.
```

### Archivo 2 · `.claude/skills/produce-campaign/generate_assets.ts`

Este archivo contiene las funciones de generación. Es el que más customizarás según el caso.

```typescript
// ============================================================
// generate_assets.ts — Generadores de assets para Campaign Hub
// ============================================================
// Lee el payload del job y produce los assets. Sube a Drive vía WebApp.

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const WEBAPP_URL = process.env.WEBAPP_URL!;
const WEBAPP_TOKEN = process.env.WEBAPP_TOKEN!;

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

interface JobPayload {
  campaign_id: string;
  name: string;
  audience: string;
  channels: string[];
  brief: string;
  kpis: string;
  drive_folder_id: string;
  assets_needed: string[];
}

async function callClaudeAPI(prompt: string, model = 'claude-sonnet-4-5') {
  const res = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  return (res.content[0] as any).text;
}

async function callClaudeJSON(prompt: string, model = 'claude-sonnet-4-5') {
  const raw = await callClaudeAPI(prompt + '\n\nDevuelve SOLO JSON válido, sin markdown.', model);
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// Sube un archivo a Drive vía WebApp
// (En esta versión simplificada, asumimos que la skill llama a una función
// que sube directamente vía UrlFetchApp. Para un setup real, necesitas
// un endpoint adicional en el WebApp que reciba multipart, o usar
// Google Drive API con Service Account. Aquí simulamos subiendo a una
// carpeta local y devolviendo una "URL" ficticia de Drive.)
async function uploadToDrive(filePath: string, folderId: string, fileName: string): Promise<{id: string, url: string}> {
  // PLACEHOLDER: para tu versión final, implementa esto con Drive API o
  // amplía el WebApp con un endpoint de upload multipart.
  // Por ahora, simulamos:
  const fakeId = 'drive_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  console.log(`[uploadToDrive] ${fileName} → folder ${folderId} (simulated)`);
  return {
    id: fakeId,
    url: `https://drive.google.com/file/d/${fakeId}/view`
  };
}

// Llama al WebApp para registrar un asset
async function registerAsset(asset: any) {
  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_asset',
      token: WEBAPP_TOKEN,
      asset
    })
  });
  return await res.json();
}

// -----------------------------------------------------------
// Generador 1 — hero_image
// Render HTML → screenshot PNG → upload a Drive
// -----------------------------------------------------------

export async function generateHeroImage(payload: JobPayload, variant: number) {
  const html = `<!DOCTYPE html>
<html><head><style>
  body { margin: 0; font-family: 'Inter', sans-serif; }
  .hero {
    width: 1200px; height: 630px;
    background: linear-gradient(135deg, #2B4A2F, #B33A3A);
    display: flex; align-items: center; justify-content: center;
    color: #F4EFE6; text-align: center; padding: 40px;
  }
  .hero h1 {
    font-family: 'Libre Baskerville', serif;
    font-size: 72px; margin: 0;
  }
  .hero p { font-size: 24px; margin-top: 20px; opacity: 0.9; }
</style></head>
<body>
  <div class="hero">
    <div>
      <h1>${payload.name}</h1>
      <p>${payload.audience}</p>
    </div>
  </div>
</body></html>`;

  const tmpHtml = `/tmp/hero_${payload.campaign_id}_v${variant}.html`;
  const tmpPng = `/tmp/hero_${payload.campaign_id}_v${variant}.png`;
  fs.writeFileSync(tmpHtml, html);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`file://${tmpHtml}`);
  await page.screenshot({ path: tmpPng });
  await browser.close();

  const upload = await uploadToDrive(tmpPng, payload.drive_folder_id, `hero_v${variant}.png`);
  return {
    type: 'hero_image',
    variant,
    drive_url: upload.url,
    preview_url: upload.url,
    drive_file_id: upload.id
  };
}

// -----------------------------------------------------------
// Generador 2 — landing_page
// Rellena template HTML → screenshot preview → sube HTML + PNG
// -----------------------------------------------------------

export async function generateLandingPage(payload: JobPayload) {
  const templatePath = path.join(__dirname, 'templates/landing.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const filled = template
    .replace(/\{\{NAME\}\}/g, payload.name)
    .replace(/\{\{BRIEF\}\}/g, payload.brief.substring(0, 500))
    .replace(/\{\{AUDIENCE\}\}/g, payload.audience);

  const tmpHtml = `/tmp/landing_${payload.campaign_id}.html`;
  const tmpPng = `/tmp/landing_${payload.campaign_id}.png`;
  fs.writeFileSync(tmpHtml, filled);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`file://${tmpHtml}`);
  await page.screenshot({ path: tmpPng, fullPage: true });
  await browser.close();

  const htmlUpload = await uploadToDrive(tmpHtml, payload.drive_folder_id, 'landing.html');
  const pngUpload = await uploadToDrive(tmpPng, payload.drive_folder_id, 'landing_preview.png');

  return {
    type: 'landing_page',
    variant: 1,
    drive_url: htmlUpload.url,
    preview_url: pngUpload.url,
    drive_file_id: htmlUpload.id
  };
}

// -----------------------------------------------------------
// Generador 3 — copy_variants
// Usa Claude API para generar 3 variantes de copy por canal
// -----------------------------------------------------------

export async function generateCopyVariants(payload: JobPayload) {
  const prompt = `Eres copywriter para una campaña de ${payload.name}.
Audiencia: ${payload.audience}
Brief: ${payload.brief}
Canales: ${payload.channels.join(', ')}

Genera 3 variantes de copy para cada canal. Cada variante debe tener:
- headline (máx 8 palabras)
- body (1-2 frases)
- cta (3-5 palabras)

Formato JSON:
[
  {"channel": "...", "variant": 1, "headline": "...", "body": "...", "cta": "..."},
  ...
]`;

  const variants = await callClaudeJSON(prompt);
  const results = [];

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const content = `CHANNEL: ${v.channel}\nVARIANT: ${v.variant}\n\nHEADLINE: ${v.headline}\n\nBODY: ${v.body}\n\nCTA: ${v.cta}`;
    const tmpTxt = `/tmp/copy_${payload.campaign_id}_${v.channel}_v${v.variant}.txt`;
    fs.writeFileSync(tmpTxt, content);

    const upload = await uploadToDrive(
      tmpTxt,
      payload.drive_folder_id,
      `copy_${v.channel}_v${v.variant}.txt`
    );

    results.push({
      type: 'copy_variants',
      variant: i + 1,
      drive_url: upload.url,
      preview_url: upload.url,
      drive_file_id: upload.id
    });
  }

  return results;
}

// -----------------------------------------------------------
// Generador 4 — social_posts
// Similar al hero, pero cuadrado y con estilo distinto
// -----------------------------------------------------------

export async function generateSocialPost(payload: JobPayload, variant: number) {
  const templatePath = path.join(__dirname, 'templates/social_post.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const filled = template
    .replace(/\{\{NAME\}\}/g, payload.name)
    .replace(/\{\{VARIANT\}\}/g, String(variant));

  const tmpHtml = `/tmp/social_${payload.campaign_id}_v${variant}.html`;
  const tmpPng = `/tmp/social_${payload.campaign_id}_v${variant}.png`;
  fs.writeFileSync(tmpHtml, filled);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  await page.goto(`file://${tmpHtml}`);
  await page.screenshot({ path: tmpPng });
  await browser.close();

  const upload = await uploadToDrive(tmpPng, payload.drive_folder_id, `social_v${variant}.png`);
  return {
    type: 'social_posts',
    variant,
    drive_url: upload.url,
    preview_url: upload.url,
    drive_file_id: upload.id
  };
}

// -----------------------------------------------------------
// Main — orquesta todo el flujo
// -----------------------------------------------------------

async function main() {
  // 1. Pedir siguiente job
  const nextRes = await fetch(`${WEBAPP_URL}?action=next_job&token=${WEBAPP_TOKEN}`);
  const nextJob = await nextRes.json();

  if (nextJob.empty) {
    console.log('idle — no hay jobs');
    return;
  }

  console.log(`Procesando job ${nextJob.id}`);
  const payload: JobPayload = JSON.parse(nextJob.payload);

  // 2. Marcar como running
  await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'mark_running',
      token: WEBAPP_TOKEN,
      job_id: nextJob.id
    })
  });

  try {
    // 3. Generar según assets_needed
    const produced: any[] = [];

    if (payload.assets_needed.includes('hero_image')) {
      for (let v = 1; v <= 3; v++) {
        produced.push(await generateHeroImage(payload, v));
      }
    }

    if (payload.assets_needed.includes('landing_page')) {
      produced.push(await generateLandingPage(payload));
    }

    if (payload.assets_needed.includes('copy_variants')) {
      const copies = await generateCopyVariants(payload);
      produced.push(...copies);
    }

    if (payload.assets_needed.includes('social_posts')) {
      for (let v = 1; v <= 3; v++) {
        produced.push(await generateSocialPost(payload, v));
      }
    }

    // 4. Registrar cada asset en el WebApp
    for (const asset of produced) {
      await registerAsset({
        campaign_id: payload.campaign_id,
        type: asset.type,
        variant: asset.variant,
        drive_url: asset.drive_url,
        preview_url: asset.preview_url,
        drive_file_id: asset.drive_file_id
      });
    }

    // 5. Marcar job como done
    await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'mark_done',
        token: WEBAPP_TOKEN,
        job_id: nextJob.id
      })
    });

    console.log(`✅ Job ${nextJob.id} completado: ${produced.length} assets`);
  } catch (err: any) {
    console.error('❌ Error procesando job:', err);
    await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'mark_failed',
        token: WEBAPP_TOKEN,
        job_id: nextJob.id,
        error: String(err).substring(0, 500)
      })
    });
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}
```

**Nota importante sobre `uploadToDrive`**: en esta versión usamos un placeholder simulado. Para un setup real 100% funcional hay dos caminos:

- **Opción A (simple)**: extender el WebApp de Apps Script con un endpoint `upload_asset` que reciba el contenido en base64 y lo escriba en Drive. Es lo más limpio para no tener que configurar Service Account en Claude Code.
- **Opción B (avanzada)**: configurar Service Account de Google Cloud y usar Drive API directamente.

La **Parte 5** incluye la opción A ampliando el WebApp.

### Archivo 3 · `.claude/skills/produce-campaign/templates/landing.html`

Plantilla simple de landing:

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>{{NAME}}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #F4EFE6;
    color: #2B4A2F;
  }
  .hero {
    background: #2B4A2F;
    color: #F4EFE6;
    padding: 120px 40px 80px;
    text-align: center;
  }
  .hero h1 {
    font-family: 'Libre Baskerville', Georgia, serif;
    font-size: 64px;
    margin-bottom: 20px;
  }
  .hero .subtitle { font-size: 20px; opacity: 0.85; }
  .content {
    max-width: 720px;
    margin: 0 auto;
    padding: 80px 40px;
  }
  .content p {
    font-size: 18px;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  .cta {
    display: inline-block;
    background: #B33A3A;
    color: #F4EFE6;
    padding: 18px 40px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 30px;
    border-radius: 4px;
  }
</style>
</head>
<body>
  <section class="hero">
    <h1>{{NAME}}</h1>
    <p class="subtitle">Para {{AUDIENCE}}</p>
  </section>
  <section class="content">
    <p>{{BRIEF}}</p>
    <a href="#" class="cta">Quiero saber más</a>
  </section>
</body>
</html>
```

### Archivo 4 · `.claude/skills/produce-campaign/templates/social_post.html`

Plantilla cuadrada para post social:

```html
<!DOCTYPE html>
<html>
<head><style>
  body { margin: 0; font-family: 'Inter', sans-serif; }
  .post {
    width: 1080px; height: 1080px;
    background: linear-gradient(160deg, #E8C547, #2B4A2F);
    display: flex; align-items: center; justify-content: center;
    color: #F4EFE6; padding: 80px; text-align: center;
  }
  .post h1 {
    font-family: 'Libre Baskerville', serif;
    font-size: 96px; line-height: 1.1;
  }
  .post .variant {
    position: absolute; bottom: 40px; right: 40px;
    font-size: 18px; opacity: 0.6;
  }
</style></head>
<body>
  <div class="post">
    <h1>{{NAME}}</h1>
    <div class="variant">v{{VARIANT}}</div>
  </div>
</body>
</html>
```

## 4.4 Probar la skill localmente (antes de automatizar)

Antes de configurar la routine, ejecuta la skill **una vez a mano** para ver si funciona.

### 4.4.1 — Crear un job de prueba desde el Spreadsheet

Ve al Spreadsheet y en la hoja `Jobs` añade una fila manual:

| Columna | Valor |
|---|---|
| id | `job_test_1` |
| campaign_id | `camp_test_1` |
| status | `Queued` |
| payload | `{"campaign_id":"camp_test_1","name":"IPA de Prueba","audience":"foodies urbanos","channels":["instagram"],"brief":"Una IPA con lúpulo de Galicia. Notas cítricas.","kpis":"2000 leads","drive_folder_id":"TU_DRIVE_CAMPAIGNS_FOLDER_ID","assets_needed":["copy_variants"]}` |

**IMPORTANTE**: en `payload`, sustituye `TU_DRIVE_CAMPAIGNS_FOLDER_ID` por tu ID real de carpeta Campaigns.

### 4.4.2 — Ejecutar la skill

Desde el terminal, en el directorio del proyecto:

```bash
cd ~/projects/campaign-hub-worker
npx tsx .claude/skills/produce-campaign/generate_assets.ts
```

Debería:
1. Imprimir "Procesando job job_test_1"
2. Generar 3 variantes de copy (mínimo, que es lo único que pedimos)
3. Imprimir "✅ Job job_test_1 completado: 3 assets"

Verifica en el Spreadsheet:
- Hoja `Jobs`: tu job de prueba está en `Done`.
- Hoja `Assets`: aparecen 3 filas nuevas con `qa_status = QA pending`.

Si esto funciona, la skill está bien.

Si **falla**, revisa:
- `WEBAPP_URL` en `.env` (debe terminar en `/exec`).
- `WEBAPP_TOKEN` en `.env` (mismo que en Script Properties).
- Salida de errores del terminal → suele indicar el problema exacto.

## 4.5 Configurar la routine (ejecución automática)

Ahora hacemos que la skill se ejecute sola cada 5 minutos, sin tu intervención.

### Opción A — Claude Code Routines (si tienes el feature)

1. Abre Claude.ai → sección **Routines** (si no la ves, está en beta y puede que tu cuenta aún no la tenga).
2. "+ New routine":
   - Name: `campaign-hub-producer`
   - Schedule: `*/5 * * * *` (cada 5 min)
   - Prompt: `Ejecuta la skill produce-campaign. Si no hay jobs queued, termina en silencio.`
3. Guarda.

### Opción B — cron en tu máquina (si prefieres control local)

Si no tienes Routines, puedes hacer que tu ordenador lo ejecute (requiere tener la máquina encendida):

```bash
# Edita crontab
crontab -e
```

Añade esta línea (reemplaza `/Users/tu-usuario` por tu ruta real):

```
*/5 * * * * cd /Users/tu-usuario/projects/campaign-hub-worker && /usr/local/bin/npx tsx .claude/skills/produce-campaign/generate_assets.ts >> /tmp/campaign-hub.log 2>&1
```

Guarda (`Ctrl+O`, Enter, `Ctrl+X` si estás en nano).

Verifica:
```bash
crontab -l
```

Los logs se guardan en `/tmp/campaign-hub.log` — puedes revisarlos con:
```bash
tail -f /tmp/campaign-hub.log
```

### Opción C — GitHub Action (sin máquina encendida, avanzado)

Para producción seria, puedes montar un GitHub Action que se ejecute cada 5 minutos. Se sale del alcance de este laboratorio, pero la idea es la misma: ejecutar `tsx .claude/skills/produce-campaign/generate_assets.ts` cada X tiempo con los secretos inyectados.

## 4.6 Comprobación antes de avanzar

- [ ] Claude Code instalado y con login hecho.
- [ ] Proyecto `campaign-hub-worker` creado con estructura correcta.
- [ ] `.env` tiene los tres valores correctos.
- [ ] La skill corre en local sin errores con un job de prueba.
- [ ] Aparecen rows en la hoja `Assets` del Spreadsheet al ejecutar.
- [ ] Routine o cron configurada para ejecutar cada 5 min.

Si todo está marcado, pasa a la **Parte 5 · Probar el sistema end-to-end**.

La Parte 5 también cubre cómo ampliar el WebApp con el endpoint `upload_asset` (opción A del comentario de 4.3) para que los archivos se suban de verdad a Drive, no simulados.
