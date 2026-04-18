---
title: "Certificación C4 — Prompt Engineering"
date: "2026-04-18"
description: "Capítulo 4 de preparación: prompt engineering para arquitectos."
excerpt: "Peso en el examen: ~20% Subtemas: d4.1 Explicit Criteria · d4.2 Few-Shot Prompting · d4.3 tool_use Structured Output · d4.4 Validation-Retry & Multi-Pass Escenarios relacionados:…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — Dominio 4: Prompt Engineering

# & Structured Output

**Peso en el examen:** ~20%
**Subtemas:** d4.1 Explicit Criteria · d4.2 Few-Shot Prompting · d4.3 tool_use Structured Output · d4.4 Validation-Retry &
Multi-Pass
**Escenarios relacionados:** #6 Structured Data Extraction · #2 Code Generation
**Prerequisitos del curso:** M2, Prework Área 9

## d4.1 Explicit Criteria & Instruction Design

### Concepto central

En producción, las instrucciones vagas producen resultados inconsistentes y false positives que erosionan la confianza del equipo (alert fatigue). La solución: criterios explícitos y medibles.

### I vs

```
# I VAGO: Resultados inconsistentes, over-flagging
prompt = "Review this code for quality issues. Be thorough."
# Claude flaggea: style nits, naming preferences, functions &gt;10 lines...
# Developers ignoran TODOS los flags → real bugs pasan desapercibidos
# I EXPLÍCITO: Resultados consistentes, accionables
prompt = """Review this code. Flag ONLY:
1. Functions exceeding 50 lines of code
2. Async operations missing try-catch error handling
3. Hardcoded strings matching patterns: sk-, pk-, key-, password=
4. Public functions missing JSDoc documentation
5. SQL queries constructed with string concatenation
For each: file:line, rule violated (1-5), severity, one-line fix."""
# Resultados verificables: ¿la función tiene &gt;50 líneas? Sí/No.
```

**Impact de false positives:**

• Demasiados false positives → developers ignoran la herramienta → **alert fatigue**
• Criterios explícitos → flagging preciso → confianza → adopción

### Preguntas de práctica

**P1.** A code review tool flags 50 issues per PR, but developers report that 80% are false positives. What's the root
cause?
A) The model is too old and needs upgrading B) The prompt uses vague criteria like "find all issues" instead of specific, measurable rules C) The context window is too small D) The tool needs more few-shot examples
**B.** Criterios vagos producen over-flagging. Criterios explícitos y medibles reducen false positives drásticamente. A/C
no son la causa. D puede ayudar pero no resuelve la raíz (criterios vagos).

## d4.2 Few-Shot Prompting

### Reglas de oro

Regla Detalle

**2-4 examples**

Sweet spot. <2 no establece patrón. >6 bloat sin beneficio proporcional

**Formato consistente**

TODOS los examples siguen la misma estructura de output

**Edge case incluido**

Al menos 1 example con caso ambiguo (sarcasmo, mixed, edge)

**Diversidad**

Cubrir categorías diferentes (positive/negative/neutral, simple/complex)

### Código: Few-shot bien estructurado

```
prompt = """Classify support tickets. Output JSON.
Example 1 (Clear — billing):
Input: "I was charged twice for my subscription"
Output: {"category": "billing", "priority": "high", "needs_human": false}
Example 2 (Clear — technical):
Input: "App crashes when I upload large files"
Output: {"category": "technical", "priority": "high", "needs_human": false}
Example 3 (Edge — legal/escalation):
Input: "I want to sue your company for data breach"
Output: {"category": "legal", "priority": "critical", "needs_human": true}
Example 4 (Ambiguous — mixed):
Input: "Great product but billing is confusing"
Output: {"category": "billing", "priority": "medium", "needs_human": false}
Now classify:
Input: "{ticket_text}"
"""
```

### Preguntas de práctica

**P2.** How many few-shot examples should typically be included for an ambiguous classification task?
A) 0 — Claude is smart enough without examples B) 1 — one example is sufficient C) 2-4 — covering common cases and at least one edge case D) 10+ — more examples always improve accuracy
**C.** 2-4 es óptimo. Incluir al menos un edge case. A deja ambigüedad sin resolver. B no establece patrón. D bloat el
prompt sin beneficio proporcional.

## d4.3 Tool Use for Structured Output

### La distinción CRÍTICA del examen

```
tool_use + JSON schema → Garantiza ESTRUCTURA (campos, tipos, enums)
tool_use + JSON schema → NO garantiza SEMÁNTICA (contenido correcto)
Estructura correcta + semántica incorrecta = POSIBLE
Ejemplo: {"name": "John Smith", "date": "2026-01-15"}
  Schema: I (string, string, formato correcto)
  Semántica: I si el nombre real es "Jane Doe" y la fecha es 2025-12-01
```

### tool_choice: 3 modos

```
# AUTO: Claude decide si usar tool
response = client.messages.create(
    tools=[extract_tool],
    tool_choice="auto",  # Default
    # Claude puede responder con texto o con tool_use
)
# ANY: Claude DEBE usar algún tool
response = client.messages.create(
    tools=[extract_tool, search_tool],
    tool_choice="any",
    # Claude elige cuál pero DEBE usar uno
)
# FORCED: Claude DEBE usar tool X específico
response = client.messages.create(
    tools=[extract_tool],
    tool_choice={"type": "tool", "name": "extract_invoice"},
    # Schema compliance GARANTIZADA
)
```

### Schema design: best practices

