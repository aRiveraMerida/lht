---
excerpt: "El patrón Ralph Wiggum: iteración agéntica persistente para tareas complejas."
---

# Módulo 7: Metodología Ralph Wiggum

**Duración:** 6-7 horas
**Nivel:** Avanzado
**Dependencias:** Módulos 1-6 (especialmente M3 TDD, M6 Hooks)
**Modalidad:** 100% práctica con tareas de larga duración reales
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Implementar Ralph loops** usando headless mode (claude -p) con --max-turns para tareas iterativas
2. **Diseñar completion promises** verificables automáticamente con tests o comandos
3. **Configurar Stop hooks** en settings.json para interceptar salida prematura
4. **Diferenciar AFK-Ralph vs HITL-Ralph vs Auto mode** y cuándo usar cada uno
5. **Configurar worktree isolation** con -w para sesiones Ralph aisladas
6. **Monitorear remotamente** con --teleport para tareas overnight
7. **Usar el Agent SDK** como alternativa programática a bash loops
8. **Optimizar costos** con guardrails de tokens y turnos

## 1. Fundamentos: ¿Qué es Ralph y qué problema resuelve?

### 1.1 El problema de las tareas que exceden una sesión

```
# Tarea: Migrar 100 tests de Jest a Vitest
claude "migra todos los tests de Jest a Vitest"
# Claude hace:
# 1. Migra 8-15 archivos
# 2. Se detiene (piensa que terminó)
# 3. Reporta: "Migración completa I"
# Realidad: Quedan 85+ archivos sin migrar
```

**¿Por qué pasa esto?**

• Claude trabaja en una sola conversación con contexto finito
• No tiene mecanismo para verificar completitud real
• "Algunos archivos migrados" se confunde con "todos migrados"
• No hay persistencia entre invocaciones

### 1.2 Ralph = loop que re-alimenta a Claude hasta completar

**Ralph Wiggum** (nombre del personaje de Los Simpsons, por su persistencia ingenua) es un **bash loop que invoca a**
**Claude repetidamente** hasta que una condición verificable se cumple:
```
while true; do
  # 1. Claude trabaja en la tarea (headless mode)
  claude -p "$PROMPT" --max-turns 20
  # 2. Verificar completion promise
  if completion_check_passes; then
    echo "I Task complete!"
    break
  fi
  # 3. Si no completó, re-alimentar
  echo "I Progress made, continuing..."
done
```

**Componentes clave:**

```
RALPH SYSTEM
PRD.md IIIIIII Define completion promise
Ralph Loop III claude -p (headless, --max-turns)
PROGRESS.md (tracking)
Completion Check
¿Pasó? IIII SÍ III EXIT (done)
Stop Hook (settings.json) III Previene salida
prematura
```

### 1.3 La historia y los números

**Origen — Geoffrey Huntley (AI Hero):**

"Usé Ralph para completar un contrato de desarrollo de $50,000. Costo total en API calls: $297. Ralph corrió durante 3 días en modo AFK."

**Métricas del caso documentado:**

• 47 features en feature_list.json
• 72 horas de ejecución (3 días)
• ~340 iteraciones de Claude
• $297 en API costs
• 43/47 features completadas (91.5%)

**Repositorios de referencia:**

• snarktank/ralph — Implementación original
• DmitrySolana/ralph-claude-code (~1.200#) — Loop autónomo con detección de exit

### 1.4 Las piezas técnicas que ya conoces

Ralph combina conceptos de módulos anteriores:
Pieza De qué módulo Rol en Ralph Headless mode (claude -p)
M1 CLI Invocar Claude sin REPL interactivo M1 CLI Limitar iteraciones por invocación
```
--max-turns
```
Stop hooks (settings.json)
M6 Hooks Prevenir salida prematura TDD / tests como verificación M3 TDD Completion promise verificable CLAUDE.md + rules/ M4 Config Contexto persistente entre invocaciones Auto-memoria M1 Claude aprende entre sesiones

### 1.5 Ralph vs Auto mode vs Headless: cuándo usar cada uno

Desde marzo 2026, Claude Code tiene **Auto mode** donde la IA auto-verifica la seguridad de cada acción. Esto cubre muchos casos que antes requerían Ralph.
Escenario Herramienta Por qué Tarea de 1-2 horas, no requiere persistencia
**Auto mode** (sesión interactiva
normal)
Auto mode + /effort auto es suficiente Tarea que excede 1 sesión (multi-día)

**Ralph loop**

Necesita persistencia via PROGRESS.md y re-alimentación Migración mecánica de 100+ archivos

**Ralph AFK**

Reglas claras, completion promise verificable Refactor arquitectónico overnight

**Ralph HITL**

Necesita validación humana en decisiones de diseño Automatización en CI/CD (sin humano)
```
Headless (claude -p --max-turns
```
Sin REPL, output estructurado, limits programáticos N)
Integración con pipeline existente
**Agent SDK** (Python/TypeScript)
Programático, guardrails de costo, streaming
**Regla práctica:** Si puedes terminar en una sesión → no necesitas Ralph. Si la tarea requiere múltiples sesiones con
tracking de progreso → Ralph. Si la tarea es programática y se integra en un pipeline → Agent SDK.

