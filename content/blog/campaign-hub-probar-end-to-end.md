---
title: "Campaign Hub · Probar end-to-end"
date: "2026-04-19"
description: "Las piezas funcionando juntas. Test completo con el caso ficticio, tests negativos intencionados y troubleshooting de los fallos habituales."
excerpt: "Las piezas funcionando juntas. Test completo con el caso ficticio, tests negativos intencionados y troubleshooting de los fallos habituales."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 6
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 5 · Probar el sistema end-to-end

Hasta ahora hemos montado las piezas. En esta parte las hacemos funcionar juntas de verdad.

**Tiempo estimado**: 30 minutos.

**Contiene**:
- Ampliar el WebApp para uploads reales a Drive
- Actualizar la skill para usar el upload real
- Test completo paso a paso
- Tests negativos (provocar errores para ver si el sistema se recupera)
- Qué hacer si algo no funciona

---

## 5.1 Ampliar el WebApp con upload real a Drive

En la Parte 4 dejamos la subida a Drive "simulada". Ahora la hacemos real. Es solo añadir un endpoint al WebApp.

### 5.1.1 — Añadir el endpoint al WebApp

Vuelve al editor Apps Script de tu Spreadsheet. Abre `WebApp.gs` y localiza la función `doPost`. Añade una nueva acción — el bloque completo queda así:

```javascript
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
  if (action === 'upload_file')  return jsonResponse(uploadFile(body.file));  // ← NUEVO

  return jsonResponse({ error: 'unknown_action' });
}
```

Al final del archivo, añade esta función:

```javascript
// -----------------------------------------------------------
// Upload de archivo a una carpeta Drive
// Recibe el contenido en base64 y lo escribe.
// -----------------------------------------------------------
function uploadFile(file) {
  // file = { folder_id, filename, mime_type, content_base64 }
  try {
    const folder = DriveApp.getFolderById(file.folder_id);
    const blob = Utilities.newBlob(
      Utilities.base64Decode(file.content_base64),
      file.mime_type,
      file.filename
    );

    // Intentar ubicar subcarpeta "02_assets" si existe
    let targetFolder = folder;
    const subfolders = folder.getFoldersByName('02_assets');
    if (subfolders.hasNext()) {
      targetFolder = subfolders.next();
    }

    const driveFile = targetFolder.createFile(blob);
    // Hacer accesible con enlace
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return {
      ok: true,
      drive_file_id: driveFile.getId(),
      drive_url: driveFile.getUrl()
    };
  } catch (e) {
    return { error: 'upload_failed', detail: String(e) };
  }
}
```

### 5.1.2 — Re-desplegar el WebApp

Importante: los cambios en Apps Script **no se reflejan automáticamente** en el WebApp desplegado. Hay que re-desplegar.

1. Arriba a la derecha del editor → **Deploy** → **Manage deployments**.
2. Clic en el icono ✏️ (**Edit**) al lado de tu deployment activo.
3. Version: **New version**.
4. Clic en **Deploy**.
5. La URL **no cambia**, así que no tienes que actualizar nada en tu `.env`.

### 5.1.3 — Probar el endpoint con curl

Desde terminal:

```bash
# Sustituye las variables por los valores de tu .env
WEBAPP_URL="https://script.google.com/macros/s/..../exec"
WEBAPP_TOKEN="tu_token"
FOLDER_ID="tu_drive_campaigns_folder_id"

# Creamos un base64 con contenido de prueba
BASE64=$(echo "Hola desde el test" | base64)

curl -X POST "$WEBAPP_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\": \"upload_file\",
    \"token\": \"$WEBAPP_TOKEN\",
    \"file\": {
      \"folder_id\": \"$FOLDER_ID\",
      \"filename\": \"test.txt\",
      \"mime_type\": \"text/plain\",
      \"content_base64\": \"$BASE64\"
    }
  }"
```

Respuesta esperada:
```json
{"ok":true,"drive_file_id":"1ABC...","drive_url":"https://..."}
```

