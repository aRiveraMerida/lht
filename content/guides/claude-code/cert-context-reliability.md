---
title: "Certificación C5 — Contexto y fiabilidad"
date: "2026-04-18"
description: "Capítulo 5 de preparación: gestión de contexto y fiabilidad del agente."
excerpt: "Peso en el examen: ~15% Subtemas: d5.1 Context Optimization · d5.2 Escalation & Errors · d5.3 Context Degradation · d5.4 Human Review & Provenance Escenarios relacionados: #1…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — Dominio 5: Context

# Management & Reliability

**Peso en el examen:** ~15%
**Subtemas:** d5.1 Context Optimization · d5.2 Escalation & Errors · d5.3 Context Degradation · d5.4 Human Review &
Provenance
**Escenarios relacionados:** #1 Customer Support · #3 Multi-Agent Research
**Prerequisitos del curso:** M2, M10

## d5.1 Context Optimization & Positioning

### 2 conceptos clave

**1. Progressive summarization destruye detalles:**

```
Original: "John Smith (ACC-12345) order #98765, charged $150 instead of promo $99.99"
Summary 1: "Customer billing issue with promotion"
Summary 2: "Billing issue"
→ Nombre, cuenta, order, montos, promo: TODO perdido
```

**2. "Lost in the middle" effect:**

Información al INICIO y al FINAL del contexto tiene más recall. Información en el MEDIO se pierde más fácilmente.

### La solución: Case facts blocks

```
## CASE FACTS (Do not summarize — reference directly)
Field          | Value
|----------------|------------------------------------|
Customer       | John Smith
Account ID     | ACC-12345
Order          | #98765
Expected Price | $99.99 (promo SUMMER2026)
Charged Price  | $150.00
Overcharge     | $50.01
## RULES
- Refund $50.01 is within $500 agent limit → resolve directly
- Always address as "Mr. Smith"
```

**Principios:**

• Case facts van al INICIO del contexto (high-recall position)
• Son INMUTABLES — nunca se resumen ni comprimen
• Contienen SOLO datos factuales críticos
• Formato tabular para máxima densidad de información

### I vs

```
Depender de que Claude "recuerde" datos de hace 50 mensajes
   → Progressive summarization los destruye
Case facts block al inicio con todos los datos críticos
   → Siempre disponibles, nunca resumidos
Poner info crítica en el medio de un prompt largo
   → Lost in the middle: menos recall
Info crítica al inicio Y al final del prompt
   → Position-aware ordering: máximo recall
```

### Preguntas de práctica

**P1.** In a 50-message customer support conversation, the agent needs to reference the customer's account number
from message 3. What's the safest approach?
A) Trust that Claude remembers it from the conversation history B) Place critical customer data in an immutable "case facts" block at the start of context C) Summarize the conversation every 10 messages to keep it fresh D) Re-ask the customer for their account number
**B.** Case facts blocks preservan datos críticos en high-recall position (inicio del contexto), inmutables ante
summarization. A confía en memoria que se degrada. C destruye detalles. D es mala experiencia de cliente.

## d5.2 Escalation & Error Propagation

### Triggers válidos vs inválidos

```
# I VÁLIDOS (objetivo, auditable)
triggers_validos = {
    "customer_requested_human": True,      # Petición explícita
    "policy_gap": "No policy for this case", # Gap en reglas
    "authority_exceeded": "Refund &gt; $500",  # Límite de negocio
    "capability_limit": "Need DB access",   # Capacidad técnica
    "retry_exhausted": "3 retries failed",  # Agotamiento
}
# I INVÁLIDOS (anti-patrones del examen)
triggers_invalidos = {
    "negative_sentiment": "Customer is angry",  # Sentimiento ≠ complejidad
    "low_confidence": "Model says 60% sure",    # Self-reported unreliable
    "many_messages": "Conversation &gt; 10 msgs",  # Arbitrario
}
```

### Error propagation en multi-agente

```
# Cuando un subagente falla, reportar AL COORDINATOR:
subagent_error = {
    "status": "partial_failure",
    "completed": ["market_size", "growth_rate"],     # Lo que SÍ obtuvo
    "failed": ["competitor_analysis"],                # Lo que falló
    "error": {
        "category": "timeout",
        "isRetryable": True,
        "attempted": "Fetch competitor data from API"
    }
}
# El coordinator decide: retry, alternativa, o escalar
# I ANTI-PATRÓN: Subagente devuelve {} silenciosamente
# El coordinator asume que no hay competitors → decisión incorrecta
```

### Preguntas de práctica

**P2.** A customer writes: "This is ridiculous! I've been waiting 2 hours!" The agent can resolve their issue (a simple
address change). Should the agent escalate to a human?
A) Yes — the customer's negative sentiment warrants human intervention B) No — the task is simple and within the agent's capability, regardless of sentiment C) Yes — waiting 2 hours is a red flag for system issues D) No — but the agent should apologize first and then escalate anyway
**B.** Sentimiento negativo NO es trigger de escalación. La tarea (address change) es simple y está dentro de la
capacidad del agente. Resolver directamente es la acción correcta. A es sentiment-based escalation (anti-patrón).
**P3.** A subagent fails to connect to an external API. It returns {"results": []} to the coordinator. What's wrong?
A) Nothing — empty results are a valid response B) The subagent should report isError: true because it couldn't perform the search — empty results mask the access failure C) The subagent should crash so the coordinator knows something went wrong D) The subagent should retry indefinitely until it succeeds
**B.** Retornar [] cuando la API está caída es un error silencioso. El coordinator asume "no hay datos" cuando la
realidad es "no pudimos buscar". Debe reportar error estructurado con isError, errorCategory, y partial results si los hay.

