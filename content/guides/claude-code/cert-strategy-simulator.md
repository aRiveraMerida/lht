---
title: "Certificación C8 — Simulador de estrategia"
date: "2026-04-18"
description: "Capítulo 8: simulador de decisiones estratégicas del arquitecto."
excerpt: "El examen presenta 4 opciones por pregunta. Casi siempre, 2-3 de las opciones son anti-patrones documentados. Si los reconoces, eliminas las opciones incorrectas ANTES de evaluar…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — C8: Estrategia de eliminación +

# Simulacro por escenarios

## Parte 1: La estrategia que aprueba el examen

### Cómo funciona el examen por dentro

El examen presenta 4 opciones por pregunta. **Casi siempre, 2-3 de las opciones son anti-patrones**
**documentados.** Si los reconoces, eliminas las opciones incorrectas ANTES de evaluar la correcta.
Esto convierte un examen de "elegir la respuesta correcta entre 4" en "elegir entre 1-2 opciones después de descartar las trampas".

### Los 18 anti-patrones como filtro de eliminación

Cada anti-patrón aparece como distractor en múltiples preguntas. Memorizar estos 18 patrones te permite eliminar instantáneamente las opciones que los contienen.

**Nivel CRITICAL (10) — aparecen en casi todas las secciones**

#
Si ves esto en una opción...
Es WRONG porque...
1 Parsear texto de Claude para decidir si continuar el loop stop_reason es el mecanismo determinista 2 Iteration cap como ÚNICO mecanismo de parada Debe ser safety net, no mecanismo principal 3 "Add to system prompt" para reglas críticas de negocio Prompts = probabilístico. Hooks = determinista 4 Error genérico: "Operation failed", "Something went wrong"
Necesita isError + errorCategory + isRetryable 5 Retornar [] cuando la DB/API está caída Confunde "no hay datos" con "no pudimos buscar"
6 Hardcoding API keys en archivos de config ${ENV_VAR} para secrets 7 Same-session self-review Confirmation bias. Sesiones separadas siempre 8 "Be thorough", "find all issues"
(instrucciones vagas)
Criterios explícitos y medibles 9 Progressive summarization de datos del cliente Case facts blocks inmutables 10 Aggregate accuracy only (ej. "95% overall")
Per-document-type (stratified)
metrics

**Nivel HIGH (7) — aparecen frecuentemente**

#
Si ves esto en una opción...
Es WRONG porque...
11 Escalar por sentimiento negativo del cliente Sentimiento ≠ complejidad 12 Self-reported confidence score para decisiones No es fiable ni calibrado 13 18+ tools en un solo agente 4-5 tools por agente. Distribuir 14 Compartir contexto completo del coordinator con subagentes Solo contexto relevante por subtarea 15 tool_use "guarantees correctness"
Garantiza ESTRUCTURA, no SEMÁNTICA 16 "Try again" como retry genérico Append errores específicos (campo, valor, esperado)
17 Sin provenance tracking en datos de múltiples fuentes Source + confidence + timestamp

**Nivel MEDIUM (1)**

#
Si ves esto en una opción...
Es WRONG porque...
18 Preferencias personales en project-level config User-level para personal, project para equipo

### Cómo aplicar la estrategia: ejemplo paso a paso

**Pregunta:** "A support agent processes a $700 refund despite a $500 limit. How should this be prevented?"

**Opciones:**

• A) Add "CRITICAL: Never process refunds above $500" to the system prompt
• B) Implement a PostToolUse hook that blocks refunds above $500
• C) Set the model temperature to 0 for deterministic behavior
• D) Ask Claude to self-assess whether the refund needs approval

**Proceso de eliminación:**

1. **A** contiene "add to system prompt" para regla crítica → **Anti-patrón #3** → ELIMINAR
2. **C** no es un anti-patrón conocido, pero temperatura no controla compliance → DUDOSA
3. **D** contiene "self-assess" → **Anti-patrón #12** (self-reported confidence) → ELIMINAR
4. **B** es hook programático → I Correcto
**Resultado:** De 4 opciones, 2 se eliminan instantáneamente (A, D). C se descarta por razonamiento. **B es la única**
**opción viable.** Tiempo total: 15 segundos.

