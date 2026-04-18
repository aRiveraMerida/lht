---
title: "Certificación C3 — Configuración de Claude Code"
date: "2026-04-18"
description: "Capítulo 3 de preparación: configuración avanzada de Claude Code."
excerpt: "Peso en el examen: ~20% Subtemas: d3.1 CLAUDE.md Hierarchy · d3.2 Commands & Skills · d3.3 Plan Mode & Iteration · d3.4 CI/CD & Batch Escenarios relacionados: #2 Code Generation…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — Dominio 3: Claude Code

# Configuration & Workflows

**Peso en el examen:** ~20%
**Subtemas:** d3.1 CLAUDE.md Hierarchy · d3.2 Commands & Skills · d3.3 Plan Mode & Iteration · d3.4 CI/CD & Batch
**Escenarios relacionados:** #2 Code Generation with Claude Code · #5 Claude Code for CI/CD
**Prerequisitos del curso:** M2, M3, M4, M5, M6, M12

## d3.1 CLAUDE.md Hierarchy & Configuration

### Las 3 capas de configuración

```
~/.claude/CLAUDE.md          ← USER: preferencias personales (no compartir)
project/.claude/CLAUDE.md    ← PROJECT: estándares del equipo (git)
project/src/api/CLAUDE.md    ← DIRECTORY: reglas scoped a esa carpeta
```
**Precedencia:** Más específico gana. Directory > Project > User.

### Modular config con @import y .claude/rules/

```
&lt;!-- .claude/CLAUDE.md (project level) --&gt;
# Project: E-commerce API
## Stack
TypeScript strict mode. Express. PostgreSQL.
@import ./rules/api-design.md
@import ./rules/testing.md
# .claude/rules/api-design.md
---
paths:
  - src/routes/**
  - src/controllers/**
---
All endpoints must validate auth tokens.
Use Zod schemas for request validation.
Return consistent error format: { error: string, code: number }.
```
**Clave:** Los archivos en .claude/rules/ con frontmatter paths: solo se cargan cuando Claude trabaja en archivos que
coinciden con el glob pattern.

### I vs

```
Todo en un CLAUDE.md de 800 líneas
   + preferencias personales mezcladas con reglas del equipo
   + reglas de API junto con reglas de testing
   → Claude no puede priorizar, contexto innecesario
Modular:
   ~/.claude/CLAUDE.md       → "Use vim keybindings" (personal)
   .claude/CLAUDE.md         → "TypeScript strict mode" (equipo)
   src/api/CLAUDE.md         → "Validate auth tokens" (scoped)
   .claude/rules/testing.md  → "Every function needs tests" (topic)
```

### Preguntas de práctica