## 2. Headless mode: la base técnica de Ralph

### 2.1 claude -p — ejecutar y salir

El **headless mode** (print mode) ejecuta Claude sin REPL interactivo:
```
# Ejecuta prompt, imprime resultado, sale
claude -p "lista los archivos en src/"
# Con límite de turnos
claude -p "implementa la función calculateTax" --max-turns 10
# Con output JSON (para parsing programático)
claude -p "analiza este código" --output-format json
# Con output streaming JSON
claude -p "migra este archivo" --output-format stream-json
# Continuando sesión anterior
claude -c -p "continúa con el siguiente archivo"
# Resumiendo sesión específica
claude -r "session-id" -p "siguiente paso"
```

### 2.2 Flags relevantes para Ralph

Flag Efecto Uso en Ralph Headless mode (ejecuta y sale)
Invocación no-interactiva
```
-p "prompt"
```
Límite de turnos por invocación Evitar loops infinitos dentro de una
```
--max-turns N
```
invocación Continuar última conversación Mantener contexto entre
```
-c
```
invocaciones Resumir sesión específica Recuperar contexto perdido
```
-r "id"
```
Git worktree aislado Cada Ralph en su propio worktree
```
-w
```
Output como JSON Parsing programático de resultados
```
--output-format json
```
Modelo específico Sonnet para iteración, Opus para
```
--model MODEL
```
decisiones Herramientas permitidas Restringir qué puede hacer Claude
```
--allowedTools TOOLS
```
Sin prompts de permiso Solo en entornos controlados (CI/CD)
```
--dangerously-skip-permissions
```

### 2.3 Pipe de input

```
# Pipe de archivo como prompt
cat PRD.md | claude -p
# Pipe de múltiples fuentes
cat PRD.md PROGRESS.md | claude -p "basándote en esta info, continúa"
# Pipe de comando
git diff | claude -p "revisa estos cambios"
```

## 3. Completion promises: el corazón de Ralph

### 3.1 Qué es un completion promise

Un **completion promise** es una condición verificable automáticamente que define cuándo la tarea está completa:
```
MALO: "Cuando todo esté listo"
→ Ambiguo, no verificable
MALO: "Cuando todos los tests pasen"
→ Verificable pero impreciso (¿cuántos tests?)
BUENO: "Cuando grep -r 'vi.fn' *.test.js retorne 20 resultados
           Y npm test muestre 60 tests passing
           Y grep -r 'jest.fn' *.test.js retorne 0 resultados"
→ Específico, verificable automáticamente, con 3 condiciones
```

### 3.2 Anatomía de un PRD.md para Ralph

```
# PRD: Migrate Jest → Vitest
## Goal
Migrate all 20 test files from Jest syntax to Vitest.
## Scope
- 20 files: module1.test.js ... module20.test.js
- Update package.json (remove jest, add vitest)
- Create vitest.config.js
- Replace: jest.fn() → vi.fn(), jest.mock() → vi.mock()
## Completion Promise
Task is COMPLETE when ALL of these pass:
1. `grep -r 'vi.fn' *.test.js | wc -l` returns 20
2. `grep -r 'jest.fn' *.test.js | wc -l` returns 0
3. `npm test` exits with code 0 (all 60 tests pass)
4. PROGRESS.md contains "Status: COMPLETE"
## Verification Script
```
#!/bin/bash
VI_COUNT=$(grep -r 'vi.fn' *.test.js | wc -l)
JEST_COUNT=$(grep -r 'jest.fn' *.test.js | wc -l)
TEST_RESULT=$(npm test 2>&1; echo $?)
if [ "$VI_COUNT" -eq 20 ] && [ "$JEST_COUNT" -eq 0 ] && [ "$TEST_RESULT" -eq 0 ]; then echo "COMPLETE"
exit 0 else echo "INCOMPLETE: vi=$VI_COUNT/20, jest=$JEST_COUNT/0, tests=$TEST_RESULT"
exit 1 fi

