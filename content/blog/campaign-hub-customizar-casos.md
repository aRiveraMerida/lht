---
title: "Campaign Hub · Customizar a otros casos"
date: "2026-04-19"
description: "Qué cambia y qué no cuando adaptas el sistema a otro dominio. 5 ejemplos ficticios (SaaS, content creator, academia, consultora, freelance) listos para copiar."
excerpt: "Qué cambia y qué no cuando adaptas el sistema a otro dominio. 5 ejemplos ficticios (SaaS, content creator, academia, consultora, freelance) listos para copiar."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 7
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 6 · Customizar para otro caso

Tienes el sistema funcionando para Cervezas del Valle (o tu equivalente). Ahora: cómo adaptarlo a un caso totalmente distinto **sin empezar de cero**.

**Tiempo estimado**: 30-60 minutos por caso nuevo.

## 6.1 Lo que cambia y lo que no cambia

Esta es la tabla mental más útil que te llevas:

| Parte | ¿Cambia al adaptar? |
|---|---|
| Estructura Drive (carpeta raíz + subcarpeta Campaigns + templates) | No cambia |
| Schema de las 4 hojas (Campaigns, Assets, Jobs, Logs) | **Casi nunca cambia** — puedes añadir columnas propias, pero no tocar las existentes |
| Archivos Apps Script: Utils, ClaudeClient, DriveManager, Triggers, WebApp | No cambian |
| Agentes: BriefReviewer, Dispatcher, QAReviewer, Publisher (lógica) | No cambia |
| `Config.gs` — variables del caso | **Cambia** |
| Brand Guardrails Doc | **Cambia** (contenido del doc) |
| `Prompts.gs` — prompts de Reviewer y QA | **Cambia** (ajuste de dominio) |
| Templates HTML (landing, social) | **Cambia** (opcional) |
| Generadores en `generate_assets.ts` | **Cambia parcialmente** (tipos de asset distintos) |
| Skill `SKILL.md` | **Cambia** (añadir/quitar tipos de asset) |

Lo azul es lo que tocas. Lo demás se queda exactamente igual.

## 6.2 Proceso de adaptación (5 pasos)

### Paso 1 — Define las variables del caso nuevo

Rellena esta plantilla para el nuevo caso antes de tocar nada:

```
CASO              = "..."
OBJETO            = "..."               (lo que produce: "campaña", "lección", "propuesta"...)
UNIDADES_DE_ASSET = [...]               (los tipos de creatividades a producir)
AUDIENCIA         = "..."               (quién usa el sistema)
APROBADOR_HUMANO  = "..."
GUARDRAILS_CAMBIA = [qué partes del doc de marca cambian]
CANAL_NOTIF       = [Slack, email, ninguno...]
```

### Paso 2 — Copia del proyecto actual

**En Drive**: crea una copia del Spreadsheet (clic derecho → Hacer una copia) con el nuevo nombre. Apps Script la copia también y mantiene la estructura.

**En local**: duplica el proyecto:

```bash
cp -r ~/projects/campaign-hub-worker ~/projects/NUEVO-CASO-worker
cd ~/projects/NUEVO-CASO-worker
```

### Paso 3 — Edita los 4 puntos de cambio

1. **`Config.gs`**: cambia CASO, OBJETO, UNIDADES_DE_ASSET, IDs.
2. **Brand Guardrails Doc**: reescribe contenido.
3. **`Prompts.gs`**: ajusta prompts al dominio.
4. **`generate_assets.ts` + SKILL.md**: añade/quita funciones según nuevos tipos de asset.

### Paso 4 — Redeploy del WebApp (nuevo deployment)

Tras cambios en Apps Script → Deploy → Manage → New version.

### Paso 5 — Pasa 1 caso real para validar

No presumas que funciona. Ejecuta un caso completo y verifica.

## 6.3 Cinco ejemplos ficticios de adaptación

Los casos son inventados. Úsalos como patrón para tu caso real.

### Ejemplo 1 — "Product Launch Hub" para una startup SaaS

**Contexto ficticio**: startup "Nimbus Analytics" lanza cada trimestre una feature nueva. Cada lanzamiento requiere landing, comunicado de prensa, secuencia de emails y changelog.

