---
excerpt: "Cómo construir harnesses que conviertan a Claude en un agente autónomo de calidad."
---

# Módulo 10: Harnesses para agentes de larga

# duración

**Duración:** 5-6 horas
**Nivel:** Experto
**Dependencias:** Módulos 1-9 (especialmente M7 Ralph, M8 Multi-Claude, M9 Agent SDK)
**Modalidad:** 100% práctica con agentes autónomos overnight
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Implementar el sistema dual** de Anthropic: Initializer Agent + Coding Agent
2. **Diseñar feature lists JSON** con estado verificable y dependencias
3. **Usar git logs como memoria** entre sesiones discretas
4. **Configurar agentes overnight** con safeguards reales (-w, --teleport, --max-turns, hooks)
5. **Implementar checkpointing y recovery** con /rewind y branches de backup
6. **Usar el Agent SDK** para harnesses programáticos con guardrails de costo
7. **Orquestar proyectos multi-día** con tracking de progreso automatizado

## 1. Fundamentos: De Ralph a harnesses enterprise

### 1.1 Ralph es insuficiente para proyectos de varios días

**Ralph (M7):**

```
- Iteraciones múltiples en UNA sesión continua
- Si se interrumpe (laptop, timeout, error), pierde contexto
- No hay memoria entre ejecuciones del script
- Ideal para: 2-6 horas de trabajo continuo
```

**Problema real:**

```
# Día 1: Ralph trabaja 6 horas, completa 15/50 features
# [Cierras laptop]
# Día 2: Reinicias Ralph
# Ralph: "¿Qué features ya están hechas?"
# → Sin memoria. Puede re-implementar lo que ya hizo.
```

### 1.2 La solución: Harnesses con estado persistente

Anthropic documentó el patrón en "Effective harnesses for long-running agents": un sistema de dos agentes con estado que persiste en el filesystem.
```
LONG-RUNNING HARNESS
INITIALIZER AGENT (ejecuta UNA vez)
→ Analiza el proyecto/PRD
→ Genera feature_list.json (estado persistente)
→ Configura CLAUDE.md + .claude/
→ Define completion criteria por feature
CODING AGENT (ejecuta MUCHAS veces)
→ Lee feature_list.json (¿qué falta?)
→ Lee git log (¿qué se hizo antes?)
→ Implementa siguiente feature con TDD
→ Actualiza JSON: status → "completed"
→ Commit semántico
→ Repite hasta completar o timeout
ESTADO PERSISTENTE:
feature_list.json ← Qué features están hechas
git log           ← Cómo se implementaron
PROGRESS.md       ← Tracking de sesiones
```
**La clave:** El Coding Agent NO necesita memoria entre sesiones porque toda la información está en archivos que
persisten (JSON, git, markdown).

### 1.3 Qué cambia respecto a Ralph

Ralph (M7)
Harness (M10)
Loop bash continuo Sesiones discretas reanudables PROGRESS.md como único tracking feature_list.json + git log + PROGRESS.md Una sola ejecución larga Múltiples sesiones (días/semanas)
Stop hook previene salida Cada sesión termina limpiamente, re-invocas Sin dependencias entre features feature_list.json soporta dependencies: [1, 2]
Sin safeguards de costo Agent SDK con max_budget_usd por sesión

## 2. feature_list.json: El estado persistente

### 2.1 Estructura

```
{
  "project": "Task Management API",
  "created": "2026-03-28",
  "features": [
    {
      "id": 1,
      "name": "User Model + Migration",
      "description": "Create User model with email, password_hash, name. Migration with indexes.",
      "status": "completed",
      "verification": "npm test -- --grep 'User model'",
      "dependencies": [],
      "complexity": "simple",
      "completed_at": "2026-03-28T10:30:00Z",
      "session": 1
    },
    {
      "id": 2,
      "name": "User Registration Endpoint",
      "description": "POST /api/v1/users - register with email validation, password hashing",
      "status": "completed",
      "verification": "npm test -- --grep 'registration'",
      "dependencies": [1],
      "complexity": "medium",
      "completed_at": "2026-03-28T11:15:00Z",
      "session": 1
    },
    {
      "id": 3,
      "name": "JWT Authentication",
      "description": "POST /api/v1/auth/login - JWT access + refresh tokens",
      "status": "pending",
      "verification": "npm test -- --grep 'auth'",
      "dependencies": [1, 2],
      "complexity": "medium"
    }
  ],
  "metadata": {
    "total": 15,
    "completed": 2,
    "in_progress": 0,
    "pending": 23
  }
}
```

