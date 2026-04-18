---
title: "Certificación C2 — Tool Design y MCP"
date: "2026-04-18"
description: "Capítulo 2 de preparación: diseño de herramientas y MCP."
excerpt: "Peso en el examen: ~20% Subtemas: d2.1 Tool Descriptions · d2.2 Structured Errors · d2.3 Tool Distribution · d2.4 MCP Config · d2.5 Built-in Tools Escenarios relacionados: #1…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — Dominio 2: Tool Design & MCP

# Integration

**Peso en el examen:** ~20%
**Subtemas:** d2.1 Tool Descriptions · d2.2 Structured Errors · d2.3 Tool Distribution · d2.4 MCP Config · d2.5 Built-in
Tools
**Escenarios relacionados:** #1 Customer Support Agent · #4 Developer Productivity
**Prerequisitos del curso:** M1, M5

## d2.1 Tool Description Best Practices

### Concepto central

Las tool descriptions son la documentación que Claude lee para decidir **cuándo** y **cómo** usar cada herramienta. Una descripción vaga produce selección incorrecta. Una descripción detallada produce uso preciso.

### I vs I: Calidad de tool description

```
// I ANTI-PATRÓN: Descripción vaga
{
  "name": "search",
  "description": "Searches for stuff",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" }
    }
  }
}
// Claude no sabe: ¿qué busca? ¿formato? ¿límites? ¿edge cases?
// I CORRECTO: Descripción completa
{
  "name": "lookup_customer",
  "description": "Search for a customer by email, phone number, or account ID. Returns customer profile including name,
  "input_schema": {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "description": "Customer email (must contain @)"
      },
      "phone": {
        "type": "string",
        "description": "Phone in E.164 format, e.g., +15551234567"
      },
      "account_id": {
        "type": "string",
        "description": "Account ID starting with ACC-, e.g., ACC-12345"
      }
    }
  }
}
```

**Checklist de una buena description:**

• I Propósito claro en 1 frase
• I Formatos de input con ejemplos
• I Constraints y ranges
• I Edge cases documentados
• I Qué significa "no results" (¿error o vacío legítimo?)
• I Cuándo NO usar la herramienta

## d2.2 Structured Error Responses

### Concepto central

Cuando una herramienta falla, el error debe darle a Claude suficiente información para decidir: ¿reintento? ¿pruebo alternativa? ¿escalo?

### Los 4 campos de un error estructurado

Campo Tipo Propósito Ejemplo boolean Distinguir error de
```
isError
```
resultado vacío
```
true
```
string Clasificar el tipo de fallo
```
"timeout", "auth",
errorCategory
"validation",
"not_found", "rate_limit"
```
boolean ¿Tiene sentido reintentar?
true para timeout, false
```
isRetryable
```
para validation object Qué se intentó y qué falló
```
context
{"attempted": "...",
"suggestion": "..."}
```

### La distinción CRÍTICA: Access failure vs Empty result

Este es uno de los conceptos más evaluados en el examen:
```
// SITUACIÓN A: Base de datos está caída → NO pudimos buscar
// Esto es un ACCESS FAILURE
{
  "isError": true,
  "errorCategory": "timeout",
  "isRetryable": true,
  "context": {
    "attempted": "Customer lookup by email: john@test.com",
    "service": "customer-database",
    "timeout_ms": 5000,
    "suggestion": "Retry after 2 seconds or try account ID lookup"
  }
}
// Claude sabe: "la búsqueda FALLÓ — no sé si el cliente existe"
// SITUACIÓN B: Base de datos responde, pero el cliente no existe
// Esto es un EMPTY RESULT (éxito, sin datos)
{
  "isError": false,
  "customers": [],
  "metadata": {
    "searched_by": "email",
    "query": "john@test.com",
    "results_count": 0
  }
}
// Claude sabe: "la búsqueda FUNCIONÓ — el cliente no existe"
// I ANTI-PATRÓN CATASTRÓFICO: DB caída pero retornamos []
{
  "customers": []
}
// Claude piensa: "el cliente no existe"
// Realidad: "¡no pudimos ni buscar!"
// → Claude le dice al cliente "no tenemos su cuenta"
// → El cliente SÍ tiene cuenta pero la DB estaba caída
```

### I vs I: Error messages

```
# I ANTI-PATRÓN: Error genérico
return {"error": "Operation failed"}
# Claude no sabe: ¿qué falló? ¿puede reintentar? ¿qué hacer?
# I ANTI-PATRÓN: Suprimir silenciosamente
return {"results": []}  # Cuando la DB estaba caída
# Claude toma decisiones basándose en datos incorrectos
# I CORRECTO: Error estructurado
return {
    "isError": True,
    "errorCategory": "rate_limit",
    "isRetryable": True,
    "context": {
        "attempted": "Search orders for customer C-123",
        "retry_after_seconds": 30,
        "suggestion": "Wait 30s then retry, or ask customer for order ID directly"
    }
}
```