Ve a Drive → `Campaigns/` → deberías ver `test.txt`. Si está ahí, el endpoint funciona. Bórralo.

---

## 5.2 Actualizar la skill para usar upload real

Edita `.claude/skills/produce-campaign/generate_assets.ts`. Localiza la función `uploadToDrive` y reemplázala por esta versión real:

```typescript
async function uploadToDrive(
  filePath: string,
  folderId: string,
  fileName: string
): Promise<{ id: string; url: string }> {
  const content = fs.readFileSync(filePath);
  const base64 = content.toString('base64');

  const mimeType = fileName.endsWith('.png') ? 'image/png'
    : fileName.endsWith('.html') ? 'text/html'
    : fileName.endsWith('.txt') ? 'text/plain'
    : 'application/octet-stream';

  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'upload_file',
      token: WEBAPP_TOKEN,
      file: {
        folder_id: folderId,
        filename: fileName,
        mime_type: mimeType,
        content_base64: base64
      }
    })
  });

  const json: any = await res.json();
  if (json.error) {
    throw new Error(`Upload failed: ${json.error} — ${json.detail || ''}`);
  }

  return { id: json.drive_file_id, url: json.drive_url };
}
```

Guarda el archivo.

---

## 5.3 Test end-to-end completo

Ahora hacemos pasar una campaña entera por el sistema. Seguiremos el caso ficticio:

> Laura va a crear una nueva campaña llamada **"Cerveza IPA Primavera"** para Cervezas del Valle.

### 5.3.1 — Preparar el brief (Google Doc)

1. En Drive, dentro de `Campaign Hub/`, crea un Google Doc: "Brief IPA Primavera".
2. Pega este contenido:

```
Brief IPA Primavera 2026

Producto: IPA estacional con lúpulo Cascade de la temporada de primavera.
Notas de cata: cítricas, suave amargor, final limpio.

Contexto: lanzamiento en 6 semanas. Quieren que llegue a gente que
conoce la marca pero no ha probado nunca una IPA.

Tono deseado: alegre pero no ruidoso. Cercano.

Distribución: tienda online + 3 ciudades (Madrid, Barcelona, Valencia)
en bares seleccionados.
```

3. Copia la URL del Doc.

### 5.3.2 — Crear la campaña en el Spreadsheet

Abre el Spreadsheet y en la hoja `Campaigns` añade una fila (empezando en la fila 2):

| Columna | Valor |
|---|---|
| id | *(dejar vacío, el agente lo creará)* |
| name | `IPA Primavera 2026` |
| status | `Ready to brief` |
| owner_email | `laura@cervezasdelvalle.com` (inventa o pon tu email real) |
| approver_email | `carmen@cervezasdelvalle.com` |
| audience | *(dejar vacío — veremos cómo el agente lo rellena)* |
| channels | *(vacío)* |
| brief_doc_url | `[pega aquí la URL del Doc que creaste]` |
| kpis | *(vacío)* |
| approved | ❌ (sin marcar) |
| drive_folder_id | *(vacío)* |
| production_log | *(vacío)* |
| go_live_date | *(opcional: una fecha a 3 días vista)* |
| created_at | *(vacío)* |

**Al cambiar el `status` a "Ready to brief"**, el trigger onEdit debería dispararse.

### 5.3.3 — Observar el agente BriefReviewer actuar

Espera **30-60 segundos** mirando la fila. Deberías ver:

1. La celda `id` se rellena con algo tipo `camp_1745079XXX_a7f3b9`.
2. Aparece un valor en `drive_folder_id`.
3. Las celdas `audience`, `channels`, `kpis` se rellenan (si estaban vacías).
4. `status` cambia a `Brief OK` (o `Needs fix`).
5. `production_log` muestra algo tipo `[2026-04-19T...] BriefReviewer: El brief es coherente con guardrails...`.

**Verificación adicional**:
- Ve a Drive → `Campaign Hub/Campaigns/` → debe haber una carpeta nueva `camp_XXX_IPA_Primavera_2026/` con tres subcarpetas dentro.
- En la hoja `Logs`, debe haber una línea de `BriefReviewer`.

