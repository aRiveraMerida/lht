---
title: "Campaign Hub · Los 4 agentes en Apps Script"
date: "2026-04-19"
description: "El cerebro del sistema: 10 archivos de Apps Script con una sola responsabilidad cada uno. Copiar, pegar y entender por qué cada pieza hace lo que hace."
excerpt: "El cerebro del sistema: 10 archivos de Apps Script con una sola responsabilidad cada uno. Copiar, pegar y entender por qué cada pieza hace lo que hace."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 4
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 3 · Los 4 agentes en Apps Script

Ahora metemos el código que hace funcionar el cerebro del sistema. **Vas a copiar y pegar 10 archivos**. Es mucho código, pero la estructura es clarísima y cada archivo tiene una sola responsabilidad.

**Tiempo estimado**: 45 minutos, sin prisas.

**Regla de oro de esta parte**: haz los pasos en orden. No te adelantes. Cada archivo depende de los anteriores.


## 3.0 Mapa de lo que vamos a hacer

```
1. Abrir Apps Script desde el Spreadsheet
2. Guardar secretos (API key, etc.) en Script Properties
3. Copiar los 10 archivos de código:
   ├── Config.gs            ← Variables centrales
   ├── Utils.gs             ← Funciones auxiliares
   ├── ClaudeClient.gs      ← Hablar con la API de Claude
   ├── DriveManager.gs      ← Crear carpetas en Drive
   ├── Prompts.gs           ← Prompts de los agentes
   ├── BriefReviewer.gs     ← Agente 1
   ├── Dispatcher.gs        ← Agente 2
   ├── QAReviewer.gs        ← Agente 3
   ├── Publisher.gs         ← Agente 4
   ├── Triggers.gs          ← Router de eventos
   └── WebApp.gs            ← Endpoint público para Claude Code
4. Instalar los triggers (con un botón que crearemos)
5. Desplegar el WebApp
6. Anotar la URL del WebApp y el token
```


## 3.1 Conseguir la API key de Anthropic

Si no la tienes ya:

1. `console.anthropic.com` → Registro o login.
2. Menú → **API Keys** → **Create Key**.
3. Nombre: `campaign-hub-script`.
4. Copia la key (empieza por `sk-ant-`).
5. Anótala en tu nota segura como `ANTHROPIC_API_KEY`.

*Importante*: asegúrate de tener saldo en la cuenta (Billing → Add credits). Con 5-10 € vas de sobra para pruebas.


## 3.2 Abrir Apps Script

1. Abre tu Spreadsheet `Campaign Hub — Control`.
2. Menú **Extensiones → Apps Script**.
3. Se abre una pestaña nueva con el editor. Arriba a la izquierda dice "Sin título".
4. Clic en ese texto → pon el nombre: `Campaign Hub Backend`.

Verás que ya existe un archivo `Código.gs` (o `Code.gs`) con una función vacía. **Lo vamos a ignorar**. Iremos creando archivos nuevos uno a uno.


## 3.3 Guardar los secretos en Script Properties

Antes de escribir código, guardamos la API key donde toca:

1. En el editor de Apps Script, menú de la izquierda → icono de engranaje ⚙️ (**Configuración del proyecto**).
2. Scroll hasta **Propiedades del script** → clic en **Editar propiedades**.
3. Clic en **Añadir propiedad**:
   - Propiedad: `ANTHROPIC_API_KEY`
   - Valor: tu `sk-ant-...`
4. Otra propiedad:
   - Propiedad: `WEBAPP_TOKEN`
   - Valor: un texto aleatorio largo. Invéntatelo: `a7F9k2Mn5xQ8vR3jBpLw6hTcYeDg1sUz` (o similar). Anótalo en tu nota segura.
5. Si vas a usar Slack (opcional), otra propiedad:
   - Propiedad: `SLACK_WEBHOOK_URL`
   - Valor: tu webhook de Slack. *Si no tienes, déjalo en blanco o no crees la propiedad.*
6. Clic en **Guardar propiedades del script**.


## 3.4 Crear los archivos de código

Ahora, el grueso del trabajo. Por cada archivo:

1. En el panel de la izquierda del editor de Apps Script, clic en el **"+"** al lado de "Archivos" → **Script**.
2. Pon el nombre exacto que indico (sin el `.gs`, Apps Script lo añade solo).
3. Borra el contenido por defecto y pega el bloque que corresponde.
4. **Ctrl+S** (o Cmd+S en Mac) para guardar.