### 2.2 Principios de diseño

**Cada feature debe ser:**

• **Verificable:** Campo verification con comando que retorna exit 0 si pasa
• **Independiente o con dependencias explícitas:** dependencies: [1, 2]
• **Granular:** 1-2 horas de trabajo cada una (no "implementa todo el backend")
• **Atomic:** Un commit por feature
**El JSON es la source of truth.** El Coding Agent lo lee al inicio, trabaja, y lo actualiza al final. Entre sesiones, el JSON
persiste en el filesystem.

### 2.3 Generarlo con el Initializer Agent

```
# El Initializer genera el feature_list.json a partir del PRD
claude -p "
Lee el PRD en docs/PRD.md y genera feature_list.json con estas reglas:
1. Descompón el proyecto en 15-20 features granulares (1-2h cada una)
2. Cada feature tiene: id, name, description, status (pending), verification (comando), dependencies (IDs), complexity
3. Ordena por dependencias: features sin dependencias primero
4. El campo verification debe ser un comando ejecutable que verifica completitud
5. Guarda como feature_list.json en la raíz del proyecto
" --max-turns 10
```

## 3. Git log como memoria entre sesiones

### 3.1 El problema sin memoria

```
# Session 1: Implementa User model
# Session 2 (nuevo día): El agente no sabe que User model existe
# → Intenta re-implementar User model → conflictos
```

### 3.2 Git log resuelve el problema

El Coding Agent lee git log al inicio de cada sesión:
```
# En el prompt del Coding Agent:
RECENT_COMMITS=$(git log --oneline -20 --grep="feat:")
RECENT_FILES=$(git log --name-only --pretty=format: -10 | sort -u | grep -v '^$')
# Incluir en prompt:
echo "
GIT LOG (your memory of previous sessions):
$RECENT_COMMITS
FILES MODIFIED RECENTLY:
$RECENT_FILES
IMPORTANT: Do NOT re-implement features that already appear in git log.
USE existing code from previous sessions. BUILD on top of it.
"
```

**Session 2 con git log:**

```
Agent lee:
  "feat: User model with validation (#1)"
  "feat: User registration endpoint (#2)"
Agent razona:
  "User model ya existe en src/models/User.js.
   Registration endpoint en src/routes/users.js.
   Siguiente: JWT Auth. Usaré User model existente."
```

### 3.3 Commits semánticos como memoria estructurada

**Patrón de commit por feature:**

```
feat(users): User model with email validation (#1)
feat(users): Registration endpoint with password hashing (#2)
feat(auth): JWT login with access + refresh tokens (#3)
test(auth): Integration tests for auth flow (#3)
```
El #N referencia el ID en feature_list.json. El agente puede buscar por ID:
```
# ¿Qué commits corresponden a feature #3?
git log --oneline --grep="#3"
# → feat(auth): JWT login... (#3)
# → test(auth): Integration tests... (#3)
```

## 4. Ejercicio práctico 1: Sistema dual Initializer + Coding Agent

### Objetivo

Implementar los dos agentes del harness y ejecutar 3 sesiones con estado persistente.

### Paso 1: Crear PRD

```
mkdir harness-demo &amp;&amp; cd harness-demo
git init
npm init -y
npm install express better-sqlite3
npm install --save-dev vitest @vitest/coverage-v8 supertest
mkdir -p src/{models,routes,services,middleware} tests/ docs/
&lt;!-- docs/PRD.md --&gt;
# Task Management API
## Description
API REST para gestión de tareas con usuarios, proyectos y tareas.
## Core Features
- User management (CRUD + auth)
- Project management (CRUD + membership)
- Task management (CRUD + assignment + status)
- Task comments
- Basic search and filtering
## Technical Stack
- Express.js + better-sqlite3
- JWT authentication
- Vitest for testing
- &gt;85% coverage target
```

### Paso 2: Ejecutar Initializer Agent

