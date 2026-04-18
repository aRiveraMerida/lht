---
excerpt: "Capítulo 1 de preparación: arquitectura agéntica."
---

# Certificación — Dominio 1: Agentic

# Architecture & Orchestration

**Peso en el examen:** ~25% (el dominio más importante)
**Subtemas:** d1.1 Agentic Loops · d1.2 Multi-Agent Orchestration · d1.3 Hooks & Enforcement · d1.4 Session
Management
**Escenarios relacionados:** #1 Customer Support Agent · #3 Multi-Agent Research System
**Prerequisitos del curso:** M1, M6, M7, M8, M9

## Cómo usar este documento

Cada sección sigue la estructura: **concepto** → **código** → **anti-patrón vs correcto** → **exam tip** → **preguntas de**
**práctica**. Lee el concepto, estudia el código, memoriza los anti-patrones, y responde las preguntas sin mirar la
respuesta.
**Disclaimer:** Este contenido está basado en la documentación oficial de Anthropic y el material de preparación de
claudecertifications.com (sitio de la comunidad). Las preguntas exactas del examen pueden diferir.

## d1.1 Agentic Loops & Core API

### Concepto central

Un agentic loop es un patrón donde Claude itera: planifica → actúa (tool call) → observa (tool result) → decide (continuar o parar). A diferencia de un simple request-response, el agente puede ejecutar múltiples herramientas en secuencia hasta completar su tarea.
**La señal de control es** stop_reason**:**
stop_reason Significado Acción Claude quiere usar una herramienta Ejecutar tool, append result,
```
"tool_use"
```
continuar loop Claude terminó su tarea Salir del loop, retornar respuesta
```
"end_turn"
```
Se agotaron los tokens Manejar como interrupción,
```
"max_tokens"
```
posiblemente continuar

### Código: Agentic loop correcto

```
import anthropic
client = anthropic.Anthropic()
tools = [
    {
        "name": "lookup_customer",
        "description": "Search customer by email or ID",
        "input_schema": {
            "type": "object",
            "properties": {
                "email": {"type": "string"},
                "customer_id": {"type": "string"}
            }
        }
    }
]
messages = [{"role": "user", "content": "Find customer john@example.com and check their order status"}]
# === EL AGENTIC LOOP ===
while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )
    # CLAVE: stop_reason controla el loop
    if response.stop_reason == "end_turn":
        # Claude terminó — extraer respuesta final
        final_text = next(
            (b.text for b in response.content if b.type == "text"), ""
        )
        break
    if response.stop_reason == "tool_use":
        # Claude quiere usar una herramienta
        tool_block = next(
            b for b in response.content if b.type == "tool_use"
        )
        # Ejecutar la herramienta
        result = execute_tool(tool_block.name, tool_block.input)
        # Append assistant response + tool result al historial
        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": result
            }]
        })
        # Loop continúa automáticamente
```

**Flujo paso a paso:**

1. Envías mensaje con tools disponibles
2. Claude responde con stop_reason: "tool_use" + tool call
3. Ejecutas el tool, obtienes resultado
4. Appends: assistant message (con tool_use) + user message (con tool_result)
5. Re-envías → Claude puede hacer otro tool call o terminar
6. Cuando stop_reason == "end_turn" → salir del loop

### I vs I: Loop termination