### Los 5 "triggers" de eliminación más rápidos

Cuando veas estas PALABRAS en una opción, es casi siempre incorrecta:
Trigger word Anti-patrón Excepciones "sentiment"
Escalación por sentimiento (#11)
Ninguna en contexto de escalación "system prompt" + regla de negocio Prompt-based enforcement (#3)
Válido para soft preferences "try again" (sin detalles)
Retry genérico (#16)
Ninguna "confidence score" (self-reported)
Self-confidence (#12)
Ninguna "all tools" / "18 tools" + un agente Too many tools (#13)
Ninguna

## Parte 2: Simulacro por escenarios (40 preguntas)

**Formato:** 4 escenarios × 10 preguntas cada uno — replica el formato real del examen.
**Tiempo sugerido:** 75 minutos.
**Instrucciones:** Lee el escenario completo, luego responde las 10 preguntas.

### ESCENARIO A: HealthCheck — Sistema de monitoreo de pacientes

**Contexto:** Estás diseñando un agente que monitorea datos de salud de pacientes en un hospital. El agente recibe
alertas de dispositivos médicos (ritmo cardíaco, presión, oxígeno), las clasifica por urgencia, consulta el historial del paciente, y decide si notificar al equipo médico o registrar como observación rutinaria. El sistema tiene 14 herramientas disponibles incluyendo acceso al historial clínico, sistema de alertas, y protocolo de escalación.

**Requisitos críticos:**

• Alertas clasificadas como "critical" SIEMPRE deben notificar al equipo médico (sin excepción)
• El historial del paciente puede tener datos de hace horas que ya cambiaron
• Múltiples dispositivos envían datos simultáneamente
• Toda decisión clínica debe tener trazabilidad (qué dato, de qué fuente, a qué hora)
**A1.** The agent has 14 tools (vitals lookup, history check, alert dispatch, protocol search, etc.). Tool selection errors are
causing missed critical alerts. What's the fix?
A) Fine-tune the model on medical tool selection examples B) Write more detailed tool descriptions for all 14 tools C) Distribute tools across specialized subagents: vitals-agent (4 tools), history-agent (4 tools), alert-agent (3 tools), coordinator (3 tools including Task)
D) Switch to a larger model with better reasoning
**A2.** A critical heart rate alert (180 bpm) MUST always notify the medical team. How to enforce this?
A) System prompt: "ALWAYS notify the medical team for heart rate above 150 bpm"
B) PreToolUse hook that intercepts the classification tool and forces "critical" + notification for heart rate >150 C) Add "heart rate >150 = critical" to the tool description D) Train the model on examples of critical alerts
**A3.** Patient vitals were retrieved 2 hours ago showing stable blood pressure. The agent uses this data for a current
assessment. The blood pressure has since spiked. What pattern should prevent this?
A) Use a larger context window to keep more data B) Periodically re-fetch critical vitals before making assessments — stale context is a risk in long sessions C) Trust the most recent data in the conversation D) Ask the patient directly
**A4.** The coordinator delegates vitals analysis to a subagent. How should context be passed?
A) Share the coordinator's full conversation history (40 messages about 12 patients)
B) Pass only this patient's ID, current vitals, and the specific analysis task C) Share all patient data for cross-reference D) Let the subagent access the coordinator's memory
**A5.** The vitals-agent can't connect to the heart rate monitor (timeout). It returns {"heart_rate": null}. The coordinator
assumes the patient has no heart rate data. What went wrong?
A) The null value is ambiguous — expected B) The agent should have returned isError: true with errorCategory: "timeout" to distinguish "couldn't read" from "no data"
C) The coordinator should check for null values D) The timeout is too short
**A6.** A nurse complains loudly: "Your stupid system sent 50 false alarms today! Fix it!" The system can resolve this by
adjusting alert thresholds. Should it escalate to a human?
A) Yes — the nurse is clearly frustrated, escalate immediately B) No — the task (adjust thresholds) is within capability. Resolve directly, regardless of tone C) Yes — 50 false alarms indicates a systemic problem beyond the agent D) Ask the nurse to provide specific examples first
**A7.** The system needs to track why each alert was classified as "critical" or "routine". What should it maintain?
A) A log of all alert classifications without source details B) Provenance metadata: which vital triggered it, device ID, reading value, timestamp, classification rule applied C) A summary of daily alerts D) The model's confidence score for each classification
**A8.** The agentic loop processes alerts continuously. Some alerts take 30 seconds to resolve (database lookups). The
loop checks for "alert resolved" in Claude's text to move on. What's wrong?
A) 30 seconds is too slow B) Text parsing for loop control is an anti-pattern — use stop_reason == "end_turn" for deterministic termination C) The database is too slow D) The loop should have a 10-second timeout
**A9.** Patient data includes: name, ID, blood type, allergies, current medications, and 3 hours of vitals history. The
conversation is 60 messages long. Where should this critical data be placed?
A) Summarized in the most recent message B) In an immutable "patient facts" block at the START of context (high-recall position)
C) Distributed throughout the conversation naturally D) In a separate database only
**A10.** Two monitoring devices report conflicting blood pressure: Device A says 140/90, Device B says 120/80. How
should the coordinator handle this?
A) Average the readings: 130/85 B) Use the higher reading to be safe C) Report both readings with device ID, timestamp, and calibration status — annotate as "conflicting"
D) Discard both — conflicting data is unreliable

