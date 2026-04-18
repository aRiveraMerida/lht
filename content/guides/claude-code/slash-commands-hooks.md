---
excerpt: "Slash commands y hooks como mecanismos de personalización avanzada del agente."
---

# Módulo 6: Slash commands y hooks

# personalizados

**Duración:** 5-6 horas
**Nivel:** Intermedio-Avanzado
**Dependencias:** Módulos 1-5 (CLAUDE.md + rules/ + skills + plugins dominados)
**Modalidad:** 100% práctica con creación de comandos y hooks funcionales
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Dominar los 30+ slash commands built-in** y los atajos de teclado esenciales
2. **Crear slash commands personalizados** en .claude/commands/ como archivos markdown
3. **Configurar hooks en settings.json** con los 20+ eventos disponibles (PreToolUse, PostToolUse, Stop,
SessionStart, SubagentStop...)
4. **Implementar hooks de tipo command** (shell) y **tipo http** (integración con servicios externos)
5. **Diseñar hooks con matchers** para filtrar por herramienta y patrón de archivo
6. **Diferenciar block-at-submit** (exit code 2 = denegar) **vs hint hooks** (exit 0 con output)
7. **Integrar commands + hooks + skills** en un sistema de automatización cohesivo

## 1. Fundamentos: Las dos caras de la extensibilidad

### 1.1 Slash commands vs Hooks — dos filosofías

En M5 aprendiste skills (workflows reutilizables) y plugins (paquetes compartibles). Este módulo cubre las otras dos piezas de extensibilidad:

**Slash Commands**

**Hooks**

**Quién dispara**

TÚ escribes /comando Se disparan AUTOMÁTICAMENTE por eventos

**Cuándo**

Cuando tú decides Antes/después de cada acción de Claude

**Propósito**

Automatizar secuencias que inicias tú Interceptar y validar acciones de Claude

**Formato**

Archivo markdown en Configuración JSON en
```
.claude/commands/
settings.json
```

**Ejemplo**

Formatear automáticamente después
```
/commit-push-pr
```
de cada Write

**La cita que lo resume:**

"Uso /commit-push-pr docenas de veces al día. Es el comando que más valor me da." — Boris Cherny, creador de Claude Code

### 1.2 Dónde viven

```
.claude/commands/              ← Slash commands del PROYECTO
commit-push-pr.md
fix-issue.md
create-endpoint.md
~/.claude/commands/            ← Slash commands del USUARIO (todos los proyectos)
my-workflow.md
analyze-deps.md
.claude/settings.json          ← Hooks del PROYECTO (sección "hooks")
~/.claude/settings.json        ← Hooks del USUARIO
```

## 2. Los 30+ slash commands built-in

Antes de crear commands personalizados, domina los que ya vienen con Claude Code. Estos son los que usarás diariamente:

### 2.1 Gestión de sesión

Comando Función Cuándo usar Borra historial completo Contexto >70%, cambio de tarea
```
/clear
```
Compacta conversación Contexto 50-70%
```
/compact
```
Compacta preservando temas Cuando necesitas mantener contexto
```
/compact focus on X,Y
```
selectivo Reanuda sesión anterior Retomar trabajo del día anterior
```
/resume
```
Revierte al checkpoint anterior Claude hizo algo mal
```
/rewind
```
Copia última respuesta Guardar output de Claude
```
/copy
```

### 2.2 Configuración

Comando Función Cuándo usar Ajustes generales (buscable)
Cambiar cualquier configuración
```
/config
```
Gestión de permisos Ajustar allowedTools/deny
```
/permissions
```
Cambiar modelo mid-session Escalar a Opus para tarea compleja
```
/model
```
Nivel de esfuerzo
```
/effort
```
(low/medium/high/auto)
Ajustar profundidad de razonamiento Estilos de salida Cambiar formato de respuestas
```
/output-style
```
Selector de tema visual Personalizar apariencia
```
/theme
```
Modo vim para edición Si eres usuario de vim
```
/vim
```

### 2.3 Herramientas y features