```
claude -p "
Eres el INITIALIZER AGENT para un proyecto de larga duración.
Lee docs/PRD.md y ejecuta estas tareas:
1. Genera feature_list.json con 15-20 features granulares.
   Cada feature debe tener: id, name, description, status (pending),
   verification (comando npm test), dependencies, complexity.
   Ordena por dependencias.
2. Crea CLAUDE.md con:
   - WHAT/WHY/HOW del proyecto
   - Instrucciones para el Coding Agent:
     a) Leer feature_list.json para saber qué falta
     b) Leer git log para memoria de sesiones anteriores
     c) Implementar siguiente feature pendiente con TDD
     d) Actualizar JSON al completar
     e) Commit semántico: feat(scope): description (#ID)
   - Convención: un commit por feature
3. Crea PROGRESS.md inicial vacío
4. Crea estructura de directorios necesaria
5. Haz git add -A &amp;&amp; git commit -m 'chore: initialize project with harness'
" --max-turns 20
```

### Paso 3: Crear el Coding Agent como script

```
#!/bin/bash
# code-session.sh — Ejecuta UNA sesión del Coding Agent
FEATURE_LIST="feature_list.json"
MAX_FEATURES=${1:-5}  # Features por sesión
# Verificar estado
PENDING=$(jq '[.features[] | select(.status == "pending")] | length' $FEATURE_LIST)
COMPLETED=$(jq '.metadata.completed' $FEATURE_LIST)
TOTAL=$(jq '.metadata.total' $FEATURE_LIST)
echo "III Coding Session III"
echo "Progress: $COMPLETED/$TOTAL completed, $PENDING pending"
echo "Max features this session: $MAX_FEATURES"
if [ "$PENDING" -eq 0 ]; then
  echo "I All features complete!"
  exit 0
fi
# Context para el agente
RECENT_COMMITS=$(git log --oneline -20 --grep="feat:" 2&gt;/dev/null || echo "No commits yet")
NEXT_ID=$(jq -r '[.features[] | select(.status == "pending")][0].id' $FEATURE_LIST)
NEXT_NAME=$(jq -r "[.features[] | select(.id == $NEXT_ID)].name" $FEATURE_LIST)
echo "Next feature: #$NEXT_ID — $NEXT_NAME"
echo ""
# Invocar Coding Agent
claude -p "
Eres el CODING AGENT en un harness de larga duración.
ESTADO ACTUAL (feature_list.json):
$(cat $FEATURE_LIST)
GIT LOG (tu memoria de sesiones anteriores):
$RECENT_COMMITS
INSTRUCCIONES:
1. Lee CLAUDE.md para contexto del proyecto
2. La siguiente feature pendiente es #$NEXT_ID: $NEXT_NAME
3. Implementa con TDD:
   a) Escribe tests primero
   b) Implementa código para pasar tests
   c) Ejecuta tests para confirmar GREEN
4. Al completar:
   a) Actualiza feature_list.json: status → completed, completed_at → ahora
   b) Actualiza metadata counts
   c) Commit: feat(scope): description (#$NEXT_ID)
   d) Añade entrada en PROGRESS.md
5. Si terminas, pasa a la siguiente feature (hasta $MAX_FEATURES features)
REGLAS:
- NO re-implementes features que ya están en git log
- USA código existente de features anteriores
- SIEMPRE ejecuta tests antes de marcar como completed
- UN commit por feature
" --max-turns 30 -w
# Post-session summary
NEW_COMPLETED=$(jq '.metadata.completed' $FEATURE_LIST)
DONE_THIS_SESSION=$((NEW_COMPLETED - COMPLETED))
echo ""
echo "III Session Summary III"
echo "Features completed: $DONE_THIS_SESSION"
echo "Total progress: $NEW_COMPLETED/$TOTAL"
echo "$(date): +$DONE_THIS_SESSION features" &gt;&gt; PROGRESS.md
```

### Paso 4: Ejecutar 3 sesiones

```
chmod +x code-session.sh
# Session 1: Features 1-5
./code-session.sh 5
# → Implementa User model, registration, login, etc.
# [Simular pausa — cierra terminal, abre mañana]
# Session 2: Features 6-10
./code-session.sh 5
# → Lee git log: ve features 1-5 ya implementadas
# → Continúa con feature 6 (usa User model existente)
# Session 3: Features 11-15
./code-session.sh 5
# → Lee git log: ve features 1-10
# → Continúa con feature 11
```

### Verificación entre sesiones