### ESCENARIO B: LegalDoc — Pipeline de extracción de contratos legales

**Contexto:** Estás construyendo un pipeline que extrae cláusulas clave de contratos legales (partes, fechas,
obligaciones, penalizaciones, jurisdicción). El sistema procesa ~500 contratos/semana. Los contratos vienen en formatos variados (PDF, Word, escaneados). Los datos extraídos alimentan un dashboard de compliance. Un error de extracción puede tener consecuencias legales.

**Requisitos:**

• Output JSON con schema forzado
• Validation de cada extracción antes de almacenar
• Contratos en idiomas diferentes (español, inglés, portugués)
• Diferentes tipos: NDA, MSA, SLA, Amendment — cada uno con campos distintos
**B1.** How to guarantee the extraction output matches a specific JSON structure?
A) Prompt: "Please output your response as valid JSON"
B) tool_use with JSON schema + tool_choice forcing the extraction tool C) Post-process Claude's text output with regex D) Use a separate JSON validator after Claude responds
**B2.** The extraction tool returns perfectly structured JSON: {"party_a": "Acme Corp", "effective_date":
"2026-01-15"}. But the actual contract says "Beta LLC" and "March 1, 2026". Is the output correct?
A) Yes — the JSON matches the schema perfectly B) No — tool_use guarantees STRUCTURE (fields, types) but NOT SEMANTIC correctness (values)
C) Yes — forced tool_choice eliminates extraction errors D) The schema needs more constraints
**B3.** Validation detects: effective_date is "January 15" (missing year), governing_law is empty, penalty_amount
contains "TBD" instead of a number. What should the retry include?
A) "There were errors, please try again"
B) "Fix these 3 issues: (1) effective_date 'January 15' missing year — use ISO 8601 YYYY-MM-DD, (2) governing_law is empty — extract jurisdiction from contract, (3) penalty_amount 'TBD' is not a number — if amount is not specified, use null"
C) Increase temperature for a different result D) Skip these fields and proceed
**B4.** The schema's contract_type enum is ["NDA", "MSA", "SLA"]. A "Joint Venture Agreement" is submitted. What
happens?
A) It's correctly rejected B) It's forced into NDA, MSA, or SLA — misclassification C) The extraction fails completely D) Claude adds "JVA" to the enum automatically
**B5.** The pipeline shows 92% accuracy across 500 contracts. The legal team asks if it's production-ready. You check
per-type accuracy: NDAs 98%, MSAs 95%, SLAs 72%, Amendments 60%. What do you report?
A) 92% is above threshold — deploy B) SLAs (72%) and Amendments (60%) are critically below threshold — the aggregate masks these failures C) Run more contracts to confirm 92% D) Remove SLAs and Amendments from the pipeline
**B6.** The system processes 500 contracts weekly. This is a batch operation completed by Monday morning. What API
strategy saves the most money?
A) Synchronous claude -p for each contract B) Message Batches API with custom_id per contract (50% savings, 24h window)
C) Process them all in one giant prompt D) Hire humans instead
**B7.** After extraction, a reviewer Claude validates the results. Both extraction and review run in the same session. The
review rarely finds issues. Why?
A) The extractions are very accurate B) Same-session self-review retains reasoning context — the reviewer is biased toward confirming the extraction C) The review prompt is too permissive D) Claude can't find extraction errors
**B8.** Contracts in Spanish, English, and Portuguese need extraction. How many few-shot examples should the prompt
include?
A) 0 — Claude handles multilingual natively B) 2-4 examples covering at least one per language and one edge case (e.g., mixed-language contract)
C) 15+ examples for comprehensive coverage D) 1 example in English only
**B9.** A contract's penalty_amount field has confidence 0.3 (low) because the amount was partially obscured in a
scanned PDF. How should this be flagged for human review?
A) Set a global confidence threshold and flag the entire contract B) Flag at field level — only penalty_amount needs human review, other fields with high confidence are fine C) Discard the entire extraction D) Use Claude's self-reported confidence instead
**B10.** The extraction prompt says "Extract all relevant information from this contract." Results are inconsistent across
runs. What's wrong?
A) The model is non-deterministic B) The prompt uses vague criteria ("relevant") instead of explicit fields: "Extract: party_a, party_b, effective_date, termination_date, governing_law, penalty_amount"
C) Temperature is too high D) The contracts are too complex