**Haz los archivos en el orden que pongo**. No te saltes ninguno.


### Archivo 1 · `Config.gs`

Este archivo centraliza todas las variables. Es **el único que vas a tocar** cuando cambies de caso (de Cervezas del Valle a otro cliente).

```javascript
// ============================================================
// CONFIG — Variables centrales del sistema
// ============================================================
// Este es el ÚNICO archivo que normalmente editas al cambiar de caso.

const CONFIG = {
  // -----------------------------------------------------------
  // IDs que anotaste en la Parte 2
  // -----------------------------------------------------------
  DRIVE_CAMPAIGNS_FOLDER_ID: 'PEGA_AQUI_DRIVE_CAMPAIGNS_FOLDER_ID',
  GUARDRAILS_DOC_ID: 'PEGA_AQUI_GUARDRAILS_DOC_ID',

  // -----------------------------------------------------------
  // Secretos (leídos de Script Properties)
  // No los pongas en claro aquí.
  // -----------------------------------------------------------
  ANTHROPIC_API_KEY: PropertiesService.getScriptProperties()
                      .getProperty('ANTHROPIC_API_KEY'),
  SLACK_WEBHOOK_URL: PropertiesService.getScriptProperties()
                      .getProperty('SLACK_WEBHOOK_URL'),
  WEBAPP_TOKEN: PropertiesService.getScriptProperties()
                      .getProperty('WEBAPP_TOKEN'),

  // -----------------------------------------------------------
  // Modelos a usar
  // -----------------------------------------------------------
  MODEL_HEAVY: 'claude-sonnet-4-5',    // Para Reviewer y QA (juicio)
  MODEL_LIGHT: 'claude-haiku-4-5',     // Para Dispatcher y Publisher (mecánico)
  ANTHROPIC_VERSION: '2023-06-01',

  // -----------------------------------------------------------
  // Identidad del caso (cambia según cliente/producto)
  // -----------------------------------------------------------
  CASO: 'Creative Campaign Hub',
  OBJETO: 'campaña',
  IDIOMA: 'es-ES',
  UNIDADES_DE_ASSET: [
    'hero_image',
    'landing_page',
    'copy_variants',
    'social_posts'
  ],

  // -----------------------------------------------------------
  // Nombres de las hojas (no los cambies a menos que renombraras en la Parte 2)
  // -----------------------------------------------------------
  SHEET_CAMPAIGNS: 'Campaigns',
  SHEET_ASSETS: 'Assets',
  SHEET_JOBS: 'Jobs',
  SHEET_LOGS: 'Logs',

  // -----------------------------------------------------------
  // Calendar (donde crear eventos de go-live)
  // -----------------------------------------------------------
  CALENDAR_ID: 'primary'   // 'primary' = tu calendario por defecto
};
```

**Sustituye ahora** las dos líneas con `PEGA_AQUI_...` por los IDs que anotaste en la Parte 2. Guarda.


### Archivo 2 · `Utils.gs`

Funciones auxiliares que usarán todos los agentes. No tienes que entenderlas, solo copiarlas.

```javascript
// ============================================================
// UTILS — Helpers de Sheets, logs y notificaciones
// ============================================================

function getSheet(name) {
  return SpreadsheetApp.getActive().getSheetByName(name);
}

// Devuelve el número de columna (1-indexado) de una cabecera
function getColIndex(sheetName, columnName) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = headers.indexOf(columnName);
  if (idx === -1) {
    throw new Error(`Columna "${columnName}" no encontrada en "${sheetName}"`);
  }
  return idx + 1;
}

// Lee una fila como objeto {columna: valor}
function getRowAsObject(sheetName, rowIndex) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  const obj = { _row: rowIndex };
  headers.forEach((h, i) => { obj[h] = values[i]; });
  return obj;
}

// Actualiza varias celdas de una fila
function updateRow(sheetName, rowIndex, updates) {
  const sheet = getSheet(sheetName);
  Object.keys(updates).forEach(key => {
    const col = getColIndex(sheetName, key);
    sheet.getRange(rowIndex, col).setValue(updates[key]);
  });
}

// Añade una fila al final de una hoja
function appendRow(sheetName, obj) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => obj[h] !== undefined ? obj[h] : '');
  sheet.appendRow(row);
  return sheet.getLastRow();
}

// Busca la primera fila donde una columna tenga un valor concreto
function findRowByField(sheetName, field, value) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const colIdx = headers.indexOf(field);
  if (colIdx === -1) return null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][colIdx] === value) return i + 1;
  }
  return null;
}

// Genera un ID único corto
function generateId(prefix) {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${ts}_${rand}`;
}

