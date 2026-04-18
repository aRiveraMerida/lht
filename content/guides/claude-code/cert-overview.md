---
excerpt: "Bloque de preparación para el examen Claude Certified Architect."
---

# Guía de preparación: Claude Certified Architect

# – Foundations

**Objetivo:** Prepararte para el examen de certificación usando lo que ya aprendiste en el curso + contenido
complementario específico para el examen
**Formato:** Mapeo dominio por dominio con lo que ya sabes, lo que falta, y contenido de estudio
**Examen:** 720/1000 para aprobar · 4 de 6 escenarios aleatorios · Multiple choice basado en escenarios

## Tu ventaja: mapeo curso → examen

Has completado un curso de 13 módulos. Esto cubre ~65-70% del contenido del examen. Este documento cierra el 30-35% restante.
Dominio del examen Peso Módulos que ya hiciste Cobertura Lo que falta D1: Agentic Architecture ~25% M1, M7, M8, M9 75% Agent SDK API details, stop_reason, fork_session D2: Tool Design & MCP ~20% M1, M5 50% Structured errors, tool distribution, .mcp.json config D3: Claude Code Config ~20% M4, M5, M6, M12 85% @import, SKILL.md context:fork, batch API D4: Prompt Engineering ~20% M2, Prework 9 40% tool_use schemas, tool_choice, few-shot, validation-retry D5: Context & Reliability ~15% M2, M10 45% Provenance, escalation patterns, context degradation

## Dominio 1: Agentic Architecture & Orchestration (~25%)

### Lo que ya sabes (del curso)

• **Agentic loops** → M7 (Ralph): headless mode, --max-turns, completion promises
• **Multi-agent** → M8 (Agent Teams, claude-squad, Ctrl+B, -w)
• **Subagentes** → M9 (.claude/agents/, Agent SDK, allowed-tools, least-privilege)
• **Hooks** → M6 (settings.json, 20+ eventos, exit 0/1/2, matchers)
• **Session management** → M7 (claude -c, -r), M10 (feature_list.json, git log como memoria)

### Lo que necesitas para el examen

**1.1 Agentic loop lifecycle (stop_reason)**

El examen pregunta sobre cómo un agentic loop decide cuándo parar. La clave es stop_reason:
```
# Agentic loop correcto con Agent SDK
import anthropic
client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Analyze this codebase"}]
tools = [...]  # Tool definitions
while True:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        messages=messages,
        tools=tools,
        max_tokens=4096,
    )
    # La CLAVE: check stop_reason
    if response.stop_reason == "end_turn":
        # Claude terminó naturalmente — salir del loop
        break
    elif response.stop_reason == "tool_use":
        # Claude quiere usar una herramienta — ejecutar y continuar
        tool_results = execute_tools(response.content)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
    # Loop continúa automáticamente
```
**Anti-patrón del examen:** I Parsear texto natural para decidir si parar ("Claude dijo 'done' así que paramos"). I Usar
```
stop_reason == "end_turn" siempre.
```
**Anti-patrón del examen:** I Poner iteration cap arbitrario como mecanismo principal de parada. I Dejar que el loop
termine vía stop_reason, usar cap solo como safety net.

**1.2 Hub-and-spoke (coordinator + subagents)**

```
COORDINATOR   I ← Orquesta, NO ejecuta trabajo
  ISub A I ISub B I ISub C I  ← Ejecutan, contexto AISLADO
```

**Principios clave para el examen:**

• El coordinator NO hace trabajo directo — solo orquesta
• Cada subagente tiene **contexto aislado** (no comparten memoria)
• El coordinator pasa contexto explícitamente a cada subagente
• allowedTools debe incluir "Task" para poder spawnar subagentes
• 4-5 herramientas máximo por agente (anti-patrón: 18+ tools)

**1.3 fork_session**

```
# fork_session: crear branch de exploración sin afectar la sesión principal
forked = client.fork_session(session_id)
# El fork hereda contexto completo
# Cambios en el fork NO afectan la sesión original
# Útil para: exploración, comparación de approaches
```

**1.4 Hooks: programmatic vs prompt-based enforcement**