### 3.3 PROGRESS.md: la memoria entre iteraciones

Claude no tiene memoria entre invocaciones headless. PROGRESS.md es el mecanismo de tracking:
```
# Progress: Jest → Vitest Migration
Started: 2026-03-27 10:00
Last updated: 2026-03-27 10:45
Iteration: 7
## Status: IN_PROGRESS
## Completed (14/20)
- [x] module1.test.js
- [x] module2.test.js
...
- [x] module14.test.js
- [ ] module15.test.js
- [ ] module16.test.js
...
- [ ] module20.test.js
## Issues found
- module8.test.js: jest.spyOn needed special handling (vi.spyOn)
- module12.test.js: timer mocks differ (jest.useFakeTimers → vi.useFakeTimers)
## Next action
Process module15.test.js
```
Claude lee PROGRESS.md al inicio de cada invocación y lo actualiza al final. Sin esto, repite trabajo ya hecho.

## 4. Ejercicio práctico 1: Ralph básico con headless mode

### Objetivo

Implementar un Ralph loop funcional para agregar JSDoc a 10 archivos JavaScript.

### Setup

```
mkdir ralph-demo &amp;&amp; cd ralph-demo
git init
# Crear 10 archivos sin JSDoc
for i in $(seq 1 10); do
cat &gt; "module${i}.js" &lt;&lt;EOF
export function calculateSum(a, b) {
  return a + b;
}
export function calculateProduct(a, b) {
  return a * b;
}
EOF
done
git add . &amp;&amp; git commit -m "initial: 10 modules without JSDoc"
```

### Crear PRD.md

```
# PRD: Add JSDoc to all JavaScript files
## Goal
Add JSDoc documentation to every exported function in all .js files.
## Completion Promise
Task COMPLETE when:
1. Every exported function has @param and @returns tags
2. `grep -r '@param' *.js | wc -l` returns &gt;= 20 (2 functions × 10 files)
3. `grep -r '@returns' *.js | wc -l` returns &gt;= 20
4. PROGRESS.md shows "Status: COMPLETE"
## Rules
- One file per iteration
- Update PROGRESS.md after each file
- Do NOT skip files
```

### Crear PROGRESS.md inicial

```
cat &gt; PROGRESS.md &lt;&lt;'EOF'
# Progress: JSDoc Documentation
Status: IN_PROGRESS
Files completed: 0/10
## Checklist
- [ ] module1.js
- [ ] module2.js
- [ ] module3.js
- [ ] module4.js
- [ ] module5.js
- [ ] module6.js
- [ ] module7.js
- [ ] module8.js
- [ ] module9.js
- [ ] module10.js
EOF
```

### Crear ralph.sh

```
#!/bin/bash
# ralph.sh — Basic Ralph loop
set -e
MAX_ITERATIONS=25
ITERATION=0
echo "I Ralph starting — JSDoc Documentation"
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo ""
  echo "III I Iteration $ITERATION III"
  # Build prompt with current state
  PROMPT=$(cat &lt;&lt;PROMPT_EOF
You are working on a documentation task.
PRD (task definition):
$(cat PRD.md)
Current progress:
$(cat PROGRESS.md)
INSTRUCTIONS:
1. Read PROGRESS.md to see which files are done
2. Pick the NEXT unchecked file
3. Add complete JSDoc to ALL functions in that file
4. Mark the file as [x] in PROGRESS.md
5. Update "Files completed: N/10"
6. If all 10 files done, change "Status: COMPLETE"
Process ONE file, then stop.
PROMPT_EOF
)
  # Invoke Claude in headless mode
  echo "$PROMPT" | claude -p --max-turns 15
  # Check completion promise
  PARAM_COUNT=$(grep -rc '@param' *.js 2&gt;/dev/null | awk -F: '{s+=$2}END{print s}')
  STATUS=$(grep "^Status:" PROGRESS.md | awk '{print $2}')
  echo "I Check: @param=$PARAM_COUNT/20, Status=$STATUS"
  if [ "$STATUS" = "COMPLETE" ] &amp;&amp; [ "$PARAM_COUNT" -ge 20 ]; then
    echo ""
    echo "I COMPLETION PROMISE MET after $ITERATION iterations!"
    break
  fi
  sleep 2
done
if [ $ITERATION -eq $MAX_ITERATIONS ]; then
  echo "II Max iterations reached. Check PROGRESS.md."
fi
```