// Escribe una línea en la hoja Logs
function logAgent(agent, action, context, result) {
  try {
    appendRow(CONFIG.SHEET_LOGS, {
      timestamp: new Date(),
      agent: agent,
      action: action,
      context: typeof context === 'object' ? JSON.stringify(context) : String(context),
      result: typeof result === 'object' ? JSON.stringify(result) : String(result)
    });
  } catch (e) {
    console.error('Log failed:', e);
  }
}

// Notifica a Slack (si el webhook está configurado)
function notifySlack(text) {
  if (!CONFIG.SLACK_WEBHOOK_URL) return;
  try {
    UrlFetchApp.fetch(CONFIG.SLACK_WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ text: text }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error('Slack notify failed:', e);
  }
}
```


### Archivo 3 · `ClaudeClient.gs`

Wrapper para hablar con la API de Claude.

```javascript
// ============================================================
// CLAUDE CLIENT — Llamadas a la API de Anthropic
// ============================================================

function callClaude(prompt, options) {
  options = options || {};
  const model = options.model || CONFIG.MODEL_HEAVY;
  const maxTokens = options.maxTokens || 2000;

  const body = {
    model: model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  };

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': CONFIG.ANTHROPIC_API_KEY,
      'anthropic-version': CONFIG.ANTHROPIC_VERSION
    },
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  });

  const status = response.getResponseCode();
  const text = response.getContentText();

  if (status !== 200) {
    throw new Error(`Claude API error ${status}: ${text}`);
  }

  const json = JSON.parse(text);
  return json.content[0].text;
}

// Fuerza respuesta JSON estricta y la parsea
function callClaudeJSON(prompt, options) {
  const jsonInstruction = '\n\nIMPORTANTE: Devuelve SOLO un objeto JSON válido, ' +
                          'sin explicaciones, sin markdown, sin ```. ' +
                          'Empieza por { y termina por }.';
  const raw = callClaude(prompt + jsonInstruction, options);
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`No se pudo parsear JSON de Claude: ${cleaned.substring(0, 200)}`);
  }
}
```


### Archivo 4 · `DriveManager.gs`

Gestión de carpetas en Drive y lectura del Doc de Guardrails.

```javascript
// ============================================================
// DRIVE MANAGER — Carpetas y lectura de Guardrails
// ============================================================

function createCampaignFolder(campaignId, campaignName) {
  const root = DriveApp.getFolderById(CONFIG.DRIVE_CAMPAIGNS_FOLDER_ID);
  const safeName = campaignName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
  const folderName = `${campaignId}_${safeName}`;
  const folder = root.createFolder(folderName);

  // Subcarpetas estándar
  folder.createFolder('01_brief');
  folder.createFolder('02_assets');
  folder.createFolder('03_final');

  return {
    id: folder.getId(),
    url: folder.getUrl()
  };
}

function readGuardrails() {
  const doc = DocumentApp.openById(CONFIG.GUARDRAILS_DOC_ID);
  return doc.getBody().getText();
}

function readBriefFromUrl(briefDocUrl) {
  if (!briefDocUrl) return '';
  const match = String(briefDocUrl).match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return '';
  try {
    const doc = DocumentApp.openById(match[1]);
    return doc.getBody().getText();
  } catch (e) {
    console.error('No se pudo leer brief doc:', e);
    return '';
  }
}
```


### Archivo 5 · `Prompts.gs`

Los prompts que van a la API de Claude. **Este es el archivo que más personalizas** cuando adaptas a otro caso.

```javascript
// ============================================================
// PROMPTS — Instrucciones que enviamos a Claude
// ============================================================