**Pregunta típica del examen:** "¿Cómo asegurar que nunca se procesa un reembolso >$500 sin aprobación?"
**Prompt-based:** "Never process refunds above $500" en el system prompt
→ Probabilístico, Claude puede ignorarlo
**Hook programático:** PostToolUse hook que bloquea con exit 2
→ Determinista, imposible de saltarse
```
{
  "hooks": {
    "PostToolUse": [{
      "matcher": { "tool": "process_refund" },
      "hooks": [{
        "type": "command",
        "command": "python3 check_refund_limit.py $AMOUNT",
        "timeout": 5
      }]
    }]
  }
}
```

## Dominio 2: Tool Design & MCP Integration (~20%)

### Lo que ya sabes (del curso)

• **22 herramientas built-in** → M1 (Read, Write, Edit, Bash, Grep, Glob...)
• **Skills con frontmatter** → M5 (allowed-tools, model, budget)
• **MCP servers** → M5 (plugins)

### Lo que necesitas para el examen

**2.1 Tool descriptions: best practices**

Las descripciones de tools son lo que Claude lee para decidir cuándo y cómo usar cada herramienta.

**Buena descripción de tool:**

```
{
  "name": "search_orders",
  "description": "Search customer orders by order ID, email, or date range. Returns max 50 results. Use when customer as
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "Exact order ID (e.g., 'ORD-12345')" },
      "email": { "type": "string", "format": "email" },
      "date_range": {
        "type": "object",
        "properties": {
          "from": { "type": "string", "format": "date" },
          "to": { "type": "string", "format": "date" }
        }
      }
    }
  }
}
```
**Incluir en la descripción:** cuándo usar, formatos de input, límites, edge cases.

**2.2 Structured error responses**

**Anti-patrón del examen:** I {"error": "Something went wrong"} (genérico)
**Error estructurado correcto:**
```
{
  "isError": true,
  "errorCategory": "validation",
  "isRetryable": false,
  "message": "Order ID 'ORD-99999' not found in database",
  "context": {
    "searched_id": "ORD-99999",
    "suggestion": "Verify the order ID format (ORD-XXXXX)"
  }
}
```
Campo Propósito Ejemplo Distinguir error de resultado vacío
```
isError
true
```
Tipo de error (validation, auth,
```
errorCategory
```
rate_limit, internal)
```
"validation"
```
¿El agente debería reintentar?
false para validation, true para
```
isRetryable
```
rate_limit Descripción legible
```
message
"Order not found"
```
Info adicional para debugging
```
context
{"searched_id": "..."}
```
**Anti-patrón:** I Retornar resultado vacío como éxito (silently suppressing errors). I Distinguir "no results found" (éxito,
lista vacía) de "search failed" (error).

**2.3 Tool distribution (4-5 por agente)**

**Pregunta de examen:** "You have 18 tools. How do you distribute them?"
Dar las 18 a un solo agente → Claude se confunde, selección subóptima Distribuir en 3-4 agentes especializados de 4-5 tools cada uno
```
Agent "order-handler":  search_orders, update_order, cancel_order, process_refund
Agent "product-helper":  search_products, get_inventory, compare_products, get_reviews
Agent "account-mgr":     get_profile, update_profile, reset_password, verify_identity
Coordinator:             route to agent based on intent
```

**2.4 MCP server configuration**

```
// .mcp.json (proyecto — se commitea)
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "postgresql://..." }
    }
  }
}
// ~/.claude.json (usuario — global, no se commitea)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}
```
**Para el examen:** .mcp.json = proyecto (compartido). ~/.claude.json = usuario (personal, con secrets).

## Dominio 3: Claude Code Configuration & Workflows (~20%)

### Lo que ya sabes (del curso) — ~85% cubierto

• **CLAUDE.md** → M1, M4 (WHAT/WHY/HOW, <200 líneas, 4 capas)
• .claude/rules/ → M4 (paths: condicional)
• **Commands** → M6 (markdown en .claude/commands/)
• **Skills** → M5 (frontmatter, allowed-tools, plugins)
• **Hooks** → M6 (settings.json, 20+ eventos, exit 2)
• **Plan mode** → M2 (Shift+Tab)
• **CI/CD** → M12, M13 (claude-code-action, -p flag)

### Lo que falta para el examen

**3.1 @import en CLAUDE.md**