### Ejecutar

```
chmod +x ralph.sh
./ralph.sh
```

**Output esperado:**

```
Ralph starting — JSDoc Documentation
I Iteration 1
[Claude documenta module1.js]
Check: @param=2/20, Status=IN_PROGRESS
I Iteration 2
[Claude documenta module2.js]
Check: @param=4/20, Status=IN_PROGRESS
...
I Iteration 10
[Claude documenta module10.js]
Check: @param=20/20, Status=COMPLETE
COMPLETION PROMISE MET after 10 iterations!
```

### Entregable

1. ralph.sh funcional
2. PRD.md con completion promise claro
3. PROGRESS.md actualizado por Claude
4. 10 archivos con JSDoc completo
5. Log con número de iteraciones y output de cada checkpoint

## 5. Stop hooks: prevenir salida prematura

### 5.1 El problema

Sin Stop hook, Claude puede declarar "terminado" en la iteración 3 de 10 y el loop no lo sabe:
```
# Claude en iteración 3:
"He completado la documentación de los archivos."
# Realidad: Solo hizo 3/10
```

### 5.2 Configurar Stop hook en settings.json

Los Stop hooks se configuran en settings.json (no como shell scripts sueltos):
```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "STATUS=$(grep '^Status:' PROGRESS.md 2&gt;/dev/null | awk '{print $2}'); if [ \"$STATUS\" != 'COMP
        }]
      }
    ]
  }
}
```

**Cómo funciona:**

• El evento Stop se dispara cuando Claude intenta terminar
• El hook lee PROGRESS.md
• Si Status ≠ COMPLETE → exit 2 (DENY) → Claude NO puede parar
• Si Status = COMPLETE → exit 0 (ALLOW) → Claude puede terminar

### 5.3 Stop hook más robusto

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "bash -c 'STATUS=$(grep \"^Status:\" PROGRESS.md 2&gt;/dev/null | awk \"{print \\$2}\"); PARAM=$(gr
          "timeout": 10
        }]
      }
    ]
  }
}
```
Este verifica TANTO el Status de PROGRESS.md COMO la condición real del completion promise (@param count).

### 5.4 Ejercicio: Probar el Stop hook

```
# 1. Configura el Stop hook en .claude/settings.json
# 2. Inicia nueva sesión (hooks se cargan al inicio)
# 3. Pide a Claude documentar "todos los archivos"
#    pero con solo 3 archivos listos
documenta todos los archivos .js del proyecto con JSDoc
# Claude documenta algunos y luego intenta parar:
# I BLOCKED: Status=IN_PROGRESS (@param=6/20). Keep working.
# Claude continúa trabajando
```

## 6. AFK-Ralph vs HITL-Ralph

### 6.1 AFK-Ralph (Away From Keyboard)

Ralph corre sin supervisión. Ideal para tareas mecánicas con reglas claras:
```
# Ejecutar y irte a dormir
nohup ./ralph.sh &gt; ralph.log 2&gt;&amp;1 &amp;
# Monitorear remotamente (desde otro terminal o móvil)
tail -f ralph.log
```
**Con worktree isolation (**-w**):**
```
# Cada sesión Ralph en su propio worktree aislado
# No afecta tu working directory principal
# En ralph.sh, cambiar invocación de Claude:
echo "$PROMPT" | claude -p -w --max-turns 15
```
El flag -w crea un git worktree nuevo para cada invocación, evitando conflictos si estás trabajando en el repo al mismo tiempo.
**Con monitoreo remoto (**--teleport**):**
```
# Iniciar Ralph con teleport (sesión accesible desde web)
claude --teleport -p "$PROMPT" --max-turns 15
# La sesión se mueve a claude.ai/code
# Puedes monitorear desde el móvil
# Útil para sesiones overnight
```

### 6.2 HITL-Ralph (Human In The Loop)

Ralph pausa después de cada iteración para que revises:
```
#!/bin/bash
# ralph-hitl.sh
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo "III I Iteration $ITERATION III"
  echo "$PROMPT" | claude -p --max-turns 15
  # Check completion
  if completion_check_passes; then break; fi
  # HITL pause
  echo ""
  echo "II  HUMAN CHECKPOINT"
  echo "  [c] Continue  [a] Abort  [m] Modify prompt"
  read -p "  Choice: " CHOICE
  case $CHOICE in
    a|A) echo "Aborted."; exit 0 ;;
    m|M)
      read -p "  Additional instructions: " EXTRA
      PROMPT="$PROMPT\n\nADDITIONAL: $EXTRA"
      ;;
    *) ;; # Continue
  esac
