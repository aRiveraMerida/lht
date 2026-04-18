---
title: "Módulo 9 — Subagentes"
date: "2026-04-18"
description: "Subagentes especializados: diseño, configuración y patrones de orquestación."
excerpt: "Dependencias: Módulos 1-8 (especialmente M5 Skills, M7 Agent SDK preview, M8 Agent Teams) Modalidad: 100% práctica con arquitecturas multi-agente Actualizado: Marzo 2026 Al…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Módulo 9: Subagentes y Agent SDK

**Duración:** 5-6 horas
**Nivel:** Avanzado
**Dependencias:** Módulos 1-8 (especialmente M5 Skills, M7 Agent SDK preview, M8 Agent Teams)
**Modalidad:** 100% práctica con arquitecturas multi-agente
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Definir subagentes** en .claude/agents/ con roles, permisos y herramientas específicas
2. **Usar el Agent tool** (renombrado de Task tool) para spawning programático de subagentes
3. **Dominar el Agent SDK** (Python/TypeScript) en profundidad: sesiones, guardrails, hooks como callbacks
4. **Implementar pipelines multi-stage** (analyzer → designer → implementer → tester)
5. **Configurar hooks de subagentes** (SubagentStart, SubagentStop) en settings.json
6. **Diferenciar** Agent Teams (M8, coordinación automática) vs subagentes (control programático)
7. **Diseñar arquitecturas** de subagentes especializados con least-privilege

## 1. Fundamentos: Subagentes vs Agent Teams

### 1.1 Lo que ya sabes (resumen de M7-M8)

En M7 aprendiste a usar el Agent SDK como alternativa a bash para Ralph loops. En M8 aprendiste Agent Teams (coordinación automática por Opus). Ahora profundizamos en el **control programático** de agentes individuales.
Agent Teams (M8)
Subagentes (M9)
Opus decide cómo descomponer
**TÚ** defines cada agente
Workers automáticos Agentes con roles explícitos ~7x tokens (overhead de coordinación)
Control de costo por agente Ideal: "hazlo todo, tú decides cómo"
Ideal: "yo diseño la arquitectura de agentes"
Feature nativa de Claude Code
```
.claude/agents/ + Agent SDK
```

### 1.2 Los 3 mecanismos de subagentes

```
MECANISMOS DE SUBAGENTES
1. .claude/agents/  (archivos markdown)
→ Definir agentes con frontmatter YAML
→ Invocar con @ desde la sesión interactiva
→ Similar a skills pero con rol de AGENTE
2. Agent tool (Claude invoca internamente)
→ Claude decide spawnar subagentes
→ Cada subagente hereda contexto parcial
→ El agente principal coordina
3. Agent SDK (programático)
→ Python/TypeScript: query(), sesiones, streaming
→ Guardrails de costo (max_budget_usd)
→ Hooks como callbacks, MCP custom, structured output
→ Orquestación desde tu código
```

### 1.3 Cuándo usar cada mecanismo

```
¿Quieres definir un agente reutilizable con rol fijo?
  → .claude/agents/ (reviewer, tester, documenter)
¿Quieres que Claude decida cuándo spawnar workers?
  → Agent tool (Claude lo usa internamente)
¿Quieres orquestar desde Python/TS con control programático?
  → Agent SDK (pipelines, guardrails, integración con sistemas)
¿Quieres que Claude coordine todo automáticamente?
  → Agent Teams (M8) — no es control programático
```

## 2. .claude/agents/: Definir subagentes con roles

### 2.1 Estructura

Los subagentes se definen como archivos markdown en .claude/agents/:
```
.claude/agents/
reviewer.md         # Code reviewer (read-only)
tester.md           # Test writer (read + write tests)
documenter.md       # Documentation writer
security-auditor.md # Security analysis (read-only)
```

### 2.2 Anatomía de un agente

```
# .claude/agents/reviewer.md
---
name: reviewer
description: Code review specialist — security, performance, maintainability
allowed-tools: Read, Grep, Glob
model: claude-sonnet-4-6
---
# Code Reviewer
## Role
You are a senior code reviewer. You analyze code for security vulnerabilities,
performance issues, and maintainability problems. You NEVER modify code —
only read and report.
## Process
1. Read the files or diff specified
2. Analyze for:
   - Security: SQL injection, XSS, auth bypass, secrets exposure
   - Performance: N+1 queries, unnecessary loops, memory leaks
   - Maintainability: naming, complexity, duplication, missing tests
3. Report findings with severity levels
## Output format
For each finding:
- **Severity**: I Critical | I Warning | I Info
- **File:line**: exact location
- **Issue**: clear description
- **Fix**: suggested change (describe, don't implement)
## Constraints
- You have read-only access — you cannot edit files
- Focus on logic errors, not style (formatters handle style)
- Security issues are ALWAYS I Critical
- Flag at least 1 positive aspect of the code reviewed
```