```
&lt;!-- CLAUDE.md --&gt;
# Project
@import .claude/rules/api-conventions.md
@import .claude/rules/testing.md
```
Permite importar contenido de otros archivos dentro de CLAUDE.md. El contenido importado se incluye en el contexto como si estuviera inline.

**3.2 SKILL.md frontmatter: context: fork**

```
# .claude/skills/research.md
---
name: deep-research
description: Research a topic using web search
context: fork          # ← Ejecuta en contexto separado (fork)
allowed-tools: WebSearch, Read
argument-hint: "topic to research"
---
```
context: fork significa que el skill se ejecuta en un **fork del contexto**, no en la sesión principal. Los cambios en el fork no afectan la sesión. Útil para exploración sin contaminar el contexto de trabajo.

**3.3 Batch API (Message Batches)**

```
# Para procesamiento masivo no-urgente
# 50% de descuento, ventana de 24h
batch = client.messages.batches.create(
    requests=[
        {"custom_id": "doc-1", "params": {"model": "claude-sonnet-4-6", "max_tokens": 1024, "messages": [...]}},
        {"custom_id": "doc-2", "params": {"model": "claude-sonnet-4-6", "max_tokens": 1024, "messages": [...]}},
        # ... hasta miles de requests
    ]
)
# Polling para resultados
status = client.messages.batches.retrieve(batch.id)
# status.processing_status: "in_progress" | "ended"
```
**Para el examen:** Batch = latency-tolerant, 50% savings, 24h window. Synchronous = blocking, inmediato, precio
completo.

**3.4 -p flag + structured output en CI**

```
# JSON output para parseo programático
claude -p "analyze this code" --output-format json
# Con JSON schema para validación
claude -p "extract data" --output-format json --json-schema '{"type":"object","properties":{"name":{"type":"string"}}}'
```

## Dominio 4: Prompt Engineering & Structured Output (~20%)

### II El dominio con más gaps vs el curso

El curso enseña prompting práctico (M2, Prework 9), pero el examen profundiza en **patterns de producción**.

**4.1 Explicit criteria > vague instructions**

"Be thorough in your review"
"Check for: 1) SQL injection in user inputs, 2) Missing null checks on API responses, 3) Hardcoded secrets, 4)
Missing error handling in async functions"
**Para el examen:** El impacto de false positives vs false negatives. "Check carefully" produce más false positives.
Criterios explícitos reducen ambos.

**4.2 Few-shot prompting (2-4 examples)**

```
messages = [{
    "role": "user",
    "content": """Classify these support tickets:
    Example 1:
    Input: "My order hasn't arrived after 2 weeks"
    Output: {"category": "shipping", "priority": "high", "needs_human": false}
    Example 2:
    Input: "I want to sue your company"
    Output: {"category": "legal", "priority": "critical", "needs_human": true}
    Example 3:
    Input: "Can you change my delivery address?"
    Output: {"category": "shipping", "priority": "medium", "needs_human": false}
    Now classify:
    Input: "I received a broken product and I'm very upset"
    """
}]
```
**Para el examen:** 2-4 examples es el sweet spot. Incluir edge cases en los examples. Los examples resuelven
ambigüedad mejor que instrucciones largas.

**4.3 tool_use para structured output**

```
# Forzar output estructurado via tool_use
response = client.messages.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Extract info from this text: ..."}],
    tools=[{
        "name": "submit_extraction",
        "description": "Submit the extracted data",
        "input_schema": {
            "type": "object",
            "required": ["name", "email", "sentiment"],
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string", "format": "email"},
                "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
                "confidence": {"type": "number", "minimum": 0, "maximum": 1}
            }
        }
    }],
    tool_choice={"type": "tool", "name": "submit_extraction"}  # FORZAR este tool
)
```

**tool_choice options:**

• "auto" → Claude decide si usar tools (default)
• "any" → Claude DEBE usar algún tool
• {"type": "tool", "name": "X"} → Claude DEBE usar tool X específicamente
**Para el examen:** tool_use garantiza **schema compliance** (campos y tipos correctos). Pero NO garantiza **semantic**
**correctness** (el contenido puede ser incorrecto). Combinar con validation-retry.

**4.4 Validation-retry loop**