**P1.** A developer adds "Use vim keybindings" to the project's .claude/CLAUDE.md. What's wrong?
A) Vim keybindings aren't supported B) Personal preferences should go in user-level config (~/.claude/CLAUDE.md), not project-level C) The setting should be in settings.json instead D) Nothing — any preference can go in project config
**B.** Preferencias personales van en user-level. Project-level es compartido via git — no imponer preferencias
personales al equipo.
**P2.** A .claude/rules/api-design.md file has paths: ["src/routes/**"] in its frontmatter. When is this rule loaded?
A) Always, for every file in the project B) Only when Claude is working on files matching src/routes/**
C) Only when the developer manually activates the rule D) Only during CI/CD pipelines
**B.** El frontmatter paths: hace que la regla sea condicional — solo se carga cuando Claude trabaja en archivos que
coinciden con el glob pattern. Esto es progressive disclosure.

## d3.2 Custom Commands & Skills

### Commands vs Skills

Commands Skills

**Ubicación**

```
.claude/commands/
.claude/skills/
```

**Formato**

Markdown simple SKILL.md con frontmatter YAML

**Contexto**

Sesión actual (compartido)
Puede ser forked (aislado)

**Tool access**

Todos los tools disponibles Restringible con allowed-tools

**Invocar**

Activación automática o manual
```
/nombre
```

**Ideal para**

Acciones rápidas y simples Operaciones complejas que necesitan aislamiento

### SKILL.md frontmatter

```
# .claude/skills/refactor/SKILL.md
---
context: fork          # Ejecutar en contexto aislado
allowed-tools:         # Restringir herramientas
  - Read
  - Edit
  - Grep
argument-hint: "file or directory to refactor"
---
# Refactoring Skill
1. Analyze current code structure
2. Identify SOLID violations
3. Apply changes incrementally with Edit
4. Verify each change maintains behavior
```

### I vs

```
&lt;!-- I Command para tarea compleja --&gt;
&lt;!-- .claude/commands/refactor.md --&gt;
Refactor the code to use dependency injection.
Look through all files and restructure.
&lt;!-- Contamina el contexto principal con exploración --&gt;
&lt;!-- Sin restricción de tools — puede hacer Write --&gt;
&lt;!-- I Skill con context:fork y allowed-tools --&gt;
# .claude/skills/refactor/SKILL.md
---
context: fork
allowed-tools: [Read, Edit, Grep]
---
Refactor the code to use dependency injection.
&lt;!-- Contexto aislado + tools restringidos --&gt;
```

### Preguntas de práctica

**P3.** A team wants to create a reusable code analysis routine that explores the codebase without affecting the current
conversation. What should they use?
A) A custom command in .claude/commands/
```
B) A skill with context: fork in .claude/skills/
C) A rule in .claude/rules/
```
D) A hook in settings.json
**B.** context: fork ejecuta en contexto aislado — la exploración no contamina la sesión principal. A corre en el
contexto actual. C es para reglas pasivas. D es para automatización, no exploración.

## d3.3 Plan Mode & Iterative Refinement

### Cuándo usar Plan Mode vs Direct Execution

Plan Mode Direct Execution Cambios multi-archivo Arreglar un typo Decisiones arquitectónicas Añadir un log statement Feature nueva compleja Cambio single-file con scope claro Errores costosos de deshacer Tarea obvia sin ambigüedad

### Patrones de iterative refinement

Patrón Cómo funciona Cuándo usar

**Concrete examples**

"Quiero que se vea así: [ejemplo]"
Formatting, estilo, output structure

**TDD iteration**

Test → implement → verify → refine Funcionalidad nueva, calidad verificable

**Interview pattern**

"Hazme 3 preguntas antes de empezar"
Requirements ambiguos

### El ciclo TDD (el patrón de refinement más evaluado)

```
1. WRITE FAILING TEST → Define expected behavior
2. IMPLEMENT → Make the test pass
3. RUN TESTS → Verify correctness
4. REFINE → Improve quality, keep tests green
5. REPEAT → Next requirement
```
**Por qué TDD es superior a "implement this feature":** Cada paso tiene una meta verificable. Claude sabe
EXACTAMENTE cuándo terminó (tests pass). Sin TDD, Claude puede declarar "done" prematuramente.

### Preguntas de práctica

**P4.** A developer asks Claude to redesign the database schema across 12 files. Should they use plan mode or direct
execution?
A) Direct execution — let Claude figure it out B) Plan mode — think first, then execute the multi-file changes C) Both simultaneously D) Neither — manual editing is better for schema changes
**B.** Multi-file architectural changes requieren plan mode. Claude primero planifica qué archivos tocar, en qué orden, y
qué cambios hacer en cada uno. Direct execution para 12 archivos arriesga inconsistencias.

## d3.4 CI/CD Integration & Batch Processing

### Flags clave para CI/CD

```
# Non-interactive mode (REQUERIDO en CI)
claude -p "Review this code"
# Structured JSON output (para parseo automático)
claude -p "Analyze..." --output-format json
# Schema enforcement (garantiza estructura)
claude -p "Extract..." --output-format json --json-schema '{...}'
```

### Session isolation: Generator vs Reviewer

```
# I ANTI-PATRÓN: Same-session self-review
claude -p "Write auth module"         # Session A
claude --resume -p "Review your code" # MISMA sesión
# El reviewer retiene el razonamiento del generator → confirmation bias
# I CORRECTO: Sesiones separadas
claude -p "Write auth module"          # Session A
claude -p "Review this diff: $(git diff)" # Session B (fresh)
# Reviewer no tiene contexto del generator → review objetiva
```

### Message Batches API

```
# 50% de descuento, ventana de 24 horas
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "audit-file-1",  # ← Para tracking
            "params": {
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Audit file1.ts for security issues"}]
            }
        },
        {
            "custom_id": "audit-file-2",
            "params": {
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Audit file2.ts for security issues"}]
            }
        },
    ]
)
# Resultados en hasta 24h, 50% más barato que sync
```
**Usar batch para:** Auditorías nocturnas, reviews semanales, análisis masivo.
**NO usar batch para:** PR reviews (blocking), feedback en tiempo real.

### Preguntas de práctica

**P5.** In a CI/CD pipeline, a code generator session is followed by a code review. The review runs with --resume in the
same session. What's the problem?
A) --resume doesn't work in CI/CD B) The reviewer retains the generator's reasoning context, creating confirmation bias C) The review will be slower D) The generator's code will be overwritten
**B.** Same-session self-review (anti-patrón Critical). El reviewer ve el razonamiento del generator → tiende a confirmar
las decisiones en lugar de cuestionarlas. Sesiones separadas eliminan este sesgo.
**P6.** A team processes 2,000 code files for a weekly security audit. Which approach saves the most on API costs?
A) Process each file synchronously with claude -p B) Use the Message Batches API with custom_id per file C) Process all files in a single prompt D) Skip the audit to save costs
**B.** Batch API ofrece 50% de descuento con ventana de 24h. A es full price. C desborda el contexto. D no es una
opción válida.

## Resumen de anti-patrones — Dominio 3

#
Anti-patrón (I)
Correcto (I)
Severidad 1 Preferencias personales en project config User-level para personal, project para equipo Medium 2 Commands para tareas que necesitan aislamiento Skills con context:fork + allowed-tools High 3 Same-session self-review en CI/CD Sesiones separadas (generator vs reviewer)
Critical 4 Plan mode para tareas simples Direct execution para cambios obvios y scoped Medium 5 Interactive mode en CI/CD
-p flag (non-interactive)
High 6 Sync processing para tareas masivas no-urgentes Batch API (50% savings, 24h window)
Medium

## Exam tips finales — Dominio 3

1. **User config para personal, project para equipo, directory para scoped** — la jerarquía es binaria
2. context: fork **+** allowed-tools → skill. Sin aislamiento → command
3. **Same-session self-review = Critical anti-pattern** — sesiones separadas siempre
4. **Plan mode para complejo, direct para simple** — la distinción es scope y riesgo
5. -p **+** --output-format json → CI/CD standard
6. **Batch API = 50% savings** con 24h window. Solo para no-urgente