### ESCENARIO C: DevTeam — Configuración de Claude Code para equipo de 8

### developers

**Contexto:** Lideras un equipo de 8 developers que trabaja en un monorepo con backend (Express/TypeScript),
frontend (React), y servicios compartidos. Quieres configurar Claude Code para que todo el equipo siga las mismas convenciones. El equipo hace PRs diarias y deploys semanales. Un junior developer se acaba de incorporar y necesita onboarding rápido.
**C1.** Where should the team's TypeScript strict mode rule go?
A) Each developer's ~/.claude/CLAUDE.md B) .claude/CLAUDE.md at the project root (committed to git)
C) A shared Notion doc that developers reference D) The CI/CD pipeline configuration only
**C2.** API endpoints have specific validation rules. Frontend components have styling guidelines. How to organize these
rules?
A) One massive .claude/CLAUDE.md with everything
```
B) .claude/rules/api-validation.md with paths glob src/api/ and .claude/rules/frontend-styling.md with paths
glob src/frontend/
```
C) Put all rules in CLAUDE.md with section headers D) Create separate repos for backend and frontend rules
**C3.** A developer adds "Always use dark theme in terminal" to .claude/CLAUDE.md (project). What's wrong?
A) Dark theme isn't supported B) Personal preferences should be in ~/.claude/CLAUDE.md (user-level), not project-level config shared with the team C) It should be in settings.json D) Nothing — any preference can go anywhere
**C4.** The team needs a reusable code review routine that analyzes code quality without affecting the developer's current
session. What to build?
```
A) A slash command /review in .claude/commands/
B) A skill with context: fork and allowed-tools: [Read, Grep, Glob]
```
C) A hook that runs after every edit D) A separate script called from terminal
**C5.** The junior developer needs to implement a new API endpoint. What's the best workflow?
A) Tell them to "make a new endpoint" and let Claude figure it out B) Use plan mode: Claude plans the endpoint structure first, developer reviews, then Claude implements with TDD iteration C) Write the code manually and ask Claude to review D) Copy an existing endpoint and modify
**C6.** PRs need code review by Claude in CI. What's the critical configuration?
A) Use --resume to continue the author's Claude session for review B) Use a SEPARATE Claude session with -p flag and --output-format json for the review C) Let each developer review their own code with Claude D) Skip automated review — manual is better
**C7.** The team's .claude/CLAUDE.md has grown to 400 lines. Performance seems to degrade. What to do?
A) It's fine — more instructions is better B) Refactor: keep CLAUDE.md under 200 lines with @import for modular rules in .claude/rules/ C) Split into 4 CLAUDE.md files in random directories D) Delete half the rules
**C8.** A skill for database migration needs to run SQL commands but should NOT be able to modify application code.
What frontmatter?
A) No restrictions needed
```
B) context: fork + allowed-tools: [Read, Bash, Grep] (Bash for SQL, no Write/Edit for code)
C) allowed-tools: [Write, Edit, Bash, Read, Grep, Glob]
D) context: fork only
```
**C9.** The team runs nightly linting on the entire codebase (2,000 files). What's the most cost-effective approach?
A) claude -p for each file synchronously B) Message Batches API with custom_id per file C) One prompt with all 2,000 files D) Lint only changed files
**C10.** The team wants Claude to follow a specific commit message format: type(scope): description. How to ensure
this?
A) Add to system prompt: "Always use conventional commits"
```
B) Define the format in .claude/CLAUDE.md with examples: feat(auth): add JWT validation
```
C) Create a PostToolUse hook that validates commit messages against the pattern and blocks non-compliant commits D) Hope Claude follows conventions by default