**Variables**:

```
CASO              = "Product Launch Hub"
OBJETO            = "lanzamiento"
UNIDADES_DE_ASSET = ["landing_page", "press_release", "email_sequence", "changelog_doc"]
APROBADOR_HUMANO  = "Product Marketing Lead"
```

**Guardrails cambian**:
- Tono: "técnico pero accesible, evitamos jerga marketing".
- Prohibidos: exageraciones, comparativas con competidores.
- Añade sección "Templates de mensaje" con las estructuras de press release, email, etc.

**Prompt QA añade**:
- Verificar que no hay commitments sobre fechas futuras ("pronto", "próximamente" — palabras peligrosas para una startup).
- Check de que las features mencionadas existen en el changelog oficial.

**Generadores nuevos**:
- `generatePressRelease`: usa Claude para estructurar en formato AP style, sube como Google Doc (no HTML).
- `generateEmailSequence`: genera 4 emails con 3-7 días de separación, devuelve un array.
- `generateChangelog`: formato markdown, sube como .md a Drive.

**Generadores a quitar**: `generateSocialPost`, `generateHeroImage` (no los usan).

### Ejemplo 2 — "Content Publishing Hub" para creador personal

**Contexto ficticio**: creador "Sergio Rondán" (inventado) publica en LinkedIn + newsletter. Cada post va acompañado de imagen, versión adaptada a newsletter y thread de Twitter.

**Variables**:

```
CASO              = "Content Publishing Hub"
OBJETO            = "post"
UNIDADES_DE_ASSET = ["post_draft", "hero_image", "newsletter_version", "twitter_thread"]
APROBADOR_HUMANO  = "El propio autor"
```

**Guardrails cambian**:
- Tono muy personal: "primera persona, anécdotas reales, opiniones frontales".
- Sección nueva: "Voz del autor" con muestras de textos pasados bien puntuados.
- Prohibidos: "en este post voy a...", "¿alguna vez te has preguntado...?" (clichés de LinkedIn).

**Schema de Spreadsheet**: añade columna `tema_pilar` a la hoja `Campaigns` con valores como `adopción IA`, `crítica producto`, `aprendizaje`. Permite filtrar fácilmente.

**Prompts**:
- BriefReviewer incluye: "verifica que el tema encaja con uno de los pilares del autor".
- QAReviewer es más exigente con voz: "si la frase pudiese ser escrita por cualquier otra persona del sector, marca Issues".

**Generadores**:
- `generatePostDraft`: Claude API → genera 3 variantes del post en markdown, sube como Doc.
- `generateHeroImage`: mantiene el existente pero con paleta del autor.
- `generateNewsletterVersion`: coge el post y lo expande (+40% palabras), añade CTA a newsletter.
- `generateTwitterThread`: trocea el contenido en 6-10 tweets.

### Ejemplo 3 — "Training Production Hub" para academia

**Contexto ficticio**: academia "Núcleo Digital" produce cursos cortos. Cada módulo nuevo necesita: guion de video, slides, quiz, y paquete SCORM para subir al LMS.

**Variables**:

```
CASO              = "Training Production Hub"
OBJETO            = "módulo"
UNIDADES_DE_ASSET = ["video_script", "slides_deck", "quiz", "scorm_package"]
APROBADOR_HUMANO  = "Coordinador Pedagógico"
```

**Cambios radicales respecto al hub de campañas**:
- El schema de `Campaigns` pasa a llamarse semánticamente `Modules`. En la práctica **mantienes el nombre** de la hoja (`Campaigns`) por simplicidad y cambias el `OBJETO` en Config. La hoja sigue siendo la misma.
- Añade columnas: `nivel` (básico/intermedio/avanzado), `duracion_min`, `objetivos_aprendizaje`.

