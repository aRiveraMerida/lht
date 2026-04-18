---
title: "Quick reference"
date: "2026-04-18"
description: "Referencia rápida con los comandos, patrones y configuraciones más usados."
excerpt: "Imprime o ten abierto mientras trabajas. Los 20 comandos y conceptos que más usarás. Atajo Qué hace Módulo Shift+Tab Plan Mode (Claude planifica antes de ejecutar) M2 Shift+Tab ×2…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Quick Reference: Claude Code en 1 página

**Imprime o ten abierto mientras trabajas. Los 20 comandos y conceptos que más usarás.**

## Atajos de teclado

Atajo Qué hace Módulo

**Shift+Tab**

Plan Mode (Claude planifica antes de ejecutar)
M2

**Shift+Tab ×2**

Auto mode (ejecuta sin pedir confirmación)
M2

**Option+T**

Extended thinking (razonamiento profundo)
M2

**Ctrl+B**

Enviar tarea actual a background M2, M8

**Escape**

Interrumpir respuesta actual M2

**Escape ×2**

Cancelar completamente M2

## Slash commands esenciales

Comando Qué hace Módulo Generar CLAUDE.md automático
```
/init
```
para el proyecto M1 Máxima calidad (más tokens, más
```
/effort high
```
razonamiento)
M2 Grid visual de archivos en contexto M2
```
/context
```
Compactar contexto (liberar espacio)
M2
```
/compact
```
Ver qué recuerda Claude de la
```
/memory
```
sesión M1, M4 Revertir al checkpoint anterior M2, M10
```
/rewind
```
Ver tokens consumidos en la sesión M8
```
/cost
```
Cambiar modelo (sonnet-4-6,
```
/model
```
opus-4-6)
M1 Ejecutar en entorno aislado M3
```
/sandbox
```
Análisis de seguridad del código M3
```
/security-review
```

## CLI (headless mode)

```
# Ejecutar prompt sin sesión interactiva
claude -p "implementa feature X con TDD"
# Con límite de turnos
claude -p "..." --max-turns 20
# En worktree aislado (no afecta tu working directory)
claude -p "..." -w
# Monitorear desde móvil/web
claude -p "..." --teleport
# Continuar sesión anterior
claude -c
# Resumir sesión específica
claude -r SESSION_ID
```

## Estructura de proyecto profesional

```
mi-proyecto/
CLAUDE.md                    ← &lt;200 líneas, WHAT/WHY/HOW
.claude/
settings.json            ← Permisos, hooks, modelo
rules/                   ← Reglas condicionales (paths:)
III api-conventions.md
III testing.md
commands/                ← Slash commands custom
III deploy.md
skills/                  ← Workflows reutilizables
III tdd.md
agents/                  ← Subagentes especializados
reviewer.md
agent_docs/                  ← Docs extensas (specs, API refs)
src/
tests/
package.json
```

## Hooks (settings.json)

```
{
  "hooks": {
    "PreToolUse": [{
      "matcher": { "tool": "Write", "pattern": "\\.env" },
      "hooks": [{ "type": "command", "command": "exit 2" }]
    }],
    "PostToolUse": [{
      "matcher": { "tool": "Write", "pattern": "\\.js$" },
      "hooks": [{ "type": "command", "command": "npx prettier --write $FILE_PATH" }]
    }],
    "Stop": [{
      "hooks": [{ "type": "command", "command": "echo 'No pares, sigue con PROGRESS.md'" }]
    }]
  }
}
```
**Exit codes:** 0 = aprobado · 1 = error (no bloquea) · **2 = denegar (bloquea la acción)**

## RTK (ahorro de tokens)

```
brew install rtk          # Instalar
rtk init --global         # Activar para Claude Code
rtk gain                  # Ver ahorros
rtk gain --graph          # Gráfico últimos 30 días
rtk discover              # Oportunidades perdidas
```

## Ralph loop (ejecución autónoma)

```
#!/bin/bash
while true; do
  claude -p "
    Lee PROGRESS.md. Continúa la siguiente tarea pendiente.
    Usa TDD. Actualiza PROGRESS.md al terminar.
    Si todo está completado, incluye DONE en tu respuesta.
  " --max-turns 20 -w
  grep -q "DONE" PROGRESS.md &amp;&amp; break
  sleep 5
done
```

## Las 4 capas de configuración (precedencia)

```
1. Managed (Anthropic)     ← No editable
2. User (~/.claude/)       ← Tu configuración global
3. Project (.claude/)      ← Por proyecto (en el repo)
4. Local (.claude.local/)  ← Tu máquina, no commitear
```
**Cada capa sobrescribe la anterior.** Local > Project > User > Managed.

## Regla de oro del TDD con Claude Code

```
1. SPEC   → Escribe la especificación en lenguaje natural
2. RED    → Claude genera tests que FALLAN
3. GREEN  → Claude implementa código para PASAR los tests
4. VALIDATE → Claude ejecuta tests para confirmar
5. REFACTOR → Claude mejora sin romper tests
NUNCA permitas que Claude modifique tests para que pasen.
Los tests son la fuente de verdad.
```

## Multi-Claude: cuándo usar qué

Herramienta Cuándo

**Ctrl+B**

1 tarea lenta + seguir trabajando
**-w** (múltiples terminales)
Features independientes, control total

**claude-squad**

Multi-agente visual con tmux

**Agent Teams**

Tarea compleja descomponible (Opus líder, ~7x tokens)

**Subagentes (.claude/agents/)**

Roles fijos reutilizables (reviewer, tester)

## CI/CD con claude-code-action

```
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "Review this PR for security and quality"
    allowed_tools: "Read,Grep,Glob"
    model: "claude-sonnet-4-6"
    max_turns: 30
```

## Los 5 errores más comunes

Error Corrección CLAUDE.md de 500 líneas <200 líneas. Mover detalles a .claude/rules/ Hooks como shell scripts JSON en settings.json, exit 2 para denegar
--plan para Plan mode
**Shift+Tab** en el REPL
Sin tests (Claude no auto-verifica)
TDD siempre. Sin tests, no hay feedback loop Task tool Se llama **Agent tool**
