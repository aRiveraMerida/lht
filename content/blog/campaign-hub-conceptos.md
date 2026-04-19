---
title: "Campaign Hub · Conceptos y vocabulario"
date: "2026-04-19"
description: "Agente, trigger, API key, MCP, webhook, skill. El vocabulario mínimo para entender lo que viene, explicado sin asumir conocimiento previo."
excerpt: "Agente, trigger, API key, MCP, webhook, skill. El vocabulario mínimo para entender lo que viene, explicado sin asumir conocimiento previo."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 2
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 1 · Conceptos y vocabulario

Antes de tocar nada, nos aseguramos de que sabemos qué significa cada palabra. Si alguno de estos conceptos ya lo tienes claro, salta al siguiente. Si aparece una palabra rara en las siguientes partes, vuelve aquí.


## 1.1 ¿Qué es un "agente"?

Un agente, en este contexto, **no es un programa grande ni complejo**. Es simplemente:

> **Un fragmento de código que se dispara cuando pasa algo, mira un contexto, toma una pequeña decisión, y actúa.**

Ejemplo con el caso de Cervezas del Valle:

- **Pasa algo**: Laura cambia el `status` de una fila a "Ready to brief".
- **Mira un contexto**: el agente lee la fila + lee las reglas de marca.
- **Toma una pequeña decisión**: "el brief no menciona el público objetivo, lo propongo yo".
- **Actúa**: escribe la propuesta en la celda `audience`, cambia el `status` a "Brief OK".

Eso es un agente. Nada más.

En nuestro sistema hay **4 agentes**, cada uno con un trabajo muy concreto:

| Agente | Se dispara cuando… | Hace… |
|---|---|---|
| **BriefReviewer** | El `status` cambia a "Ready to brief" | Revisa el brief y lo valida |
| **Dispatcher** | `status`="Brief OK" + `approved`=true | Pasa el trabajo a la cola |
| **QAReviewer** | Un asset nuevo pasa a "QA pending" | Revisa calidad del asset |
| **Publisher** | Cada hora (timer) | Publica campañas listas |

**Punto clave**: cada agente hace *una cosa*. No mezclamos. Si un agente hace 3 cosas, lo partimos en 3 agentes. Esto facilita depurar cuando algo falla.


## 1.2 ¿Qué es Apps Script?

**Apps Script** es un lenguaje de programación (una variante de JavaScript) que vive dentro de Google Workspace.

Lo importante para nuestro caso:

- **No necesitas servidor propio**: el código corre en los servidores de Google.
- **Está pegado a tus documentos**: cada Spreadsheet puede tener su propio Apps Script.
- **Reacciona a eventos**: puede dispararse cuando alguien edita una celda, abre el documento, o a una hora fija.
- **Gratis** hasta cuotas generosas (para nuestro volumen, nunca las tocarás).

Donde vive:

```
Tu Spreadsheet "Campañas"
 └── Menú Extensions → Apps Script
      └── Aquí escribimos el código de los 4 agentes
```

**No temas el código**. En la Parte 3 te paso los archivos completos. Tú solo copias, pegas y ajustas 4 variables.


## 1.3 ¿Qué es un "trigger"?

Un **trigger** es el gatillo que dispara un agente. En Apps Script hay dos tipos que usaremos:

### Trigger `onEdit`

> Se dispara cada vez que un humano edita una celda del Spreadsheet.

El agente recibe información de **qué se editó** (qué hoja, qué celda, qué valor nuevo). Con eso decide si le interesa o no.

Ejemplo:
- Laura cambia `status` a "Ready to brief" en la fila 5.
- El trigger `onEdit` dispara una función (escrita por nosotros) que recibe: "hoja=Campaigns, fila=5, columna=status, valor=Ready to brief".
- Nuestra función dice: "ah, valor=Ready to brief → esto es para BriefReviewer" y llama al agente.

### Trigger `time-based`

> Se dispara cada X tiempo (cada hora, cada día, cada 5 minutos).