function buildBriefReviewerPrompt(campaign, briefText, guardrails) {
  return `Eres un revisor de briefs para ${CONFIG.CASO}. Hablas ${CONFIG.IDIOMA}.

# Brief actual
Nombre: ${campaign.name || '[sin nombre]'}
Audiencia: ${campaign.audience || '[vacío]'}
Canales: ${campaign.channels || '[vacío]'}
KPIs: ${campaign.kpis || '[vacío]'}

# Contenido del brief (del Google Doc enlazado)
${briefText || '[sin contenido — no se encontró Doc]'}

# Brand Guardrails
${guardrails}

# Tu tarea
1. Detecta campos vacíos o inconsistentes.
2. Si falta audience, channels o kpis, propón valores razonables basados en el brief.
3. Valida tono, prohibidos y claims contra los Guardrails.
4. Decide status:
   - "Brief OK" si el brief es coherente con guardrails (aunque faltasen campos que puedas rellenar).
   - "Needs fix" si el brief contradice guardrails, es incoherente, o falta información crítica.

# Formato de respuesta (JSON)
{
  "status": "Brief OK" | "Needs fix",
  "reason": "explicación breve en 1-2 frases",
  "updates": {
    "audience": "...",
    "channels": "...",
    "kpis": "..."
  }
}

En "updates" incluye solo los campos que estaban vacíos y sugieres rellenar. Si no hay nada que rellenar, devuelve "updates": {}.`;
}

function buildQAReviewerPrompt(asset, campaign, guardrails) {
  return `Eres revisor de QA para assets de ${CONFIG.CASO}. Hablas ${CONFIG.IDIOMA}.

# Asset a revisar
Tipo: ${asset.type}
Variant: ${asset.variant}
URL: ${asset.drive_url}

# Campaña asociada
Nombre: ${campaign.name}
Audiencia: ${campaign.audience}
KPIs: ${campaign.kpis}

# Brand Guardrails
${guardrails}

# Criterios
Marca "Issues" si detectas:
- Tono fuera de guardrails.
- Uso de palabras prohibidas.
- Claims no permitidos.
- Incoherencia con la audiencia.

Marca "Approved" si cumple todo. NUNCA uses "Rejected" (eso solo lo hace el humano).

# Formato de respuesta (JSON)
{
  "qa_status": "Approved" | "Issues",
  "notes": "si Issues: lista concreta de problemas. Si Approved: breve justificación."
}`;
}
```


### Archivo 6 · `BriefReviewer.gs` — Agente 1

```javascript
// ============================================================
// BRIEF REVIEWER — Agente 1
// Se dispara cuando una campaña pasa a "Ready to brief"
// ============================================================

function briefReviewer(campaignRowIndex) {
  const campaign = getRowAsObject(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex);
  const guardrails = readGuardrails();
  const briefText = readBriefFromUrl(campaign.brief_doc_url);

  // Asignar ID si no tiene
  if (!campaign.id) {
    campaign.id = generateId('camp');
    updateRow(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex, {
      id: campaign.id,
      created_at: new Date()
    });
  }

  // Crear carpeta Drive si no existe
  if (!campaign.drive_folder_id) {
    const folder = createCampaignFolder(campaign.id, campaign.name || 'sin_nombre');
    updateRow(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex, {
      drive_folder_id: folder.id
    });
    campaign.drive_folder_id = folder.id;
  }

  const prompt = buildBriefReviewerPrompt(campaign, briefText, guardrails);

  try {
    const result = callClaudeJSON(prompt, { model: CONFIG.MODEL_HEAVY });

    const updates = {
      status: result.status,
      production_log: `[${new Date().toISOString()}] BriefReviewer: ${result.reason}\n${campaign.production_log || ''}`
    };

    // Rellenar campos vacíos con lo que sugiera el agente
    if (result.updates) {
      ['audience', 'channels', 'kpis'].forEach(field => {
        if (result.updates[field] && !campaign[field]) {
          updates[field] = result.updates[field];
        }
      });
    }

    updateRow(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex, updates);
    logAgent('BriefReviewer', 'review', { campaign_id: campaign.id }, result);
  } catch (e) {
    updateRow(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex, {
      status: 'Needs fix',
      production_log: `[${new Date().toISOString()}] BriefReviewer ERROR: ${e.message}`
    });
    logAgent('BriefReviewer', 'error', { campaign_id: campaign.id }, e.message);
  }
}
```


### Archivo 7 · `Dispatcher.gs` — Agente 2

```javascript
// ============================================================
// DISPATCHER — Agente 2
// Se dispara cuando status="Brief OK" Y approved=true
// Crea un job en la cola para Claude Code
// ============================================================