### Preguntas de práctica — d2.2

**P1.** A tool attempts to connect to a database but the connection times out. The tool returns {"customers": []}. What's
wrong?
A) Nothing — empty results are valid B) The tool should return an error with isError: true because the search was never performed C) The tool should retry automatically without informing the agent D) The tool should throw an exception and crash the agent
**B.** Retornar [] cuando la DB está caída hace que Claude piense "no hay clientes" cuando la realidad es "no pudimos
buscar". Es un error silencioso catastrófico. La respuesta correcta usa isError: true con errorCategory: "timeout"
```
y isRetryable: true.
```
**P2.** An error response contains {"error": "Something went wrong"}. Why is this problematic?
A) The error message is too long B) The agent cannot determine whether to retry, try an alternative, or escalate without structured fields C) The agent will crash if it receives an error D) Error messages should always be in JSON format
**B.** Sin campos estructurados (isError, errorCategory, isRetryable), Claude no tiene información para tomar la decisión
correcta. Necesita saber: ¿es retryable? ¿qué categoría de error? ¿qué se intentó?

## d2.3 Tool Distribution & Selection

### Concepto central: 4-5 tools por agente

La investigación muestra que la calidad de selección de herramientas degrada significativamente por encima de 5 tools. Con 18+ tools, Claude confunde herramientas similares y hace selecciones subóptimas.

### I vs I: Distribución de herramientas

```
# I ANTI-PATRÓN: 18 tools en un agente
overloaded_agent = Agent(
    tools=[
        lookup_customer, update_account, verify_identity,
        find_order, process_refund, update_shipping,
        track_package, send_email, send_sms,
        create_ticket, escalate, search_kb,
        check_inventory, apply_coupon, schedule_callback,
        log_interaction, generate_report, update_preferences,
    ]  # 18 tools → selección degradada
)
# I CORRECTO: Distribuir en agentes especializados
coordinator = Agent(tools=[Task, summarize, format_response])  # 3 tools
customer_agent = Agent(tools=[
    lookup_customer, update_account, verify_identity, check_status
])  # 4 tools
order_agent = Agent(tools=[
    find_order, process_refund, update_shipping, track_package
])  # 4 tools
comms_agent = Agent(tools=[
    send_email, send_sms, create_ticket, escalate_human
])  # 4 tools
```

### tool_choice: Controlar selección

Valor Comportamiento Cuándo usar Claude decide si usar tool y cuál Default, mayoría de casos
```
"auto"
```
Claude DEBE usar algún tool (elige
```
"any"
```
cuál)
Cuando la tarea requiere una herramienta seguro Claude DEBE usar tool X específico Forzar structured output, extracción
```
{"type": "tool", "name": "X"}
```
de datos
```
# Forzar tool específico para structured output
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[...],
    tools=[extract_data_tool],
    tool_choice={"type": "tool", "name": "extract_data"},
    # Claude DEBE usar extract_data → output con schema garantizado
)
```

### Preguntas de práctica — d2.3

**P3.** You have 16 tools for a customer service system. What's the best architecture?
A) One agent with all 16 tools B) Two agents with 8 tools each C) Four specialized agents with 4 tools each, coordinated by a hub agent D) Sixteen single-tool agents
**C.** 4 tools por agente es óptimo. A (16 tools) degrada selección. B (8 tools) sigue siendo demasiado. D (1 tool each) es
overhead excesivo.
**P4.** You need Claude to always respond with structured JSON matching a specific schema. What's the correct
```
tool_choice setting?
A) tool_choice: "auto"
B) tool_choice: "any"
C) tool_choice: {"type": "tool", "name": "submit_extraction"}
```
D) No tool_choice needed — just ask in the prompt
**C.** Forzar tool específico garantiza schema compliance (campos y tipos correctos). A deja la opción abierta. B requiere
algún tool pero no especifica cuál. D es prompt-based (no garantiza schema).

## d2.4 MCP Server Configuration

### Dos niveles de configuración

Archivo Nivel Compartido Secrets Ejemplo Proyecto Via git
```
Usar ${ENV_VAR}
```
Jira, Postgres del
```
.mcp.json
```
proyecto Usuario Personal Aquí van API keys personales
```
~/.claude.json
```

### Código: Configuración correcta

```
// .mcp.json (proyecto — se commitea a git)
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "--read-only"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"   // ← Variable de entorno, NO hardcoded
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@company/jira-mcp-server"],
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_TOKEN": "${JIRA_TOKEN}"       // ← Variable de entorno
      }
    }
  }
}
// I ANTI-PATRÓN: Hardcoding secrets
{
  "mcpServers": {
    "jira": {
      "env": {
        "JIRA_TOKEN": "sk-abc123-real-secret-key"  // ← NUNCA
      }
    }
  }
}
// Este archivo se commitea a git → secret leakeado
```