```
max_retries = 3
for attempt in range(max_retries):
    response = get_extraction(text)
    errors = validate(response)
    if not errors:
        break  # Válido
    # Append SPECIFIC errors to prompt (not generic "try again")
    messages.append({
        "role": "user",
        "content": f"Validation errors found:\n"
                   f"- 'email' field is not a valid email: '{response['email']}'\n"
                   f"- 'sentiment' must be one of: positive, negative, neutral\n"
                   f"Please fix these specific issues."
    })
```
**Anti-patrón:** I "That was wrong, try again" (genérico). I Append errores específicos con campo, valor incorrecto, y
valor esperado.

**4.5 Multi-pass review**

```
Pass 1: Per-file local analysis
  → Each file reviewed independently for local issues
Pass 2: Cross-file integration
  → Review how files interact, data flow, consistency
Pass 3: Global architectural review
  → Overall patterns, security boundaries, performance
```
**Anti-patrón del examen:** I Same-session self-review (Claude revisa su propio trabajo en la misma sesión →
reasoning context bias, tiende a confirmar sus decisiones). I Usar sesiones separadas para generator y reviewer.

## Dominio 5: Context Management & Reliability (~15%)

### Lo que necesitas para el examen

**5.1 Progressive summarization risks**

Cuando el contexto se llena, Claude puede "resumir" mensajes anteriores. Riesgos:
• **Lost in the middle:** Información en el medio del contexto se prioriza menos que al inicio o al final
• **Detail loss:** Datos numéricos, IDs, edge cases se pierden en resúmenes
• **Cascading errors:** Un resumen incorrecto contamina todo lo que sigue
**Mitigación:** Usar bloques case facts (datos críticos al inicio del contexto), trim verbose tool outputs, position-aware
ordering (lo más importante al inicio y al final).

**5.2 Escalation patterns**

**Anti-patrón:** I Escalar basándose en sentimiento ("el cliente está enfadado → escalate")
Escalar basándose en: complejidad de tarea, gaps en políticas, límites de autoridad
```
# Criterios de escalación correctos
escalation_criteria = {
    "policy_gap": "No policy covers this situation",
    "authority_limit": "Refund exceeds $500 agent limit",
    "multi_department": "Requires coordination across teams",
    "legal_risk": "Customer mentions legal action",
    "technical_failure": "System error prevents resolution",
}
# NO escalar por:
# - Sentiment score alto (enfado ≠ complejidad)
# - Self-reported confidence bajo (no es fiable)
```

**5.3 Context degradation en sesiones largas**

• **Scratchpad files:** Guardar estado en archivos para liberar contexto
• **/compact:** Compactar manualmente cuando el contexto se llena
• **Subagent delegation:** Delegar subtareas a subagentes con contexto fresh
• **Crash recovery manifests:** Archivo que describe estado para recovery

**5.4 Information provenance**

Cuando Claude sintetiza información de múltiples fuentes:
• **Claim-source mappings:** Cada afirmación debe trazarse a su fuente
• **Temporal data:** Marcar cuándo se obtuvo cada dato
• **Source characterization:** "Well-established" vs "contested" vs "single-source"
• **Confidence indicators:** Field-level confidence, no aggregate

**5.5 Human review: stratified sampling**

**Anti-patrón:** I Revisar solo aggregate accuracy (85% correct overall). Un document type puede tener 50% accuracy
y quedar enmascarado.
**Stratified sampling:** Revisar accuracy por tipo de documento, por categoría, por fuente. Track per-category
metrics.

## Los 10 anti-patrones más importantes del examen

Memoriza estos. Son los distractores más frecuentes:
#
Anti-patrón (I respuesta incorrecta)
Correcto (I)
1 Parsear texto natural para loop termination
```
Usar stop_reason == "end_turn"
```
2 Iteration cap arbitrario como mecanismo principal stop_reason + cap como safety net 3 Prompt-based enforcement para reglas críticas Hooks programáticos (determinista)
4 Self-reported confidence para escalación Criterios estructurados + checks programáticos 5 Escalación basada en sentimiento Escalar por complejidad, policy gaps, autoridad 6 Error genérico ("Operation failed")
isError + errorCategory + isRetryable + context 7 Suprimir errores silenciosamente (empty = success)
Distinguir "no results" de "search failed"
8 18+ tools en un solo agente 4-5 tools por agente, distribuir en especializados 9 Self-review en la misma sesión Sesiones separadas (generator vs reviewer)
10 Aggregate accuracy solamente Per-category/per-type accuracy (stratified)