```
# I ANTI-PATRÓN: Parsear texto natural
while True:
    response = get_response()
    text = response.content[0].text
    if "task complete" in text.lower():  # ← INCORRECTO
        break
    if "I'm done" in text.lower():       # ← INCORRECTO
        break
# Claude puede decir "done" de 100 formas diferentes
# O usar "done" en otro contexto ("the customer is done waiting")
# I ANTI-PATRÓN: Iteration cap como mecanismo principal
MAX_ITERATIONS = 10
for i in range(MAX_ITERATIONS):  # ← INCORRECTO como PRIMARY
    response = get_response()
    # Puede cortar en iteración 10 cuando Claude necesita 11
    # O hacer 10 iteraciones cuando la tarea se completó en 3
# I CORRECTO: stop_reason + safety cap
MAX_ITERATIONS = 50  # Safety net, no mecanismo principal
iteration = 0
while iteration &lt; MAX_ITERATIONS:
    response = client.messages.create(...)
    iteration += 1
    if response.stop_reason == "end_turn":
        break  # Terminación natural ← MECANISMO PRINCIPAL
    if response.stop_reason == "tool_use":
        execute_and_append_tool_result()
        continue
# Safety cap solo se alcanza si algo falla
if iteration &gt;= MAX_ITERATIONS:
    log_warning("Safety cap reached — investigate")
```
**Exam tip:** El cap es aceptable como **safety net**, pero NUNCA como mecanismo principal de parada. La respuesta
correcta siempre menciona stop_reason.

### Preguntas de práctica — d1.1

**P1.** An agentic loop processes customer support tickets. Which signal should the loop check to determine if Claude
has finished processing a ticket?
A) Parse Claude's text for phrases like "ticket resolved" or "case closed"
B) Check if the token count exceeds 80% of the context window
```
C) Check response.stop_reason == "end_turn"
```
D) Count the number of tool calls and stop after 5
**C.** stop_reason == "end_turn" es el único signal determinista y fiable. A es parsing NL (anti-patrón — Claude puede
expresar completitud de muchas formas). B es basado en tokens (irrelevante para completitud de tarea). D es iteration cap como mecanismo principal (anti-patrón).
**P2.** After a tool call returns its result, what must happen before the next API call in the agentic loop?
A) Reset the messages array to only include the latest tool result B) Append both the assistant's response (with tool_use) and the tool result to messages C) Replace the last user message with the tool result D) Send only the tool result without the assistant's previous response
**B.** Hay que appendear AMBOS: el assistant message (que contiene el tool_use block) y el user message (con
tool_result referenciando el tool_use_id). Sin ambos, la API no puede vincular el resultado con la llamada correcta. A pierde historial. C/D rompen la secuencia de mensajes.
**P3.** An agent's agentic loop includes a MAX_ITERATIONS = 10 cap. After 10 iterations, the agent stops even though it
hasn't finished the task. What's the root cause?
A) The model is too slow and needs a faster version B) The iteration cap is being used as the primary stopping mechanism instead of stop_reason C) The tools are taking too long to execute D) The context window is too small
**B.** El cap arbitrario como mecanismo principal corta la ejecución antes de que Claude termine. La solución es usar
stop_reason como mecanismo principal y subir el cap a un valor alto como safety net.

## d1.2 Multi-Agent Orchestration

### Concepto central: Hub-and-spoke

En lugar de un solo agente con todas las herramientas, se usa un **coordinator** que delega a **subagentes**
especializados:
```
COORDINATOR     I ← Orquesta, NO ejecuta trabajo
tools: [Task,
summarize,
format_report]
SubAgent I I SubAgent I I SubAgent
Market  I I  Tech    I I  Legal
4 tools  I I 4 tools  I I 4 tools
```

**Principios clave:**

1. **El coordinator incluye** Task **en allowedTools** — sin esto, no puede spawnar subagentes
2. **4-5 tools por agente** — más de eso degrada calidad de selección
3. **Contexto aislado** — cada subagente recibe SOLO el contexto relevante a su tarea
4. **Múltiples Task calls en paralelo** — si Claude hace 3 Task calls en una respuesta, se ejecutan
simultáneamente
5. **El coordinator NO hace trabajo directo** — solo orquesta y sintetiza

### Código: Hub-and-spoke

```
# Coordinator: orquesta, incluye Task en tools
coordinator = Agent(
    model="claude-sonnet-4-20250514",
    tools=[
        Task,                # REQUERIDO para spawnar subagentes
        summarize_results,   # Sintetizar outputs
        format_report,       # Formato final
    ]
)
# Subagentes: especializados, 4-5 tools cada uno
market_agent = Agent(
    model="claude-sonnet-4-20250514",
    tools=[web_search, read_doc, extract_data, format_citation],
)
tech_agent = Agent(
    model="claude-sonnet-4-20250514",
    tools=[read_code, grep_patterns, analyze_deps, format_report],
)
```