### ESCENARIO D: ResearchBot — Agente de investigación de mercado multi-fuente

**Contexto:** Diseñas un agente que investiga mercados tecnológicos. Recibe preguntas como "¿Cuál es el tamaño del
mercado de AI infrastructure en 2026?" y debe buscar en múltiples fuentes (web, reports de analistas, bases de datos internas), sintetizar los hallazgos, y producir un informe con fuentes citadas. Diferentes fuentes a menudo tienen datos conflictivos.
**D1.** The research agent needs to search 3 sources simultaneously. What architecture?
A) One agent that sequentially calls each source B) Hub-and-spoke: coordinator spawns 3 subagents (web-researcher, analyst-reports, internal-db), each with 4-5 tools C) One agent with all 15 research tools D) Three separate agents with no coordinator
**D2.** The web-researcher subagent finds a blog post claiming "AI infrastructure market = $65B". The analyst-reports
subagent finds IDC reporting "$42B". How should the coordinator synthesize this?
A) Use the IDC number (more authoritative)
B) Average: $53.5B C) Report both with provenance: IDC ($42B, primary research, high confidence) vs blog ($65B, single source, medium confidence) — annotate as contested D) Discard both — too much conflict
**D3.** The coordinator gives each subagent its full 60-message research history. The web-researcher receives
instructions about the analyst database and vice versa. What's the impact?
A) Better context for all subagents B) Token waste and potential confusion — each subagent should receive only its task-specific context C) Improved cross-referencing capabilities D) No impact
**D4.** The internal-db subagent can't connect to the database (maintenance window). It returns {"market_data": []}.
The coordinator reports "No internal data available for this market." Is this correct?
A) Yes — empty results mean no data B) No — the subagent should report isError: true, errorCategory: "unavailable" so the coordinator knows the data MIGHT exist but couldn't be accessed C) Yes — the coordinator correctly interpreted the empty response D) No — the subagent should retry until the database is back
**D5.** Research data was collected 4 hours ago. The final report references "current market cap of Company X: $85B"
from that data. Company X's stock dropped 15% in the last 2 hours. What pattern should prevent this?
A) Use real-time stock feeds B) Re-fetch time-sensitive data before including it in the final report — stale context is a risk C) Add a disclaimer: "Data as of 4 hours ago"
D) Only use annual reports (less volatile)
**D6.** The web-researcher finds 3 articles about market growth. Article A says 23%, B says 18%, C says 25%. How
should the report present this?
A) Report the average: 22% B) Report all three with sources and characterize: "Growth estimates range from 18-25% (3 sources), with the majority indicating >20%"
C) Use the most recent article only D) Report 23% (the middle value)
**D7.** The coordinator needs to delegate to 3 subagents. Its allowedTools is [summarize_report, format_citations].
Can it delegate?
A) Yes — any agent can create subagents B) No — allowedTools must include Task to spawn subagents C) Yes — if the subagents have Task D) Only if using the Agent SDK directly
**D8.** After collecting research, the agentic loop checks if Claude's text contains "research complete" to exit. Some runs
never exit because Claude phrases it differently. What's the fix?
A) Add more stop phrases: "done", "finished", "complete", "all gathered"
B) Replace text parsing with stop_reason == "end_turn" for deterministic loop termination C) Set a 20-iteration hard cap D) Add "You MUST say 'research complete' when done" to the prompt
**D9.** The research session has been running for 5 hours. The coordinator starts repeating searches it already did in
hour 1. What's happening?
A) The model is broken B) Context degradation — earlier search results were summarized or lost. Use scratchpad files to persist findings C) The search API is returning cached results D) The research topic has changed
**D10.** The final report needs to indicate data reliability. Which approach is best?
A) One overall confidence score for the report B) Per-claim provenance: each data point tagged with source, confidence level (well-established/single-source/contested), and retrieval timestamp C) A disclaimer at the bottom D) Let the reader assess reliability