function dispatcher(campaignRowIndex) {
  const campaign = getRowAsObject(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex);

  // Doble verificación
  if (campaign.status !== 'Brief OK') return;
  if (!campaign.approved) return;

  // Evitar duplicados
  const existingJob = findRowByField(CONFIG.SHEET_JOBS, 'campaign_id', campaign.id);
  if (existingJob) {
    logAgent('Dispatcher', 'skip_duplicate', { campaign_id: campaign.id }, 'job existe');
    return;
  }

  const briefText = readBriefFromUrl(campaign.brief_doc_url);

  const payload = {
    campaign_id: campaign.id,
    name: campaign.name,
    audience: campaign.audience,
    channels: String(campaign.channels || '').split(',').map(s => s.trim()).filter(Boolean),
    brief: briefText,
    kpis: campaign.kpis,
    drive_folder_id: campaign.drive_folder_id,
    assets_needed: CONFIG.UNIDADES_DE_ASSET
  };

  appendRow(CONFIG.SHEET_JOBS, {
    id: generateId('job'),
    campaign_id: campaign.id,
    status: 'Queued',
    payload: JSON.stringify(payload),
    started_at: '',
    finished_at: '',
    error: ''
  });

  updateRow(CONFIG.SHEET_CAMPAIGNS, campaignRowIndex, {
    status: 'In production',
    production_log: `[${new Date().toISOString()}] Dispatcher: job encolado\n${campaign.production_log || ''}`
  });

  logAgent('Dispatcher', 'enqueue', { campaign_id: campaign.id }, 'ok');
  notifySlack(`📦 Nueva campaña en producción: *${campaign.name}*`);
}
```


### Archivo 8 · `QAReviewer.gs` — Agente 3

```javascript
// ============================================================
// QA REVIEWER — Agente 3
// Se dispara cuando un asset pasa a "QA pending"
// ============================================================

function qaReviewer(assetRowIndex) {
  const asset = getRowAsObject(CONFIG.SHEET_ASSETS, assetRowIndex);

  // Evita race condition: no revisar mientras Claude Code aún escribe
  if (asset.writing_in_progress) return;

  const campaignRow = findRowByField(CONFIG.SHEET_CAMPAIGNS, 'id', asset.campaign_id);
  if (!campaignRow) {
    logAgent('QAReviewer', 'error', { asset_id: asset.id }, 'campaign no encontrada');
    return;
  }
  const campaign = getRowAsObject(CONFIG.SHEET_CAMPAIGNS, campaignRow);
  const guardrails = readGuardrails();
  const prompt = buildQAReviewerPrompt(asset, campaign, guardrails);

  try {
    const result = callClaudeJSON(prompt, { model: CONFIG.MODEL_HEAVY });

    updateRow(CONFIG.SHEET_ASSETS, assetRowIndex, {
      qa_status: result.qa_status,
      qa_notes: result.notes
    });

    if (result.qa_status === 'Issues') {
      notifySlack(`⚠️ QA flag en asset ${asset.type} (campaña _${campaign.name}_): ${result.notes}`);
    }

    logAgent('QAReviewer', 'review', { asset_id: asset.id }, result);
  } catch (e) {
    updateRow(CONFIG.SHEET_ASSETS, assetRowIndex, {
      qa_status: 'Issues',
      qa_notes: `QA error: ${e.message}. Revisión humana requerida.`
    });
    logAgent('QAReviewer', 'error', { asset_id: asset.id }, e.message);
  }
}
```


### Archivo 9 · `Publisher.gs` — Agente 4

```javascript
// ============================================================
// PUBLISHER — Agente 4
// Se ejecuta cada hora. Publica campañas con todos los assets aprobados.
// ============================================================