```
# Después de cada sesión:
jq '.metadata' feature_list.json
# { "total": 20, "completed": 10, "pending": 10 }
cat PROGRESS.md
# 2026-03-28 10:00: +5 features
# 2026-03-28 14:00: +5 features
git log --oneline
# feat(tasks): Task comments (#10)
# feat(tasks): Task assignment (#9)
# ...
# feat(users): User model (#1)
npm test
#  45 tests passed
```

### Entregable

```
1. code-session.sh funcional
```
2. feature_list.json con tracking real
3. 3 sesiones ejecutadas con estado persistente
4. Git log mostrando commits por feature
5. Tests pasando después de cada sesión

## 5. Agentes overnight con safeguards

### 5.1 El patrón overnight

Combinar Ralph loop (M7) con harness persistente (M10) para sesiones de 6-8 horas sin supervisión:
```
#!/bin/bash
# overnight.sh
MAX_FEATURES=${1:-15}
TIMEOUT_HOURS=${2:-8}
START=$(date +%s)
TIMEOUT_SECS=$((TIMEOUT_HOURS * 3600))
echo "I Overnight session starting"
echo "Max features: $MAX_FEATURES, Timeout: ${TIMEOUT_HOURS}h"
# Safety: backup branch
git branch "backup-overnight-$(date +%Y%m%d)" 2&gt;/dev/null
COMPLETED_START=$(jq '.metadata.completed' feature_list.json)
FEATURES_DONE=0
while [ $FEATURES_DONE -lt $MAX_FEATURES ]; do
  # Timeout check
  NOW=$(date +%s)
  if [ $((NOW - START)) -gt $TIMEOUT_SECS ]; then
    echo "I Timeout reached"
    break
  fi
  # Pending check
  PENDING=$(jq '[.features[] | select(.status == "pending")] | length' feature_list.json)
  if [ "$PENDING" -eq 0 ]; then
    echo "I All features complete!"
    break
  fi
  # Run one session (1 feature)
  ./code-session.sh 1
  # Verify tests pass after each feature
  if ! npm test --silent 2&gt;/dev/null; then
    echo "II Tests failed. Stopping overnight."
    break
  fi
  CURRENT=$(jq '.metadata.completed' feature_list.json)
  FEATURES_DONE=$((CURRENT - COMPLETED_START))
  echo "I Overnight progress: +$FEATURES_DONE features"
  sleep 5
done
# Generate report
cat &gt; overnight_report.md &lt;&lt;EOF
# Overnight Report
Started: $(date -r $START 2&gt;/dev/null || date)
Ended: $(date)
Features completed: $FEATURES_DONE
Total progress: $(jq '.metadata.completed' feature_list.json)/$(jq '.metadata.total' feature_list.json)
## Commits
$(git log --oneline --since="${TIMEOUT_HOURS} hours ago")
## Test Results
$(npm test 2&gt;&amp;1 | tail -5)
EOF
echo "I Report: overnight_report.md"
```

### 5.2 Safeguards esenciales

Safeguard Implementación Por qué

**Backup branch**

```
git branch backup-
```
Revertir si algo sale mal
```
overnight-DATE
```

**Timeout**

Comparar timestamp de inicio vs actual No correr indefinidamente

**Tests after each**

**feature**

`npm test \ \ break` Parar si rompe algo

**Max features cap**

Argumento al script Control de costo

**Worktree isolation**

-w en
code-session.sh No ensuciar tu working directory

**Report automático**

overnight_report.md Saber qué pasó al despertar

### 5.3 Monitoreo remoto overnight

```
# Opción 1: teleport (monitorear desde móvil)
# En code-session.sh, cambiar:
claude -p "..." --max-turns 30 -w --teleport
# La sesión aparece en claude.ai/code
# Puedes monitorear desde el móvil
# Opción 2: Hook HTTP de notificación
# En .claude/settings.json:
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "http",
        "url": "https://hooks.slack.com/services/T.../B.../xxx",
        "method": "POST",
        "body": "{\"text\": \"I Overnight: feature completed\"}"
      }]
    }]
  }
}
```

### 5.4 Overnight con Agent SDK (alternativa programática)