### 2.3 Campos del frontmatter

Campo Efecto Ejemplo Identificador para invocar con @
```
reviewer → @reviewer
name
```
Lo que Claude lee para decidir
```
description
```
cuándo es relevante "Code review specialist"
**Restricción de herramientas** —
```
allowed-tools
```
security by design
```
Read, Grep, Glob (solo lectura)
```
Modelo específico para este agente
```
claude-sonnet-4-6 o
model
claude-opus-4-6
```

### 2.4 Invocar subagentes

```
# Desde sesión interactiva:
@reviewer analiza los cambios recientes en @src/auth/
# Claude spawna el subagente reviewer con:
# - Solo herramientas Read, Grep, Glob
# - El prompt del archivo reviewer.md
# - El modelo especificado
# - Acceso al contexto solicitado (src/auth/)
# El subagente ejecuta y retorna resultados al agente principal
```

### 2.5 Diferencia con skills

```
.claude/agents/
.claude/skills/
```
Define un **ROL** (quién es el agente)
Define un **WORKFLOW** (qué proceso seguir)
allowed-tools restringe herramientas allowed-tools restringe herramientas Se invoca con @nombre Se invoca con /nombre o auto-activación Es un **agente separado** con su propio contexto Es una **instrucción** para el agente actual Ejemplo: @reviewer (otro agente que revisa)
Ejemplo: /tdd (proceso que el agente actual sigue)

## 3. Ejercicio práctico 1: Crear suite de subagentes

### Objetivo

Crear 4 subagentes especializados y usarlos en un workflow real.

### Paso 1: Crear los agentes

```
cd library-api  # Tu proyecto de M3-M8
mkdir -p .claude/agents
crea 4 subagentes en .claude/agents/:
1. reviewer.md
   - allowed-tools: Read, Grep, Glob
   - Rol: code review con foco en seguridad y performance
   - Output: findings con severidad (I/I/I)
2. tester.md
   - allowed-tools: Read, Write(tests/**), Bash(npx vitest *)
   - Rol: identificar gaps de testing y escribir tests
   - Constraints: solo puede escribir en tests/, no en src/
3. documenter.md
   - allowed-tools: Read, Write(agent_docs/**), Write(*.md)
   - Rol: actualizar documentación basándose en código actual
   - Output: archivos markdown actualizados
4. security-auditor.md
   - allowed-tools: Read, Grep, Glob
   - Rol: auditoría de seguridad OWASP top 10
   - Output: reporte estructurado con CVE references si aplica
```

### Paso 2: Usar los agentes

```
# Test 1: Review
@reviewer analiza @src/services/BookService.js
y @src/routes/books.js
# Test 2: Testing
@tester identifica qué tests faltan para @src/validators/
y escríbelos
# Test 3: Documentation
@documenter actualiza @agent_docs/api-reference.md
con los endpoints actuales del proyecto
# Test 4: Security
@security-auditor audita todo el directorio @src/
con foco en SQL injection y auth bypass
```

### Paso 3: Verificar restricciones

```
# Verificar que reviewer NO editó archivos
git status
# Debería estar limpio (reviewer es read-only)
# Verificar que tester SOLO escribió en tests/
git diff --name-only
# Solo debería mostrar archivos en tests/
# Verificar que documenter SOLO escribió markdown
git diff --name-only
# Solo debería mostrar archivos .md
```

### Entregable

1. 4 archivos en .claude/agents/ con frontmatter completo
2. Log de uso de cada agente con output
3. Evidencia de que allowed-tools restringe correctamente
4. Comparación: resultado de @reviewer vs @security-auditor (overlap + diferencias)

## 4. Hooks de subagentes: SubagentStart y SubagentStop

### 4.1 Eventos disponibles

En M6 aprendiste hooks con eventos como PreToolUse y Stop. Para subagentes hay eventos específicos:
Evento Cuándo Uso Cuando se crea un subagente Logging, configurar entorno
```
SubagentStart
```
Cuando un subagente termina Recoger resultados, notificar
```
SubagentStop
```

### 4.2 Configurar hooks de subagentes