function publisher() {
  const campaignsSheet = getSheet(CONFIG.SHEET_CAMPAIGNS);
  const data = campaignsSheet.getDataRange().getValues();
  const headers = data[0];
  const statusCol = headers.indexOf('status');
  const idCol = headers.indexOf('id');

  for (let i = 1; i < data.length; i++) {
    // Solo campañas en "QA" o "In production" (por si Claude Code marcó directamente QA)
    const currentStatus = data[i][statusCol];
    if (currentStatus !== 'QA' && currentStatus !== 'In production') continue;

    const campaignId = data[i][idCol];
    if (!campaignId) continue;

    const campaign = getRowAsObject(CONFIG.SHEET_CAMPAIGNS, i + 1);
    const assets = getAssetsByCampaign(campaignId);

    if (assets.length === 0) continue;

    const allApproved = assets.every(a => a.qa_status === 'Approved');
    if (!allApproved) continue;

    publishCampaign(campaign, assets, i + 1);
  }
}

function getAssetsByCampaign(campaignId) {
  const sheet = getSheet(CONFIG.SHEET_ASSETS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const campaignIdCol = headers.indexOf('campaign_id');
  const assets = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][campaignIdCol] === campaignId) {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = data[i][idx]; });
      assets.push(obj);
    }
  }
  return assets;
}

function publishCampaign(campaign, assets, rowIndex) {
  // 1. Mensaje de resumen
  const assetList = assets.map(a =>
    `• ${a.type} v${a.variant}: ${a.drive_url}`
  ).join('\n');

  const folderUrl = `https://drive.google.com/drive/folders/${campaign.drive_folder_id}`;
  const slackMsg = `🚀 *Campaña lista*: ${campaign.name}\n\n` +
                   `Audiencia: ${campaign.audience}\n` +
                   `Canales: ${campaign.channels}\n` +
                   `Drive: ${folderUrl}\n\n` +
                   `*Assets aprobados:*\n${assetList}`;
  notifySlack(slackMsg);

  // 2. Crear evento en Calendar (si hay fecha)
  if (campaign.go_live_date) {
    try {
      const cal = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
      const start = new Date(campaign.go_live_date);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      cal.createEvent(
        `🚀 Go-live: ${campaign.name}`,
        start,
        end,
        {
          description: `Owner: ${campaign.owner_email}\nApprover: ${campaign.approver_email}\n\nDrive: ${folderUrl}`
        }
      );
    } catch (e) {
      console.error('Calendar event failed:', e);
    }
  }

  // 3. Marcar como Live
  updateRow(CONFIG.SHEET_CAMPAIGNS, rowIndex, {
    status: 'Live',
    production_log: `[${new Date().toISOString()}] Publisher: published\n${campaign.production_log || ''}`
  });

  logAgent('Publisher', 'publish', { campaign_id: campaign.id }, 'ok');
}
```

### Archivo 10 · `Triggers.gs` — Router de eventos

Este archivo orquesta qué agente se ejecuta cuando hay un cambio. También contiene la función `installTriggers` que activarás al final.

```javascript
// ============================================================
// TRIGGERS — Router de eventos onEdit y schedule
// ============================================================

function masterOnEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();
  const col = e.range.getColumn();
  const row = e.range.getRow();
  if (row === 1) return; // Cabecera

  try {
    if (sheetName === CONFIG.SHEET_CAMPAIGNS) {
      handleCampaignsEdit(e, row, col);
    } else if (sheetName === CONFIG.SHEET_ASSETS) {
      handleAssetsEdit(e, row, col);
    }
  } catch (err) {
    console.error('masterOnEdit error:', err);
    logAgent('Triggers', 'error', { sheet: sheetName, row: row }, err.message);
  }
}

function handleCampaignsEdit(e, row, col) {
  const statusCol = getColIndex(CONFIG.SHEET_CAMPAIGNS, 'status');
  const approvedCol = getColIndex(CONFIG.SHEET_CAMPAIGNS, 'approved');

  // Caso 1: status cambió a "Ready to brief"
  if (col === statusCol && e.value === 'Ready to brief') {
    briefReviewer(row);
    return;
  }

  // Caso 2: status o approved cambiaron, y se dan las condiciones del Dispatcher
  if (col === statusCol || col === approvedCol) {
    const campaign = getRowAsObject(CONFIG.SHEET_CAMPAIGNS, row);
    if (campaign.status === 'Brief OK' && campaign.approved) {
      dispatcher(row);
    }
  }
}

function handleAssetsEdit(e, row, col) {
  const qaStatusCol = getColIndex(CONFIG.SHEET_ASSETS, 'qa_status');
  if (col === qaStatusCol && e.value === 'QA pending') {
    qaReviewer(row);
  }
}