## Mapeo: 6 escenarios del examen → módulos del curso

Escenario De qué va Lo que ya hiciste Repaso extra

**1. Customer Support**

**Agent**

Agent SDK, escalation, hooks, errors M1, M6, M7, M9 Escalation patterns (D5), structured errors (D2)

**2. Code Generation con**

**Claude Code**

CLAUDE.md, plan mode, commands, TDD M2, M3, M4, M5, M6 @import, context:fork (D3)

**3. Multi-Agent Research**

Hub-and-spoke, context passing, provenance M8, M9 Provenance (D5), fork_session (D1)

**4. Developer Productivity**

Built-in tools, MCP, codebase exploration M1, M5 Tool distribution (D2), .mcp.json (D2)

**5. Claude Code for CI/CD**

-p flag, structured output,
batch API M7, M12, M13 Batch API (D3),
--output-format json (D3)

**6. Structured Data**

**Extraction**

JSON schemas, tool_use, validation-retry Parcial (M2)
tool_use + tool_choice (D4), few-shot (D4)
**Escenarios más fáciles para ti** (>75% cubierto por el curso): 2 (Code Generation) y 5 (CI/CD).
**Escenarios que más estudio extra necesitan:** 1 (Support — escalation patterns) y 6 (Extraction — tool_use
schemas).

## Plan de estudio complementario (4 semanas)

Si ya terminaste el curso, necesitas ~4 semanas adicionales para la certificación:
```
Semana 1: D1 + D2 (Agentic Architecture + Tool Design)
  - Día 1-2: stop_reason, agentic loop lifecycle
  - Día 3: Hub-and-spoke, fork_session
  - Día 4: Structured errors (isError, errorCategory, isRetryable)
  - Día 5: Tool distribution (4-5 max), .mcp.json
  - Día 6: Practice Test D1 + D2
  - Día 7: Review
Semana 2: D3 + D4 (Claude Code Config + Prompt Engineering)
  - Día 1: @import, SKILL.md context:fork
  - Día 2: Batch API, --output-format json
  - Día 3: tool_use con JSON schema, tool_choice
  - Día 4: Few-shot prompting (2-4 examples)
  - Día 5: Validation-retry loops
  - Día 6: Practice Test D3 + D4
  - Día 7: Review
Semana 3: D5 + Anti-patterns
  - Día 1: Progressive summarization, lost in middle
  - Día 2: Escalation patterns (no sentiment, sí complexity)
  - Día 3: Context degradation, scratchpad, /compact
  - Día 4: Provenance, stratified sampling
  - Día 5: Memorizar 10 anti-patrones
  - Día 6: Practice Test D5
  - Día 7: Review
Semana 4: Exam simulation
  - Día 1-2: Full practice exam (50 preguntas)
  - Día 3: Review wrong answers en profundidad
  - Día 4: Segundo practice exam
  - Día 5: Review + gaps
  - Día 6: Tercer practice exam (timed)
  - Día 7: Examen
```

## Preguntas de práctica (20 preguntas estilo examen)

### D1: Agentic Architecture

**Q1.** You're building an agentic loop. What should determine when the loop stops?
A) Parsing Claude's text output for keywords like "done" or "complete"
B) A fixed iteration limit of 10 turns
```
C) Checking response.stop_reason == "end_turn"
```
D) Monitoring token count and stopping at 80% of context window
**C.** stop_reason es el mecanismo determinista. A es un anti-patrón (parsing NL). B es un cap arbitrario (anti-patrón
como mecanismo principal). D no tiene relación con la completitud de la tarea.
**Q2.** You need to ensure refunds above $500 always require human approval. What approach is most reliable?
A) Add to system prompt: "Never process refunds above $500 without approval"
B) Implement a PostToolUse hook that checks refund amount and returns exit code 2 if above $500 C) Ask Claude to self-assess whether the refund needs approval D) Set a tool parameter max_amount: 500 in the tool description
**B.** Hooks programáticos son deterministas. A es prompt-based enforcement (probabilístico, anti-patrón). C es
self-reported confidence (anti-patrón). D solo documenta el límite pero no lo enforcea.
**Q3.** A coordinator agent needs to spawn 3 subagents for parallel research. What must be true about the coordinator's
```
allowedTools?
```
A) It must include "Read", "Write", and "Bash"
B) It must include "Task" to spawn subagents C) It must include all tools that subagents will use D) No special tools needed — any agent can spawn subagents
**B.** allowedTools debe incluir "Task" para que el coordinator pueda crear subagentes. Los subagentes tienen su
propio set de tools, independiente del coordinator.
**Q4.** What is the key risk of task decomposition that is "overly narrow"?
A) Increased token costs B) Coverage gaps — some aspects of the task are missed C) Subagents finish too quickly D) Context window overflow
**B.** Descomposición demasiado estrecha crea gaps de cobertura — partes de la tarea original no se asignan a ningún
subagente.