```
{
  "hooks": {
    "SubagentStart": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo \"$(date): Subagent started\" &gt;&gt; .claude/subagent.log"
        }]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo \"$(date): Subagent completed\" &gt;&gt; .claude/subagent.log"
        }],
        "hooks": [{
          "type": "http",
          "url": "https://webhook.site/tu-uuid",
          "method": "POST",
          "headers": { "Content-Type": "application/json" },
          "body": "{\"event\": \"subagent_completed\"}"
        }]
      }
    ]
  }
}
```

### 4.3 Herencia de hooks

**Los subagentes heredan los hooks del agente principal.** Esto significa que si tienes un hook PostToolUse que
formatea con Black, los subagentes también formatearán automáticamente.
**Implicación:** No necesitas configurar hooks por subagente — se heredan. Si quieres hooks diferentes para
subagentes, necesitas usar el Agent SDK (sección 5) donde puedes pasar configuración por agente.

## 5. Agent SDK en profundidad

### 5.1 Repaso: lo que ya sabes de M7

En M7 instalaste el SDK y lo usaste como alternativa a bash para Ralph loops:
```
from claude_agent_sdk import query, ClaudeAgentOptions
async for message in query(
    prompt="...",
    options=ClaudeAgentOptions(
        max_turns=15,
        max_budget_usd=2.0,
    ),
):
    ...
```
Ahora vamos más allá.

### 5.2 Sesiones multi-turn con estado

```
from claude_agent_sdk import ClaudeSDKClient
async def multi_turn_session():
    client = ClaudeSDKClient()
    # Turn 1: Análisis
    response1 = await client.send(
        prompt="Analiza la estructura de @src/ y lista los módulos principales",
        options=ClaudeAgentOptions(
            max_turns=5,
            allowed_tools=["Read", "Grep", "Glob"],  # Solo lectura
        ),
    )
    analysis = response1.result
    # Turn 2: Implementación basada en análisis
    response2 = await client.send(
        prompt=f"Basándote en este análisis:\n{analysis}\n\nImplementa un nuevo módulo de notificaciones siguiendo los m
        options=ClaudeAgentOptions(
            max_turns=20,
            allowed_tools=["Read", "Write", "Edit", "Bash"],
            max_budget_usd=5.0,
        ),
    )
    # Turn 3: Verificación
    response3 = await client.send(
        prompt="Ejecuta todos los tests y reporta el resultado",
        options=ClaudeAgentOptions(
            max_turns=5,
            allowed_tools=["Bash"],
        ),
    )
    await client.close()
```
**Ventaja sobre headless mode:** El cliente mantiene estado entre turns — el agente recuerda lo que hizo en turns
anteriores sin necesidad de PROGRESS.md.

### 5.3 Subagentes programáticos

```
async def pipeline_with_subagents():
    client = ClaudeSDKClient()
    # Subagente 1: Analyzer (read-only)
    analyzer_result = await client.send(
        prompt="Analiza src/auth/ para vulnerabilidades de seguridad",
        options=ClaudeAgentOptions(
            model="claude-sonnet-4-6",
            allowed_tools=["Read", "Grep"],
            max_turns=10,
            max_budget_usd=1.0,
        ),
    )
    # Subagente 2: Implementer (basado en análisis)
    impl_result = await client.send(
        prompt=f"""
        El análisis de seguridad encontró estos issues:
        {analyzer_result.result}
        Corrige cada issue. Usa TDD: escribe test primero, luego fix.
        """,
        options=ClaudeAgentOptions(
            model="claude-sonnet-4-6",
            allowed_tools=["Read", "Write", "Edit", "Bash"],
            max_turns=25,
            max_budget_usd=3.0,
        ),
    )
    # Subagente 3: Verificador (read-only + bash para tests)
    verify_result = await client.send(
        prompt="Ejecuta tests y /security-review. Reporta si los issues fueron resueltos.",
        options=ClaudeAgentOptions(
            model="claude-sonnet-4-6",
            allowed_tools=["Read", "Bash"],
            max_turns=10,
            max_budget_usd=1.0,
        ),
    )
    print(f"Pipeline complete. Verification: {verify_result.result[:200]}")
    await client.close()
```

### 5.4 Guardrails del SDK