**Si no pasa nada** después de 2 minutos:
- Ve a Apps Script → menú izquierdo → icono **Ejecuciones**. Mira si hay ejecuciones recientes o errores.
- Si no hay ejecuciones: tus triggers no están activos. Vuelve a ejecutar `installTriggers()` en Apps Script.
- Si hay ejecuciones con error: lee el error. Suele ser un ID mal pegado en `Config.gs`.

### 5.3.4 — Aprobar como humano

Si el status es `Brief OK`:
1. Lee lo que el agente rellenó (audience, channels, kpis). Ajusta si no te convence.
2. Marca el checkbox `approved` ✅.

**Esto dispara al Dispatcher** automáticamente. En segundos:

- `status` pasa a `In production`.
- En la hoja `Jobs`, aparece una nueva fila con status `Queued`.
- En Logs: línea de `Dispatcher`.

### 5.3.5 — Claude Code produce los assets

Si tienes la routine activa (Parte 4.5), espera **hasta 5 min**. Si estás probando con cron local o manualmente:

```bash
cd ~/projects/campaign-hub-worker
npx tsx .claude/skills/produce-campaign/generate_assets.ts
```

La salida en terminal:
```
Procesando job job_XXX...
[uploadToDrive] hero_v1.png → folder .../ (real)
... (varias líneas)
✅ Job job_XXX completado: 12 assets
```

Verifica:
- Hoja `Jobs`: status `Done`.
- Hoja `Assets`: 12 filas nuevas (3 hero + 1 landing + 5 copy variants + 3 social). Todas con `qa_status = QA pending`.
- Drive → carpeta de la campaña → subcarpeta `02_assets/` → archivos PNG, HTML, TXT.
- Hoja `Campaigns`: status pasó a `QA`.

### 5.3.6 — QAReviewer revisa automáticamente

Al crearse cada fila en `Assets` con `qa_status = QA pending`, el trigger dispara `QAReviewer`. En **1-2 minutos**, todas las filas deberían tener:
- `qa_status` = `Approved` o `Issues`.
- `qa_notes` con una justificación o lista de problemas.

En la hoja `Logs` verás una línea por asset revisado.

**Si algunos quedan en `Issues`**: el agente detectó algo a arreglar. Lee las `qa_notes`, arregla manualmente el asset (o ignora, para el test) y marca `qa_status = Approved` a mano.

### 5.3.7 — Publisher cierra el ciclo

El Publisher corre cada hora. Para probar sin esperar:

1. Apps Script → archivo `Publisher.gs`.
2. Barra superior → selector de función → `publisher`.
3. Clic en ▶ **Ejecutar**.

Resultado:
- En `Campaigns`, tu campaña pasa a `Live`.
- Si configuraste Slack webhook, recibes mensaje.
- Si pusiste `go_live_date`, se crea evento en Calendar.
- En `production_log`: nueva entrada del Publisher.

**Enhorabuena**: has pasado una campaña entera por el sistema.

---

## 5.4 Tests negativos (provocar errores)

Un sistema solo está listo si sabe fallar bien. Estos tests te ahorran dolores futuros.

### Test 1 — Brief malo

Crea una campaña con un brief vacío o provocador:

```
Producto: la mejor cerveza revolucionaria del mundo,
disruptiva y única, artesanal.
```

Cambia `status` a `Ready to brief`.

**Esperado**: BriefReviewer detecta violación de guardrails (palabras prohibidas: revolucionaria, disruptiva, única, artesanal). Pone `status = Needs fix` y explica en `production_log`.

### Test 2 — API key mal

1. Ve a Script Properties y cambia temporalmente `ANTHROPIC_API_KEY` a `sk-ant-wrong`.
2. Crea una nueva campaña y cambia status a `Ready to brief`.

**Esperado**: el agente falla, pero NO deja la fila colgada. Pone `status = Needs fix` y log con el error 401.

**Después del test**: restaura la API key correcta.

### Test 3 — Job atascado