### D2: Tool Design & MCP

**Q5.** A tool returns an empty result set. How should this be communicated?
```
A) {"results": [], "message": "No data found"}
B) {"isError": true, "message": "No results"}
```
C) {"results": []} (silently return empty)
```
D) {"isError": true, "errorCategory": "not_found", "isRetryable": false}
```
**A.** Un resultado vacío es un resultado exitoso (no un error). B y D lo tratan como error incorrectamente. C es aceptable
pero A es mejor porque distingue explícitamente "no data found" (útil para Claude para decidir qué hacer).
**Q6.** You have 16 tools for a customer service system. What's the recommended approach?
A) Give all 16 tools to a single agent for maximum capability B) Create 3-4 specialized agents with 4-5 tools each, coordinated by a hub agent C) Create 16 single-tool agents D) Give 8 tools to two agents and let them coordinate
**B.** 4-5 tools por agente es el sweet spot. A (16 tools) es un anti-patrón. C (1 tool each) es excesivo overhead. D (8
each) es todavía demasiado por agente.

### D3: Claude Code Config

**Q7.** What does context: fork in a SKILL.md frontmatter mean?
A) The skill creates a git fork of the repository B) The skill runs in a forked context that doesn't affect the main session C) The skill runs with forked permissions (elevated access)
D) The skill forks into parallel execution
**B.** context: fork ejecuta el skill en un contexto separado. Los cambios/exploración no contaminan la sesión principal.
**Q8.** In CI/CD, how should you separate the "generator" and "reviewer" roles?
A) Use the same Claude session for both with different prompts B) Use separate sessions with isolated context for each role C) Use the same session but append "Now switch to reviewer mode"
D) Use different models (Opus for generator, Sonnet for reviewer)
**B.** Sesiones separadas evitan reasoning context bias (anti-patrón: same-session self-review). A y C mantienen el
contexto de razonamiento del generator, lo que sesga la review. D cambia modelo pero no resuelve el sesgo de contexto.

### D4: Prompt Engineering

```
Q9. What does tool_choice: {"type": "tool", "name": "extract_data"} guarantee?
```
A) Both schema compliance and semantic correctness B) Schema compliance (correct fields and types) but NOT semantic correctness C) Semantic correctness but NOT schema compliance D) Neither — it's just a suggestion
**B.** tool_use con schema forzado garantiza que el output tiene los campos y tipos correctos. Pero el contenido
semántico (¿los valores son correctos?) no está garantizado — necesitas validation-retry para eso.
**Q10.** How many few-shot examples should you typically include for ambiguous classification tasks?
A) 0 — let Claude figure it out B) 1 — one example is enough C) 2-4 — cover common cases and edge cases D) 10+ — more examples always better
**C.** 2-4 examples es el sweet spot. 0 deja ambigüedad sin resolver. 1 no cubre edge cases. 10+ consume contexto
innecesariamente y puede causar overfitting.
**Q11.** A validation-retry loop detects errors. What should the retry prompt include?
A) "That was wrong, please try again"
B) The specific validation errors with field names, incorrect values, and expected formats C) The complete original prompt repeated D) A higher temperature setting to get different results
**B.** Errores específicos permiten a Claude corregir exactamente lo que falló. A es genérico (anti-patrón). C desperdicia
contexto. D no resuelve errores de comprensión.

### D5: Context & Reliability

