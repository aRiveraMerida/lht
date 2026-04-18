---
excerpt: "Coordinación de múltiples instancias de Claude trabajando en paralelo."
---

# Módulo 8: Multi-Claude workflows y Agent

# Teams

**Duración:** 5-6 horas
**Nivel:** Avanzado
**Dependencias:** Módulos 1-7 (especialmente M6 Hooks, M7 Ralph/Headless)
**Modalidad:** 100% práctica con orquestación de múltiples agentes
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Usar Agent Teams** — múltiples Claude coordinados nativamente con agente líder + workers
2. **Ejecutar tareas en background** con Ctrl+B para paralelismo local
3. **Usar** -w para worktree isolation nativo (sin scripts manuales)
4. **Monitorear remotamente** con --teleport y Claude Code en la web
5. **Usar claude-squad** (~5.600#) para multi-agente con tmux
6. **Implementar patrón write-review** con agentes especializados
7. **Gestionar costos** — entender el ~7x de overhead de Agent Teams
8. **Decidir** cuándo usar Agent Teams vs claude-squad vs sesiones manuales vs Auto mode

## 1. Fundamentos: El salto de single-Claude a multi-Claude

### 1.1 El problema del throughput

```
# Tienes 5 features independientes, ~1 hora cada una
# Secuencial (single Claude):
Feature A → Feature B → Feature C → Feature D → Feature E
Total: 5 horas
# Paralelo (multi-Claude):
Feature A
Feature B
Feature C IIII Simultáneo → Total: ~1-2 horas
Feature D
Feature E
```

**Boris Cherny:**

"Corro típicamente 5 instancias de Claude Code en terminal tmux + 5-10 en el browser. El patrón 'Claude escribe,
Claude revisa' mejora la calidad significativamente."

### 1.2 Las 4 formas de multi-Claude en 2026

Método Qué es Coordinación Cuándo usar

**Agent Teams**

Feature nativa: líder + workers Automática (líder coordina)
Tareas complejas descomponibles

**claude-squad**

App terminal con tmux Semi-automática (tmux panels)
Multi-agente visual e interactivo

**Ctrl+B (background)**

Enviar tarea a background Manual (tú decides qué va a bg)
Tarea lenta + seguir trabajando

**Múltiples terminales**

N instancias de claude Manual (tú coordinas)
Control total, features independientes

### 1.3 Cuándo usar cada método

```
¿Las tareas son independientes entre sí?
SÍ, completamente independientes
II ¿Son más de 3?
II SÍ → claude-squad o múltiples terminales con -w
II NO → Ctrl+B para 2-3 tareas simultáneas
NO, necesitan coordinación
¿Hay un plan maestro descomponible?
SÍ → Agent Teams (líder descompone, workers ejecutan)
NO → Write-review pattern (2 instancias: writer + reviewer)
```

## 2. Agent Teams: multi-agente nativo

### 2.1 Qué son los Agent Teams

Introducidos con Opus 4.6 (febrero 2026), **Agent Teams** permiten que Claude cree y coordine múltiples agentes internamente:
```
AGENT TEAMS
LEAD AGENT      I ← Opus 4.6 (planifica)
(Orchestrator)
IWorkerIIWorkerIIWorkerI ← Sonnet (ejecutan)
A   II  B   II  C
RESULTS    I → Reunidos por el líder
```

**Cómo funciona:**

1. Tú das la tarea al **agente líder** (Opus 4.6)
2. El líder **descompone** la tarea en subtareas
3. El líder **spawna workers** (Sonnet) para cada subtarea
4. Cada worker trabaja en paralelo con su propio contexto
5. El líder **reúne resultados** y resuelve conflictos
6. Tú recibes el resultado integrado

### 2.2 Activar Agent Teams

```
# Para activar Agent Teams, necesitas Opus 4.6 como modelo
/model claude-opus-4-6
# Luego, simplemente describe una tarea compleja
implementa un sistema de autenticación completo:
- registro de usuarios con validación de email
- login con JWT (access + refresh tokens)
- password reset via email
- OAuth2 con Google y GitHub
- middleware de auth para rutas protegidas
Usa TDD para cada componente.
```
Claude Opus, como líder, puede decidir descomponer esto en workers:
• Worker A: Registro + validación de email
• Worker B: Login + JWT tokens
• Worker C: Password reset
• Worker D: OAuth2 providers
• Worker E: Middleware de auth

### 2.3 El costo: ~7x más tokens

Agent Teams consume significativamente más tokens que una sesión estándar:
Métrica Sesión estándar Agent Teams Tokens por tarea ~50K ~350K (~7x)
Costo (Opus líder + Sonnet workers)
~$0.50 ~$3.50 Velocidad 1x 3-5x más rápido Calidad Buena Mejor (revisión cruzada)

**Cuándo vale la pena el 7x:**

• I Proyecto con deadline ajustado (velocidad justifica costo)
• I Tarea claramente descomponible (5+ subtareas independientes)
• I Resultado de calidad superior (workers se revisan entre sí)
• I Tarea simple (Sonnet estándar es suficiente)
• I Budget limitado (7x de costo no se justifica)

### 2.4 Cuándo Agent Teams NO funciona bien

• **Tareas altamente secuenciales** → Step B depende del resultado de Step A → no paralelizable
• **Codebase pequeño** (<1.000 LOC) → Overhead de coordinación > beneficio
• **Una sola tarea indivisible** → "Arregla este bug" no se descompone en workers
• **Tasks que requieren mucho contexto compartido** → Los workers tienen contexto independiente
**Nota importante:** Agent Teams es una feature introducida con Opus 4.6 (febrero 2026) que Anthropic ha
descrito como evolución natural del sistema de subagentes. La forma exacta de activar Agent Teams, el grado de control sobre la descomposición en workers, y el modelo de costos pueden evolucionar entre versiones. **Verifica**
**el estado actual** en la documentación oficial: docs.anthropic.com/en/docs/claude-code/agent-teams. Si Agent
Teams no está disponible en tu plan o versión, los ejercicios de este módulo funcionan igualmente con claude-squad o múltiples terminales con -w — el concepto de paralelismo es el mismo, solo cambia la herramienta de coordinación.

## 3. Ctrl+B: Background tasks (el multi-Claude más simple)

### 3.1 Cómo funciona

En una sesión interactiva de Claude Code, puedes enviar la tarea actual a background y seguir trabajando:
```
# Estás trabajando con Claude...
implementa tests de integración para el módulo de auth
# Claude empieza a trabajar — es lento (muchos tests)
# Presionas Ctrl+B
# Claude continúa en background
# Tu terminal vuelve al REPL
# Puedes dar otra instrucción:
ahora implementa la validación de email en @src/validators/email.js
# Dos tareas corriendo simultáneamente
```

### 3.2 Gestión de background tasks

```
# Ver tareas en background
# (aparecen en el status line del REPL)
# Terminar todas las tareas background
Ctrl+F  Ctrl+F  (doble Ctrl+F)
# Resultado de la tarea background
# aparece cuando termina, aunque estés en otra conversación
```

### 3.3 Cuándo usar Ctrl+B

Escenario Ctrl+B Agent Teams Múltiples terminales Tarea lenta + seguir trabajando Ideal Overkill Funciona 2 tareas independientes Overkill Funciona I 5+ tareas paralelas Limitado claude-squad I Tareas que requieren coordinación No Manual I
**Tip:** Ctrl+B es perfecto para "ejecuta los tests mientras yo sigo editando otro archivo". No necesitas Agent Teams ni
claude-squad para ese caso.

## 4. -w: Worktree isolation nativo

### 4.1 El flag -w

En M7 mencionamos -w brevemente. Es el mecanismo nativo para que cada sesión de Claude trabaje en un **git**
**worktree aislado**:
```
# Cada sesión en su propio worktree
claude -w    # Crea worktree nuevo, trabaja ahí
# En headless mode
claude -p "implementa feature X" -w --max-turns 20
# Multiple sesiones paralelas, cada una aislada
# Terminal 1:
claude -w  # worktree-1/
# Terminal 2:
claude -w  # worktree-2/
# Terminal 3:
claude -w  # worktree-3/
```
**Por qué importa:** Sin -w, si dos Claude editan el mismo archivo simultáneamente, hay conflictos. Con -w, cada Claude
tiene su copia del repo en una rama separada.

### 4.2 Antes vs Ahora

Antes (M8 manual)
Ahora (nativo)
Crear worktree-manager.sh con 100 líneas claude -w (un flag)
Gestionar branches manualmente Claude crea branch + worktree automáticamente Merge manual con scripts Merge al finalizar la sesión Cleanup manual de worktrees Limpieza automática

### 4.3 Ejercicio: 3 Claude en paralelo con -w

```
# Terminal 1: Feature A
cd mi-proyecto
claude -w
# &gt; implementa el módulo de autenticación con TDD
# Terminal 2: Feature B
cd mi-proyecto
claude -w
# &gt; implementa el módulo de perfil de usuario con TDD
# Terminal 3: Feature C
cd mi-proyecto
claude -w
# &gt; implementa el endpoint de búsqueda con filtros
# Cada Claude trabaja en su worktree aislado
# Al terminar, merge los resultados
```

## 5. --teleport y Claude Code en la web

### 5.1 --teleport: Mover sesiones a la web

El flag --teleport mueve una sesión local a Claude Code en la web, permitiendo monitoreo desde cualquier dispositivo:
```
# Iniciar sesión con teleport
claude --teleport
# O mover sesión existente
# (dentro de Claude Code)
/remote-control
# La sesión aparece en claude.ai/code
# Puedes monitorear desde el móvil
```
**Caso de uso principal:** Inicias un Ralph loop o Agent Teams en tu máquina, activas teleport, y monitorizas desde el
móvil mientras cenas.

### 5.2 Claude Code en la web

Desde noviembre 2025, Claude Code también funciona en la web (claude.ai/code), permitiendo:
• **Múltiples tareas paralelas** sin usar tu máquina local
• **Acceso desde cualquier dispositivo** (móvil, tablet)
• **Sin límite de instancias locales** (las sesiones corren en cloud)
```
# En la web: claude.ai/code
# Abrir múltiples tareas en pestañas diferentes
# Cada pestaña es una instancia independiente
# Pueden trabajar en el mismo repo (con worktrees)
```

### 5.3 Combinación local + web

```
# Tu máquina: 2-3 sesiones locales para trabajo interactivo
claude          # Sesión principal (interactiva)
claude -w       # Feature en worktree (background)
# Web: 3-5 tareas paralelas en cloud
# Pestaña 1: Migración Jest→Vitest (Ralph loop)
# Pestaña 2: Generación de tests
# Pestaña 3: Documentación de API
# Total: 5-8 Claude trabajando simultáneamente
```

## 6. claude-squad: Multi-agente con tmux

### 6.1 Qué es claude-squad

claude-squad (~5.600#) es una aplicación de terminal que usa tmux para gestionar múltiples instancias de Claude Code simultáneamente:
```
claude-squad
Session 1I I Session 2I I Session 3I
auth     I I profile  I I search
40%      I I 75%      I I 20%
[1] View session  [a] Add new  [d] Delete
[Enter] Attach    [q] Quit
```

### 6.2 Instalación y uso

```
# Instalar (requiere Go)
go install github.com/smtg-ai/claude-squad@latest
# O con brew
brew install claude-squad
# Iniciar
claude-squad
# Crear sesiones
# [a] → Nombrar sesión → Escribir prompt → Enter
# Repetir para cada tarea
# Monitorear
# Las sesiones se muestran como paneles tmux
# Puedes attach/detach a cualquiera
```

### 6.3 claude-squad vs Agent Teams

Agent Teams claude-squad

**Coordinación**

Automática (líder coordina)
Manual (tú decides qué hacer)

**Modelo**

Requiere Opus como líder Cualquier modelo

**Costo**

~7x (líder + workers)
1x por instancia

**Visibilidad**

Resultado final integrado Ves cada sesión en tmux

**Ideal para**

Tareas descomponibles con plan Features independientes en paralelo

**Setup**

Nativo (ninguno)
Instalar claude-squad

### 6.4 Ejercicio: 4 features con claude-squad

```
claude-squad
# [a] auth-feature
#   &gt; implementa autenticación JWT completa con TDD
# [a] profile-feature
#   &gt; implementa CRUD de perfil de usuario con TDD
# [a] search-feature
#   &gt; implementa búsqueda con filtros y paginación cursor
# [a] admin-feature
#   &gt; implementa panel de admin con roles y permisos
# Monitorear progreso en la interfaz
# Attach a cualquier sesión para interactuar
# [1] → [Enter] para ver sesión de auth
```

## 7. Patrón write-review: calidad con 2 agentes

### 7.1 El concepto

En lugar de que un solo Claude escriba y "auto-revise" (sesgo de confirmación), separas los roles:
```
Writer (Terminal 1)        Reviewer (Terminal 2)
Implementa feature  III   Lee diff, revisa
Feedback
Corrige issues
Commit                    Aprueba
```

### 7.2 Implementación con -w y subagentes

El writer y el reviewer pueden ser dos sesiones con CLAUDE.md diferente, o puedes usar subagentes (.claude/agents/) que se profundizan en M9:
```
&lt;!-- .claude/agents/reviewer.md --&gt;
---
name: reviewer
description: Code review specialist with read-only access
allowed-tools: Read, Grep, Glob
model: claude-sonnet-4-6
---
# Code Reviewer
## Role
Review code changes for security, performance, maintainability.
## Process
1. Read git diff of recent changes
2. Check security (SQL injection, XSS, auth bypass)
3. Check performance (N+1, unnecessary loops, memory)
4. Check maintainability (naming, complexity, duplication)
5. Report findings with severity
## Output
For each finding:
- I Critical | I Warning | I Info
- File:line
- Issue
- Suggested fix
## Constraints
- Read-only: cannot modify code
- Focus on logic errors, not style
- Security issues are always Critical
```

**Uso:**

```
# En sesión interactiva después de implementar una feature:
@reviewer revisa los cambios que acabo de hacer en src/auth/
# El subagente reviewer analiza con herramientas read-only
# Genera reporte de findings
# Tú (o el writer) corrige
```

### 7.3 Write-review como hook (automatizado)

Puedes automatizar el review como hook PostToolUse:
```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "claude -p 'Review the recent changes: $(git diff HEAD~1). Report security issues, performance prob
          "timeout": 120
        }]
      }
    ]
  }
}
```
Cada vez que Claude termina una tarea (evento Stop), automáticamente se ejecuta un mini-review con herramientas read-only.

## 8. Ejercicio práctico 1: Multi-Claude con -w y Ctrl+B

### Objetivo

Ejecutar 3 tareas en paralelo usando herramientas nativas (sin instalar nada extra).

### Setup

```
cd library-api  # Tu proyecto de M3-M7
```

### Ejecución

```
# Sesión principal (interactiva)
# Tarea 1: Feature nueva
implementa endpoint GET /api/v1/books/stats que retorne:
- total de libros
- rating promedio global
- top 3 géneros por cantidad
- libros agregados en los últimos 30 días
Usa TDD.
# Mientras Claude trabaja... Ctrl+B (enviar a background)
# Tarea 2: En la misma sesión, ahora en foreground
implementa endpoint GET /api/v1/books/recommendations/:userId
que recomiende libros basándose en los géneros más leídos
por el usuario. Usa TDD.
# Tarea 2 en foreground + Tarea 1 terminando en background
# Ambas con worktree isolation
# En OTRO terminal (Tarea 3, worktree aislado):
cd library-api
claude -w
# &gt; actualiza la documentación de API en agent_docs/api-reference.md
# &gt; con todos los endpoints existentes. Incluye curl examples.
```

### Verificación

```
# Después de que las 3 tareas terminen:
# 1. Verificar que no hay conflictos
git status
# 2. Verificar que tests pasan
npm test
# 3. Verificar endpoint de stats
curl http://localhost:3000/api/v1/books/stats
# 4. Verificar endpoint de recommendations
curl http://localhost:3000/api/v1/books/recommendations/user-1
# 5. Verificar documentación actualizada
cat agent_docs/api-reference.md
```

### Entregable

1. 3 tareas completadas en paralelo
2. Sin conflictos de merge
3. Tests pasando para las 2 features nuevas
4. Documentación actualizada
5. Log con tiempos: cuánto tardó cada tarea, overlap real

## 9. Ejercicio práctico 2: Agent Teams para proyecto descomponible

### Objetivo

Usar Agent Teams para una tarea compleja que se beneficia de descomposición automática.

### Prerrequisito

```
/model claude-opus-4-6
```

### Tarea

```
/effort high
Implementa un sistema completo de notificaciones para la library API:
1. Modelo de Notification (tipo, mensaje, leída/no leída, userId, timestamps)
2. CRUD endpoints (/api/v1/notifications)
3. Endpoint para marcar como leída (PATCH /notifications/:id/read)
4. Endpoint para marcar todas como leídas (PATCH /notifications/read-all)
5. Service que genera notificaciones automáticamente:
   - Cuando se agrega un libro nuevo → notificación a todos los usuarios
   - Cuando se deja una review → notificación al "owner" del libro
   - Cuando un libro tiene &gt;10 reviews → notificación "trending"
6. Tests completos (unit + integration, &gt;85% coverage)
7. Documentación en agent_docs/
Usa TDD para cada componente. Implementa todo.
```
**Observa:** Con Agent Teams, Opus puede descomponer esto en 4-5 workers que trabajan en paralelo:
• Worker A: Modelo + migraciones
• Worker B: Endpoints CRUD
• Worker C: Service de auto-generación
• Worker D: Tests
• Worker E: Documentación
**Sin Agent Teams** (solo Sonnet), Claude haría todo secuencialmente en una sola sesión.

### Medir el impacto

```
/cost
# Comparar:
# - Tokens usados con Agent Teams
# - Tiempo total de ejecución
# - Calidad del resultado
```

### Entregable

1. Sistema de notificaciones completo y funcional
2. Tests >85% coverage
3. /cost screenshot mostrando tokens usados
4. Comparación: ¿cuánto habrías tardado sin Agent Teams?
5. Análisis: ¿el 7x de costo justificó la velocidad?

## 10. Ejercicio integrador: Proyecto multi-feature con orquestación completa

### Descripción

Implementa 4 features independientes para la library API usando la combinación de herramientas que prefieras.

### Features

1. **Sistema de favoritos** — POST/DELETE /api/v1/books/:id/favorite, GET /api/v1/users/:id/favorites
2. **Búsqueda avanzada** — GET /api/v1/books/search?q=...&genre=...&rating_min=...&sort=...
3. **Exportación** — GET /api/v1/books/export?format=csv|json (descarga de colección)
4. **Sistema de tags** — CRUD de tags, asociación many-to-many con libros

### Elige tu approach

Approach Herramientas Cuándo elegiría esto A: Agent Teams Opus 4.6 como líder Quiero rapidez, presupuesto no es problema B: claude-squad 4 sesiones tmux Quiero visibilidad, interacción con cada agente C: Manual con -w 4 terminales Control total, sin dependencias extra D: Secuencial 1 sesión Auto mode Proyecto simple, no justifica multi-Claude

### Para cualquier approach

1. Configura CLAUDE.md y .claude/rules/ apropiados (M4)
2. Cada feature debe usar TDD (M3)
3. Configura hooks PostToolUse para formateo (M6)
4. Documenta progreso (PROGRESS.md si usas Ralph, /cost para métricas)

### Entregable

1. **4 features implementadas** con tests pasando
2. **Documento MULTI_CLAUDE_REPORT.md:**
• Approach elegido y justificación
• Tiempo total vs estimación secuencial
• Costo de API (tokens × precio)
• Conflictos encontrados (si los hubo) y cómo se resolvieron
• ¿Usarías multi-Claude de nuevo para este tipo de tarea?
3. **Comparación de approaches** (si probaste más de uno):
• Agent Teams vs claude-squad vs manual
• Velocidad, costo, calidad, complejidad de setup

### Criterios de evaluación

4 features completas y funcionales Tests pasando con >85% coverage Sin conflictos de merge entre features Approach justificado (no "porque sí")
Métricas documentadas (tiempo, costo, tokens)
Reflexión sobre cuándo usar multi-Claude

## 11. Conceptos clave para memorizar

### Las 4 formas de multi-Claude

```
Agent Teams    → Coordinación automática (Opus líder + Sonnet workers)
claude-squad   → Multi-agente visual con tmux (~5.600#)
Ctrl+B         → Background simple (1 tarea en bg + 1 en fg)
-w + terminales → Control manual total con worktree isolation
```

### Costos

```
Agent Teams: ~7x tokens vs sesión estándar
claude-squad: 1x por instancia (N instancias = Nx)
Ctrl+B: Mismo costo que 2 sesiones
-w: Mismo costo que 1 sesión por terminal
```

### Cuándo NO paralelizar

```
Features interdependientes (B necesita que A termine)
Proyecto &lt;1.000 LOC (overhead &gt; beneficio)
Una sola tarea indivisible
Tarea de 1 hora (Auto mode es suficiente)
```

### El patrón write-review

```
Writer (full tools) → Implementa
Reviewer (read-only) → Analiza, reporta
Writer → Corrige
→ Merge
```

## 12. Antipatrones a evitar

**Agent Teams para tareas simples** → 7x de costo sin beneficio. Usa Auto mode
**10 instancias para proyecto pequeño** → Overhead de coordinación > trabajo real
**Paralelo sin aislamiento** → Sin -w, dos Claude editando el mismo archivo = conflictos
**Sin reviewer** → Todo merge directo → calidad inconsistente. Al menos 1 review
**Features dependientes en paralelo** → Feature B necesita Feature A → secuenciar
**Worktree manager manual** → Usa -w nativo. Los scripts de M8 antiguo están obsoletos
**Sin métricas** → Si no mides tiempo y costo, no sabes si multi-Claude valió la pena

## 13. Recursos complementarios

### Repositorios

• smtg-ai/claude-squad (~5.600#) — Multi-agente con tmux
• anthropics/claude-code (~81.600#) — Agent Teams, -w, --teleport

### Documentación oficial

• Agent Teams — Multi-agente nativo
• Background tasks — Ctrl+B
• CLI Reference — Flags -w, --teleport
• Manage costs — Optimización de costos multi-agente

### Lecturas

• Anthropic: Claude Code Best Practices — Multi-agent — Sección de paralelismo
• Boris Cherny: Multi-Claude setup — Thread con detalles

## 14. Checklist de finalización del módulo

Usé Ctrl+B para enviar tarea a background mientras sigo trabajando Ejecuté 3+ sesiones paralelas con -w (worktree isolation)
Probé Agent Teams con Opus 4.6 como líder Entiendo el costo ~7x de Agent Teams y cuándo se justifica Instalé y probé claude-squad con tmux Implementé patrón write-review (writer + reviewer read-only)
Usé --teleport o /remote-control para monitoreo remoto Completé ejercicio integrador (4 features en paralelo)
Métricas documentadas (tiempo, costo, tokens, comparación)
Puedo decidir cuándo usar Agent Teams vs claude-squad vs Ctrl+B vs secuencial Sé cuándo NO paralelizar (features dependientes, proyecto pequeño)

## Próximos pasos

En **Módulo 9: Subagentes y Agent SDK** aprenderás:
• Agent tool (renombrado de Task tool) para spawning de subagentes
• .claude/agents/ — definir agentes con roles, permisos y herramientas específicas
• Agent SDK en profundidad (Python/TypeScript): sesiones, hooks como callbacks, MCP custom
• Pipeline multi-stage (analyzer → designer → implementer → tester)
• Diferencia entre Agent Teams (coordinación automática) y subagentes (control programático)
**Conexión con M8:** Agent Teams coordina automáticamente. Subagentes te dan **control programático** sobre cada
agente: qué modelo usa, qué herramientas tiene, qué instrucciones sigue. M8 es "deja que Claude coordine". M9 es "yo defino cada agente".