### I vs I: Context passing

```
# I ANTI-PATRÓN: Compartir contexto completo del coordinator
Task(
    prompt="Research market size",
    context=coordinator.full_conversation_history,
    # 90% del contexto es irrelevante para este subagente
    # Desperdicia tokens + confunde al subagente
)
# I CORRECTO: Contexto explícito y específico por subtarea
Task(
    prompt="Research AI infrastructure market size for 2025-2026",
    context="Focus: total addressable market in USD, year-over-year growth rate, top 3 vendors by revenue. Return struct
    # Solo lo que este subagente necesita
)
```

### I vs I: Task decomposition

```
# I ANTI-PATRÓN: Descomposición demasiado estrecha
tasks = [
    "Count lines in file A",
    "Count lines in file B",
    "Count lines in file C",
]
# ¿Quién analiza la relación entre los archivos?
# Coverage gap: ningún subagente sintetiza el panorama completo
# I CORRECTO: Descomposición con cobertura completa
tasks = [
    "Analyze each source file for complexity and dependencies",
    "Identify cross-file integration patterns and potential issues",
    "Synthesize findings into an architectural assessment",
]
# Cada tarea tiene alcance definido
# La síntesis cubre gaps entre análisis individuales
```

### fork_session: Branch sin contaminar

```
# fork_session crea una copia del contexto actual
# Cambios en el fork NO afectan la sesión original
forked = client.fork_session(session_id)
# Útil para:
# - Explorar un approach alternativo sin comprometer el principal
# - Comparar dos soluciones side by side
# - "¿Qué pasaría si...?" sin riesgo
# El fork hereda todo el contexto de la sesión original
# Pero diverge a partir de ese punto
```

### Preguntas de práctica — d1.2

**P4.** A coordinator needs to delegate work to 3 specialized subagents. What must the coordinator's allowedTools
include?
A) All tools from all 3 subagents B) The Task tool C) Only Read and Write tools D) No special tools — any agent can delegate by default
**B.** allowedTools debe incluir Task para poder spawnar subagentes. A le daría demasiadas herramientas al
coordinator. C no incluye Task. D es incorrecto — se necesita Task explícitamente.
**P5.** A coordinator passes its full conversation history to each subagent. What problem does this create?
A) The subagents become faster because they have more context B) The coordinator loses its own context C) Subagents receive irrelevant context that wastes tokens and may confuse their task execution D) The system becomes more secure
**C.** Compartir contexto completo desperdicia tokens y puede confundir al subagente con información irrelevante. Cada
subagente debe recibir SOLO el contexto específico de su tarea.
**P6.** A research task requires exploring two different analytical approaches to compare them. What session
management technique is most appropriate?
A) Use --resume to continue the same session with both approaches sequentially B) Use fork_session to create a branch for each approach without affecting the main session C) Start two completely new sessions with no shared context D) Use a single session and ask Claude to evaluate both approaches simultaneously
**B.** fork_session hereda el contexto actual (que tiene la pregunta de investigación) y permite explorar sin contaminar
la sesión principal. A mezcla los approaches. C pierde el contexto compartido. D puede generar sesgo (evalúa su propio trabajo).
**P7.** Task decomposition for a codebase audit results in 5 narrow subtasks: "Check file A", "Check file B", etc. What is
the primary risk?
A) Too many subagents will be expensive B) Coverage gaps — cross-file issues and interactions between files are missed C) Subagents will duplicate work D) The coordinator will become a bottleneck
**B.** Descomposición demasiado estrecha crea gaps de cobertura. Issues que solo aparecen en la interacción entre
archivos (imports cruzados, data flow, inconsistencias de API) no se detectan si cada subagente solo ve un archivo.

## d1.3 Hooks & Programmatic Enforcement

### Concepto central: Determinista vs Probabilista