Comando Función Cuándo usar Gestión de servidores MCP Configurar conexiones externas
```
/mcp
```
Configuración de hooks Añadir/editar hooks interactivamente
```
/hooks
```
Gestión de subagentes Crear/editar agentes (M9)
```
/agents
```
Interfaz de plugins Instalar/gestionar plugins (M5)
```
/plugin
```
Lista skills disponibles Ver qué skills están activos
```
/skills
```
Lista TODOS los skills y commands Referencia rápida de todo lo
```
/commands
```
disponible Gestión de auto-memoria Ver/editar aprendizajes de Claude
```
/memory
```
Bash sandboxeado Testing aislado (M3)
```
/sandbox
```
Conectar a VS Code Integración con IDE
```
/ide
```
Modo entrada por voz Dictar en lugar de escribir
```
/voice
```
Sesión accesible desde web Monitorear desde claude.ai/code
```
/remote-control
```
Análisis de seguridad Después de implementar (M3)
```
/security-review
```
Auto-generar CLAUDE.md Nuevo proyecto (M1)
```
/init
```

### 2.4 Diagnóstico

Comando Función Cuándo usar Grid coloreado de uso de contexto Monitoreo visual rápido
```
/context
```
Estadísticas de tokens Análisis de gasto
```
/cost
```
Uso del plan de suscripción Tracking de límites
```
/usage
```
Reportar bug a Anthropic Cuando algo no funciona
```
/bug
```
Troubleshoot de problemas Diagnóstico de issues
```
/debug
```
Diagnósticos del entorno Verificar instalación
```
/doctor
```

### 2.5 Atajos de teclado (repaso de M2)

Atajo Función

**Shift+Tab**

Toggle Plan Mode

**Option+T / Alt+T**

Toggle extended thinking

**Ctrl+O**

Modo verbose (ver thinking)

**Ctrl+B**

Enviar a background
**Ctrl+F** (x2)
Terminar agentes background

**!**

Toggle modo shell

**@**

Referenciar archivo/dir

**Escape**

Pausar ejecución

**Escape x2**

Revertir al checkpoint

## 3. Crear slash commands personalizados

### 3.1 Anatomía de un slash command

Los slash commands son **archivos markdown** en .claude/commands/. El nombre del archivo se convierte en el nombre del comando:
```
.claude/commands/commit-push-pr.md  →  /commit-push-pr
.claude/commands/fix-issue.md       →  /fix-issue
.claude/commands/create-endpoint.md →  /create-endpoint
```
**Contenido del archivo:** Es un prompt en markdown que se envía a Claude cuando invocas el comando. Puede incluir
variables especiales:
Variable Valor Ejemplo Todo lo que escribes después del
```
$ARGUMENTS
```
comando
```
/fix-issue 123 → $ARGUMENTS = 123
Ejemplo: /commit-push-pr
&lt;!-- .claude/commands/commit-push-pr.md --&gt;
Analiza los cambios actuales en git y ejecuta este workflow:
1. Ejecuta `git diff --stat` para ver qué cambió
2. Propón una estrategia de commits atómicos siguiendo Conventional Commits
3. Muéstrame la estrategia y espera mi aprobación
4. Crea cada commit con `git add` selectivo + `git commit`
5. Ejecuta tests para verificar que todo pasa
6. Si tests pasan, haz `git push` a la rama actual
7. Crea PR con `gh pr create` incluyendo:
   - Título descriptivo derivado de los commits
   - Body con resumen de cambios
   - Link a issue si el nombre de la rama contiene un número
Si algo falla en cualquier paso, detente y muéstrame el error.
```

**Uso:**

```
/commit-push-pr
```
Claude lee el contenido del archivo y lo ejecuta como si se lo hubieras escrito tú.

### 3.2 Commands con argumentos ($ARGUMENTS)