Lo usamos para el **Publisher**, que no reacciona a un edit sino que patrulla periódicamente:
- Cada hora, el Publisher recorre las campañas en status "QA" y ve si están listas para publicar.


## 1.4 ¿Qué es una API y qué es una "API key"?

Una **API** es la puerta de entrada para que un programa hable con otro programa.

Cuando nuestros agentes necesitan "pensar" (revisar un brief, evaluar calidad), llaman a la **API de Anthropic** para pedirle a Claude que haga esa evaluación.

La **API key** es como la contraseña que identifica quién está haciendo la llamada. Es imprescindible y hay que tratarla con cuidado:

- **NO** la pegues en el código fuente directamente.
- **NO** la compartas ni la subas a GitHub.
- **SÍ** la guardas en un lugar seguro (en Apps Script hay un sitio especial llamado "Script Properties").

Para conseguir tu API key:
1. Ve a `console.anthropic.com`.
2. Regístrate (si no lo has hecho).
3. Añade saldo inicial (con 5-10€ de crédito vas sobrado para probar).
4. Sección "API keys" → "Create key" → copia el valor (empieza por `sk-ant-...`).

**Atención**: la key se muestra **una sola vez**. Si la pierdes, tienes que crear una nueva.


## 1.5 ¿Qué es MCP?

**MCP** (Model Context Protocol) es una forma estandarizada de que Claude Code pueda usar herramientas externas.

Analogía: si Claude Code es un trabajador, MCP son los enchufes de la pared. Cada herramienta externa (Google Sheets, Google Drive, Playwright...) tiene un enchufe MCP. Conectas los enchufes que necesitas y Claude Code puede usarlos.

**En nuestro laboratorio, vamos a evitar MCPs complicados**. En lugar de conectar Claude Code directamente a Google Sheets con un MCP, vamos a usar un truco más simple (un "webhook", lo explico ya).


## 1.6 ¿Qué es un "webhook" / "endpoint HTTP"?

Un **endpoint HTTP** es simplemente una **URL que, cuando alguien la visita, ejecuta código**.

Ejemplo simple:
- URL: `https://miservicio.com/api/saludar`
- Alguien la visita con el parámetro `?nombre=Laura`.
- En el servidor hay un código que dice: "cuando me visiten en `/api/saludar`, responde con 'Hola, {nombre}'".
- El visitante recibe: "Hola, Laura".

En nuestro sistema, haremos que **Apps Script exponga una URL pública** con varias "acciones":
- `?action=next_job` → devuelve el siguiente trabajo pendiente.
- `POST action=mark_done` → marca un trabajo como completado.
- `POST action=create_asset` → añade una fila a la hoja de assets.

Claude Code usa esas URLs como quien manda mensajes. **No necesita conocer Google Sheets directamente**, solo sabe dos cosas: la URL base y un token secreto.

Esto se llama **"WebApp" en Apps Script** y lo vamos a montar paso a paso en la Parte 3.

## 1.7 ¿Qué es Claude Code?

**Claude Code** es la herramienta de Anthropic para usar Claude desde el terminal, con acceso a tu sistema de archivos y a herramientas externas.

No confundir:
- **Claude.ai** (la web): chat conversacional.
- **Claude Code** (el CLI): Claude con "manos" para ejecutar comandos, leer/escribir archivos, llamar APIs.

Para nuestro sistema, Claude Code es **el cocinero**. Cuando recibe un pedido, él solo sabe:
1. Ir a buscar el pedido al "buzón" (el WebApp de Apps Script).
2. Cocinar (generar los assets).
3. Guardarlos en Drive.
4. Avisar al buzón de que ya está.

**Claude Code Routine** es una función que permite que Claude Code se ejecute solo cada X minutos, sin que tú le digas nada. Esto es lo que hace que el sistema funcione automáticamente.

## 1.8 ¿Qué es un "Service Account" de Google?

Cuando tú entras en Google Sheets con tu navegador, te identificas con tu cuenta personal (`laura@cervezasdelvalle.com`, por ejemplo).