done
```

### 6.3 Cuándo usar cada modo

Tipo de tarea Modo Por qué Migración mecánica (Jest→Vitest)

**AFK**

Reglas claras, bajo riesgo de decisiones malas Porting código (Python→TypeScript)

**AFK**

Sintaxis mecánica, tests validan Fix de bugs en batch (20 issues)

**AFK**

Tests verifican cada fix Refactor arquitectónico

**HITL**

Decisiones de diseño requieren humano Feature nueva compleja

**HITL**

Approach necesita validación Cambio de paradigma (OOP→FP)

**HITL**

Conceptual, cada paso importa Tarea de 1-2h que no necesita persistencia

**Auto mode**

No necesitas Ralph, sesión normal

## 7. Ejercicio práctico 2: Migración Jest → Vitest con Ralph

### Objetivo

Aplicar Ralph a una migración real de framework de testing.

### Setup

```
mkdir jest-to-vitest &amp;&amp; cd jest-to-vitest
npm init -y
npm install --save-dev jest
# Crear 20 archivos de test con sintaxis Jest
for i in $(seq 1 20); do
cat &gt; "module${i}.test.js" &lt;&lt;EOF
describe('Module ${i}', () =&gt; {
  it('should work', () =&gt; {
    expect(1 + 1).toBe(2);
  });
  it('should handle async', async () =&gt; {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
  it('should mock functions', () =&gt; {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
EOF
done
git init &amp;&amp; git add . &amp;&amp; git commit -m "initial: 20 Jest test files"
```

### PRD y PROGRESS

Crea PRD.md con completion promise verificable (20 archivos migrados, 0 referencias a jest, tests pasando).
Crea PROGRESS.md con checklist de 20 archivos.
Configura Stop hook en .claude/settings.json.

### Ralph script para migración

```
#!/bin/bash
# ralph-migrate.sh
MAX_ITERATIONS=30
ITERATION=0
echo "I Ralph: Jest → Vitest Migration"
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  MIGRATED=$(grep -rl 'vi\.fn' *.test.js 2&gt;/dev/null | wc -l | tr -d ' ')
  REMAINING=$(grep -rl 'jest\.fn' *.test.js 2&gt;/dev/null | wc -l | tr -d ' ')
  echo "III I Iteration $ITERATION (migrated: $MIGRATED/20, remaining: $REMAINING) III"
  PROMPT=$(cat &lt;&lt;EOF
Jest → Vitest Migration (iteration $ITERATION)
Progress:
$(cat PROGRESS.md)
Task:
$(cat PRD.md)
Currently: $MIGRATED/20 files migrated, $REMAINING remaining.
INSTRUCTIONS:
1. Read PROGRESS.md — find next unchecked file
2. Migrate that ONE file:
   - jest.fn() → vi.fn()
   - jest.mock() → vi.mock()
   - jest.spyOn() → vi.spyOn()
   - jest.useFakeTimers() → vi.useFakeTimers()
   - Add import { vi } from 'vitest' at top
3. Mark [x] in PROGRESS.md
4. Update count
5. If 20/20: change Status to COMPLETE
Process ONE file only.
EOF
)
  echo "$PROMPT" | claude -p --max-turns 15
  # Completion check
  MIGRATED=$(grep -rl 'vi\.fn' *.test.js 2&gt;/dev/null | wc -l | tr -d ' ')
  JEST_REMAINING=$(grep -rl 'jest\.fn' *.test.js 2&gt;/dev/null | wc -l | tr -d ' ')
  STATUS=$(grep "^Status:" PROGRESS.md 2&gt;/dev/null | awk '{print $2}')
  if [ "$STATUS" = "COMPLETE" ] &amp;&amp; [ "$MIGRATED" -ge 20 ] &amp;&amp; [ "$JEST_REMAINING" -eq 0 ]; then
    echo "I MIGRATION COMPLETE! Iterations: $ITERATION"
    # Final verification
    echo "Running tests..."
    npm test &amp;&amp; echo "I All tests pass!" || echo "II Some tests failed"
    break
  fi
  sleep 2
done
```

### Ejecutar y medir

```
chmod +x ralph-migrate.sh
./ralph-migrate.sh
# Después de completar:
# Verificar manualmente
grep -r 'jest\.' *.test.js  # Debe retornar vacío
npm test                     # Debe pasar 60 tests
```

### Entregable

1. 20 archivos migrados Jest → Vitest
2. Ralph script funcional
3. PROGRESS.md con tracking de cada iteración
4. Tests pasando con Vitest
5. **Métricas:**
• Iteraciones totales
• Tiempo de ejecución
• Costo estimado (tokens × precio por modelo)
• Comparación: tiempo manual estimado vs Ralph

## 8. Agent SDK como alternativa a bash loops

### 8.1 Cuándo usar Agent SDK en lugar de bash

Escenario Bash (ralph.sh)
Agent SDK (Python)
Script simple, pocas condiciones Overkill I Integración con pipeline Python/TS Incómodo I Guardrails de costo ($max)
Manual Built-in Streaming de resultados Limitado I Lógica de decisión compleja Difícil en bash I Subagentes programáticos No disponible I

### 8.2 Ralph con Agent SDK (Python)

```
# ralph_sdk.py
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def ralph_loop():
    max_iterations = 30
    for iteration in range(1, max_iterations + 1):
        print(f"\nIII I Iteration {iteration} III")
        # Read current state
        with open("PRD.md") as f:
            prd = f.read()
        with open("PROGRESS.md") as f:
            progress = f.read()
        prompt = f"""
        Task: {prd}
        Current progress: {progress}
        Pick the next unchecked file and process it.
        Update PROGRESS.md when done.
        """
        # Invoke Claude with guardrails
        async for message in query(
            prompt=prompt,
            options=ClaudeAgentOptions(
                setting_sources=["project"],   # Load CLAUDE.md + .claude/
                permission_mode="bypassPermissions",
                max_turns=15,
                max_budget_usd=2.0,            # $2 max per iteration
                model="claude-sonnet-4-6",
            ),
        ):
            if hasattr(message, "result"):
                print(f"  Result: {message.result[:100]}")
        # Check completion
        with open("PROGRESS.md") as f:
            if "Status: COMPLETE" in f.read():
                print(f"\nI COMPLETE after {iteration} iterations!")
                return
    print(f"\nII Max iterations ({max_iterations}) reached")
asyncio.run(ralph_loop())
```

**Ventajas del SDK:**

• max_budget_usd=2.0 → guardrail de costo por iteración
• max_turns=15 → límite de turnos built-in
• setting_sources=["project"] → carga CLAUDE.md y .claude/ automáticamente
• Lógica de decisión en Python (más expresiva que bash)
• Streaming de mensajes para monitoreo en tiempo real

### 8.3 Instalación y setup del Agent SDK

El Agent SDK proporciona las mismas herramientas, loop de agente y gestión de contexto de Claude Code, pero programable en Python o TypeScript. Aquí lo instalamos para usarlo con Ralph — en **M9 profundizarás** en subagentes, permisos programáticos, hooks como callbacks Python, MCP custom y sesiones multi-turn.

**Prerequisitos:**

Requisito Python TypeScript Runtime Python 3.10+ Node.js 18+ Claude Code Instalado y autenticado (claude Igual doctor pasa)
API key Autenticación via Claude Code (se hereda)
Igual

**Instalación Python:**

```
# Crear entorno virtual (recomendado)
python -m venv .venv
source .venv/bin/activate    # macOS/Linux
# .venv\Scripts\activate     # Windows
# Instalar SDK
pip install claude-agent-sdk
# Verificar instalación
python -c "from claude_agent_sdk import query; print('SDK installed I')"
```

**Instalación TypeScript:**

```
# En proyecto Node.js existente
npm install @anthropic-ai/claude-agent-sdk
# Verificar
node -e "const sdk = require('@anthropic-ai/claude-agent-sdk'); console.log('SDK installed I')"
```

**Verificación completa — script de test:**

```
# test_sdk.py — Ejecutar para verificar que todo funciona
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def test():
    async for message in query(
        prompt="Respond with exactly: SDK_OK",
        options=ClaudeAgentOptions(
            max_turns=1,
            max_budget_usd=0.10,  # $0.10 max para test
        ),
    ):
        if hasattr(message, "result"):
            print(f"Response: {message.result}")
            if "SDK_OK" in message.result:
                print("I Agent SDK working correctly!")
asyncio.run(test())
python test_sdk.py
# Debería mostrar:
# Response: SDK_OK
# I Agent SDK working correctly!
```
**Nota:** El SDK hereda la autenticación de Claude Code. Si claude doctor pasa, el SDK funcionará sin configuración
adicional de API keys.
**Preview de M9:** En este módulo usamos el SDK solo como alternativa a bash para Ralph loops. En **Módulo 9:**
**Subagentes y Agent SDK** explorarás el SDK en profundidad: definir subagentes programáticos con roles y
permisos, hooks como funciones Python (no solo shell commands), servidores MCP in-process, structured outputs con JSON schema, sesiones multi-turn con ClaudeSDKClient, y orquestación de pipelines multi-agente.
Lo que aprendes aquí es la base — M9 construye encima.

## 9. Ejercicio práctico 3: Ralph avanzado con feature list

### Objetivo

Implementar sistema Ralph completo con feature_list.json, múltiples features, y tracking granular.

### feature_list.json

```
{
  "project": "User Management API",
  "features": [
    {
      "id": 1,
      "name": "User Registration",
      "status": "pending",
      "verification": "npm test -- --grep 'registration'",
      "tests": "tests/registration.test.js"
    },
    {
      "id": 2,
      "name": "User Authentication (JWT)",
      "status": "pending",
      "verification": "npm test -- --grep 'auth'",
      "tests": "tests/auth.test.js"
    },
    {
      "id": 3,
      "name": "Password Reset",
      "status": "pending",
      "verification": "npm test -- --grep 'reset'",
      "tests": "tests/reset.test.js"
    },
    {
      "id": 4,
      "name": "User Profile CRUD",
      "status": "pending",
      "verification": "npm test -- --grep 'profile'",
      "tests": "tests/profile.test.js"
    },
    {
      "id": 5,
      "name": "User Soft Delete",
      "status": "pending",
      "verification": "npm test -- --grep 'delete'",
      "tests": "tests/delete.test.js"
    }
  ]
}
```

### Ralph con feature tracking

El script lee feature_list.json, encuentra la siguiente feature pending, invoca Claude para implementarla con TDD, marca como completed si los tests pasan, y continúa con la siguiente.
```
crea ralph-features.sh que:
1. Lee feature_list.json para encontrar próxima feature pending
2. Invoca claude -p con prompt que incluye:
   - PRD.md (contexto general)
   - feature_list.json (feature específica)
   - PROGRESS.md (estado actual)
   - Git log reciente (contexto de qué se ha hecho)
3. Después de cada invocación:
   - Ejecuta el comando de verification de la feature
   - Si pasa: marca como completed en JSON
   - Si falla: deja como in_progress
4. Actualiza PROGRESS.md
5. Continúa hasta que todas las features estén completed
Incluye Stop hook que verifica que hay features pending.
```

### Ejecutar como AFK overnight

```
# Con worktree isolation
chmod +x ralph-features.sh
# Opción 1: nohup (local, en background)
nohup ./ralph-features.sh &gt; ralph.log 2&gt;&amp;1 &amp;
echo "Ralph running in PID $!"
tail -f ralph.log  # Monitorear
# Opción 2: tmux (local, reconectable)
tmux new-session -d -s ralph './ralph-features.sh | tee ralph.log'
tmux attach -t ralph  # Para ver progreso
# Opción 3: Agent SDK con teleport (monitoreo móvil)
python ralph_sdk.py  # Con --teleport si tu SDK lo soporta
```

### Entregable

1. ralph-features.sh funcional con feature tracking
2. feature_list.json con 5 features
3. Al menos 3/5 features completadas por Ralph
4. PROGRESS.md con tracking por feature
5. Stop hook configurado en settings.json
6. Métricas: iteraciones por feature, costo total, tiempo

## 10. Ejercicio integrador: Migración completa con Ralph + HITL

### Descripción

Migra un proyecto real de una configuración a otra usando Ralph con checkpoints humanos para decisiones de diseño.

### Opciones de migración (elige una)

**Opción A:** Express → Fastify (cambio de framework)
**Opción B:** JavaScript → TypeScript (cambio de lenguaje)
**Opción C:** REST → GraphQL (cambio de paradigma)

### Proceso

1. **Crear PRD.md** con completion promise específico para tu migración
2. **Crear feature_list.json** con cada componente como feature (modelos, rutas, middleware, tests)
3. **Configurar Stop hook** en settings.json
4. **Ejecutar ralph-hitl.sh** — revisando cada componente migrado
5. **Documentar decisiones** en PROGRESS.md (qué cambió y por qué)
6. **Comparar con Agent SDK** — reimplementar el loop en Python

### Entregable

1. **Proyecto migrado** funcional con tests pasando
2. **ralph-hitl.sh** y **ralph_sdk.py** (ambas versiones)
3. **PROGRESS.md** con decisiones documentadas
4. **RALPH_REPORT.md:**
• Iteraciones totales
• Intervenciones HITL (cuántas, por qué)
• Errores que Ralph corrigió solo
• Errores que requirieron intervención humana
• Costo total de API
• Tiempo total vs estimación manual
• ¿Usarías Ralph de nuevo para esta tarea?

## 11. Conceptos clave para memorizar

### Los 3 pilares de Ralph

```
1. COMPLETION PROMISE → Condición verificable automáticamente
2. PROGRESS TRACKING → PROGRESS.md como memoria entre iteraciones
3. STOP HOOK → Previene salida prematura (exit 2)
```

### Headless mode en Ralph

```
# Invocar: claude -p (headless, ejecuta y sale)
# Limitar: --max-turns N
# Continuar: -c (última sesión) o -r "id" (sesión específica)
# Aislar: -w (git worktree)
# Monitorear: --teleport (acceso desde web/móvil)
```

### Agent SDK vs Bash

```
Bash   → Scripts simples, pocas condiciones
SDK    → Guardrails de costo, integración con pipelines, streaming
```

### AFK vs HITL vs Auto mode

```
AFK   → Tareas mecánicas, completion promise claro, overnight
HITL  → Decisiones de diseño, validación humana en cada paso
Auto  → Tarea de 1-2h que no excede una sesión
```

## 12. Antipatrones a evitar

**Completion promise vago** → "Cuando todo esté listo" → Usar condiciones verificables con comandos
**Sin PROGRESS.md** → Claude repite trabajo ya hecho en cada iteración
**Stop hook como shell script suelto** → Va en settings.json, evento Stop, exit 2 para denegar
**AFK para refactors conceptuales** → HITL cuando hay decisiones de diseño
**MAX_ITERATIONS muy bajo** → 10 iteraciones para 100 archivos → dar margen: 150+
**Sin** --max-turns **en headless** → Una invocación puede consumir tokens indefinidamente
**Ralph para tareas de 1 hora** → Auto mode es suficiente, Ralph es overhead innecesario
**No leer git log en el prompt** → Claude pierde contexto de lo que ya se commiteó

## 13. Recursos complementarios

### Lecturas obligatorias

• AI Hero: Getting Started with Ralph
• AI Hero: Tips for AI Coding with Ralph Wiggum — 11 tips avanzados
• Anthropic: Effective Harnesses for Long-Running Agents — Sistema dual (preview M10)

### Repositorios

• snarktank/ralph — Implementación original
• DmitrySolana/ralph-claude-code (~1.200#) — Loop autónomo con detección de exit
• repomirrorhq/repomirror — Técnica Ralph para porting de repos
• anthropics/claude-agent-sdk-python (~5.745#) — Agent SDK

### Documentación oficial

• Run Claude Code programmatically — Headless mode
• CLI Reference — Flags -p, --max-turns, -w, -c, -r
• Agent SDK overview — SDK Python/TypeScript
• Manage costs — Optimización de costos

## 14. Checklist de finalización del módulo

Implementé Ralph básico con headless mode (claude -p)
Usé --max-turns para limitar cada invocación Creé PRD.md con completion promise verificable automáticamente PROGRESS.md se actualiza correctamente entre iteraciones Configuré Stop hook en settings.json (exit 2 para denegar)
Entiendo diferencia entre AFK-Ralph, HITL-Ralph y Auto mode Completé migración Jest→Vitest con Ralph Probé worktree isolation con -w Implementé Ralph con Agent SDK en Python Usé max_budget_usd como guardrail de costo Completé ejercicio integrador (migración con HITL)
Métricas documentadas (iteraciones, costo, tiempo, comparación)
Puedo decidir cuándo usar Ralph vs Auto mode vs Agent SDK

## Próximos pasos

En **Módulo 8: Multi-Claude workflows y Agent Teams** aprenderás:
• **Agent Teams** (Opus 4.6) — múltiples Claude coordinados nativamente
• **claude-squad** (~5.600#) — multi-agente con tmux
• Git worktrees para aislar trabajo de cada instancia
• Patrón write-review-edit con 3 agentes
• Claude Code en la web para tareas paralelas
• El costo de Agent Teams (~7x tokens vs sesión estándar)
**Conexión con M7:** Ralph es SECUENCIAL (una tarea, múltiples iteraciones). Multi-Claude es PARALELO (múltiples
tareas, simultáneamente). Los concepts de tracking (PROGRESS.md) y completion promises aplican a cada agente del equipo.