**Guardrails cambian totalmente**:
- Sección "Principios pedagógicos" (Bloom's taxonomy, aprendizaje activo...).
- Sección "Restricciones": cada quiz debe tener mínimo 5 preguntas, máximo 10.

**Prompts**:
- BriefReviewer verifica que los objetivos de aprendizaje están en formato verbo-observable ("el alumno podrá identificar...", no "el alumno entenderá...").
- QAReviewer incluye revisión pedagógica: "¿cada concepto se presenta, se aplica y se evalúa?".

**Generadores radicalmente distintos**:
- `generateVideoScript`: Claude → markdown con timecodes, sube como Doc.
- `generateSlidesDeck`: genera HTML slides (reveal.js o similar) + captura cada slide como PNG.
- `generateQuiz`: JSON con preguntas/respuestas, guarda como `.json`.
- `generateSCORMPackage`: empaqueta todo en ZIP con manifest.xml estándar SCORM. Usa librería `scorm-again` o similar.

### Ejemplo 4 — "Client Proposal Hub" para consultora

**Contexto ficticio**: consultora "Arcadia Advisors" produce propuestas para RFPs de clientes. Cada propuesta requiere resumen ejecutivo, arquitectura técnica, pricing y timeline.

**Variables**:

```
CASO              = "Client Proposal Hub"
OBJETO            = "propuesta"
UNIDADES_DE_ASSET = ["executive_summary", "technical_approach", "pricing_model", "timeline_gantt"]
APROBADOR_HUMANO  = "Managing Partner"
```

**Especial**: las propuestas son muy confidenciales. Usa una **cuenta de Google Workspace separada** con compartición restringida. Los permisos de la carpeta Campaigns deben ser solo para el equipo interno.

**Columnas nuevas en `Campaigns`**:
- `client_name` (cliente al que se presenta).
- `rfp_doc_url` (link al RFP original, lo lee el BriefReviewer para alinear).
- `contract_value_eur` (para priorizar visualmente).

**Guardrails cambian**:
- Sección "Tono corporativo": lenguaje formal, impersonal.
- "Cláusulas estándar": texto legal que siempre va en las propuestas.
- "Palabras prohibidas" diferentes: evitar commitments absolutos ("garantizamos", "100%").

**Prompts**:
- BriefReviewer lee el RFP + guardrails. Verifica que la propuesta responde a cada requirement del RFP.
- QAReviewer: checklist contra RFP + coherencia precios/timeline.

**Generadores**:
- `generateExecutiveSummary`: Claude API → Doc de 1-2 páginas, exporta como PDF.
- `generateTechnicalApproach`: Doc de 5-15 páginas con diagramas (descritos en markdown, convertidos a imagen con Mermaid).
- `generatePricingModel`: XLSX con tabla de pricing, generado con librería `exceljs`.
- `generateTimelineGantt`: imagen PNG del Gantt usando una librería de gráficos o HTML+Playwright.

**Notificaciones**: aquí Slack no tiene sentido si es confidencial. Reemplaza por email a un grupo interno específico.

### Ejemplo 5 — "Campaign Hub Minimalista" para freelance

**Contexto ficticio**: Marta es freelance diseñadora. Para cada cliente pequeño quiere automatizar solo la parte repetitiva: tomar un brief y devolver 3 opciones de mock-up.

**Variables**:

```
CASO              = "Freelance Mockup Hub"
OBJETO            = "pedido"
UNIDADES_DE_ASSET = ["mockup_v1", "mockup_v2", "mockup_v3"]
APROBADOR_HUMANO  = "Marta (la freelance)"
```

**Simplificación**: solo hay un tipo de asset (mockup), con 3 variantes. Lo demás no se genera.

**Cambios**:
- `generate_assets.ts` reduce a **una sola función**: `generateMockup`.
- `UNIDADES_DE_ASSET` técnicamente es solo `["mockup"]`, y la función genera 3 variantes internamente.

**Guardrails**:
- Sección "Estilos de Marta": paleta, tipografías, estilo visual característico.
- Sección "Reglas por tipo de cliente": si el cliente es "restaurante" aplica unos criterios; si es "app" otros; si es "personal brand" otros.

**BriefReviewer** verifica que el brief identifica el tipo de cliente para que QA pueda aplicar las reglas correctas.

**Flujo**: brief → 3 mockups → Marta revisa y elige uno → envía al cliente manualmente. El sistema no publica nada solo.

## 6.4 Tabla resumen comparativa

| Caso | Tipos de asset | Usuario | Tono QA | Apto para… |
|---|---|---|---|---|
| Campaign Hub (original) | imagen hero, landing, copy, social | equipo marketing | equilibrado | marca con cadencia de campañas |
| Product Launch Hub | landing, press, email, changelog | Product Marketing | técnico-preciso | SaaS con feature releases |
| Content Publishing | post, imagen, newsletter, thread | creador individual | muy personal | personal brand, newsletter |
| Training Production | script, slides, quiz, SCORM | academia/L&D | pedagógico | edtech, formación corporativa |
| Client Proposal Hub | summary, approach, pricing, Gantt | consultora | corporativo/legal | servicios profesionales |
| Freelance Mockup | 3 mockups | freelance | estilo personal | servicios visuales pequeños |

## 6.5 Patrón general de adaptación (resumen en 6 líneas)

```
1. Copia el Spreadsheet y el proyecto local.
2. Cambia el Guardrails Doc al nuevo dominio.
3. Actualiza Config.gs (CASO, OBJETO, UNIDADES_DE_ASSET).
4. Reescribe los 2 prompts en Prompts.gs con lenguaje del nuevo dominio.
5. Añade/quita generadores en generate_assets.ts según los nuevos tipos de asset.
6. Redeploy WebApp (New version). Prueba con 1 caso real.
```

Si te mantienes en el patrón, cada caso nuevo son 30-60 min.
Si te sales del patrón (cambias columnas del schema, añades más agentes, cambias la dirección del flujo), son varias horas y el riesgo de romper algo sube.

**Regla**: siempre que puedas, ajusta prompts y generadores. No cambies la infraestructura (agentes, schema, WebApp). La infraestructura es sagrada.

## 6.6 Checklist de caso nuevo

Antes de dar por bueno un caso adaptado:

- [ ] Config.gs tiene los IDs del nuevo Spreadsheet y Guardrails.
- [ ] Brand Guardrails Doc está escrito con los criterios del dominio.
- [ ] Los 2 prompts de `Prompts.gs` usan vocabulario del nuevo dominio.
- [ ] Los generadores producen los tipos declarados en `UNIDADES_DE_ASSET`.
- [ ] Hice un test end-to-end con un caso ficticio del dominio.
- [ ] El coste por caso está en el rango esperado (mido en Anthropic Usage).
- [ ] Documenté qué cambié vs el sistema original (en un README).

Cuando todos los checkboxes estén marcados, tu sistema está listo para ese caso.

## 6.7 Qué viene después

Cuando domines la adaptación, hay mejoras opcionales que no tocan el core pero añaden valor:

1. **Dashboard visual**: añadir un Data Studio / Looker Studio conectado al Spreadsheet para ver métricas (campañas por mes, tiempo medio de producción, tasa de fallo).

2. **Notificaciones más finas**: email al aprobador cuando hay algo pendiente, recordatorio si una campaña lleva X días sin avanzar.

3. **Regeneración selectiva**: en lugar de "pass/fail" por asset, añadir una acción "regenerar" que vuelva a encolar solo ese asset.

4. **Aprendizaje continuo**: cada vez que un humano corrige un asset aprobado por QA, guardarlo en una hoja `QA_Corrections`. Periódicamente, dar estas correcciones al agente como few-shots para mejorarlo.

5. **Multi-tenant**: si quieres un único sistema que sirva a varios clientes, añade una columna `client_id` y filtra todo por ese valor. Cada cliente ve solo sus campañas.

Todas estas son de segundo orden. Primero: **dominar el sistema base en un caso real tuyo**. Luego, si lo necesitas, ampliar.

## 6.8 Cierre del laboratorio

Has construido un sistema que:

- Recibe un brief humano.
- Lo valida contra reglas de marca.
- Produce creatividades automáticamente.
- Las revisa y las publica.
- Se adapta a distintos dominios sin rehacer la infraestructura.

Si has seguido las 6 partes, tienes un sistema funcional, no una demo. **La clave del valor no es el sistema: es el ritual de pasar casos reales por él y mejorar los prompts y guardrails con la experiencia acumulada.** Un sistema mediocre con guardrails afinados durante 3 meses supera a un sistema perfecto con guardrails genéricos.

Dale uso, mide lo que pasa, ajusta los prompts cada vez que veas un fallo, y en 2-3 meses tendrás una herramienta afinada para tu realidad.