```
# overnight_sdk.py
import asyncio
import json
from datetime import datetime, timedelta
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
async def overnight():
    client = ClaudeSDKClient()
    max_features = 15
    timeout = datetime.now() + timedelta(hours=8)
    completed = 0
    while completed &lt; max_features and datetime.now() &lt; timeout:
        with open("feature_list.json") as f:
            features = json.load(f)
        pending = [f for f in features["features"] if f["status"] == "pending"]
        if not pending:
            print("I All features complete!")
            break
        next_feat = pending[0]
        print(f"I Working on #{next_feat['id']}: {next_feat['name']}")
        result = await client.send(
            prompt=f"Implement feature #{next_feat['id']}: {next_feat['name']}. "
                   f"Description: {next_feat['description']}. Use TDD. "
                   f"Update feature_list.json when done.",
            options=ClaudeAgentOptions(
                setting_sources=["project"],
                max_turns=25,
                max_budget_usd=3.0,  # $3 max per feature
            ),
        )
        completed += 1
        print(f"  I Done ({completed}/{max_features})")
    await client.close()
    print(f"\nI Overnight complete: {completed} features")
asyncio.run(overnight())
```
**Ventaja del SDK:** max_budget_usd=3.0 garantiza que ninguna feature cuesta más de $3. Si el agente se atasca en
loops, se detiene automáticamente.

## 6. Checkpointing y recovery

### 6.1 /rewind para recovery

Si una sesión va mal, /rewind revierte al checkpoint anterior:
```
# Sesión normal:
implementa feature #8: Payment integration
# Claude implementa mal (rompe tests)
# En lugar de debuggear:
/rewind
# Vuelve al estado antes del intento
# Puedes re-intentar con instrucciones diferentes
```

### 6.2 Backup branches automáticas

```
# Antes de cada sesión (en code-session.sh):
git branch "checkpoint-session-$(date +%Y%m%d-%H%M)" 2&gt;/dev/null
# Si la sesión va mal:
git checkout checkpoint-session-20260328-1400
git checkout -b main-recovered
# Actualizar feature_list.json para reflejar el revert:
# Cambiar features que se corrompieron de "completed" → "pending"
```

### 6.3 feature_list.json como checkpoint

```
# Antes de cada sesión overnight:
cp feature_list.json feature_list.json.backup
# Si algo sale mal:
cp feature_list.json.backup feature_list.json
git checkout .  # Revertir código
```

## 7. Ejercicio práctico 2: Overnight real con safeguards

### Objetivo

Ejecutar una sesión overnight de 4+ horas con todos los safeguards.

### Setup

Usar el proyecto del ejercicio 1 (harness-demo) con 15+ features pendientes.

### Ejecución

```
# Antes de "dormir" (o de dejar el ordenador):
# 1. Verificar estado
jq '.metadata' feature_list.json
npm test
# 2. Crear backup
git branch backup-overnight-$(date +%Y%m%d)
# 3. Configurar hooks de notificación (opcional)
# Editar .claude/settings.json con hook HTTP Stop
# 4. Lanzar overnight
nohup ./overnight.sh 10 6 &gt; overnight.log 2&gt;&amp;1 &amp;
echo "Overnight PID: $!"
# O con Agent SDK:
nohup python overnight_sdk.py &gt; overnight.log 2&gt;&amp;1 &amp;
# 5. Monitorear (opcional)
tail -f overnight.log
```

### Al despertar

```
# 1. Ver reporte
cat overnight_report.md
# 2. Verificar estado
jq '.metadata' feature_list.json
npm test
# 3. Ver qué se hizo
git log --oneline --since="8 hours ago"
# 4. Si algo salió mal:
git diff backup-overnight-$(date +%Y%m%d)..HEAD
# Evaluar si revertir o aceptar
```

### Entregable

1. overnight.sh o overnight_sdk.py funcional
2. Sesión de 4+ horas ejecutada
3. overnight_report.md generado
4. Backup branch creada
5. Tests pasando post-overnight
6. Análisis: features completadas, costo, issues encontrados

## 8. Ejercicio integrador: Proyecto multi-día completo

### Descripción

Proyecto de 15 features ejecutado en 3-4 sesiones a lo largo de 2 días.

### Plan

**Día 1 (AM):**

```
# Initializer Agent
claude -p "..." --max-turns 20
# → feature_list.json con 15 features
# Session 1: Features 1-5 (fundamentos: modelos, DB, setup)
./code-session.sh 5
```

**Día 1 (PM):**

```
# Session 2: Features 6-10 (API core: endpoints, auth, validación)
./code-session.sh 5
```

**Día 1 (noche):**

```
# Overnight: Features 11-15 (features avanzadas + polish)
./overnight.sh 5 6
```

**Día 2 (AM):**

