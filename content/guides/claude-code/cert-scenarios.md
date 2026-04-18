---
title: "Certificación C6 — Escenarios prácticos"
date: "2026-04-18"
description: "Capítulo 6 de preparación: escenarios prácticos de examen."
excerpt: "Formato del examen: 4 de 6 escenarios seleccionados aleatoriamente Uso de este documento: Estudiar los 6 para estar preparado sin importar cuáles salgan Estructura por escenario:…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — C6: Los 6 Escenarios del

# Examen

**Formato del examen:** 4 de 6 escenarios seleccionados aleatoriamente
**Uso de este documento:** Estudiar los 6 para estar preparado sin importar cuáles salgan
**Estructura por escenario:** Contexto → Decisiones arquitectónicas → Anti-patrones → Dominios evaluados →
Preguntas El examen te sitúa en un escenario real y te pide tomar decisiones arquitectónicas. Cada opción incorrecta es un anti-patrón documentado. Si los reconoces, eliminas 2-3 opciones antes de leer la correcta.

## Escenario 1: Customer Support Resolution Agent

**Contexto:** Diseñar un agente de soporte que maneja consultas, resuelve problemas y escala casos complejos.

### 4 decisiones arquitectónicas clave

Decisión Correcto Anti-patrón ¿Cómo termina el agentic loop?
Check stop_reason: continuar en Parsear texto buscando "done" o "complete"
```
tool_use, salir en end_turn
```
¿Cómo enforcea el límite de $500 en refunds?
PostToolUse hook que bloquea programáticamente y escala "Never process refunds >$500" en el system prompt ¿Cuándo escalar a un humano?
Petición explícita del cliente, policy gaps, límites de autoridad Sentimiento negativo o confidence score bajo ¿Cómo preservar datos del cliente en conversaciones largas?
Case facts block inmutable al inicio del contexto Progressive summarization que pierde detalles

### Dominios evaluados

• **D1:** Agentic loop control via stop_reason
• **D1:** Hooks para enforcement determinista
• **D2:** Structured error responses de tool failures
• **D5:** Case facts para preservación de contexto

### Estrategia de examen

Cada pregunta de escalación intentará engañarte con sentiment-based triggers. Cada pregunta de enforcement intentará que elijas prompt-based. Cada pregunta de contexto intentará que elijas summarization. Las respuestas correctas son siempre: stop_reason, hooks, case facts.

### Preguntas de práctica

**1.1** The support agent processes a $650 refund. The system prompt says "Never process refunds above $500." What
went wrong?
A) The system prompt wasn't clear enough — add "CRITICAL" and "NEVER"
B) Prompt-based enforcement is probabilistic — should use a PostToolUse hook C) The model needs fine-tuning to respect refund limits D) The $500 limit should be in the tool description instead
**B.** Prompts son probabilísticos. Hooks son deterministas y garantizan el bloqueo al 100%. A es más prompt-based
(misma debilidad). C es overkill. D documenta pero no enforcea.
**1.2** A customer says "I'm furious about this! Fix it NOW!" The issue is a simple address change. What should the agent
do?
A) Escalate to a human because the customer is angry B) Resolve the address change directly — it's within the agent's capability regardless of tone C) Escalate because the customer's confidence in the agent is low D) Ask the customer to calm down before proceeding
**B.** La tarea es simple y está dentro de la capacidad del agente. Sentimiento ≠ complejidad. A es sentiment-based
escalation. C es self-confidence (no aplica aquí). D es inapropiado.

## Escenario 2: Code Generation with Claude Code

**Contexto:** Configurar Claude Code para el workflow de un equipo de desarrollo.

### 4 decisiones arquitectónicas clave

Decisión Correcto Anti-patrón ¿Dónde van los estándares del equipo?
.claude/CLAUDE.md (project-level, git)
```
~/.claude/CLAUDE.md (user-level,
```
personal)
¿Cuándo usar plan mode vs direct?
Plan para cambios multi-archivo;
direct para fixes simples Siempre plan (overhead) o nunca plan (riesgo)
¿Cómo manejar refactoring complejo?
```
Skill con context: fork +
```
Command que corre en sesión principal y contamina
```
allowed-tools
```
¿Mejor estrategia de refinement?
TDD iteration: test → implement → verify → refine "Make it better" sin criterios verificables

### Dominios evaluados

• **D3:** CLAUDE.md hierarchy (user vs project vs directory)
• **D3:** Commands vs skills (aislamiento)
• **D3:** Plan mode para tareas complejas
• **D4:** Criterios explícitos y TDD iteration

### Estrategia de examen

Este escenario es puro Claude Code config. Saber las 3 capas de config, cuándo commands vs skills, y que TDD iteration es el patrón de refinement preferido.

### Preguntas de práctica