```
&lt;!-- .claude/commands/fix-issue.md --&gt;
Workflow de bugfix para issue #$ARGUMENTS:
1. Lee el issue con `gh issue view $ARGUMENTS --json title,body,labels`
2. Crea branch: `git checkout -b fix/issue-$ARGUMENTS`
3. Analiza el issue y localiza el código relevante
4. Escribe un test que reproduce el bug (TDD — el test debe FALLAR)
5. Implementa el fix mínimo que hace pasar el test
6. Ejecuta toda la test suite para confirmar que no rompiste nada
7. Commit: `fix: &lt;descripción&gt; (#$ARGUMENTS)`
8. Push y crea PR con `Fixes #$ARGUMENTS` en el body
```

**Uso:**

```
/fix-issue 234
```
Claude reemplaza $ARGUMENTS por 234 y ejecuta todo el workflow.

### 3.3 Commands con bash inline

Los commands pueden incluir bloques de bash que se ejecutan ANTES de enviar el prompt a Claude. Esto pre-computa estado para que Claude no pierda tiempo:
```
&lt;!-- .claude/commands/analyze-deps.md --&gt;
```

## Este bloque se ejecuta ANTES de enviar a Claude

PKG_MANAGER="unknown"
if [ -f "package.json" ]; then PKG_MANAGER="npm"; fi if [ -f "requirements.txt" ]; then PKG_MANAGER="pip"; fi if [ -f "go.mod" ]; then PKG_MANAGER="go"; fi OUTDATED=""
if [ "$PKG_MANAGER" = "npm" ]; then OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")
fi
```
Análisis de dependencias para proyecto $PKG_MANAGER.
Dependencias desactualizadas:
$OUTDATED
Tareas:
1. Identifica dependencias con vulnerabilidades (CRITICAL)
2. Identifica updates mayores con breaking changes (WARNING)
3. Lista updates menores seguros (SAFE)
4. Para cada una, proporciona el comando exacto de actualización
```
**Ventaja del bash inline:** Claude recibe los datos pre-computados en lugar de tener que ejecutar npm outdated él
mismo. Esto ahorra tiempo y tokens.

### 3.4 Ejercicio: Crear 3 slash commands

```
mkdir -p .claude/commands
```
**Command 1:** /commit-push-pr **(el imprescindible)**
```
crea .claude/commands/commit-push-pr.md siguiendo el patrón
que te mostré. Incluye:
- Análisis de git diff
- Propuesta de commits atómicos (Conventional Commits)
- Esperar aprobación antes de ejecutar
- Tests antes de push
- Crear PR con gh CLI
```
**Command 2:** /create-endpoint **(productividad)**
```
crea .claude/commands/create-endpoint.md que reciba
$ARGUMENTS como especificación del endpoint.
Workflow:
1. Parse $ARGUMENTS para extraer método, path, descripción
2. Crear ruta siguiendo patrones de @src/routes/
3. Crear controller con validación Zod
4. Crear tests (unit + integration)
5. Ejecutar tests
6. Actualizar agent_docs/api-reference.md si existe
```
**Command 3:** /morning-standup **(contexto)**
```
crea .claude/commands/morning-standup.md con bash inline que:
Bash inline:
- git log --oneline --since="yesterday" (commits de ayer)
- git status (cambios pendientes)
- cat TODO.md si existe
Prompt a Claude:
- Resume lo que se hizo ayer basándose en commits
- Lista lo pendiente basándose en git status y TODO
- Sugiere prioridades para hoy
```

**Validación:**

```
# Probar los 3 commands
/commit-push-pr          # Debería analizar y proponer commits
/create-endpoint GET /api/v1/stats   # Debería crear endpoint completo
/morning-standup         # Debería dar resumen del día anterior
# Ver todos los commands disponibles
/commands
```

### Entregable

1. 3 archivos en .claude/commands/ funcionales
2. Log de uso de cada command con output de Claude
3. Comparación: tiempo con command vs escribir el prompt manualmente

### Criterios de evaluación

Commands se invocan correctamente con /nombre $ARGUMENTS se sustituye correctamente Bash inline pre-computa estado cuando aplica /commands los lista como disponibles Son genuinamente útiles (no toy examples)

## 4. El sistema de hooks: 20+ eventos y 2 tipos

### 4.1 Hooks = automatización basada en eventos

Los hooks ejecutan código **automáticamente** antes o después de acciones de Claude. Se configuran en settings.json (no como shell scripts sueltos):
```
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "python -m black \"$CLAUDE_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```
Este ejemplo formatea automáticamente con Black cada archivo Python que Claude escribe. No tienes que pedirlo — sucede cada vez.

### 4.2 Eventos disponibles (20+)

Evento Cuándo se dispara Uso típico

**PreToolUse**

ANTES de que Claude use una herramienta Bloquear acciones peligrosas, validar

**PostToolUse**

DESPUÉS de que Claude use una herramienta Formatear código, reportar coverage

**PostToolUseFailure**

Después de que una herramienta FALLA Logging, notificación

**UserPromptSubmit**

Antes de procesar input del usuario Validar input, pre-procesar

**SessionStart**

Al iniciar sesión Setup del entorno, logging

**SessionEnd**

Al terminar sesión Cleanup, guardar estado

**Stop**

Cuando el agente principal TERMINA Verificar completitud, notificar

**SubagentStart**

Al crear un subagente Logging, configurar subagente

**SubagentStop**

Cuando un subagente termina Recoger resultados

**PreCompact**

Antes de compactación de contexto Guardar snapshot de contexto

**Notification**

Cuando Claude envía notificación Redirigir a Slack/email

**WorktreeCreate**

Al crear git worktree Setup de worktree

**WorktreeRemove**

Al eliminar worktree Cleanup

**CwdChanged**

Al cambiar directorio de trabajo Recargar configuración

**FileChanged**

Cuando un archivo cambia Lint incremental

**TaskCompleted**

Cuando se completa una tarea Logging, métricas

**ConfigChange**

Al cambiar configuración Recargar hooks

### 4.3 Dos tipos de hook: command y http

**Tipo command (shell):**

Ejecuta un comando en tu terminal:
```
{
  "type": "command",
  "command": "python -m black \"$CLAUDE_FILE_PATH\"",
  "timeout": 30
}
```

**Tipo http (integración externa):**

Hace un POST HTTP a un servicio externo:
```
{
  "type": "http",
  "url": "https://hooks.slack.com/services/T.../B.../xxx",
  "method": "POST",
  "headers": { "Content-Type": "application/json" },
  "body": "{\"text\": \"Claude Code: tarea completada\"}"
}
```

### 4.4 Matchers: filtrar cuándo se activa el hook

Los matchers determinan CUÁNDO se ejecuta el hook. Solo aplican a eventos que involucran herramientas (PreToolUse, PostToolUse):
```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [{ "type": "command", "command": "black $CLAUDE_FILE_PATH" }]
      },
      {
        "matcher": "Write(*.ts)",
        "hooks": [{ "type": "command", "command": "prettier --write $CLAUDE_FILE_PATH" }]
      },
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "echo 'Bash executed: $CLAUDE_TOOL_INPUT'" }]
      }
    ]
  }
}
```

**Patrones de matcher:**

• Write(*.py) → Cualquier archivo Python escrito
• Write(src/**) → Cualquier archivo en src/ escrito
• Bash → Cualquier comando bash ejecutado
• Read(.env) → Lectura de .env (en PreToolUse, para bloquear)

### 4.5 Exit codes: block vs allow vs ask

En hooks de tipo command, el exit code determina qué pasa:
Exit code Efecto Nombre Cuándo usar

**0**

Permitir (+ output como feedback)
Allow/Hint Feedback informativo

**1**

Error del hook (se ignora, acción continúa)
Error Bug en el hook

**2**

**DENEGAR la acción**

Deny/Block Bloquear acción peligrosa
```
// Hook que BLOQUEA rm -rf
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'rm -rf'; then echo 'BLOCKED: rm -rf not allowed' &amp;&a
        }]
      }
    ]
  }
}
```

**La diferencia crítica:**

```
Exit 0 → "He procesado esto, aquí tienes feedback" (Claude ve el output)
Exit 1 → "Mi hook falló" (Claude ignora y continúa)
Exit 2 → "DENEGADO" (Claude NO puede ejecutar la acción)
```

### 4.6 Variables de entorno disponibles en hooks

Variable Contenido Disponible en Nombre de la herramienta (Write,
```
$CLAUDE_TOOL_NAME
```
Bash, etc.)
PreToolUse, PostToolUse Input completo de la herramienta PreToolUse, PostToolUse
```
$CLAUDE_TOOL_INPUT
```
Path del archivo afectado Write, Edit, Read
```
$CLAUDE_FILE_PATH
```
ID de la sesión actual Todos
```
$CLAUDE_SESSION_ID
```
Mensaje de notificación Notification
```
$MESSAGE
```

### 4.7 Propiedades de los hooks

• **Timeout:** 60 segundos por defecto, configurable con "timeout": N
• **Paralelismo:** Cuando múltiples hooks coinciden con un evento, se ejecutan en paralelo
• **Seguridad:** Las ediciones directas a hooks en settings.json no surten efecto hasta la **siguiente sesión**
(previene modificación maliciosa por Claude)
• **Herencia:** Los subagentes heredan los hooks del agente principal

## 5. Ejercicio práctico 1: Hooks de formateo automático (PostToolUse)

### Objetivo

Configurar hooks que formatean código automáticamente cada vez que Claude escribe un archivo.

### Paso 1: Configurar hooks en settings.json

```
edita @.claude/settings.json y agrega hooks de formateo:
Para cada tipo de archivo:
- *.py → ejecutar black
- *.js, *.ts → ejecutar prettier
- *.md → sin formateo (dejar como está)
Usar evento PostToolUse con matchers para Write.
Timeout de 10 segundos para cada hook.
```

**Resultado esperado en settings.json:**

```
{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allowedTools": ["Read", "Write(src/**)", "Edit(src/**)", "Bash(npm *)"],
    "deny": ["Bash(rm -rf *)"]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [{
          "type": "command",
          "command": "python -m black \"$CLAUDE_FILE_PATH\" --quiet",
          "timeout": 10
        }]
      },
      {
        "matcher": "Write(*.js)",
        "hooks": [{
          "type": "command",
          "command": "npx prettier --write \"$CLAUDE_FILE_PATH\"",
          "timeout": 10
        }]
      },
      {
        "matcher": "Write(*.ts)",
        "hooks": [{
          "type": "command",
          "command": "npx prettier --write \"$CLAUDE_FILE_PATH\"",
          "timeout": 10
        }]
      }
    ]
  }
}
```

### Paso 2: Probar el hook

```
# Inicia NUEVA sesión (hooks se cargan al inicio de sesión)
# Sal y vuelve a entrar a Claude Code
crea un archivo @src/utils.py con una función que calcule
el factorial de un número. No te preocupes por el formateo.
```
**Observa:** Claude escribe el archivo → el hook PostToolUse ejecuta Black automáticamente → el archivo queda
formateado sin que nadie lo pida.
```
# Verifica que Black se ejecutó
muéstrame el contenido de @src/utils.py
# El código debería estar formateado por Black
# (indentación consistente, line length, etc.)
```

### Paso 3: Verificar que el matcher filtra correctamente

```
# Crear archivo .md (NO debería triggear formateo)
crea un archivo README.md con una descripción del proyecto
# No debería haber output de prettier/black
# porque no hay matcher para *.md
```

### Entregable

1. Settings.json con hooks de formateo configurados
2. Log mostrando que el hook se ejecuta automáticamente
3. Evidencia de que el matcher filtra correctamente (Python formatea, MD no)

## 6. Ejercicio práctico 2: Hook de seguridad (PreToolUse con exit 2)

### Objetivo

Crear un hook que BLOQUEA acciones peligrosas antes de que Claude las ejecute.

### Hook: Bloquear comandos destructivos y lectura de secrets

```
edita @.claude/settings.json y agrega hooks PreToolUse:
1. Bloquear cualquier bash que contenga "rm -rf"
2. Bloquear lectura de archivos .env, .env.* y cualquier archivo
   con "secret" o "credential" en el nombre
3. Para cada bloqueo, mostrar un mensaje explicativo
Usa exit code 2 para denegar.
```

**Resultado esperado:**

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm -rf|DROP TABLE|DROP DATABASE'; then echo 'I BLOCKED:
        }]
      },
      {
        "matcher": "Read(.env*)",
        "hooks": [{
          "type": "command",
          "command": "echo 'I BLOCKED: Cannot read secrets file' &amp;&amp; exit 2"
        }]
      },
      {
        "matcher": "Read(*secret*)",
        "hooks": [{
          "type": "command",
          "command": "echo 'I BLOCKED: Cannot read secrets file' &amp;&amp; exit 2"
        }]
      }
    ]
  }
}
```

### Probar el hook

```
# NUEVA sesión para cargar hooks
# Test 1: Intentar rm -rf
ejecuta rm -rf /tmp/test
# Debería mostrar: I BLOCKED: Destructive command detected
# Claude NO ejecuta el comando
# Test 2: Intentar leer .env
lee el archivo .env
# Debería mostrar: I BLOCKED: Cannot read secrets file
# Claude NO lee el archivo
# Test 3: Comando normal (debería pasar)
ejecuta ls -la src/
# Debería ejecutarse normalmente (no matchea con rm -rf)
```

### Entregable

1. PreToolUse hooks configurados en settings.json
2. Log de 3 tests: 2 bloqueados + 1 permitido
3. Explicación: por qué exit 2 (no exit 1) es necesario para bloquear

## 7. Ejercicio práctico 3: Hook HTTP para notificar a Slack (Stop event)

### Objetivo

Configurar un hook que notifica a un canal de Slack cuando Claude termina una tarea.

### Configuración

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [{
          "type": "http",
          "url": "https://hooks.slack.com/services/T.../B.../xxx",
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "body": "{\"text\": \"I Claude Code terminó una tarea en el proyecto\"}"
        }]
      }
    ]
  }
}
```

### Alternativa sin Slack: webhook.site para testing

Si no tienes Slack configurado, usa webhook.site para ver los POST:
```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [{
          "type": "http",
          "url": "https://webhook.site/tu-uuid-unico",
          "method": "POST",
          "headers": { "Content-Type": "application/json" },
          "body": "{\"event\": \"task_completed\", \"project\": \"library-api\"}"
        }]
      }
    ]
  }
}
```

### Probar

```
# NUEVA sesión
# Pide algo simple
crea una función hello() en @src/hello.js que retorne "Hello World"
# Cuando Claude termina → el hook Stop se dispara
# → POST a webhook.site (o Slack)
# → Verificar en webhook.site que recibiste el POST
```

### Entregable

1. Hook HTTP configurado (Slack o webhook.site)
2. Screenshot de webhook.site mostrando el POST recibido
3. Si usas Slack: screenshot del mensaje en el canal

## 8. Ejercicio práctico 4: Sistema combinado de hooks

### Objetivo

Combinar múltiples hooks en un sistema coherente de calidad y automatización.

### El sistema completo

```
edita @.claude/settings.json con este sistema de hooks:
PreToolUse:
1. Bloquear rm -rf y DROP TABLE (seguridad)
2. Bloquear lectura de .env* (secrets)
PostToolUse:
3. Formatear Python con black después de Write(*.py)
4. Formatear JS/TS con prettier después de Write(*.js/*.ts)
5. Ejecutar lint después de Write en src/ (feedback, no bloqueo)
Stop:
6. Notificar a webhook.site cuando la tarea termina
SessionStart:
7. Log de inicio de sesión con timestamp
```

**Resultado esperado (settings.json consolidado):**

```
{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allowedTools": ["Read", "Write(src/**)", "Write(tests/**)", "Edit(src/**)", "Bash(npm *)", "Bash(git *)"],
    "deny": ["Read(.env)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm -rf|DROP TABLE'; then echo 'I BLOCKED' &amp;&amp; ex
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [{
          "type": "command",
          "command": "python -m black \"$CLAUDE_FILE_PATH\" --quiet",
          "timeout": 10
        }]
      },
      {
        "matcher": "Write(*.js)",
        "hooks": [{
          "type": "command",
          "command": "npx prettier --write \"$CLAUDE_FILE_PATH\"",
          "timeout": 10
        }]
      },
      {
        "matcher": "Write(src/**)",
        "hooks": [{
          "type": "command",
          "command": "npx eslint \"$CLAUDE_FILE_PATH\" --quiet 2&gt;&amp;1 || true"
        }]
      }
    ],
    "Stop": [
      {
        "hooks": [{
          "type": "http",
          "url": "https://webhook.site/tu-uuid",
          "method": "POST",
          "headers": { "Content-Type": "application/json" },
          "body": "{\"event\": \"stop\", \"project\": \"library-api\"}"
        }]
      }
    ],
    "SessionStart": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo \"$(date): Session started in $(pwd)\" &gt;&gt; ~/.claude/session.log"
        }]
      }
    ]
  }
}
```

### Validación del sistema

```
# NUEVA sesión
# Test 1: SessionStart debería haber loggeado
cat ~/.claude/session.log
# Debería mostrar timestamp de inicio
# Test 2: Crear archivo Python (PostToolUse formatea)
crea @src/calculator.py con funciones add, subtract, multiply, divide
# Verificar que Black formateó automáticamente
# Test 3: Intentar rm -rf (PreToolUse bloquea)
ejecuta rm -rf /tmp/test
# Debería bloquearse
# Test 4: Terminar tarea (Stop notifica)
ya terminé, gracias
# Verificar en webhook.site que llegó el POST
```

### Entregable

1. Settings.json con 7 hooks configurados
2. Log de los 4 tests de validación
3. Screenshot de session.log con timestamps
4. Screenshot de webhook.site con POST recibido

## 9. Ejercicio integrador: Commands + Hooks + Skills en sistema cohesivo

### Objetivo

Integrar todo lo del módulo (+ M5 skills) en un sistema de automatización completo para un proyecto real.

### Componentes a implementar

**3 Slash Commands:**

1. /commit-push-pr → Git workflow completo
2. /fix-issue <N> → Bugfix con TDD ($ARGUMENTS)
3. /morning-standup → Resumen con bash inline

**4+ Hooks:**

1. PreToolUse: Bloqueo de seguridad
2. PostToolUse: Formateo automático
3. PostToolUse: Lint feedback (hint, no bloqueo)
4. Stop: Notificación HTTP

**Referencia a skills de M5:**

En CLAUDE.md, documentar qué commands, hooks y skills están disponibles:
```
## Automation System
### Commands available
- `/commit-push-pr` → Atomic commits + push + PR creation
- `/fix-issue &lt;N&gt;` → TDD bugfix workflow for issue N
- `/morning-standup` → Yesterday summary + today priorities
### Hooks active
- PreToolUse: Security blocks (rm -rf, secrets)
- PostToolUse: Auto-format (Black/Prettier) + lint feedback
- Stop: Slack/webhook notification
### Skills
- test-driven-development: Auto-activated for new features
- code-review: Invoke with /code-review
- create-endpoint: Invoke with /create-endpoint
```

### Validación end-to-end

```
# Test 1: Feature completa
/create-endpoint POST /api/v1/notifications
# Hooks: auto-format + lint feedback ejecutándose
# Skill create-endpoint guiando el workflow
# Test 2: Bugfix
/fix-issue 42
# Hooks: security blocks activos
# TDD skill: tests primero
# Test 3: Commit workflow
/commit-push-pr
# Hooks: tests antes de push
# Stop hook: notifica al terminar
# Test 4: Morning standup
/morning-standup
# Bash inline: pre-computa commits de ayer
```

### Entregable

1. **3 slash commands** en .claude/commands/ funcionales
2. **Settings.json** con 4+ hooks configurados
3. **CLAUDE.md** actualizado con sección Automation System
4. **Log de 4 tests** end-to-end con output
5. **AUTOMATION_LOG.md** documentando:
• Qué automatizaste y por qué
• Tiempo estimado antes vs después
• Hooks que más valor aportan
• Commands que más usas

### Criterios de evaluación

3 commands se invocan sin errores Hooks se ejecutan automáticamente en los eventos correctos PreToolUse bloquea (exit 2) cuando debe PostToolUse formatea sin bloquear HTTP hook envía notificación CLAUDE.md documenta el sistema completo Sistema ahorra tiempo medible vs workflow manual

## 10. Conceptos clave para memorizar

### Commands vs Hooks vs Skills

```
Commands    → TÚ disparas, Claude ejecuta (acciones single-shot)
Hooks       → EVENTOS disparan, código ejecuta (automatización)
Skills      → RELEVANCIA dispara, Claude sigue workflow (metodología)
```

### Exit codes de hooks

```
Exit 0 → Allow + feedback (hint)
Exit 1 → Error del hook (se ignora)
Exit 2 → DENY (bloquea la acción)
```

### Dos tipos de hook

```
command → Ejecuta shell script local
http    → POST a servicio externo (Slack, Discord, webhook)
```

### Matchers

```
Write(*.py)    → Archivos Python escritos
Write(src/**)  → Cualquier archivo en src/ escrito
Bash           → Cualquier comando bash
Read(.env*)    → Lectura de archivos .env
```

### Cuándo usar hooks: los 3 patrones principales

**Seguridad (PreToolUse + exit 2):** Bloquear acciones peligrosas
**Calidad (PostToolUse + exit 0):** Formateo, lint, feedback
**Notificación (Stop/Notification + http):** Avisar a equipo/servicios

## 11. Antipatrones a evitar

**Hooks como shell scripts sueltos** → Van en settings.json, sección "hooks"
**Exit 1 para bloquear** → Exit 1 = error del hook (se ignora). Usa **exit 2** para denegar
**Hook que siempre bloquea** → PreToolUse que deniega todo = Claude inútil. Block solo lo crítico
**Hooks sin timeout** → Un hook que tarda 5 min bloquea todo. Configura timeout
**Olvidar reiniciar sesión** → Los hooks se cargan al inicio. Después de editar settings.json, **inicia nueva sesión**
**Commands como bash scripts** → Son archivos **markdown** en .claude/commands/, no .sh
**Command que hace 10 cosas** → Cada command debe hacer 1 cosa bien. Si necesitas 10, crea 10 commands
**Sin documentar en CLAUDE.md** → Si nadie sabe que existen, nadie los usa

## 12. Recursos complementarios

### Documentación oficial

• Hooks reference — Todos los eventos, matchers y configuración
• Extend Claude with skills — Slash commands y skills
• CLI reference — Todos los slash commands built-in

### Repositorios de referencia

• disler/claude-code-hooks-mastery — Guía completa para dominar hooks
• Piebald-AI/claude-code-system-prompts (~6.600#) — System prompts con hooks internos
• shinpr/claude-code-workflows — 17 comandos especializados

### Lecturas complementarias

• AI Hero: Creating the Perfect Status Line — HUD personalizado
• Anthropic: Claude Code Best Practices — Hooks en contexto del workflow

### Practitioners

• **Boris Cherny:** /commit-push-pr docenas de veces al día
• **Matt Pocock:** Commands para generación de TypeScript types
• Fuentes del curso: Boris Cherny thread, Matt Pocock thread

## 13. Checklist de finalización del módulo

Conozco los 30+ slash commands built-in (al menos los 15 más usados)
Creé 3 slash commands personalizados en .claude/commands/ Uso $ARGUMENTS para parametrizar commands Uso bash inline para pre-computar estado Configuré hooks PostToolUse para formateo automático Configuré hook PreToolUse que bloquea con exit 2 Configuré hook HTTP que notifica a servicio externo Entiendo los 20+ eventos de hooks disponibles Sé la diferencia entre exit 0 (hint), exit 1 (error), exit 2 (deny)
Uso matchers para filtrar por herramienta y patrón de archivo Sé que hooks se recargan al iniciar nueva sesión Completé ejercicio integrador (3 commands + 4 hooks + documentación)
CLAUDE.md documenta mi sistema de automatización Puedo explicar cuándo usar command vs hook vs skill