Cuando un programa (Claude Code, en nuestro caso) necesita entrar en Sheets o Drive sin que haya un humano haciendo login, usamos un **Service Account**: es como una "cuenta de empleado robot". Tiene su propio email (algo tipo `campaign-bot@mi-proyecto.iam.gserviceaccount.com`) y su propia forma de identificarse (un archivo JSON).

**En este laboratorio NO usaremos Service Account** para simplificar. En lugar de eso, Claude Code habla con Apps Script vía WebApp (el webhook que explicamos arriba), y Apps Script habla con Sheets y Drive en nombre del humano que lo desplegó.

**Menos piezas = menos cosas que se rompen.**

## 1.9 ¿Qué es una "skill" de Claude Code?

Una **skill** es un conjunto de instrucciones + código que le enseñan a Claude Code **cómo hacer una tarea específica**.

Por ejemplo, nuestra skill se llama `produce-campaign`. Cuando Claude Code la activa, sabe:
- Cómo pedirle al buzón el siguiente trabajo.
- Cómo generar cada tipo de asset.
- Cómo subirlo a Drive.
- Cómo avisar cuando termina.

Una skill vive en una carpeta con esta estructura:

```
produce-campaign/
  SKILL.md            ← Instrucciones en lenguaje natural (qué hacer, cuándo usarla)
  generate_assets.ts  ← Código de apoyo (funciones auxiliares)
  templates/          ← Plantillas HTML para landing, social posts, etc.
```

## 1.10 Vocabulario visual del sistema completo

```
┌──────────────────────────────────────────────────────────────┐
│                    GOOGLE WORKSPACE                           │
│                                                                │
│   📄 Spreadsheet "Campañas"                                   │
│   ├── Hoja Campaigns   ← filas = campañas                     │
│   ├── Hoja Assets      ← filas = cada creatividad             │
│   ├── Hoja Jobs        ← cola de trabajos para Claude Code    │
│   └── Hoja Logs        ← historial de decisiones              │
│                                                                │
│   📁 Drive "Campaign Hub"                                     │
│   ├── 📄 Brand Guardrails (Google Doc)                        │
│   └── 📁 Campaigns/                                            │
│        └── 📁 IPA_Primavera/     ← una carpeta por campaña   │
│             ├── 01_brief/                                      │
│             ├── 02_assets/       ← aquí van las creatividades│
│             └── 03_final/                                      │
│                                                                │
│   🤖 Apps Script (detrás del Spreadsheet)                     │
│   ├── Agente BriefReviewer                                     │
│   ├── Agente Dispatcher                                        │
│   ├── Agente QAReviewer                                        │
│   ├── Agente Publisher                                         │
│   └── WebApp (endpoint público) ←─ buzón para Claude Code    │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                            ▲
                            │ HTTPS (con token secreto)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE                                │
│                                                                │
│   🔁 Routine "campaign-producer" (cada 5 min)                 │
│        ↓                                                       │
│   Ejecuta la skill "produce-campaign":                        │
│     1. GET {WebApp}?action=next_job                           │
│     2. Si hay job → lo procesa                                │
│     3. Genera assets (imágenes, copy, landing, posts)         │
│     4. Sube a Drive (vía WebApp)                              │
│     5. POST {WebApp} action=mark_done                         │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

Esto es TODO lo que hay que entender del sistema. Si memorizas este diagrama, sabes dónde vive cada cosa.

## 1.11 Resumen de la Parte 1

Antes de pasar a la Parte 2, comprueba que puedes responder a estas preguntas sin mirar:

1. ¿Qué es un agente?
2. ¿Dónde viven los 4 agentes?
3. ¿Qué dispara a un agente: una edición del humano o un timer?
4. ¿Dónde guardamos la API key para que sea segura?
5. ¿Para qué sirve el "WebApp" / endpoint HTTP?
6. ¿Qué hace Claude Code en el sistema, en una frase?
7. ¿Dónde se guardan las creatividades terminadas?

Si respondes a las 7 con comodidad, adelante con la **Parte 2**.
Si no, relee las secciones correspondientes antes de avanzar. Es el momento de ir despacio.