### Preguntas de práctica — d2.4

**P5.** A team uses an MCP server for their Jira integration. Where should the Jira API token be stored?
A) In .mcp.json with the actual token value B) In CLAUDE.md as a constant C) Using ${JIRA_TOKEN} in .mcp.json with the actual value in environment variables D) In a .env file committed to git
**C.** ${JIRA_TOKEN} en .mcp.json + token real en variables de entorno. A hardcodea secrets. B pone secrets en contexto
de Claude. D commitea secrets a git.

## d2.5 Built-in Tools

### Las 6 herramientas built-in

Tool Qué hace Usar para NO usar cuando

**Read**

Lee contenido de archivos Entender código, examinar datos Bash("cat file.txt")
disponible

**Write**

Crea archivos NUEVOS Archivos que no existen todavía Modificar archivos existentes (usar Edit)

**Edit**

Modifica archivos existentes Cambios targeted en archivos Crear archivos nuevos (usar Write)

**Bash**

Ejecuta shell commands Tests, builds, installs, system ops Operaciones de archivo (usar Read/Write/Edit)

**Grep**

Busca patrones en archivos Encontrar código, strings, patterns Buscar nombres de archivos (usar Glob)

**Glob**

Busca archivos por nombre Encontrar archivos por extensión/pattern Buscar dentro de archivos (usar Grep)

### Selección correcta de tool

```
Task: "Lee el archivo config.json"
Read("config.json")
Bash("cat config.json")
Task: "Crea un nuevo test file"
Write("tests/new-test.ts", content)
Bash("echo '...' &gt; tests/new-test.ts")
Task: "Arregla bug en línea 42 de server.ts"
Edit("server.ts", old_text, new_text)
Write("server.ts", entire_file_content)  // Reescribe todo
Task: "Busca todas las funciones getUserById"
Grep("getUserById", "src/")
Bash("grep -r 'getUserById' src/")
Task: "Encuentra todos los archivos TypeScript de test"
Glob("**/*.test.ts")
Bash("find . -name '*.test.ts'")
Task: "Ejecuta los tests"
Bash("npm test")
  // No hay alternativa built-in — Bash es correcto aquí
```
**Regla:** Si existe una herramienta dedicada, úsala en lugar de Bash. Bash es para operaciones que no tienen
herramienta built-in (tests, builds, installs).

### Preguntas de práctica — d2.5

**P6.** An agent needs to fix a typo on line 15 of a file. Which built-in tool should it use?
A) Write — replace the entire file with corrected content B) Edit — make a targeted change to the specific line C) Bash — use sed to replace the text D) Read — read the file and regenerate it
**B.** Edit hace cambios targeted sin tocar el resto del archivo. A reescribe todo (riesgo de perder contenido). C usa Bash
cuando Edit es más apropiado. D no modifica nada.
**P7.** An agent needs to find all files in the project that import a specific module. Which approach is correct?
```
A) Glob("*/importmodule*")
B) Grep("import.*module_name", "src/")
C) Bash("find . -exec grep -l 'import module_name' {} +")
```
D) Read every file in the project and check manually
**B.** Grep busca DENTRO de archivos por patrones de contenido. A busca por nombre de archivo (Glob), no contenido.
C usa Bash cuando Grep existe. D es ineficiente.

## Resumen de anti-patrones — Dominio 2

#
Anti-patrón (I)
Correcto (I)
Severidad 1 Error genérico ("Operation failed")
isError + errorCategory + isRetryable + context Critical 2 Suprimir errores silenciosamente ([] para DB caída)
Distinguir access failure vs empty result Critical 3 Hardcoding secrets en .mcp.json ${ENV_VAR} para secrets Critical 4 18+ tools en un agente 4-5 tools por agente, distribuir en especializados High 5 Tool descriptions vagas Incluir formats, examples, edge cases, boundaries High 6 Bash para operaciones de archivo Usar Read/Write/Edit/Grep/Glob dedicados Medium 7 Write para modificar archivos existentes Edit para cambios targeted Medium

## Exam tips finales — Dominio 2

1. **isError distingue fallo de resultado vacío** — la distinción más evaluada del dominio
2. **4-5 tools por agente** — respuesta automática cuando preguntan sobre distribución
3. **${ENV_VAR} para secrets** — nunca hardcodear en archivos que se commitean
4. **Grep busca contenido, Glob busca nombres** — conocer la diferencia
5. **Edit para existentes, Write para nuevos** — conocer la distinción
6. **tool_choice forzado para structured output** — garantiza schema, no semantics