## Scoring

Cuenta tus respuestas correctas de los 4 escenarios (40 preguntas):
Rango Resultado Acción
**36-40** (90-100%)
Listo para el examen Presentar con confianza
**29-35** (72-88%)
Aprobado — áreas débiles Repasar escenarios donde fallaste
**20-28** (50-70%)
Necesitas más estudio Volver a C1-C5 por dominio
**<20** (<50%)
Preparación insuficiente Rehacer curso + C1-C5 + este simulacro

### Análisis por escenario

Escenario Dominios principales Si fallaste 3+ preguntas, estudia...
A (HealthCheck)
D1, D2, D5 C1 (hooks, loops), C2 (errors), C5 (provenance)
B (LegalDoc)
D4, D3, D5 C4 (tool_use, retry), C3 (batch), C5 (stratified)
C (DevTeam)
D3, D1 C3 (config, CI/CD), C1 (enforcement)
D (ResearchBot)
D1, D5, D2 C1 (multi-agent), C5 (context, provenance), C2 (errors)

### Combinando con C7

**Total de preguntas de práctica disponibles:**

• C7: 50 preguntas individuales por dominio
• C8: 40 preguntas agrupadas en escenarios
• C1-C6: ~49 preguntas integradas en el contenido
• **Total: 139 preguntas** para practicar
Si apruebas C7 (>36/50) Y C8 (>29/40), estás preparado para el examen real.

## Parte 3: Por qué estos escenarios son diferentes de los del examen — y

## por qué eso te ayuda

### Los 6 escenarios del examen vs los 4 de este simulacro

Escenario del examen Escenario equivalente aquí Qué transfiere
#1 Customer Support Agent

**A: HealthCheck**

Escalación, hooks, case facts, errors — en contexto médico (más presión)
#2 Code Generation

**C: DevTeam**

Config hierarchy, commands vs skills, TDD, CI/CD — para equipo de 8
#3 Multi-Agent Research

**D: ResearchBot**

Hub-and-spoke, provenance, conflictos, context isolation — investigación de mercado
#4 Developer Productivity
Elementos en **C: DevTeam**
Built-in tools, MCP config, tool distribution
#5 CI/CD
Elementos en **B: LegalDoc** y **C:**

**DevTeam**

Batch API, session isolation,
--output-format json
#6 Structured Data Extraction

**B: LegalDoc**

tool_use schemas, validation-retry, few-shot, stratified metrics
**El punto clave:** Los anti-patrones son IDÉNTICOS sin importar el escenario. "Sentiment-based escalation" es
incorrecto tanto en soporte al cliente como en monitoreo médico. "Empty results for access failures" es catastrófico tanto en extracción de contratos como en monitoreo de salud.

**Si puedes aplicar los 18 anti-patrones en estos 4 escenarios nuevos, puedes aplicarlos en cualquier escenario**

**que el examen presente** — incluyendo los que no has visto.

### Principio de transferencia

```
Los conceptos son constantes. Los escenarios son variables.
stop_reason → Funciona igual en soporte, investigación, médico, legal
4-5 tools per agent → Aplica a 14 tools médicos o 16 tools de customer service
Case facts → Preserva datos de pacientes O datos de clientes O datos de contratos
Hooks → Enforcea límites de refund O límites de medicación O límites de autorización
```
Si dominas el CONCEPTO, el escenario es solo decoración.

## Parte 4: Preguntas cross-domain (10 preguntas que combinan conceptos)