Guardrail Efecto Ejemplo Límite de turnos por invocación
```
max_turns
max_turns=15
```
Tope de gasto en dólares
```
max_budget_usd
max_budget_usd=5.0
```
Herramientas permitidas
```
allowed_tools
["Read", "Grep"]
```
Modelo por agente Sonnet para workers, Opus para
```
model
```
análisis Modo de permisos
```
"bypassPermissions" para CI/CD
permission_mode
```
Cargar CLAUDE.md + .claude/
```
setting_sources
["project", "user"]
```

### 5.5 Hooks como callbacks Python

En lugar de hooks shell en settings.json, el SDK permite hooks como funciones Python:
```
async def on_tool_use(event):
    """Se ejecuta cuando el agente usa una herramienta"""
    if event.tool_name == "Write" and ".env" in event.file_path:
        raise PermissionError("Cannot write to .env files")
async def on_message(event):
    """Se ejecuta con cada mensaje del agente"""
    print(f"  [{event.role}]: {event.content[:100]}")
result = await client.send(
    prompt="Implementa feature X",
    options=ClaudeAgentOptions(
        max_turns=20,
        on_tool_use=on_tool_use,     # Hook programático
        on_message=on_message,        # Logging en tiempo real
    ),
)
```

### 5.6 Structured output

