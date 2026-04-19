---
title: "Campaign Hub · Preparar Google"
date: "2026-04-19"
description: "Sin código todavía. Carpetas en Drive, Spreadsheet con validaciones y el documento de marca Brand Guardrails."
excerpt: "Sin código todavía. Carpetas en Drive, Spreadsheet con validaciones y el documento de marca Brand Guardrails."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 3
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 2 · Preparar Google

En esta parte **no tocamos código**. Solo creamos las carpetas, el Spreadsheet y el documento de marca. Es la base sobre la que todo lo demás se apoya.

**Tiempo estimado**: 30 minutos.

## 2.0 Cómo vamos a trabajar en esta parte

Seguimos el caso ficticio de **Cervezas del Valle**. Todo lo que ves con `Cervezas del Valle` o `IPA de Primavera` o `Laura / Martín / Carmen` es inventado. Tú lo adaptas a tu realidad.

**Orden que seguiremos**:
1. Crear la carpeta en Drive
2. Crear el documento Brand Guardrails
3. Crear el Spreadsheet con 4 hojas
4. Anotar 2 IDs importantes que luego usaremos

## 2.1 Crear la estructura de Drive

### Paso 2.1.1 — Crear la carpeta raíz

1. Entra en `drive.google.com`.
2. Botón **"+ Nuevo"** → **"Carpeta"**.
3. Nombre: `Campaign Hub`.
4. Clic en "Crear".

### Paso 2.1.2 — Entrar en la carpeta y crear subcarpetas

Dentro de `Campaign Hub`, crea estas dos subcarpetas (mismo método: + Nuevo → Carpeta):

```
📁 Campaign Hub/
   ├── 📁 Campaigns            ← aquí se crearán carpetas por cada campaña
   └── 📁 _templates           ← aquí pondremos plantillas (más adelante)
```

*No hace falta crear nada más por ahora. La carpeta `Campaigns` quedará vacía — los agentes la irán llenando solos.*

### Paso 2.1.3 — Anotar el ID de la carpeta `Campaigns`

Esto es **muy importante**, lo necesitaremos en la Parte 3.

1. Entra en la carpeta `Campaigns`.
2. Mira la URL del navegador. Será algo como:
   ```
   https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT
   ```
3. Copia el trozo después de `/folders/`:
   ```
   1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT
   ```
4. **Anótalo en un sitio al que puedas volver.** Lo llamaremos `DRIVE_CAMPAIGNS_FOLDER_ID`.

*Este ID es único para tu carpeta. El de arriba es ficticio.*

## 2.2 Crear el documento Brand Guardrails

Los agentes van a leer este documento cada vez que revisen un brief o evalúen la calidad de un asset. Es **la fuente de verdad sobre la marca**.

### Paso 2.2.1 — Crear el Doc

1. Dentro de `Campaign Hub` (no dentro de subcarpetas), + Nuevo → Google Docs → Documento en blanco.
2. Título: `Brand Guardrails`.

### Paso 2.2.2 — Pegar este contenido de ejemplo

Copia y pega dentro del documento. Luego lo adaptas a tu realidad; aquí usamos valores ficticios de Cervezas del Valle:

```
# Brand Guardrails — Cervezas del Valle

## Tono de voz
- Cercano, algo irónico, nunca corporativo.
- Hablamos de tú al lector.
- Evitamos superlativos vacíos ("la mejor cerveza del mundo").

Ejemplo de frase buena:
"Una IPA con más lúpulo del que cabe en tu nevera."

Ejemplo de frase mala:
"Experimenta la excelencia artesanal de una IPA premium única."

## Palabras prohibidas
- "revolucionario"
- "disruptivo"
- "artesanal" (sobreusado, suena vacío)
- "único" (a menos que podamos demostrar qué lo hace único)

## Paleta de color
- Primario: #2B4A2F (verde botella)
- Secundario: #E8C547 (dorado trigo)
- Acento: #B33A3A (rojo etiqueta)
- Fondo claro: #F4EFE6

## Tipografía
- Títulos: Libre Baskerville
- Cuerpo: Inter

## Claims permitidos
- Fermentación artesana en Galicia.
- Sin pasteurizar.
- Ingredientes trazables en etiqueta.

## Claims prohibidos (necesitan legal antes de usar)
- Cualquier referencia a beneficios para la salud.
- Comparativas directas con marcas competidoras.
- Datos de cuota de mercado.
```

### Paso 2.2.3 — Anotar el ID del documento

Igual que con la carpeta:

1. Mira la URL del Doc:
   ```
   https://docs.google.com/document/d/1xYz9AbC8dE7fG6hI5jK4lM3nO2pQ1rS/edit
   ```
2. Copia el trozo entre `/d/` y `/edit`:
   ```
   1xYz9AbC8dE7fG6hI5jK4lM3nO2pQ1rS
   ```
3. **Anótalo**. Lo llamaremos `GUARDRAILS_DOC_ID`.

## 2.3 Crear el Spreadsheet

### Paso 2.3.1 — Crear el archivo

1. Dentro de `Campaign Hub`, + Nuevo → Google Sheets → Hoja de cálculo en blanco.
2. Título: `Campaign Hub — Control`.

Por defecto se crea con una hoja llamada "Hoja 1" o "Sheet1". La vamos a renombrar y añadir otras tres.

### Paso 2.3.2 — Crear las 4 hojas