El examen real a menudo combina conceptos de 2-3 dominios en una sola pregunta. Estas 10 preguntas practican esa combinación.
**X1.** An agent extracts contract data using tool_use (D4), but the database connection times out when saving (D2). The
system returns {"saved": false} without details. What TWO things are wrong?
A) tool_use should have caught the database error B) The error response needs structured fields (isError, errorCategory, isRetryable) AND the extraction should be validated semantically before saving C) The timeout means the schema was wrong D) The agent should retry with higher temperature
**X2.** A multi-agent system (D1) has a coordinator with 12 tools. One subagent extracts data with tool_use (D4) and
another reviews it in the same session (D3). Customer details are progressively summarized (D5). How many anti-patterns are present?
A) 1 B) 2 C) 3 D) 4
**X3.** A CI/CD pipeline (D3) runs Claude to review PRs. The review uses --resume from the code generation session
(D3). Errors are returned as {"issues": "some problems found"} (D2). The review criteria says "find all issues" (D4).
How many problems exist?
A) 1 B) 2 C) 3 D) 4
**X4.** A support agent (D1) uses sentiment analysis to escalate (D5). The agent has 18 tools (D2). Refund limits are
enforced via system prompt (D1). How many critical anti-patterns?
A) 1 B) 2 C) 3 D) 4
**X5.** An extraction pipeline uses tool_use with forced tool_choice (D4). Validation fails on 3 fields. The retry says
"Please fix the errors" (D4). Results show 94% aggregate accuracy (D5). The pipeline runs synchronously processing 1,000 documents daily (D3). What should change?
A) Only the retry message needs fixing B) The retry needs specific errors, accuracy needs stratified metrics, and daily batch should use Batch API for 50% savings C) Everything is fine except the retry D) Switch to a larger model
**X6.** A coordinator passes full context to subagents (D1). Each subagent returns errors as empty arrays (D2). The
coordinator synthesizes results without tracking which subagent provided which data (D5). After 4 hours, the coordinator references stale data from hour 1 (D5). How many issues?
A) 2 B) 3 C) 4 D) 5
**X7.** A Claude Code team configuration (D3) has CLAUDE.md at 500 lines with personal preferences mixed in. A skill
runs code analysis in the main session context (D3). The CI pipeline uses the same session for generation and review (D3). All three are from Domain 3. Which is the MOST critical to fix first?
A) The 500-line CLAUDE.md B) The skill running in main context C) The same-session CI review D) They're all equally important
**X8.** An agentic loop (D1) correctly uses stop_reason. But the agent has 16 tools (D2), uses prompt-based enforcement
for PII redaction (D1), and retries failed extractions with "try again" (D4). If you can only fix ONE thing, which has the highest impact?
A) Reduce tools to 4-5 per agent B) Replace prompt-based PII enforcement with a hook C) Add specific errors to the retry D) They all have equal impact
**X9.** A medical alert system (combines all domains) correctly uses hooks for critical alerts (D1), has 4 tools per agent
(D2), uses plan mode for complex diagnoses (D3), extracts vitals with tool_use (D4), and uses case facts for patient data (D5). But it escalates based on patient's emotional state. What's wrong?
A) Nothing — this system is well-designed B) Escalation should be based on medical criteria (severity, capability limits), not emotional state C) The system needs more tools D) Case facts shouldn't be used for medical data
**X10.** You're designing a system from scratch. It needs: data extraction from PDFs (D4), multi-source research (D1),
CI/CD integration (D3), and human review for low-confidence extractions (D5). In what order should you implement the anti-pattern protections?
A) CI/CD first, then extraction, then research, then review B) Hooks for critical business rules (D1) → Structured errors (D2) → Separate CI sessions (D3) → Validation-retry (D4)
→ Stratified metrics (D5)
C) Start with the largest domain (D1) and work down D) Implement all protections simultaneously

## Scoring final combinado

Simulacro Preguntas Tu score Aprobado C7 (por dominio)
50 ___/50
>36
C8 Escenarios (Parte 2)
40 ___/40
>29
C8 Cross-domain (Parte 4)
10 ___/10
>7

**Total**

**100**

**___/100**

**>72**

**Si superas 72/100 en el total combinado, estás preparado para el examen real.**

Las preguntas cross-domain son las más difíciles porque requieren reconocer múltiples anti-patrones simultáneamente — exactamente lo que hace el examen real.