**Q12.** A customer says "I'm going to sue you if this isn't fixed!" What determines escalation?
A) Sentiment analysis — negative sentiment triggers escalation B) Keywords — "sue" triggers automatic escalation C) Task complexity, policy gaps, and authority limits — not sentiment D) Claude's self-assessed confidence level
**C.** Escalación basada en complejidad y gaps de política, no sentimiento (anti-patrón) ni self-reported confidence
(anti-patrón). La mención de "sue" podría ser un factor (legal risk) pero no por sentimiento sino por categoría de riesgo.
**Q13.** Your data extraction pipeline shows 87% aggregate accuracy. A stakeholder asks if it's ready for production.
What should you check?
A) 87% is above the 85% threshold, so it's ready B) Check per-document-type accuracy — some types may be at 50% C) Run more samples to confirm the 87% D) Lower the threshold to 80% to be safe
**B.** Aggregate accuracy puede enmascarar problemas graves en categorías específicas (anti-patrón: aggregate-only
metrics). Stratified sampling por tipo de documento es imprescindible.
**Q14.** In a long-running session, Claude starts making errors about details discussed earlier. What's the most likely
cause?
A) Model degradation over time B) Context degradation — earlier details were lost or summarized C) Rate limiting affecting response quality D) Temperature too high
**B.** Context degradation: en sesiones largas, información del medio del contexto se pierde o resume incorrectamente
(lost in the middle effect). Mitigación: scratchpad files, /compact, subagent delegation.

### Escenarios mixtos

**Q15.** You're configuring Claude Code for a team. Where should shared project conventions go?
A) Each developer's ~/.claude/CLAUDE.md B) The project's CLAUDE.md + .claude/rules/ directory (committed to git)
C) A shared Google Doc that developers reference manually D) The CI/CD pipeline configuration only
**B.** CLAUDE.md + .claude/rules/ en el repo = compartido via git, disponible para todos, versionado. A es per-user (no
compartido). C no es legible por Claude. D solo aplica en CI.
**Q16.** A subagent encounters an error it can't resolve. What should it do?
A) Retry indefinitely until it works B) Silently return empty results to the coordinator C) Attempt local recovery first, then report partial results and the error to the coordinator D) Crash and let the coordinator detect the failure
**C.** Intentar recovery local primero, luego escalar al coordinator con resultados parciales y el error. B es suprimir
errores silenciosamente (anti-patrón). A es loop infinito. D pierde resultados parciales.
**Q17.** Which batch processing approach saves 50% on API costs?
A) Using claude -p in parallel B) Using Message Batches API with 24-hour processing window C) Using Agent Teams with Sonnet workers D) Using RTK token compression
**B.** Message Batches API ofrece 50% de descuento con ventana de 24h para resultados. A no tiene descuento. C es
multi-agent (no batch). D reduce tokens pero no el precio por token.
**Q18.** What's the purpose of "case facts" blocks in a prompt?
A) Legal disclaimers for compliance B) Critical data positioned at the start of context to resist summarization loss C) Examples for few-shot learning D) Test cases for validation
**B.** Case facts blocks colocan datos críticos al inicio del contexto donde son más resistentes a perderse por
summarization. Combate el "lost in the middle" effect.
**Q19.** You need to review Claude's code output. What's the anti-pattern?
A) Using a separate Claude session as reviewer B) Having Claude review its own code in the same session C) Using a different model for review D) Using automated linting before Claude review
**B.** Same-session self-review retiene reasoning context → confirmation bias. Claude tiende a confirmar sus propias
decisiones. A es correcto (sesión separada). C y D son complementarios válidos.
**Q20.** An MCP server provides database access. Where should connection credentials be stored?
A) In .mcp.json committed to git B) In CLAUDE.md C) In ~/.claude.json (user-level, not committed)
D) Hardcoded in the MCP server code
**C.** Credentials personales van en ~/.claude.json (user-level, no se commitea). A commitearía secrets a git. B no es
para secrets. D es hardcoding (anti-patrón universal).

## Recursos oficiales para la certificación

Recurso URL Exam Guide claudecertifications.com/claude-certified-architect/exam-g uide 5 Domain Deep Dives claudecertifications.com/claude-certified-architect/domain s Anti-Patterns Cheatsheet claudecertifications.com/claude-certified-architect/anti-pat terns Scenario Walkthroughs claudecertifications.com/claude-certified-architect/scenari os Practice Questions claudecertifications.com/claude-certified-architect/practic e-questions Register for Exam anthropic.skilljar.com Anthropic Docs docs.anthropic.com
