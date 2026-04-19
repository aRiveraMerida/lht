---
title: "Campaign Hub · Introducción"
date: "2026-04-19"
description: "Qué vamos a construir, la analogía de la cocina profesional y el caso ficticio \"Cervezas del Valle\" que usaremos durante toda la guía."
excerpt: "Qué vamos a construir, la analogía de la cocina profesional y el caso ficticio \"Cervezas del Valle\" que usaremos durante toda la guía."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 1
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Parte 0 · Introducción

## Qué vamos a construir

Un sistema que automatiza todo el ciclo de una campaña de marketing: desde que alguien escribe un brief en una hoja de cálculo, hasta que los assets (imágenes, landing, textos) están producidos, revisados y publicados.

El sistema tiene **dos mitades que colaboran**:

1. **La mitad Google** (Sheets + Drive + Apps Script): es el cerebro. Guarda el estado de todo, recibe los inputs de humanos, decide qué pasa a continuación.
2. **La mitad Claude Code**: es el taller. Cuando el cerebro dice "necesito estos 4 assets", el taller los produce y los devuelve.

Entre las dos mitades hay un **pasaplatos**: un endpoint HTTP que sirve de buzón. El cerebro deja mensajes ahí, el taller los recoge, trabaja, y deja resultados.

---

## Analogía para entenderlo de golpe

Imagina una **cocina de restaurante**:

- **La hoja de cálculo `Campaigns`** es el libro de comandas. Cada fila es un pedido.
- **Los 4 agentes de Apps Script** son 4 roles de cocina:
  - El **jefe de sala** (BriefReviewer) revisa que la comanda tenga sentido antes de pasarla a cocina.
  - El **expedidor** (Dispatcher) pasa la comanda firmada a la cocina.
  - El **catador** (QAReviewer) prueba el plato antes de que salga.
  - El **camarero** (Publisher) lleva el plato a la mesa y avisa al cliente.
- **Claude Code** es el cocinero. Solo cocina. No habla con clientes, no decide qué cocinar, solo ejecuta la receta cuando le pasan una comanda.
- **Google Drive** es la despensa y el pase donde se apoyan los platos terminados.
- **Brand Guardrails** es el recetario: lo que sí y lo que no se puede cocinar.

Si entiendes esta analogía, entiendes el sistema entero.

---

## Caso ficticio que usaremos

Para que sea concreto, vamos a acompañar toda la guía con un mismo ejemplo inventado:

> **Empresa**: "Cervezas del Valle" (ficticia).
> Sector: cervecería artesanal.
> Lanzan cada mes una **campaña de una cerveza nueva**. Cada campaña necesita:
> - Una **imagen hero** para redes y landing.
> - Una **landing page** explicando la cerveza.
> - **Textos (copy)** para Instagram, LinkedIn y newsletter.
> - **Tres posts sociales** ya maquetados.
>
> El equipo es de 3 personas: Laura (marketing), Martín (diseño), Carmen (directora, aprueba todo).

Cuando veas `Cervezas del Valle`, `Laura`, `Martín` o `Carmen` a lo largo de la guía, son ejemplos inventados para que todo se entienda.

---

## Qué hará el sistema en un día real

Trazamos un día en la vida de una campaña ficticia llamada **"Lanzamiento IPA de Primavera"**:

```
10:00  Laura abre el Spreadsheet y crea una fila:
       name = "IPA de Primavera"
       status = "Ready to brief"
       [escribe el brief en un Google Doc y pega el link]

10:00:30  El agente BriefReviewer detecta la nueva fila.
          Lee el brief + las reglas de marca.
          Detecta que faltaba "audiencia" → la propone: "30-45, urbano, foodie".
          Marca status = "Brief OK".

10:15  Carmen (directora) ve la notificación.
       Revisa el brief. Le parece bien.
       Marca el checkbox "approved".

10:15:10  El agente Dispatcher detecta approved=true + status=Brief OK.
          Crea una carpeta en Drive: "IPA_Primavera_abril_2026/"
          Deja un "pedido" en la hoja Jobs para que Claude Code lo recoja.
          Cambia status = "In production".

10:20  Claude Code (que corre cada 5 min) recoge el pedido.
       Lee brief + guardrails.
       Produce:
          - 3 variantes de imagen hero
          - 1 landing page HTML
          - 9 textos (3 variantes × 3 canales)
          - 3 posts sociales en PNG
       Sube todo a la carpeta Drive.
       Escribe 16 filas en la hoja Assets.

10:42  Claude Code termina.
       Cada fila de Assets tiene qa_status = "QA pending".

10:42:15  QAReviewer revisa cada asset contra los guardrails.
          15 pasan a "Approved".
          1 texto usa una palabra prohibida → marca "Issues" y notifica a Slack.

10:50  Laura ve la notificación en Slack.
       Arregla el texto (o le dice al sistema que lo regenere).
       Marca manualmente qa_status = "Approved".

11:00  El agente Publisher (que corre cada hora) detecta que los 16 assets
       están en Approved.
       Cambia status de la campaña a "Live".
       Manda un resumen a Slack.
       Crea un evento en Google Calendar con la fecha de go-live.
```

**Total de intervención humana**: 3 momentos (crear brief, aprobar brief, aprobar assets). El resto es automático.

---

## Qué NO vamos a construir

Para que quede claro el alcance:

- **No construimos una web pública**. La landing page se genera como HTML y se guarda en Drive. Si quieres publicarla de verdad en internet, hay que añadir un paso de deploy (lo vemos en la Parte 6 como opcional).
- **No construimos un diseñador visual**. Las imágenes "hero" que genera el ejemplo son simples (gradientes con texto). Si quieres imágenes de calidad real, tienes que conectar un modelo de imagen (DALL-E, Stable Diffusion, Imagen). Explicamos dónde enchufarlo.
- **No construimos algo que funcione solo en el teléfono**. Esto es un backoffice. Los humanos que aprueban lo hacen desde el ordenador.

---

## Las 6 partes de esta guía

| Parte | Qué hacemos | Tiempo estimado |
|---|---|---|
| **0 · Introducción** (estás aquí) | Contexto y caso | 10 min de lectura |
| **1 · Conceptos y vocabulario** | Qué es Apps Script, MCP, agente, trigger | 15 min lectura |
| **2 · Preparar Google** | Crear Drive, Spreadsheet, Brand Guardrails | 30 min práctica |
| **3 · Los 4 agentes en Apps Script** | El cerebro del sistema | 45 min práctica |
| **4 · Claude Code y la skill de producción** | El taller | 45 min práctica |
| **5 · Probar el sistema end-to-end** | Validar que todo funciona | 30 min práctica |
| **6 · Customizar para otro caso** | Adaptarlo sin empezar de cero | 30 min práctica |

**Total**: unas 4 horas la primera vez. Luego replicar a un caso nuevo son 30-60 min.

---

## Prerrequisitos mínimos

No hace falta ser desarrollador, pero sí estar cómodo con:

- **Copiar/pegar código** sin entenderlo al 100% (la guía explica qué hace cada bloque).
- **Seguir instrucciones paso a paso** sin saltar.
- **Google Workspace** con permisos para crear Spreadsheets, Apps Script y Service Accounts. Si tu cuenta es personal (@gmail.com) vale. Si es de empresa, necesitas que el admin no bloquee Apps Script.
- **Una cuenta de Claude.ai Pro o Max** (para usar Claude Code con Routines).
- **Una API key de Anthropic** (console.anthropic.com, con ~10€ de crédito inicial es de sobra para probar).
- **Un terminal** donde ejecutar comandos (Mac, Linux, o Windows con WSL).

Si algo de esto no lo tienes, la Parte 1 indica cómo conseguirlo.

---

## Cómo seguir la guía

**Regla importante**: haz las Partes 0, 1 y 2 aunque te parezcan lentas. La Parte 3 asume que ya tienes montado lo de la 2. Si te saltas, vas a perder más tiempo del que ahorras.

**Cuando estés listo**, abre la Parte 1 y empieza.
