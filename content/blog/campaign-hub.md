---
title: "Campaign Hub — Google + Claude Code"
date: "2026-04-19"
description: "Un laboratorio práctica de 6 partes para montar un sistema que automatiza el ciclo completo de producción de campañas con Google Sheets + Apps Script + Claude Code. Caso ficticio, código copiable, ~4h la primera vez."
excerpt: "Un laboratorio práctica de 6 partes para montar un sistema que automatiza el ciclo completo de producción de campañas con Google Sheets + Apps Script + Claude Code. Caso ficticio, código copiable, ~4h la primera vez."
category: "Laboratorios"
authors:
  - alberto-rivera
featured: false
series: "campaign-hub"
seriesOrder: 0
seriesTitle: "Campaign Hub · Google + Claude Code"
image: "/favicon.svg"
---

# Laboratorio Campaign Hub — Google + Claude Code

**Qué es esto**: un laboratorio práctica de 6 partes para montar, desde cero, un sistema que automatiza el ciclo completo de producción de campañas (o contenido, propuestas, módulos formativos...) usando Google Sheets + Google Drive + Apps Script + Claude Code.

**Para quién**: alguien que entiende de tecnología sin ser desarrollador. No hace falta saber programar; hay que saber copiar, pegar y seguir instrucciones.

**Tiempo total**: ~4 horas la primera vez. 30-60 min para adaptar a un nuevo caso después.

**Caso ficticio** que usamos durante todo el laboratorio: "Cervezas del Valle", una cervecería artesanal inventada que lanza una IPA cada trimestre. Los nombres, emails y datos que aparecen son todos inventados.

---

## Las 6 partes

| Parte | Archivo | Qué hace | Tiempo |
|---|---|---|---|
| **0 · Introducción** | `00-introduccion.md` | Contexto, analogía, caso ficticio, qué sí y qué no construimos | 10 min lectura |
| **1 · Conceptos y vocabulario** | `01-conceptos.md` | Qué es un agente, trigger, API key, MCP, webhook, skill... explicado sin asumir conocimiento previo | 15 min lectura |
| **2 · Preparar Google** | `02-preparar-google.md` | Crear estructura Drive, Brand Guardrails, Spreadsheet con validaciones | 30 min práctica |
| **3 · Los 4 agentes en Apps Script** | `03-apps-script-agentes.md` | Copiar 11 archivos de código, instalar triggers, desplegar WebApp | 45 min práctica |
| **4 · Claude Code y la skill** | `04-claude-code-skill.md` | Instalar Claude Code, crear proyecto local, skill de producción, routine | 45 min práctica |
| **5 · Probar end-to-end** | `05-probar-end-to-end.md` | Upload real a Drive, test completo con caso ficticio, tests negativos, troubleshooting | 30 min práctica |
| **6 · Customizar para otro caso** | `06-customizar-casos.md` | Qué cambia y qué no. 5 ejemplos ficticios adaptados (SaaS, content creator, academia, consultora, freelance) | 30-60 min práctica |

---

## Orden recomendado de lectura

1. **Lee la Parte 0 completa** antes de nada. Te da el mapa mental.
2. **Lee la Parte 1** aunque algunos términos ya los conozcas. Asegúrate de que compartimos vocabulario.
3. **Haz las Partes 2, 3, 4, 5 en orden estricto.** No saltes. Cada una depende de la anterior.
4. **La Parte 6** la haces cuando tienes el sistema funcionando con el caso original y quieres adaptarlo.

---

## Prerrequisitos

- Google Workspace (cuenta personal @gmail también sirve).
- Cuenta Claude.ai Pro o Max.
- API key de Anthropic con 5-10€ de saldo.
- Node.js 20+ instalado en tu máquina.
- Terminal (Mac, Linux, o WSL en Windows).

---

## Cómo usar el laboratorio

- **Imprimibles**: los archivos son Markdown plano. Puedes convertirlos a PDF fácilmente.
- **Variables**: cuando veas `{MAYÚSCULAS_ENTRE_LLAVES}` es un placeholder que sustituyes por tu valor.
- **Ejemplos ficticios**: cuando veas `Cervezas del Valle`, `Laura`, `Martín`, `IPA Primavera`, es inventado para ilustrar. Adáptalo a tu realidad.
- **Checklists finales**: cada parte tiene una al final. Si no puedes marcar todas las casillas, no avances — vuelve atrás.

---

## Qué vas a tener al terminar

Un sistema que:

- Permite crear campañas (u objetos equivalentes) escribiendo filas en un Spreadsheet.
- Valida briefs automáticamente contra reglas de marca.
- Produce creatividades (imágenes, landings, copy, posts sociales) sin intervención humana.
- Revisa calidad automáticamente y marca issues.
- Publica cuando todo está aprobado, notifica por Slack y crea eventos de Calendar.
- Se puede adaptar a otros dominios en 30-60 min, reusando toda la infraestructura.

---

## Soporte / ajustes sobre la marcha

Si algo no queda claro mientras sigues el laboratorio, vuelve a la parte correspondiente y relee el apartado específico. Si hay un concepto que no está explicado en la Parte 1, probablemente deba estarlo — es un aviso de que falta claridad y puede mejorarse.

**Ritmo recomendado**: no hagas las 4 horas de un tirón. Divide así:

- Día 1 (1h): Partes 0 y 1, leer y tomar notas.
- Día 2 (30 min): Parte 2, preparar Google.
- Día 3 (1h): Parte 3, Apps Script.
- Día 4 (1h): Parte 4, Claude Code.
- Día 5 (30 min): Parte 5, test end-to-end.
- Más adelante: Parte 6 cuando quieras adaptarlo.

Cada parte es un bloque cerrado. Puedes parar al final de cualquier parte sin dejar cosas a medio.