// -----------------------------------------------------------
// Instalador de triggers. EJECUTAR ESTA FUNCIÓN UNA SOLA VEZ.
// -----------------------------------------------------------
function installTriggers() {
  // Borrar triggers previos para evitar duplicados
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // onEdit instalable (necesario para tener permisos de red)
  ScriptApp.newTrigger('masterOnEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();

  // Publisher cada hora
  ScriptApp.newTrigger('publisher')
    .timeBased()
    .everyHours(1)
    .create();

  // Re-check de assets atascados cada 4 horas
  ScriptApp.newTrigger('qaEscalationCheck')
    .timeBased()
    .everyHours(4)
    .create();

  SpreadsheetApp.getActive().toast('✅ Triggers instalados correctamente', 'Campaign Hub', 5);
}

function qaEscalationCheck() {
  const sheet = getSheet(CONFIG.SHEET_ASSETS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const qaCol = headers.indexOf('qa_status');
  const createdCol = headers.indexOf('created_at');
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  for (let i = 1; i < data.length; i++) {
    const created = data[i][createdCol];
    if (data[i][qaCol] === 'QA pending' && created && new Date(created) < twoHoursAgo) {
      qaReviewer(i + 1);
    }
  }
}
```

### Archivo 11 · `WebApp.gs` — Endpoint para Claude Code

El último archivo. Es el "buzón" por donde Claude Code lee y escribe.

```javascript
// ============================================================
// WEBAPP — Endpoint HTTP para Claude Code
// ============================================================

function doGet(e) {
  const token = e.parameter.token;
  if (token !== CONFIG.WEBAPP_TOKEN) {
    return jsonResponse({ error: 'unauthorized' });
  }
  const action = e.parameter.action;

  if (action === 'ping')     return jsonResponse({ ok: true, ts: new Date() });
  if (action === 'next_job') return jsonResponse(getNextQueuedJob());

  return jsonResponse({ error: 'unknown_action' });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'invalid_json' });
  }

  if (body.token !== CONFIG.WEBAPP_TOKEN) {
    return jsonResponse({ error: 'unauthorized' });
  }

  const action = body.action;

  if (action === 'mark_running') return jsonResponse(markJobRunning(body.job_id));
  if (action === 'mark_done')    return jsonResponse(markJobDone(body.job_id));
  if (action === 'mark_failed')  return jsonResponse(markJobFailed(body.job_id, body.error));
  if (action === 'create_asset') return jsonResponse(createAsset(body.asset));

  return jsonResponse({ error: 'unknown_action' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getNextQueuedJob() {
  const sheet = getSheet(CONFIG.SHEET_JOBS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const statusCol = headers.indexOf('status');

  for (let i = 1; i < data.length; i++) {
    if (data[i][statusCol] === 'Queued') {
      const obj = { _row: i + 1 };
      headers.forEach((h, idx) => { obj[h] = data[i][idx]; });
      return obj;
    }
  }
  return { empty: true };
}

function markJobRunning(jobId) {
  const row = findRowByField(CONFIG.SHEET_JOBS, 'id', jobId);
  if (!row) return { error: 'job_not_found' };
  updateRow(CONFIG.SHEET_JOBS, row, {
    status: 'Running',
    started_at: new Date()
  });
  return { ok: true };
}

function markJobDone(jobId) {
  const row = findRowByField(CONFIG.SHEET_JOBS, 'id', jobId);
  if (!row) return { error: 'job_not_found' };
  updateRow(CONFIG.SHEET_JOBS, row, {
    status: 'Done',
    finished_at: new Date()
  });

  // Marcar la campaña como en QA
  const job = getRowAsObject(CONFIG.SHEET_JOBS, row);
  const campRow = findRowByField(CONFIG.SHEET_CAMPAIGNS, 'id', job.campaign_id);
  if (campRow) {
    updateRow(CONFIG.SHEET_CAMPAIGNS, campRow, { status: 'QA' });
  }
  return { ok: true };
}

function markJobFailed(jobId, errorMsg) {
  const row = findRowByField(CONFIG.SHEET_JOBS, 'id', jobId);
  if (!row) return { error: 'job_not_found' };
  updateRow(CONFIG.SHEET_JOBS, row, {
    status: 'Failed',
    finished_at: new Date(),
    error: errorMsg || 'sin detalle'
  });
  const job = getRowAsObject(CONFIG.SHEET_JOBS, row);
  const campRow = findRowByField(CONFIG.SHEET_CAMPAIGNS, 'id', job.campaign_id);
  if (campRow) {
    updateRow(CONFIG.SHEET_CAMPAIGNS, campRow, {
      status: 'Needs fix',
      production_log: `[${new Date().toISOString()}] Job failed: ${errorMsg}`
    });
  }
  return { ok: true };
}

function createAsset(asset) {
  const row = appendRow(CONFIG.SHEET_ASSETS, {
    id: asset.id || generateId('asset'),
    campaign_id: asset.campaign_id,
    type: asset.type,
    variant: asset.variant,
    drive_file_id: asset.drive_file_id || '',
    drive_url: asset.drive_url,
    preview_url: asset.preview_url || asset.drive_url,
    qa_status: 'QA pending',
    qa_notes: '',
    writing_in_progress: false,
    created_at: new Date()
  });
  return { ok: true, row: row };
}
```

## 3.5 Instalar los triggers

Ahora activamos todo.

1. En el editor de Apps Script, abre el archivo `Triggers.gs`.
2. En la barra superior, selector de función → elige **`installTriggers`**.
3. Clic en el botón **▶ Ejecutar**.
4. La primera vez pedirá **permisos**:
   - Clic en "Revisar permisos".
   - Elige tu cuenta de Google.
   - Si Google dice "Esta app no está verificada" → "Configuración avanzada" → "Ir a Campaign Hub Backend (no seguro)" → "Permitir".
   - Revisa los permisos y acepta (lectura/escritura de Sheets, Drive, Calendar, red externa).
5. Al terminar, debería aparecer un toast abajo: "✅ Triggers instalados correctamente".

**Verificación**: Apps Script → icono ⏰ (**Activadores** o **Triggers**). Deberías ver 3:
- `masterOnEdit` → From spreadsheet → On edit
- `publisher` → Time-driven → Hour timer
- `qaEscalationCheck` → Time-driven → Hour timer (every 4 hours)


## 3.6 Desplegar el WebApp

Lo último: abrir el buzón al mundo para que Claude Code pueda hablar con él.

1. Arriba a la derecha del editor Apps Script, clic en **Deploy** → **New deployment**.
2. Icono de engranaje (al lado de "Select type") → **Web app**.
3. Configuración:
   - Description: `Campaign Hub webhook v1`
   - Execute as: **Me (tu@email.com)**
   - Who has access: **Anyone** (sí, debe ser "Anyone" para que Claude Code pueda llamar sin login; la seguridad la pone el `WEBAPP_TOKEN`).
4. Clic en **Deploy**.
5. Si pide permisos de nuevo, acepta.
6. Te da una URL tipo:
   ```
   https://script.google.com/macros/s/AKfycb...Xyz/exec
   ```
7. **Copia esta URL**. Anótala en tu nota segura como `WEBAPP_URL`.

**Test rápido del WebApp**:

Pega esta URL en el navegador (sustituyendo `{URL}` y `{TOKEN}` por lo tuyo):

```
{WEBAPP_URL}?action=ping&token={WEBAPP_TOKEN}
```

Deberías ver:
```json
{"ok":true,"ts":"2026-04-19T..."}
```

Si ves `{"error":"unauthorized"}` → revisa el `WEBAPP_TOKEN` en Script Properties.

Si ves un error de Google → el deploy no salió bien, repite el paso 6.

## 3.7 Comprobación antes de avanzar

- [ ] Los 11 archivos están creados y guardados en Apps Script.
- [ ] `Config.gs` tiene tus IDs reales (DRIVE_CAMPAIGNS_FOLDER_ID, GUARDRAILS_DOC_ID).
- [ ] Script Properties tiene `ANTHROPIC_API_KEY` y `WEBAPP_TOKEN`.
- [ ] `installTriggers` se ejecutó sin errores y los 3 activadores están listados.
- [ ] El WebApp está deployado y `?action=ping&token=...` responde `ok:true`.
- [ ] Tengo anotada la `WEBAPP_URL`.

Si todo está marcado, pasa a la **Parte 4 · Claude Code y la skill de producción**.