**2.1** A developer adds "Use Comic Sans in terminal output" to .claude/CLAUDE.md (project level). What's wrong?
A) Comic Sans isn't supported B) Personal preferences should go in user-level config, not project-level that's shared with the team C) The preference should be in settings.json D) Nothing — any config can go in project level
**B.** Preferencias personales van en ~/.claude/CLAUDE.md (user). Project config se commitea a git y se comparte con
todo el equipo.
**2.2** A team needs a reusable code analysis tool that explores the codebase without polluting the main conversation.
What should they build?
A) A custom command in .claude/commands/
```
B) A skill with context: fork and allowed-tools: [Read, Grep]
```
C) A hook in settings.json D) A shell script called from Bash
**B.** context: fork aísla la exploración. allowed-tools restringe a solo lectura. A corre en el contexto principal
(contamina). C es para automatización, no exploración. D no usa Claude.

## Escenario 3: Multi-Agent Research System

**Contexto:** Construir un sistema coordinator-subagent para tareas de investigación en paralelo.

### 4 decisiones arquitectónicas clave

Decisión Correcto Anti-patrón ¿Qué arquitectura para investigación paralela?
Hub-and-spoke: coordinator delega a subagentes especializados Arquitectura flat donde todos comparten estado global ¿Cómo pasar contexto del coordinator a subagentes?
Solo el contexto ESPECÍFICO de cada subtarea Compartir todo el historial del coordinator ¿Cómo manejar datos conflictivos entre subagentes?
Provenance tracking (source, confidence, timestamp) y anotar conflictos Promediar valores o elegir arbitrariamente ¿Cómo manejar fallos de subagentes?
Error estructurado: qué se intentó, tipo de error, access failure vs empty result Retornar [] silenciosamente o error genérico

### Dominios evaluados

• **D1:** Hub-and-spoke, context isolation
• **D2:** Structured errors, access failure vs empty
• **D5:** Provenance tracking, conflict annotation

### Estrategia de examen

**El escenario más difícil.** Las trampas son: compartir contexto completo (siempre wrong), suprimir errores
silenciosamente (siempre wrong), resolver conflictos sin provenance (siempre wrong).

### Preguntas de práctica

**3.1** A coordinator shares its full conversation history (50 messages) with each of 3 subagents. What problems does this
create?
A) Better context means better results B) Subagents receive irrelevant context that wastes tokens and may confuse task execution C) The coordinator loses access to its own history D) Subagents will duplicate each other's work
**B.** Contexto irrelevante desperdicia tokens y confunde. Cada subagente debe recibir SOLO lo relevante a su tarea. A
es incorrecto — más contexto ≠ mejor si es irrelevante.
**3.2** Subagent A reports market size as $42B (IDC report). Subagent B reports $38B (blog post). How should the
coordinator synthesize this?
A) Average: $40B B) Use the higher number (more optimistic)
C) Report both with source, confidence level, and mark the claim as "contested"
D) Discard both — conflicting data is unreliable
**C.** Provenance: anotar ambas fuentes con confianza (IDC: high, blog: medium), marcar como contested, y dejar que el
consumidor downstream decida. A/B pierden nuance. D pierde datos útiles.

## Escenario 4: Developer Productivity with Claude

**Contexto:** Construir herramientas de desarrollo usando Agent SDK con built-in tools y MCP servers.

### 4 decisiones arquitectónicas clave

Decisión Correcto Anti-patrón El agente tiene 18 tools y selecciona mal. ¿Qué hacer?
Reducir a 4-5 por agente, distribuir en subagentes Hacer descriptions más largas o cambiar a modelo más grande ¿Qué tool para leer un config file?
Read (built-in dedicado)
Bash("cat config.json")
¿Dónde configurar MCP servers del proyecto?
```
.mcp.json con ${ENV_VAR} para
```
secrets
```
~/.claude.json (personal) o
```
hardcoding secrets ¿Write o Edit para modificar archivo existente?
Edit (cambios targeted, preserva resto)
Write (reemplaza TODO el archivo)

### Dominios evaluados

• **D2:** Tool distribution (4-5 por agente)
• **D2:** Built-in tools (Read/Write/Edit/Bash/Grep/Glob)
• **D2:** MCP config y secrets management

### Estrategia de examen

Memorizar los 6 built-in tools y cuándo usar cada uno. La pregunta "18 tools" es casi garantizada. Nunca usar Bash cuando existe tool dedicado.

### Preguntas de práctica

**4.1** An agent needs to find all files that import a specific React component. Which tool?
```
A) Glob("*/React*")
B) Grep("import.*ComponentName", "src/")
C) Bash("grep -r 'ComponentName' src/")
```
D) Read every file and check
**B.** Grep busca DENTRO de archivos por patrones de contenido. A busca nombres de archivo (Glob). C usa Bash
cuando Grep existe (anti-patrón). D es ineficiente.

## Escenario 5: Claude Code for CI/CD