Mecanismo Tipo Fiabilidad Usar para
**Hooks** (PreToolUse,
PostToolUse)
Programático 100% Reglas críticas de negocio, compliance, seguridad

**Prompt instructions**

Probabilista ~90-95% Preferencias de estilo, soft guidelines, sugerencias
**Regla del examen:** Si la pregunta es sobre una regla CRÍTICA (refund limits, data access, compliance), la respuesta
SIEMPRE es hooks. Si es sobre preferencias o estilo, prompts son aceptables.

### Código: Hook para business rule enforcement

```
# PostToolUse hook: bloquear refunds &gt; $500
def refund_limit_hook(tool_name, tool_input, tool_output):
    if tool_name == "process_refund":
        amount = tool_input.get("amount", 0)
        if amount &gt; 500:
            return {
                "blocked": True,
                "reason": f"Refund ${amount} exceeds $500 agent limit",
                "action": "escalate_to_human",
                "context": {
                    "customer_id": tool_input.get("customer_id"),
                    "requested_amount": amount,
                    "policy": "Refunds &gt;$500 require manager approval"
                }
            }
    return tool_output  # Pasar sin modificar
agent = Agent(
    model="claude-sonnet-4-20250514",
    tools=[lookup_customer, check_order, process_refund],
    hooks={"PostToolUse": [refund_limit_hook]},
)
```

### Escalation: Criterios válidos vs inválidos

Criterio válido Anti-patrón Policy gap (no hay política que cubra el caso)
Sentimiento negativo del cliente Límite de autoridad excedido (refund > $500)
Self-reported confidence score bajo Cliente solicita explícitamente un humano Número de mensajes en la conversación Complejidad técnica (multi-departamento)
Keywords como "angry" o "frustrated"
Riesgo legal (cliente menciona acciones legales)
Tone analysis score

### Preguntas de práctica — d1.3

**P8.** A customer service agent must never process refunds above $500 without human approval. Which approach is
most reliable?
A) System prompt: "CRITICAL: Never process refunds above $500. Always escalate these to a human agent."
B) A PostToolUse hook that checks the refund amount and blocks execution if it exceeds $500 C) A validation step where Claude re-reads the policy before each refund D) Setting the tool's max_amount parameter to 500 in the description
**B.** Hooks son código determinista — 100% fiable. A es prompt-based (probabilista, Claude puede ignorar). C es
self-review (no garantiza compliance). D documenta el límite pero no lo enforcea — Claude puede aún enviar amount=700.
**P9.** A customer says: "This is absolutely unacceptable! I've been waiting for 3 hours and nobody is helping me.
demand to speak to someone!" What should trigger escalation?
A) Negative sentiment score above threshold B) The customer's explicit request to speak to a human C) Claude's self-assessed confidence that it can't handle the case D) The number of messages exceeding 10 in the conversation
**B.** La solicitud explícita del cliente de hablar con un humano es un criterio objetivo y válido. A es sentiment-based
(anti-patrón). C es self-reported confidence (anti-patrón). D es arbitrario.
**P10.** When should you use prompt-based guidance instead of programmatic hooks?
A) For critical refund limits and compliance rules B) For soft style preferences like "use a friendly tone" or "prefer bullet points"
C) For data access controls and security policies D) For blocking forbidden operations
**B.** Prompt-based guidance es apropiada para preferencias de estilo y sugerencias blandas. Hooks son para reglas
críticas (A, C, D).

## d1.4 Session Management & Workflows

### Operaciones de sesión

Operación Comando/API Qué hace Cuándo usar

**Resume**

Continua sesión anterior
```
--resume
```
con contexto completo Retomar trabajo después de interrupción

**Fork**

Branch de la sesión actual,
```
fork_session
```
contexto heredado Explorar alternativas sin contaminar

**Named session**

Sesión identificable para
```
--session-name "X"
```
organizar workflows Multi-sesión organizada

**New**

(default)
Sesión nueva sin contexto previo Tarea completamente nueva

### Stale context: El riesgo de sesiones largas