```
{
  "name": "extract_invoice",
  "input_schema": {
    "type": "object",
    "required": ["vendor_name", "total", "date", "document_type"],
    "properties": {
      "vendor_name": {
        "type": "string",
        "description": "Full legal name of the vendor"
      },
      "total": {
        "type": "number",
        "description": "Total amount in the invoice currency"
      },
      "date": {
        "type": "string",
        "description": "Invoice date in ISO 8601 (YYYY-MM-DD)"
      },
      "document_type": {
        "type": "string",
        "enum": ["standard_invoice", "credit_note", "proforma", "other"]
      },
      "document_type_detail": {
        "type": ["string", "null"],
        "description": "Required if document_type is 'other'"
      },
      "confidence": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "Extraction confidence score"
      }
    }
  }
}
```

**Tips de schema:**

• "required" para campos obligatorios
• "enum" con "other" + campo de detalle para valores inesperados
• ["string", "null"] para campos opcionales
• "description" en cada property para guiar a Claude

### Preguntas de práctica

**P3.** A data extraction pipeline uses tool_choice: {"type": "tool", "name": "extract_data"} with a JSON schema.
A developer claims this eliminates all extraction errors. Is this correct?
A) Yes — forced tool_use with a schema guarantees correct output B) No — tool_use guarantees schema compliance but NOT semantic correctness; values may still be wrong C) No — tool_use doesn't work with forced tool_choice D) Yes — JSON schemas validate both structure and content
**B.** tool_use garantiza ESTRUCTURA (campos presentes, tipos correctos). NO garantiza SEMÁNTICA (valores
correctos). Se necesita validation después de extraction para verificar contenido.
**P4.** You're designing a schema for document classification. The known categories are "invoice", "receipt", and
"contract", but occasionally unknown document types appear. How should you design the enum?
```
A) "enum": ["invoice", "receipt", "contract"] — reject unknown types
B) "enum": ["invoice", "receipt", "contract", "other"] with a separate "document_type_detail" field
```
C) Use a free-text string field instead of enum D) Use two separate fields: one boolean per category
**B.** Enum con "other" + campo de detalle. A rechaza tipos desconocidos (pierde datos). C pierde las ventajas de enum
(consistencia). D no escala y es más complejo.

## d4.4 Validation-Retry Loops & Multi-Pass Review

### Validation-retry: feedback específico

```
# I ANTI-PATRÓN: Retry genérico
messages.append({
    "role": "user",
    "content": "There were errors, please try again"
    # Claude no sabe QUÉ errores → misma respuesta
})
# I CORRECTO: Errores específicos
messages.append({
    "role": "user",
    "content": """Validation failed. Fix these specific errors:
    - 'total' is $450 but line items sum to $500 (mismatch)
    - 'tax' field contains '10%' (percentage) — expected dollar amount
    - 'date' is '15/01/2026' — expected ISO 8601 format (2026-01-15)
    Re-extract with corrections."""
})
# Claude sabe EXACTAMENTE qué corregir
```

### Multi-pass review

```
Pass 1 — LOCAL (per-file):
  Cada archivo revisado independientemente
  Detecta: syntax errors, naming, missing error handling, complexity
Pass 2 — CROSS-FILE (integration):
  Revisa cómo interactúan los archivos entre sí
  Detecta: broken imports, interface mismatches, data flow issues
(Optional) Pass 3 — GLOBAL (architectural):
  Patrones de arquitectura, security boundaries, performance
```

### detected_pattern: tracking de problemas sistemáticos

```
# Si el mismo error aparece en múltiples extracciones:
if error_type in detected_patterns:
    detected_patterns[error_type]["count"] += 1
else:
    detected_patterns[error_type] = {"count": 1, "first_seen": now}
# Después de N extracciones:
for pattern, info in detected_patterns.items():
    if info["count"] &gt; threshold:
        alert(f"Systematic issue: {pattern} seen {info['count']} times")
        # Ajustar prompt o schema para prevenir este patrón
```

### Preguntas de práctica

**P5.** A validation-retry loop detects that the 'date' field is in the wrong format. What should the retry prompt include?
A) "Please try again"
B) "The date field '15/01/2026' is in DD/MM/YYYY format. Expected ISO 8601: YYYY-MM-DD (e.g., 2026-01-15).
Re-extract with corrected format."
C) "Fix the errors and resubmit"
D) Increase temperature to get a different result
**B.** Feedback específico: campo incorrecto, valor actual, formato esperado, ejemplo. A/C son genéricos (anti-patrón). D
no resuelve errores de comprensión.
**P6.** A code review pipeline has Claude generate code and then review its own code in the same session. What's the
problem?
A) The review will be too fast B) The reviewer retains the generator's reasoning context, creating confirmation bias C) Claude can't review code D) The session will run out of tokens
**B.** Same-session self-review = anti-patrón Critical. El reviewer ve por qué el generator tomó cada decisión → tiende a
confirmar en lugar de cuestionar. Usar sesiones separadas.

## Resumen de anti-patrones — Dominio 4

#
Anti-patrón (I)
Correcto (I)
Severidad 1 Instrucciones vagas ("be thorough")
Criterios explícitos y medibles Critical 2 Asumir que tool_use elimina todos los errores tool_use = estructura, NOT semántica. Validar después High 3 Retry genérico ("try again")
Append errores específicos: campo, valor, esperado High 4 Same-session self-review Sesiones separadas para generator y reviewer Critical 5
>6 few-shot examples
2-4 examples con edge case Medium 6 Aggregate accuracy solo Per-category metrics (stratified)
Critical

## Exam tips finales — Dominio 4

1. **Explicit > vague** — siempre. "Flag functions >50 lines" > "flag long functions"
2. **2-4 few-shot examples** con al menos 1 edge case
3. **tool_use = estructura, no semántica** — la distinción más evaluada
4. **tool_choice forced** para extraction. "auto" para general
5. **Validation-retry con errores específicos** — nunca genéricos
6. **Sesiones separadas** para generator vs reviewer — nunca same-session