**Contexto:** Integrar Claude Code en pipelines de CI/CD.

### 4 decisiones arquitectónicas clave

Decisión Correcto Anti-patrón ¿Cómo ejecutar Claude Code en CI?
-p flag (non-interactive) +
Interactive mode o piping via stdin
```
--output-format json
```
¿Cómo revisar código que Claude generó?
Sesión SEPARADA (fresh context, sin bias)
Same-session self-review (confirmation bias)
Auditoría nocturna: ¿sync o batch?
Message Batches API (50% savings, 24h window)
Sync requests (2x coste sin beneficio)
¿Cómo forzar structured output en review?
```
--json-schema flag
```
Parsear texto unstructured con regex

### Dominios evaluados

```
• D3: -p flag, --output-format json, --json-schema
```
• **D3:** Session isolation (generator vs reviewer)
• **D3:** Batch API (50% savings)

### Estrategia de examen

3 hechos a memorizar: (1) -p para non-interactive, (2) NUNCA self-review en misma sesión, (3) Batch API para no-urgente = 50% savings.

### Preguntas de práctica

**5.1** A CI pipeline generates code with Claude and then reviews it using --resume in the same session. What's the risk?
A) The review will be faster but less thorough B) The reviewer retains the generator's reasoning context, creating confirmation bias C) The session will exceed the token limit D) The generated code will be overwritten
**B.** Same-session self-review = anti-patrón Critical. El reviewer ve el razonamiento del generator → tiende a confirmar.
Sesiones separadas son obligatorias.
**5.2** A team runs weekly security audits on 2,000 files. Which approach minimizes cost?
A) Synchronous claude -p for each file B) Message Batches API with custom_id per file C) One prompt with all 2,000 files D) Skip the audit every other week
**B.** Batch API: 50% savings, procesa en 24h. Perfecto para tareas no-urgentes como auditorías semanales. A cuesta el
doble. C desborda contexto.

## Escenario 6: Structured Data Extraction

**Contexto:** Construir un pipeline de extracción de datos estructurados desde documentos no estructurados.

### 4 decisiones arquitectónicas clave

Decisión Correcto Anti-patrón ¿Cómo garantizar output JSON estructurado?
tool_use + JSON schema + "Output as JSON" en prompt (no garantizado)
```
tool_choice forced
```
¿tool_use garantiza correctitud?
NO — garantiza ESTRUCTURA, no SEMÁNTICA. Validar después Asumir que tool_use = 100% correcto ¿Qué hacer cuando validation falla?
Append errores ESPECÍFICOS (campo, valor, esperado) y retry "Try again" genérico ¿Cómo manejar document types inesperados?
Enum con "other" + campo detail; 2-4 few-shot con edge cases Enum rígido que fuerza misclassification

### Dominios evaluados

• **D4:** tool_use (estructura vs semántica)
• **D4:** Validation-retry con errores específicos
• **D4:** Few-shot (2-4 examples, edge case)
• **D5:** Stratified metrics por document type

### Estrategia de examen

El concepto crítico: **tool_use = estructura, NO semántica**. Cada pregunta de fiabilidad de extracción testea esto.
También: retries necesitan errores específicos, nunca genéricos.

### Preguntas de práctica

**6.1** An extraction pipeline uses tool_use with a JSON schema. A developer says "The output is always correct because
it matches the schema." Is this true?
A) Yes — schema compliance means the data is correct B) No — tool_use guarantees structure (fields, types) but NOT semantic correctness (values may be wrong)
C) Yes — forced tool_choice eliminates all errors D) No — tool_use doesn't work reliably
**B.** tool_use garantiza campos y tipos correctos. Pero el valor de "vendor_name" podría ser incorrecto, la fecha podría
ser de otro documento, etc. Se necesita validation semántica después de la extracción.
**6.2** Validation detects that tax_amount contains "10%" (percentage) instead of a dollar amount. What should the retry
prompt include?
A) "Please fix the errors and try again"
B) "The 'tax_amount' field contains '10%' (a percentage). Expected: dollar amount (e.g., $15.00). Re-extract with the corrected format."
C) Increase temperature and retry D) Remove the tax_amount field from the schema
**B.** Feedback específico: campo, valor actual, formato esperado, ejemplo. A es genérico (anti-patrón). C no resuelve
comprensión. D pierde datos.

## Cheat sheet: Dominios por escenario

Escenario D1 D2 D3 D4 D5
1. Customer
Support II I I
2. Code
Generation II I
3. Multi-Agent
Research II I II
4. Developer
Productivity II
5. CI/CD
II I
6. Structured
Extraction II I
**Cualquier combinación de 4 escenarios cubre los 5 dominios.** Pero la proporción varía. Si te tocan 1+3+4+5, D1 y
D2 pesan más. Si te tocan 2+5+6+1, D3 y D4 pesan más.