```
Session larga (4+ horas):
  Hora 1: Claude lee precio del producto → $99
  Hora 2: Claude trabaja en otra cosa
  Hora 3: El precio cambió a $149 en la DB
  Hora 4: Claude referencia "$99" → INCORRECTO
Mitigación:
  1. Re-fetch datos críticos periódicamente
  2. Scratchpad files para persistir estado actual
  3. /compact para liberar contexto obsoleto
  4. Subagent delegation con contexto fresco
```

### Task decomposition: Prompt chaining vs Dynamic adaptive

Prompt chaining Dynamic adaptive

**Qué es**

Secuencia fija de pasos predefinidos El agente decide el siguiente paso basándose en resultados

**Cuándo**

Tarea predecible, pipeline conocido Tarea impredecible, complejidad variable

**Ejemplo**

"1. Parse CSV → 2. Validate → 3.
Insert DB"
"Analyze codebase for issues. For each: assess severity, if simple fix directly, if complex plan first"

**Ventaja**

Simple, predecible, fácil de debuggear Flexible, se adapta a lo que encuentra

**Riesgo**

No se adapta si un paso falla o cambia Puede divergir, más difícil de controlar

### Preguntas de práctica — d1.4

**P11.** An agent retrieved customer data 3 hours ago in a long-running session. The agent now needs to use that data
for a refund calculation. What risk exists?
A) The data is too large for the context window B) The data may be stale — it could have changed since it was retrieved C) The agent forgot the data because of token limits D) The customer's data is encrypted
**B.** Stale context: datos obtenidos hace horas pueden haber cambiado. Mitigación: re-fetch datos críticos antes de
usarlos en decisiones importantes.
**P12.** A task requires parsing 500 invoices where each invoice follows the same format. Which decomposition strategy
is most appropriate?
A) Dynamic adaptive decomposition B) Prompt chaining with a fixed pipeline (parse → validate → extract → store)
C) Single large prompt with all 500 invoices D) fork_session for each invoice
**B.** Prompt chaining es ideal para tareas predecibles con pipeline conocido. Todos los invoices tienen el mismo formato
→ el pipeline no cambia. A es overkill para tarea uniforme. C desborda el contexto. D crea 500 forks innecesarios.
**P13.** A developer wants to explore an alternative database schema without affecting the current session's work. What
should they use?
A) Start a new session from scratch B) Use --resume to continue the current session C) Use fork_session to branch from the current context D) Use Ctrl+B to run it in background
**C.** fork_session hereda el contexto actual (que incluye la discusión de la DB actual) y permite explorar la alternativa
sin contaminar la sesión principal. A pierde todo el contexto. B continúa la misma sesión (contamina). D es para background tasks, no exploración divergente.

## Resumen de anti-patrones — Dominio 1

#
Anti-patrón (I)
Correcto (I)
Severidad 1 Parsear NL para loop termination Critical
```
stop_reason ==
"end_turn"
```
2 Iteration cap como mecanismo principal stop_reason + cap como safety net Critical 3 Prompt-based enforcement para reglas críticas Hooks programáticos (determinista)
Critical 4 Escalación por sentimiento Escalar por policy gaps, límites, complejidad High 5 Self-reported confidence para escalación Criterios estructurados + checks programáticos High 6 Compartir contexto completo con subagentes Contexto explícito y específico por subtarea High 7 Descomposición demasiado estrecha Incluir tarea de síntesis/integración Medium 8 Ignorar stale context en sesiones largas Re-fetch periódico, scratchpad files Medium

## Exam tips finales — Dominio 1

1. **Siempre** stop_reason **para controlar el loop** — nunca parsear texto
2. **Hooks para business rules, prompts para preferencias** — la distinción es binaria
3. **Subagentes reciben contexto explícito** — nunca heredan automáticamente del coordinator
4. Task **en allowedTools del coordinator** — sin esto no puede spawnar subagentes
5. **fork_session para exploración** — --resume para continuación
6. **Dynamic adaptive para tareas impredecibles** — prompt chaining para pipelines fijos
7. **Stale context es un riesgo real** — re-fetch datos antes de decisiones críticas