```
from pydantic import BaseModel
class SecurityReport(BaseModel):
    findings: list[dict]  # {severity, file, line, issue, fix}
    total_critical: int
    total_warning: int
    summary: str
result = await client.send(
    prompt="Analiza src/ para vulnerabilidades",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Grep"],
        response_format=SecurityReport,  # Structured output
    ),
)
report: SecurityReport = result.structured
print(f"Critical: {report.total_critical}, Warning: {report.total_warning}")
```
**Nota:** La API exacta del Agent SDK (nombres de métodos, parámetros de ClaudeAgentOptions, formato de
callbacks) puede evolucionar entre versiones. Verifica siempre en la documentación oficial:
docs.anthropic.com/en/docs/claude-code/sdk y el repositorio anthropics/claude-agent-sdk-python (~5.745#).

## 6. Ejercicio práctico 2: Pipeline multi-stage con Agent SDK

### Objetivo

Implementar un pipeline de 4 stages usando el Agent SDK con subagentes especializados.

### Pipeline: Analyze → Design → Implement → Verify

```
# pipeline.py
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
async def run_pipeline():
    client = ClaudeSDKClient()
    # Stage 1: ANALYZE (read-only)
    print("III Stage 1: ANALYZE III")
    analysis = await client.send(
        prompt="""Analiza el proyecto library-api:
        1. Lista todos los endpoints existentes
        2. Identifica qué tests existen y su coverage
        3. Detecta funcionalidad faltante
        4. Reporta en formato JSON estructurado""",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Grep", "Glob", "Bash"],
            max_turns=10,
            max_budget_usd=1.0,
        ),
    )
    print(f"  Analysis: {analysis.result[:200]}...")
    # Stage 2: DESIGN (read-only, basado en análisis)
    print("\nIII Stage 2: DESIGN III")
    design = await client.send(
        prompt=f"""Basándote en este análisis:
        {analysis.result}
        Diseña un módulo de "reading lists" que permita a usuarios
        crear listas de libros (como playlists). Define:
        1. Modelo de datos (tablas, relaciones)
        2. Endpoints REST
        3. Reglas de negocio
        4. Strategy de testing""",
        options=ClaudeAgentOptions(
            allowed_tools=["Read"],
            max_turns=8,
            max_budget_usd=1.0,
        ),
    )
    print(f"  Design: {design.result[:200]}...")
    # Stage 3: IMPLEMENT (full tools, basado en diseño)
    print("\nIII Stage 3: IMPLEMENT III")
    implementation = await client.send(
        prompt=f"""Implementa el módulo de reading lists según este diseño:
        {design.result}
        Usa TDD:
        1. Escribe tests primero
        2. Implementa código para pasar tests
        3. Ejecuta tests para confirmar GREEN
        4. Actualiza documentación""",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Write", "Edit", "Bash"],
            max_turns=30,
            max_budget_usd=5.0,
        ),
    )
    print(f"  Implementation: {implementation.result[:200]}...")
    # Stage 4: VERIFY (lectura + bash para tests)
    print("\nIII Stage 4: VERIFY III")
    verification = await client.send(
        prompt="""Verifica la implementación:
        1. Ejecuta todos los tests (npx vitest run)
        2. Genera reporte de coverage
        3. Ejecuta /security-review
        4. Lista cualquier issue encontrado""",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Bash", "Grep"],
            max_turns=10,
            max_budget_usd=1.0,
        ),
    )
    print(f"\n  Verification: {verification.result[:200]}...")
    await client.close()
    print("\nI Pipeline complete!")
asyncio.run(run_pipeline())
```

### Ejecutar

```
cd library-api
python pipeline.py
```

### Entregable

1. pipeline.py funcional con 4 stages
2. Módulo "reading lists" implementado y verificado
3. Log de cada stage con output
4. Métricas: tokens por stage, costo total, tiempo
5. Análisis: ¿qué stage consumió más? ¿por qué?

## 7. Ejercicio práctico 3: Orquestación avanzada (10+ agentes)

### Objetivo

Diseñar y ejecutar un proyecto con múltiples subagentes coordinados.

### Proyecto: Sistema de recomendaciones para library-api

**Subdividido en agentes:**

#
Agente allowed-tools Tarea 1 Requirement Analyzer Read, Grep Analizar qué datos tenemos para recomendar 2 Algorithm Designer Read Diseñar algoritmo de recomendación 3 Model Writer Read, Write(src/models/**)
Crear modelos de datos necesarios 4 Migration Writer Read, Write(db/**), Bash Crear migraciones de DB 5 Service Writer Read,
Write(src/services/**)
Implementar lógica de recomendación 6 Route Writer Read, Write(src/routes/**)
Crear endpoints de API 7 Unit Test Writer Read, Write(tests/unit/**),
Bash Tests unitarios 8 Integration Test Writer Read,
Write(tests/integration/**),
Bash Tests de integración 9 Security Auditor Read, Grep Auditoría de seguridad 10 Documenter Read, Write(*.md)
Documentación completa

### Implementación con SDK

```
# orchestrate.py
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
AGENTS = [
    {"name": "Requirement Analyzer", "tools": ["Read", "Grep"], "budget": 1.0,
     "prompt": "Analiza qué datos de libros, reviews y usuarios tenemos. Reporta qué podemos usar para recomendaciones."
    {"name": "Algorithm Designer", "tools": ["Read"], "budget": 1.0,
     "prompt": "Diseña algoritmo de recomendación basado en: {prev}. Opciones: collaborative filtering, content-based, h
    # ... definir los 10 agentes
]
async def run_orchestration():
    client = ClaudeSDKClient()
    results = {}
    for i, agent in enumerate(AGENTS):
        print(f"\nIII Agent {i+1}/{len(AGENTS)}: {agent['name']} III")
        # Inyectar resultados previos si el prompt los referencia
        prompt = agent["prompt"]
        if "{prev}" in prompt:
            prev_results = "\n".join(f"[{k}]: {v[:200]}" for k, v in results.items())
            prompt = prompt.replace("{prev}", prev_results)
        result = await client.send(
            prompt=prompt,
            options=ClaudeAgentOptions(
                allowed_tools=agent["tools"],
                max_budget_usd=agent["budget"],
                max_turns=15,
            ),
        )
        results[agent["name"]] = result.result
        print(f"  Done: {result.result[:100]}...")
    await client.close()
    print(f"\nI All {len(AGENTS)} agents completed!")
asyncio.run(run_orchestration())
```

### Entregable

1. orchestrate.py con 10 agentes definidos
2. Sistema de recomendaciones funcional
3. Diagrama de dependencias entre agentes
4. Métricas por agente (tokens, tiempo, costo)
5. Análisis: ¿qué agentes podrían ejecutarse en paralelo?

## 8. Ejercicio integrador: Pipeline completo con .claude/agents/ + SDK

### Descripción

Combinar subagentes declarativos (.claude/agents/) con orquestación programática (SDK) para un proyecto real.

### Tarea

1. **Definir 4 agentes** en .claude/agents/ (reviewer, tester, documenter, security-auditor)
2. **Crear pipeline SDK** que:
• Lee el proyecto actual
• Invoca cada agente vía SDK con sus permisos específicos
• Recopila resultados en un reporte consolidado
• Genera QUALITY_REPORT.md con findings de todos los agentes
3. **Configurar hooks** SubagentStart/SubagentStop para logging
4. **Comparar** resultados de pipeline SDK vs uso manual de @reviewer

### Entregable

1. 4 archivos en .claude/agents/
2. quality_pipeline.py que orquesta los 4 agentes
```
3. QUALITY_REPORT.md consolidado
```
4. Hooks de subagentes configurados en settings.json
5. Comparación: pipeline SDK vs @reviewer manual (tiempo, completitud, calidad)

## 9. Conceptos clave para memorizar

### Los 3 mecanismos

```
.claude/agents/   → Declarativo, roles fijos, invocar con @nombre
Agent tool        → Claude decide cuándo spawnar workers
Agent SDK         → Programático, guardrails, pipelines
```

### Least privilege por rol

```
Reviewer:  Read, Grep, Glob           → Solo lectura
Tester:    Read, Write(tests/**), Bash → Lee código, escribe tests
Writer:    Read, Write, Edit, Bash     → Full access
Auditor:   Read, Grep                  → Solo lectura
```

### Pipeline > Big Bang

```
Big Bang: "Implementa todo el sistema"
→ Un agente hace todo → difícil de revisar → propenso a errores
Pipeline: Analyze → Design → Implement → Verify
→ Cada stage validado → errores detectados temprano
→ Cada agente con permisos mínimos → seguridad por diseño
```

### Agent SDK vs .claude/agents/

```
.claude/agents/  → Uso interactivo desde el REPL con @nombre
Agent SDK        → Uso programático desde Python/TS
Ambos            → Definen roles con permisos específicos
```

## 10. Antipatrones a evitar

**Subagente con demasiadas responsabilidades** → "Analyze, design, implement, test" en un solo agente →
Separar en 4
**Todos los subagentes con full access** → Reviewer que puede editar = reviewer que edita por error → Least
privilege
**Pipeline sin structured handoffs** → Output de Stage 1 en texto libre que Stage 2 no parsea bien → Definir formato
de output
**Master que hace trabajo de workers** → Si el agente principal implementa código, ¿para qué subagentes? →
Master solo orquesta
**SDK sin guardrails** → Sin max_budget_usd, un agente puede consumir tokens indefinidamente → Siempre poner
límites
**Confundir agents/ con skills/** → Agents = roles (quién). Skills = workflows (qué proceso). Complementarios, no
intercambiables
**10 agentes para tarea simple** → Overhead de coordinación > beneficio. Para tareas de 1 hora, un agente basta

## 11. Recursos complementarios

### Repositorios oficiales

• anthropics/claude-agent-sdk-python (~5.745#) — SDK Python
• anthropics/claude-code (~81.600#) — .claude/agents/ docs

### Repositorios de comunidad

• VoltAgent/awesome-claude-skills — 100+ subagentes con tool permissions
• shinpr/ai-coding-project-boilerplate — 10 agentes especializados
• obra/superpowers — Skills + agentes battle-tested

### Documentación oficial

• Agent SDK overview — Python/TypeScript SDK
• CLI Reference — subagents — Flags y opciones
• Hooks — SubagentStart/SubagentStop — Eventos de subagentes

### Lecturas

• Anthropic: Equipping Agents for the Real World with Agent Skills — Arquitectura de agentes
• Anthropic: Effective Harnesses for Long-Running Agents — Pipeline patterns (preview M10)

## 12. Checklist de finalización del módulo

Creé 4 subagentes en .claude/agents/ con frontmatter completo Invoqué subagentes con @nombre desde la sesión interactiva Verifiqué que allowed-tools restringe herramientas correctamente Entiendo la diferencia entre .claude/agents/ y .claude/skills/ Configuré hooks SubagentStart/SubagentStop en settings.json Implementé pipeline multi-stage con Agent SDK (4 stages)
Usé guardrails del SDK (max_budget_usd, max_turns, allowed_tools)
Implementé sesión multi-turn con ClaudeSDKClient Orquesté 10+ agentes en proyecto complejo Completé ejercicio integrador (agents/ + SDK + hooks)
Puedo decidir cuándo usar Agent Teams (M8) vs subagentes (M9)
Puedo diseñar arquitectura de agentes con least-privilege

## Próximos pasos

En **Módulo 10: Harnesses para agentes de larga duración** aprenderás:
• Sistema dual de Anthropic: Initializer Agent + Coding Agent
• Feature list JSON con estado persistente entre sesiones
• Git logs como memoria implícita
• Checkpointing y recovery para sesiones overnight
• Métricas de progreso automatizadas
• Puppeteer MCP para testing visual E2E
**Conexión con M9:** Los subagentes que definiste en M9 pueden ser los "workers" de un harness de larga duración.
M10 enseña cómo hacer que estos agentes trabajen durante horas o días con tracking de progreso, recovery ante fallos, y verificación automática de completitud. Es la unión de Ralph (M7) + Multi-Claude (M8) + Subagentes (M9) en un sistema enterprise.