## d5.3 Context Degradation & Extended Sessions

### Síntomas de degradación

• Claude olvida instrucciones del inicio de la sesión
• Respuestas se vuelven genéricas y menos focalizadas
• Selección de herramientas menos precisa
• Claude repite trabajo que ya hizo

### 4 estrategias de mitigación

Estrategia Cómo Cuándo

**/compact**

Comprime historial de conversación Contexto largo, tarea no terminada

**Scratchpad files**

Persiste estado en archivos externos Estado que debe sobrevivir a /compact

**Subagent delegation**

Delega exploración verbose a subagentes Tareas de investigación extensas

**Crash recovery manifests**

Archivo persistente para recovery de sesión Sesiones overnight, fallos inesperados
```
# Patrón: scratchpad + /compact
agent_instructions = """
1. Create progress.md as scratchpad
2. Record findings after each analysis step
3. When context gets long, use /compact
4. After /compact, re-read progress.md to restore key context
5. Continue from where you left off
"""
```

### Preguntas de práctica

**P4.** An agent has been running for 4 hours. It starts making errors about details from hour 1. What's happening?
A) The model is degrading over time B) Context degradation — earlier information was summarized or lost as context filled up C) Rate limiting is affecting quality D) The tools are returning stale data
**B.** Context degradation: en sesiones largas, información antigua se resume o pierde. Mitigación: scratchpad files para
persistir estado crítico, /compact para liberar espacio, re-fetch datos antes de decisiones.

## d5.4 Human Review & Information Provenance

### Stratified metrics (concepto CRÍTICO del examen)

```
# I ANTI-PATRÓN: Solo aggregate accuracy
accuracy = 950 / 1000  # 95% → "¡Estamos listos para producción!"
# Pero en realidad:
# Invoices:  70/100  = 70%  ← PROBLEMA OCULTO
# Receipts:  880/900 = 97.8%
# El aggregate ENMASCARA el fallo en invoices
# I CORRECTO: Per-document-type metrics
by_type = {
    "invoice":  {"correct": 70,  "total": 100, "accuracy": 70.0},  # I BELOW THRESHOLD
    "receipt":  {"correct": 880, "total": 900, "accuracy": 97.8},  #
    "contract": {"correct": 0,   "total": 0,   "accuracy": "N/A"}, # II NO DATA
}
```

### Information provenance

```
# Cada dato debe trazarse a su fuente
data_with_provenance = {
    "market_size": {
        "value": "$42.3B",
        "source": "IDC Market Report Q4 2025",
        "confidence": "high",           # well-established
        "retrieved_at": "2026-03-28T10:00:00Z",
        "agent": "market_researcher"
    },
    "growth_rate": {
        "value": "23% YoY",
        "source": "Industry blog post",
        "confidence": "medium",          # single source
        "retrieved_at": "2026-03-28T10:05:00Z",
        "agent": "market_researcher"
    }
}
# Si dos fuentes conflictan → ANOTAR, no resolver silenciosamente
conflicts = {
    "market_size": {
        "source_a": {"value": "$42.3B", "source": "IDC"},
        "source_b": {"value": "$38.7B", "source": "Gartner"},
        "status": "contested",
        "recommendation": "Use IDC (more recent, primary research)"
    }
}
```

**Categorías de confianza:**

• **Well-established:** Múltiples fuentes coinciden, datos verificados
• **Single-source:** Una sola fuente, no verificado independientemente
• **Contested:** Fuentes en conflicto
• **Inferred:** Derivado por el agente, no dato directo

### Preguntas de práctica

**P5.** An extraction pipeline shows 95% aggregate accuracy across 1,000 documents. A stakeholder asks if it's
production-ready. What should you check?
A) 95% is above the 85% threshold — deploy immediately B) Check accuracy per document type — some categories may be significantly below threshold C) Run more documents to confirm the 95% D) Lower the threshold to 90% to give more margin
**B.** Aggregate accuracy enmascara fallos por categoría. Invoices a 70% + receipts a 98% puede promediar 95%.
Stratified metrics revelan problemas ocultos. A toma la decisión sin datos suficientes.
**P6.** Two subagents report conflicting market size data: $42.3B (IDC) vs $38.7B (Gartner). How should the coordinator
handle this?
A) Average the two numbers: $40.5B B) Use the larger number as it's more optimistic C) Annotate both sources with confidence levels and mark the claim as "contested"
D) Discard both and report "data unavailable"
**C.** Annotate conflicts con fuentes, confianza, y marcar como "contested". El downstream consumer decide. A pierde la
nuance. B es sesgo. D pierde datos útiles.

## Resumen de anti-patrones — Dominio 5

#
Anti-patrón (I)
Correcto (I)
Severidad 1 Progressive summarization de datos críticos Case facts blocks inmutables al inicio Critical 2 Aggregate accuracy solamente Per-document-type metrics (stratified)
Critical 3 Escalación por sentimiento Escalación por policy gaps, límites, complejidad High 4 Sin provenance tracking Claim-source mappings con confianza + timestamp High 5 Resolver conflictos silenciosamente Anotar conflictos con fuentes y confianza High 6 Ignorar context degradation Scratchpad files + /compact + subagent delegation Medium

## Exam tips finales — Dominio 5

1. **Case facts blocks** = datos críticos inmutables al inicio del contexto
2. **Lost in the middle** = info al inicio y final tiene más recall
3. **Sentimiento** ≠ **complejidad** — nunca escalar por sentimiento
4. **Stratified metrics** > aggregate — siempre per-document-type
5. **Provenance** = source + confidence + timestamp + agent ID
6. **Scratchpad files** sobreviven a /compact y resets de sesión
