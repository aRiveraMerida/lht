---
excerpt: "Glosario completo de términos técnicos usados en el programa."
---

# Glosario: Términos técnicos del programa

**50+ términos organizados alfabéticamente.** Referencia rápida para consultar durante cualquier módulo.

### A

**Agent SDK** — Librería Python/TypeScript de Anthropic para controlar Claude Code programáticamente. Permite crear
sesiones, definir guardrails (max_budget_usd, max_turns), y usar hooks como callbacks. → M7, M9, M10
**Agent Teams** — Feature nativa (Opus 4.6, feb 2026) donde un agente líder descompone una tarea en workers que
trabajan en paralelo. Consume ~7x más tokens que una sesión estándar. → M8
**Agent tool** — Herramienta interna de Claude Code para spawnar subagentes (antes llamada "Task tool"). Claude la
usa internamente para delegar trabajo. → M9
**agent_docs/** — Directorio de documentación técnica accesible por Claude Code. Complemento de .claude/rules/
para documentación extensa (specs, API references). → M4
**allowedTools** — Campo de settings.json que restringe qué herramientas puede usar Claude en un proyecto. Control
de seguridad determinista. → M1, M4
**Auto mode** — Modo de Claude Code donde ejecuta sin pedir confirmación en cada paso. Se activa con Shift+Tab×2
o seleccionando "Auto" en el menú de modos. → M2

### C

**Capability testing** — Evals que responden "¿puede el agente hacer X?". Cuando pasan, se convierten en regression
tests. → M11
**Checkpoint** — Punto de guardado al que puedes volver. En Claude Code: /rewind. En git: branches de backup.
Esencial para overnight sessions. → M10
**CLAUDE.md** — Archivo de configuración principal que Claude Code lee al iniciar sesión. Debe tener <200 líneas con
estructura WHAT/WHY/HOW. Se carga en el contexto del agente. → M1, M4
**.claude/** — Directorio raíz de configuración de Claude Code. Contiene subdirectorios: rules/, commands/, skills/,
agents/, y settings.json. → M4, M5, M6, M9
**.claude/agents/** — Directorio para definir subagentes con roles específicos. Cada archivo markdown define un agente
con frontmatter (name, allowed-tools, model) invocable con @nombre. → M9
**.claude/commands/** — Directorio para slash commands personalizados. Cada archivo markdown se convierte en un
comando /nombre disponible en el REPL. → M6
**.claude/rules/** — Directorio para reglas condicionales con frontmatter paths:. Las reglas solo se cargan cuando
Claude trabaja en archivos que coinciden con el patrón de paths. Mecanismo oficial de progressive disclosure. → M4
**.claude/skills/** — Directorio para skills (workflows reutilizables). Pueden ser user-invoked o model-invoked con
frontmatter avanzado (model, allowed-tools, budget). → M5
**claude -p** — Modo headless de Claude Code. Ejecuta un prompt sin sesión interactiva y retorna el resultado. Base de
Ralph loops y CI/CD. → M7, M12
**claude-code-action** — GitHub Action oficial de Anthropic (~6.589#) para ejecutar Claude Code en workflows de
CI/CD. Pieza central de M12-M13. → M12, M13
**claude-code-security-review** — GitHub Action para análisis de seguridad automatizado en PRs (~2.800#). Usa
Opus para detección profunda de vulnerabilidades. → M3, M12
**claude-squad** — Aplicación de terminal (~5.600#) para gestionar múltiples instancias de Claude Code con tmux.
Interfaz visual para multi-agente. → M8
**Completion promise** — Instrucción en el prompt que le dice a Claude cuándo ha terminado. Sin completion promise,
Claude puede parar prematuramente o no parar nunca. → M7
**Context window** — Memoria de trabajo de Claude. Todo lo que puede "ver" en un momento dado (prompt,
CLAUDE.md, archivos leídos, historial de conversación). Se compacta automáticamente cuando se llena. → M1, M2
**Ctrl+B** — Atajo para enviar la tarea actual a background en Claude Code. Permite ejecutar otra tarea en foreground
mientras la primera continúa. → M2, M8

### D

**deny rules** — Reglas en settings.json que bloquean comandos específicos (ej: rm -rf /). Mecanismo determinista,
no conversacional — más fiable que instrucciones en CLAUDE.md. → M1, M4

### E

**EDD (Eval-Driven Development)** — Analogía de TDD para agentes. Escribes un eval que falla → mejoras el agente
→ el eval pasa → se convierte en regression test. → M11
**Evals** — Tests para agentes. Miden si un agente puede completar una tarea correctamente. Compuestos de: task
(input), grader (evaluador), y expected output. → M11
**Exit codes (hooks)** — En hooks de Claude Code: exit 0 = aprobado (output se muestra a Claude), exit 1 = error (se
muestra pero no bloquea), exit 2 = denegar (bloquea la acción). → M6
**Extended thinking** — Modo donde Claude razona internamente antes de responder. Se activa con Option+T o
keywords ("think", "think hard"). Mejora calidad en tareas complejas. → M2

### F

**feature_list.json** — Archivo de estado persistente en harnesses. Lista features con status
(pending/in_progress/completed), dependencias, y verification commands. Source of truth entre sesiones. → M10
**Frontmatter** — Bloque YAML al inicio de archivos markdown (entre ---). En Claude Code se usa para configurar
skills, agents, commands y rules con campos como paths:, allowed-tools:, model:. → M4, M5, M6, M9

### G

**Grader** — Componente de un eval que determina si el output del agente es correcto. Tipos: code-based
(determinista), model-based (LLM judge), hybrid (ambos). → M11

### H

**Harness** — Sistema envolvente que gestiona la ejecución de un agente. En el programa: sistema dual Initializer Agent +
Coding Agent con estado persistente para proyectos multi-día. → M10
**Headless mode** — Modo de Claude Code sin interfaz interactiva. Se invoca con claude -p "prompt". Base para
automatización, Ralph loops, CI/CD. → M7
**Hooks** — Acciones automáticas que se ejecutan cuando ocurren eventos en Claude Code. Se configuran como JSON
en settings.json con 20+ eventos disponibles (PreToolUse, PostToolUse, Stop, etc.). → M6

### L

**Least privilege** — Principio de seguridad: dar a cada agente/subagente solo las herramientas mínimas necesarias.
Ej: reviewer con solo Read/Grep, no Write/Edit. → M9

### M

**Matchers** — Filtros en hooks que determinan CUÁNDO se ejecuta el hook. Pueden filtrar por tool name, pattern en el
contenido, o file path. → M6
**Multi-Claude** — Cualquier configuración con múltiples instancias de Claude trabajando simultáneamente. Incluye:
Agent Teams, claude-squad, Ctrl+B, múltiples terminales con -w. → M8

### O

**Overnight session** — Sesión de harness que corre 6-8+ horas sin supervisión. Requiere safeguards: backup branch,
timeout, tests entre features, max features cap, reporte automático. → M10

### P

**pass@k** — Métrica de evals. Ejecutar k veces, pasa si al menos 1 tiene éxito. Fórmula: pass@k = 1 - (1-p)^k. k=3 es
el sweet spot (p=70% → pass@3 = 97%). → M11
**Plan Mode** — Modo donde Claude planifica antes de ejecutar. Se activa con Shift+Tab. Claude genera un plan que tú
revisas antes de que empiece a codificar. → M2
**Plugins** — Skills compartidas públicamente a través de un directorio oficial. Se instalan con /plugin add URL.
Extenden las capacidades de Claude Code. → M5
**PROGRESS.md** — Archivo de tracking que el agente actualiza en cada iteración de un Ralph loop. Registra qué se
completó, qué falta, y issues encontrados. → M7
**Progressive disclosure** — Principio de que Claude solo debería recibir la información relevante para lo que está
haciendo ahora. Implementado con .claude/rules/ + paths: condicional. → M4
**PR-from-anywhere** — Patrón donde cualquier evento GitHub (issue, comment, cron, review) genera
automáticamente un agente que crea una PR. → M13

### R

**Ralph Wiggum** — Metodología de ejecución autónoma basada en loop bash que re-invoca Claude Code
repetidamente. Nombrada por el meme "I'm in danger". Usa headless mode + completion promises + PROGRESS.md.
→ M7
**/rewind** — Slash command que revierte la sesión de Claude Code al checkpoint anterior. Útil cuando Claude toma un
camino equivocado. → M2, M10
**RTK (Rust Token Killer)** — Proxy CLI (~12.300#) que intercepta comandos de terminal y comprime su output antes
de que llegue al contexto de Claude. Reduce tokens 60-90%. Instalación: brew install rtk && rtk init --global.
→ M1, M12, M13

### S

**/sandbox** — Slash command que ejecuta código en un entorno aislado. Reduce prompts correctivos en 84% (dato de
Anthropic). → M3
**Saturation testing** — Ejecutar un eval N veces (típicamente N=30+) para medir la tasa de éxito real (p). Permite
calcular pass@k con confianza estadística. → M11
**settings.json** — Archivo de configuración determinista (no conversacional). Controla: allowedTools, deny rules,
hooks, modelo por defecto, permisos. 4 capas: managed → user → project → local. → M1, M4, M6
**Shift+Tab** — Atajo para activar Plan Mode en Claude Code. Claude planifica antes de ejecutar. Shift+Tab×2 activa
Auto mode. → M2
**Stop hook** — Hook que se ejecuta cuando Claude intenta terminar una sesión (evento Stop). Se usa en Ralph loops
para prevenir que Claude pare prematuramente. Exit 2 bloquea el stop. → M6, M7
**Subagente** — Agente especializado invocado dentro de otra sesión de Claude. Definido en .claude/agents/ con
allowed-tools restringidos. Hereda contexto del agente padre. → M9

### T

**--teleport** — Flag de Claude Code que mueve una sesión local a la web (claude.ai/code), permitiendo monitoreo
remoto desde cualquier dispositivo. → M7, M8
**Tools (22 herramientas)** — Claude Code tiene 22 herramientas disponibles: Read, Write, Edit, Bash, Glob, Grep,
WebSearch, Agent tool, entre otras. Las usa autónomamente según la tarea. → M1

### V

**Vitest** — Framework de testing compatible con Jest usado en todo el programa. Se configura con npm install
--save-dev vitest. API: describe, it, expect. → M3

### W

**-w (worktree flag)** — Flag de Claude Code que crea un git worktree aislado para la sesión. Cada sesión trabaja en su
propia copia del repo sin conflictos. Esencial para multi-Claude. → M7, M8
**Worktree** — Feature de git que permite tener múltiples copias del repo en disco simultáneamente, cada una en una
rama diferente. Claude Code lo gestiona automáticamente con -w. → M7, M8

### Siglas y acrónimos

Sigla Significado Módulo CLI Command Line Interface Prework CRUD Create, Read, Update, Delete M3+ EDD Eval-Driven Development M11 ESM ECMAScript Modules (import/export)
Prework JWT JSON Web Token (autenticación)
M3+ LLM Large Language Model Todos MCP Model Context Protocol M5 REPL Read-Eval-Print Loop (sesión interactiva)
M1 RTK Rust Token Killer M12 SaaS Software as a Service P5 TDD Test-Driven Development M3