1. Marca manualmente un job en la hoja `Jobs` como `status = Running` (simula que Claude Code empezó pero se colgó).
2. Espera 15 minutos.
3. Apps Script → ejecuta la función `qaEscalationCheck` manualmente.

**Nota**: la escalation de jobs atascados (no de assets) no está implementada en este MVP. Es una mejora fácil: añade una función que detecte jobs en `Running` más de X tiempo y los marque `Failed`. Si lo quieres, dímelo y te lo añado.

### Test 4 — Race condition

1. Crea 3 campañas a la vez con status `Ready to brief`.
2. Mientras los 3 BriefReviewer procesan, marca 2 de ellas aprobadas rápidamente.

**Esperado**: los 2 Dispatchers crean jobs sin pisarse. Claude Code los procesa en orden FIFO. Ninguna queda sin procesar.

### Test 5 — Token WebApp incorrecto

En tu `.env` pon `WEBAPP_TOKEN=wrong_token` y ejecuta la skill.

**Esperado**: Claude Code recibe `{error: unauthorized}` y el job queda sin procesar. Esto es correcto: el sistema no debería procesar con auth mal.

**Después**: restaura el token.

---

## 5.5 Troubleshooting común

| Síntoma | Causa probable | Fix |
|---|---|---|
| Cambio status y no pasa nada | Triggers no instalados | Ejecuta `installTriggers()` manualmente |
| BriefReviewer falla con "columna X no encontrada" | Cabeceras del Spreadsheet no coinciden exactamente | Revisa las cabeceras de la fila 1 letra por letra |
| "Claude API error 401" | API key inválida | Revisa Script Properties, regenera si hace falta |
| "Claude API error 429" | Rate limit | Normalmente auto-resuelve; si persiste, añade delay |
| Job queda en Queued eternamente | Claude Code no corre | Revisa que la routine/cron está activa con `crontab -l` o logs |
| Job en Running para siempre | Skill falló sin marcar failed | Mejora: añade try/catch más robusto en generate_assets.ts |
| Asset sin `qa_status` | Race: escribió Claude Code pero trigger no disparó | Verifica `writing_in_progress` se está manejando bien |
| Upload a Drive falla | Folder ID mal o permisos | Prueba el endpoint con curl (sección 5.1.3) |
| QAReviewer dice "Issues" a todo | Prompt muy estricto para tu caso | Ajusta `buildQAReviewerPrompt` en `Prompts.gs` |
| Slack no llega | Webhook mal o sin configurar | Recuerda: es opcional. Si no quieres Slack, elimina la Script Property |
| Publisher no ejecuta | Trigger horario no activo | Revisa en Apps Script → Triggers que `publisher` está listado |
| Calendar event no aparece | Falta `go_live_date` o CALENDAR_ID erróneo | `CALENDAR_ID = 'primary'` es lo más común |

---

## 5.6 Revisar el consumo

Después de pasar 5-10 campañas por el sistema, es buen momento de revisar coste:

1. **Anthropic**: `console.anthropic.com` → Usage. Verás tokens consumidos por modelo y día.
2. **Apps Script**: `script.google.com/home/usage` → Ver consumo de tu script (tiempo de ejecución).
3. **Drive**: tu cuota normal de Workspace.

**Orden de magnitud para 10 campañas/mes** con todo lo que produce el sistema actual: 1-3 euros de Anthropic. Si ves mucho más, revisa si hay bucles o fallos que están re-intentando.

---

## 5.7 Comprobación final

- [ ] Pasé una campaña completa de `Ready to brief` a `Live` sin tocar los agentes.
- [ ] Los 4 agentes aparecen ejecutándose en la hoja `Logs`.
- [ ] Drive tiene una carpeta de la campaña con assets reales dentro.
- [ ] Los 5 tests negativos se comportan como se espera.
- [ ] Tengo idea del consumo de tokens por campaña.

Si todo está en orden, pasa a la **Parte 6 · Customizar para otro caso**. Es la parte corta y la más útil para sacarle partido real al sistema.