```
# Review overnight
cat overnight_report.md
npm test
# Final validation
npm test -- --coverage
jq '.metadata' feature_list.json
# { "total": 15, "completed": 15, "pending": 0 }
```

### Entregable

1. **Proyecto completo:** 15 features implementadas
2. **feature_list.json:** 15/15 completed
3. **PROGRESS.md:** Log de todas las sesiones
4. **overnight_report.md:** Sesión nocturna documentada
5. **Git history:** Commits semánticos por feature
6. **Tests:** >85% coverage
7. **HARNESS_REPORT.md:**
• Sesiones ejecutadas (cuántas, duración)
• Features por sesión
• Costo total de API estimado
• Issues que requirieron intervención manual
• Comparación: tiempo con harness vs estimación manual
• ¿El harness overnight funcionó sin problemas?
• ¿Qué mejorarías del sistema?

## 9. Conceptos clave para memorizar

### Sistema dual

```
INITIALIZER → Ejecuta UNA vez, crea estructura + feature_list.json
CODING AGENT → Ejecuta MUCHAS veces, lee estado, hace progreso, actualiza
```

### Triángulo de persistencia

```
feature_list.json → QUÉ features están hechas (source of truth)
git log           → CÓMO se implementaron (memoria técnica)
PROGRESS.md       → CUÁNDO se hicieron (tracking de sesiones)
```

### Safeguards overnight

```
1. Backup branch antes de empezar
2. Timeout (no correr indefinidamente)
3. Tests después de cada feature (rompe → para)
4. Max features cap (control de costo)
5. max_budget_usd en Agent SDK
6. Report automático al terminar
```

### Harness vs Ralph

```
Ralph   → Sesión continua, 2-6h, PROGRESS.md como tracking
Harness → Sesiones discretas, días/semanas, feature_list.json + git log
```

## 10. Antipatrones a evitar

**Features sin verification command** → Marcadas "completed" sin funcionar → cada feature necesita un test
ejecutable
**Overnight sin backup** → Si falla, no puedes revertir → git branch backup-* SIEMPRE
**Overnight sin timeout** → 24h corriendo, $200 de API → poner límite de horas
**Sin leer git log** → Re-implementa código existente → siempre incluir git log en prompt
**Features de 8 horas** → Demasiado grandes → descomponer en 1-2h cada una
**Sin tests entre features** → Feature 5 rompe feature 3 y nadie lo detecta → npm test || break
**feature_list.json sin dependencias** → Feature 3 se intenta antes que feature 1 (su dependencia) → modelar con
```
dependencies: [1]
```
**Confiar ciegamente en overnight** → Siempre revisar overnight_report.md y tests al despertar

## 11. Recursos complementarios

### Lectura obligatoria

• Anthropic: Effective Harnesses for Long-Running Agents — El blog post que define este patrón

### Repositorios

• snarktank/ralph — Base de Ralph (M7) que evoluciona en harness
• DmitrySolana/ralph-claude-code (~1.200#) — Loop autónomo
• anthropics/claude-agent-sdk-python (~5.745#) — SDK para harnesses programáticos
• repomirrorhq/repomirror — Técnica de harness para porting

### Documentación oficial

• Manage costs — Control de costo para sesiones largas
• CLI Reference — Flags: -w, --teleport, --max-turns, -c, -r

### Casos de estudio

• Geoffrey Huntley: $50k contrato completado con Ralph/harness, $297 en API
• AI Hero: Tips for AI Coding with Ralph Wiggum — 11 tips aplicables a harnesses

## 12. Checklist de finalización del módulo

Implementé Initializer Agent que genera feature_list.json Implementé Coding Agent que lee estado y hace progreso incremental feature_list.json funciona como estado persistente entre sesiones Git log incluido en prompt como memoria entre sesiones Ejecuté 3+ sesiones con estado persistente Commits semánticos por feature (#ID)
Configuré overnight con todos los safeguards (backup, timeout, tests, max features)
Ejecuté sesión overnight de 4+ horas overnight_report.md generado automáticamente Probé checkpointing (/rewind o backup branch)
Implementé versión con Agent SDK (max_budget_usd)
Completé proyecto multi-día (15+ features)
Métricas documentadas (sesiones, costo, tiempo, comparación)
Puedo decidir cuándo usar Ralph (M7) vs Harness (M10) vs Agent Teams (M8)