En la parte inferior del Spreadsheet, clic derecho sobre la pestaña "Sheet1" → **Renombrar** → `Campaigns`.

Ahora, en la pestaña "+" abajo a la izquierda, añade **3 hojas más**:
- `Assets`
- `Jobs`
- `Logs`

Orden final (de izquierda a derecha): **Campaigns | Assets | Jobs | Logs**.

### Paso 2.3.3 — Rellenar la hoja `Campaigns`

Pega en la fila 1 (cabeceras) exactamente estos nombres, uno por columna (A, B, C...):

```
id	name	status	owner_email	approver_email	audience	channels	brief_doc_url	kpis	approved	drive_folder_id	production_log	go_live_date	created_at
```

*Truco: copia esa línea, ve a la celda A1 y pega. Google Sheets pone cada palabra en una columna porque están separadas por tabulaciones.*

**Añadir validación al `status`** (dropdown):

1. Selecciona la columna C entera (clic en "C" arriba).
2. Menú **Datos → Validación de datos → +Añadir regla**.
3. En "Criterios":
   - Tipo: **Menú desplegable**
   - Opciones, añade una por una:
     ```
     Draft
     Ready to brief
     Brief OK
     Needs fix
     Approved
     In production
     QA
     Live
     Archived
     ```
4. Guardar.

**Convertir `approved` (columna J) en checkbox**:

1. Selecciona la columna J entera.
2. Menú **Insertar → Casilla de verificación**.
3. Listo: ahora cada celda es un checkbox.

### Paso 2.3.4 — Rellenar la hoja `Assets`

Pega en la fila 1:

```
id	campaign_id	type	variant	drive_file_id	drive_url	preview_url	qa_status	qa_notes	writing_in_progress	created_at
```

**Añadir validación al `type`** (columna C):

1. Seleccionar columna C → Datos → Validación → Menú desplegable:
   ```
   hero_image
   landing_page
   copy_variants
   social_posts
   ```
2. Guardar.

**Añadir validación al `qa_status`** (columna H):

1. Seleccionar columna H → Datos → Validación → Menú desplegable:
   ```
   Produced
   QA pending
   Issues
   Approved
   Rejected
   ```
2. Guardar.

**Convertir `writing_in_progress` (columna J) en checkbox**: igual que antes.

### Paso 2.3.5 — Rellenar la hoja `Jobs`

Pega en la fila 1:

```
id	campaign_id	status	payload	started_at	finished_at	error
```

**Validación del `status`** (columna C) → Menú desplegable:
```
Queued
Running
Done
Failed
```

### Paso 2.3.6 — Rellenar la hoja `Logs`

Pega en la fila 1:

```
timestamp	agent	action	context	result
```

No hace falta validación aquí. Los agentes irán escribiendo líneas.

### Paso 2.3.7 — Anotar el ID del Spreadsheet

Última cosa que anotar:

1. Mira la URL del Spreadsheet:
   ```
   https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456/edit
   ```
2. Copia el trozo entre `/d/` y `/edit`:
   ```
   1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
   ```
3. **Anótalo**. Lo llamaremos `SPREADSHEET_ID`.

## 2.4 Resumen de lo anotado

Deberías tener ya tres cosas apuntadas. Te dejo una plantilla que conviene guardar en un Doc o una nota segura:

```
─────────────────────────────────────────────
DATOS DEL CAMPAIGN HUB

DRIVE_CAMPAIGNS_FOLDER_ID:
  [aquí el ID de la carpeta Campaigns/]

GUARDRAILS_DOC_ID:
  [aquí el ID del Google Doc Brand Guardrails]

SPREADSHEET_ID:
  [aquí el ID del Spreadsheet Campaign Hub — Control]

ANTHROPIC_API_KEY:
  [sk-ant-... — la conseguirás en la Parte 3]

WEBAPP_TOKEN:
  [token que generarás en la Parte 3]

WEBAPP_URL:
  [URL que saldrá al desplegar el WebApp, Parte 3]
─────────────────────────────────────────────
```

Las tres últimas las rellenarás en la Parte 3. Guarda este documento en un sitio privado — idealmente un gestor de contraseñas.

## 2.5 Comprobación antes de avanzar

Responde sí/no a estas preguntas antes de pasar a la Parte 3:

- [ ] Tengo una carpeta `Campaign Hub` en Drive con dos subcarpetas dentro: `Campaigns/` y `_templates/`.
- [ ] Tengo un Google Doc `Brand Guardrails` con las secciones de ejemplo (o mis propias reglas).
- [ ] Tengo un Spreadsheet `Campaign Hub — Control` con 4 hojas en este orden: Campaigns, Assets, Jobs, Logs.
- [ ] Cada hoja tiene sus cabeceras en la fila 1 tal como indiqué.
- [ ] Las columnas `status`, `qa_status`, `type`, `status` (en Jobs) tienen dropdowns.
- [ ] Las columnas `approved` y `writing_in_progress` son checkboxes.
- [ ] Tengo anotados tres IDs: DRIVE_CAMPAIGNS_FOLDER_ID, GUARDRAILS_DOC_ID, SPREADSHEET_ID.

Si todo está bien, sigue con la **Parte 3 · Los 4 agentes en Apps Script**.

Si algo no cuadra, vuelve al paso donde estabas y repásalo. **No sigas con errores acumulados**: depurar más adelante cuesta mucho más tiempo que hacerlo bien ahora.
