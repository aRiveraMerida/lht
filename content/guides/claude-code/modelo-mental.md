---
excerpt: "El modelo mental correcto para entender Claude Code como agente, no como chatbot."
---

# Módulo 1: El modelo mental de Claude Code

**Duración:** 4-5 horas
**Nivel:** Principiante (0 conocimiento previo requerido)
**Modalidad:** 100% práctica con ejercicios ejecutables
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Explicar la arquitectura diferencial de Claude Code** frente a Copilot, Cursor, Cline y otros asistentes de IA
2. **Instalar, autenticar y diagnosticar** Claude Code en tu máquina usando los métodos actuales
3. **Comprender el sistema de configuración jerárquico** de 4 capas (managed → user → project → local)
4. **Crear y estructurar un CLAUDE.md efectivo** siguiendo el patrón WHAT/WHY/HOW
5. **Configurar settings.json** con permisos y modelo por defecto
6. **Navegar codebases existentes** usando @referencias y herramientas de exploración
7. **Comprender el concepto de "agent harness"** y su importancia para coding agents
8. **Entender la auto-memoria** y cómo complementa al CLAUDE.md

## 1. Fundamentos conceptuales

### 1.1 ¿Qué hace único a Claude Code?

Claude Code es un **agente de codificación autónomo** que vive en tu terminal. A diferencia de otros asistentes que sugieren código dentro de un IDE, Claude Code opera como un colaborador activo: comprende repositorios completos, planifica cambios multi-archivo y los ejecuta de forma autónoma, con puntos de control humano.
Es **deliberadamente unopinionated** — no impone workflows ni patrones predefinidos. Esta decisión de diseño lo diferencia radicalmente de otros asistentes:
Característica Claude Code Copilot Cursor Cline

**Filosofía**

Agent-first: describes tarea, IA conduce Autocomplete-first:
tab para aceptar IDE-first: tú conduces, IA asiste Approve-all: máximo control manual

**Contexto**

Hasta **1M tokens**
(Opus 4.6 / Sonnet
4.6)
32-128K tokens Variable (puede reducirse)
Variable según modelo

**Entorno**

Hereda tu bash completo (aliases, env vars)
Sandbox controlado VS Code nativo VS Code extension

**Arquitectura**

Servidor + Cliente MCP simultáneamente Cliente MCP Multi-modelo Model-agnostic (BYOK)

**SWE-bench**

**80.9%** (la puntuación
más alta publicada)
Inferior No publicado ~49.2%

**Extensibilidad**

CLAUDE.md, skills, hooks, plugins, SDK, subagentes Configuración limitada Rules, .cursorrules Prompts, BYOK

**Precio**

$20-200/mes (Pro/Max)
$10-19/mes $20/mes+ Gratuito (BYOK)

**GitHub**

~81.600 estrellas (open source)
Closed source Closed source ~58.000 estrellas

**Ejecución**

Terminal, VS Code,
JetBrains, web, móvil IDE integrado VS Code fork VS Code extension
**Analogía clave:** Claude Code es a los asistentes de IA lo que Neovim es a VSCode. Más curva de aprendizaje, pero
poder ilimitado cuando dominas los conceptos.

**Lo que esto significa en la práctica:**

Donde Copilot te sugiere la línea siguiente y Cursor te asiste mientras escribes, Claude Code toma una instrucción como "refactoriza el módulo de autenticación para soportar OAuth2 manteniendo backward compatibility con JWT" y ejecuta el trabajo completo: lee la base de código existente, planifica los cambios, edita los archivos necesarios, ejecuta tests, y crea el commit. Tú supervisas y apruebas.
"Cursor te hace más rápido en lo que ya sabes. Claude Code hace cosas por ti." — Comunidad de desarrolladores, 2026
**El setup más común en 2026** entre desarrolladores avanzados combina las tres capas: **Copilot** para completado
inline rápido + **Cursor** (o VS Code) como IDE con IA + **Claude Code** como agente terminal para tareas complejas. No compiten — se complementan.

### 1.2 Los modelos disponibles

Claude Code accede a los modelos de la familia Claude. Conocer los modelos te permite elegir el correcto para cada tarea:
Modelo Fortaleza Contexto Cuándo usar

**Claude Opus 4.6**

Máxima inteligencia, razonamiento profundo 1M tokens Arquitectura, debugging complejo, migraciones

**Claude Sonnet 4.6**

Inteligencia frontera a escala 1M tokens
**Default recomendado**:
features, refactoring, día a día

**Claude Haiku 4.5**

Máxima velocidad Menor Tareas mecánicas, formateo, queries rápidos Puedes cambiar de modelo en cualquier momento:
```
# Cambiar mid-session
/model                              # selector interactivo
/model claude-opus-4-6              # directo
# Configurar por defecto en settings.json
# O con variable de entorno
ANTHROPIC_MODEL=claude-sonnet-4-6 claude
```
**Regla práctica:** Sonnet 4.6 para el 80% de tu trabajo. Opus 4.6 cuando necesitas razonamiento profundo
(arquitectura, bugs difíciles, migraciones). Haiku para tareas mecánicas donde la velocidad importa más que la profundidad.
**Fast mode:** Opus 4.6 tiene un modo fast que procesa a 2.5x de velocidad sacrificando algo de profundidad — útil para
code review rápido.

### 1.3 El problema fundamental: LLMs son stateless

Los modelos de lenguaje **no tienen memoria entre conversaciones**. Cada vez que inicias una sesión de Claude Code:
```
Sesión 1: "Crea un API REST con Express"
[Claude crea el código]
Sesión 2: "Agrega autenticación JWT"
[Claude NO recuerda que usaste Express — necesita redescubrirlo]
```

**Consecuencias críticas:**

• No puedes asumir que Claude "sabe" decisiones de sesiones anteriores
• Necesitas mecanismos para **persistir contexto** entre sesiones
• Estos mecanismos son tres, y operan en capas:
```
1. CLAUDE.md → Instrucciones explícitas que
tú escribes y mantienes
2. Auto-memoria → Aprendizaje implícito que
Claude Code guarda automáticamente
3. Git history → Contexto técnico que Claude
lee al inicio de cada sesión
```
CLAUDE.md es lo que tú le dices a Claude. Auto-memoria es lo que Claude aprende solo. Git history es el registro de lo que se ha hecho. Los tres juntos dan a Claude suficiente contexto para ser productivo en sesiones nuevas.

### 1.4 ¿Qué es un "agent harness"?

Un **harness** es la infraestructura que transforma un LLM (que solo genera texto) en un agente autónomo (que actúa en el mundo):
```
AGENT HARNESS
Context      IIIIIIIIIII       LLM
CLAUDE.md      I         I  Opus / Sonnet
.claude/rules/ I         I  Haiku
```
I  Auto-memoria   I         IIIIIIIIIIIIIIIIIIII
```
settings.json  I
I   22 Tools
I   Read/Write/Edit
I   Bash/Glob/Grep
I   WebFetch/Search
I   Agent (subagen.)I
I   MCP servers
Control Flow   I    I  Feedback Loops
Hooks (20+)    I    I  Test results
Slash commands I    I  Build output
Skills/Plugins I    I  Screenshots
Permisos       I    I  Lint/type-check
```

**Componentes del harness:**

1. **Contexto persistente** → CLAUDE.md, .claude/rules/, auto-memoria, settings.json
2. **Tools** → 22 herramientas built-in + bash completo + MCP servers + plugins
3. **Feedback loops** → test results, build output, lint errors, screenshots
4. **Control flow** → hooks (20+ eventos), slash commands (30+), skills, subagentes

**La frase que resume todo:**

Sin harness, Claude es un chatbot. Con harness, Claude es un agente autónomo.
La calidad de tu harness determina la calidad del trabajo de Claude. Este curso entero es, en esencia, aprender a construir harnesses cada vez más sofisticados.

### 1.5 El sistema de configuración jerárquico (4 capas)

Este es el concepto arquitectónico más importante de Claude Code. Tu configuración opera en **4 capas con**
**prioridad descendente** — las capas superiores sobrescriben las inferiores:
```
CAPA 1: MANAGED (máxima prioridad)
← Definida por el admin de tu organización
← No puedes sobrescribirla
Archivo: managed-settings.json (servidor o local)
CAPA 2: USER (tu configuración global)
← Tus preferencias en todos los proyectos
Archivo: ~/.claude/settings.json
CAPA 3: PROJECT (configuración de equipo)
← Compartida por todo el equipo via git
Archivo: .claude/settings.json (committed)
CAPA 4: LOCAL (tu config personal del proyecto)
← Solo para ti, ignorada por git
Archivo: .claude/settings.local.json (gitignored)
```

**Ejemplo práctico de settings.json de proyecto (capa 3):**

```
{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allowedTools": [
      "Read",
      "Write(src/**)",
      "Edit(src/**)",
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(git *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  },
  "autoMemoryEnabled": true
}
```

**Implicación clave que debes entender ahora:**

Tipo de configuración Dónde va Por qué Instrucciones conversacionales ("usa named exports")
CLAUDE.md Claude lo lee como contexto de conversación Permisos ("puede escribir en src/ pero no en .env")
settings.json Determinista, no conversacional — se ejecuta, no se "interpreta"
Modelo por defecto settings.json Configuración técnica Convenciones por dominio (reglas de API vs frontend)
Carga condicional por paths (lo verás
```
.claude/rules/
```
en M4)
Stack, comandos de build/test, decisiones de arquitectura CLAUDE.md Siempre debe estar en contexto
**Error más común de principiantes:** Poner permisos en CLAUDE.md ("no ejecutes rm -rf"). Claude puede ignorar
instrucciones conversacionales. Los permisos van en settings.json donde son **ejecutados, no interpretados**.

### 1.6 La arquitectura de CLAUDE.md

El archivo CLAUDE.md en la raíz de tu proyecto es **inyectado en cada conversación**. Es el "system prompt personalizado" de tu proyecto. Sobrevive a la compactación de contexto — cuando Claude ejecuta /compact, relee CLAUDE.md desde disco.

**Estructura recomendada (WHAT/WHY/HOW):**

```
# Project: [Nombre del proyecto]
## WHAT
[2-3 frases: qué hace este proyecto, para quién, dominio del problema]
## WHY
[Decisiones arquitectónicas clave — lo que Claude necesita saber para
tomar buenas decisiones, no una documentación exhaustiva]
- **[Tecnología]**: [razón de la elección]
- **[Patrón]**: [por qué este enfoque]
- **[Trade-off]**: [qué se sacrificó y por qué]
## HOW
### Build
[Comandos exactos para levantar el proyecto]
### Test
[Comandos para verificar cambios — esto es CRÍTICO,
Claude necesita una forma de auto-verificar su trabajo]
### Conventions
[Patrones que Claude debe seguir — positivos, no negaciones]
- Usar named exports exclusivamente
- Type hints en todas las funciones públicas
- Tests con cobertura &gt;80%
- Commits siguiendo Conventional Commits (feat:, fix:, docs:)
```

**Límite de tamaño: máximo 200 líneas.**

La comunidad y Anthropic coinciden: cada instrucción de bajo valor degrada las de alto valor. Claude Code tiene un mecanismo interno que puede deprioritizar contexto que considera "no relevante" en CLAUDE.md largos. 200 líneas es el máximo práctico documentado. Para proyectos enterprise que necesitan más, la solución es .claude/rules/ con carga condicional por paths (lo verás en Módulo 4).

**Instrucciones positivas > negaciones:**

```
# I Correcto (instrucción positiva)
- Usar named exports exclusivamente
- Escribir tests con vitest, nunca jest
- Formatear con prettier antes de commit
# I Evitar (negación — los LLMs tienen dificultad con esto)
- NO usar default exports
- NO escribir tests con jest
- NO commitear sin formatear
```
**Tip de Boris Cherny (creador de Claude Code):** "Cada vez que Claude hace algo mal, añade una línea a
CLAUDE.md. Pero también revisa periódicamente y elimina las que ya no aplican."

### 1.7 Auto-memoria: lo que Claude aprende solo

Desde 2025, Claude Code **guarda automáticamente notas** que persisten entre sesiones:
• Comandos de build que funcionaron
• Insights de debugging descubiertos durante una sesión
• Preferencias de arquitectura observadas en tu código
• Patrones del proyecto que Claude identificó
Se gestiona con el comando /memory:
```
/memory          # Ver todas las notas guardadas
/memory clear    # Borrar notas específicas
```
Y se activa/desactiva en settings.json:
```
{
  "autoMemoryEnabled": true
}
```

**La auto-memoria NO reemplaza a CLAUDE.md:**

CLAUDE.md Auto-memoria Instrucciones explícitas que TÚ escribes Aprendizaje implícito que CLAUDE guarda Tú controlas exactamente qué dice Claude decide qué guardar Estructura definida (WHAT/WHY/HOW)
Notas informales Committed a git, compartido con equipo Solo para tu usuario Sobrevive a compactación (se relee de disco)
Persiste entre sesiones Piensa en CLAUDE.md como el manual del proyecto y la auto-memoria como las notas del compañero de equipo que ya trabajó ahí. Ambas son valiosas, pero el manual es lo que defines tú.

### 1.8 Las 22 herramientas built-in

Claude Code no es un chatbot que genera texto — es un agente con **22 herramientas** que puede usar autónomamente:
Herramienta Qué hace Ejemplo de uso

**Read**

Lee archivos Lee src/auth.ts para entender la autenticación

**Write**

Crea archivos nuevos completos Crea tests/auth.test.ts con test suite

**Edit**

Edita archivos existentes con precisión Cambia la línea 45 de config.ts

**Bash**

Ejecuta comandos shell
```
npm test, git status, ls -la
```

**Glob**

Encuentra archivos por patrón
*/.test.ts para encontrar todos los
tests

**Grep**

Busca contenido dentro de archivos Busca todos los usos de
```
authenticate()
```

**WebFetch**

Obtiene páginas web Lee documentación de una librería

**WebSearch**

Búsqueda web Investiga el error que encontró

**Agent**

Genera subagentes especializados Spawna un reviewer para code review

**TodoWrite**

Gestiona lista interna de tareas Trackea progreso de features

**NotebookEdit**

Edita notebooks Jupyter Modifica celdas de análisis Claude decide autónomamente qué herramientas usar para cada tarea. Cuando le pides "encuentra y corrige el bug de autenticación", Claude:
1. Usa **Grep** para buscar archivos relacionados con auth
2. Usa **Read** para leer los archivos relevantes
3. Usa **Bash** para ejecutar tests y ver cuál falla
4. Usa **Edit** para corregir el bug
5. Usa **Bash** de nuevo para verificar que los tests pasan
Tú no le dices qué herramientas usar — él decide. Tú controlas cuáles **puede** usar (via settings.json) y cuáles **no** (via deny rules).

## 2. Ejercicio práctico 1: Instalación y setup completo

### Objetivo

Tener Claude Code funcionando, autenticado y diagnosticado en tu máquina. Configurar settings.json básico.

### Pasos detallados

**2.1 Instalación de Claude Code CLI**

```
# MÉTODO RECOMENDADO (incluye auto-actualización)
claude install
# ALTERNATIVA: macOS con Homebrew
brew install claude-code
# ALTERNATIVA: Windows con WinGet
winget install claude-code
# ALTERNATIVA: npm (funcional pero deprecado — no se auto-actualiza)
npm install -g @anthropic-ai/claude-code
```

**Requisitos del sistema:**

• macOS 10.15+ / Ubuntu 20.04+ / Debian 10+ / Windows 10+ (WSL o Git for Windows)
• Node.js 18+ (solo si instalas via npm)

**Verificar instalación:**

```
claude --version
```

**2.2 Diagnóstico del entorno**

Antes de empezar a trabajar, verifica que todo esté correcto:
```
claude doctor
claude doctor verifica:
```
• Versión actualizada
• Autenticación funcional
• Acceso a herramientas (bash, filesystem)
• Conexión a API
• Configuración válida
Si algo falla, claude doctor te dice exactamente qué corregir. Ejecútalo siempre que algo no funcione como esperas.

**2.3 Autenticación — 3 vías disponibles**

Método Para quién Cómo

**Anthropic Console**

Desarrolladores con API key OAuth en console.anthropic.com, billing activo

**Claude App**

Usuarios Pro ($20/mes) o Max ($100-200/mes)
Login con cuenta claude.ai

**Enterprise**

Equipos con Bedrock/Vertex/Azure Variables de entorno del provider
```
# Método más común: Login con cuenta de Claude
claude login
# Se abrirá navegador para autorizar
# Verificar que la autenticación funciona
claude "hola, ¿puedes confirmar que estás conectado?"
```

**2.4 Primera interacción — verificar que todo funciona**

```
# Verificar acceso a tu bash
claude "ejecuta echo $SHELL y dime qué shell uso"
# Verificar acceso al filesystem
claude "lista los archivos del directorio actual"
# Verificar que puede ejecutar programas
claude "qué versión de git tengo instalada?"
# Verificar el modelo activo
claude "qué modelo de Claude estás usando ahora mismo?"
```

**2.5 Configurar settings.json básico**

Crea el directorio y archivo de configuración:
```
mkdir -p ~/.claude
```
Crea ~/.claude/settings.json con tu configuración global:
```
{
  "model": "claude-sonnet-4-6",
  "autoMemoryEnabled": true,
  "permissions": {
    "deny": [
      "Bash(rm -rf /)",
      "Bash(rm -rf ~)",
      "Read(.env)",
      "Read(.env.*)"
    ]
  }
}
```
Esto establece:
• Sonnet 4.6 como modelo por defecto (puedes cambiarlo cuando quieras con /model)
• Auto-memoria activada (Claude aprende de cada sesión)
• Deny rules básicas de seguridad (no borrar el sistema, no leer secrets)

### Entregable

1. Screenshot de claude --version mostrando versión instalada
2. Screenshot de claude doctor mostrando checks pasando
3. Captura de Claude respondiendo correctamente a "lista los archivos del directorio actual"
4. Archivo ~/.claude/settings.json creado con configuración básica

### Criterios de evaluación

Claude Code instalado via claude install (no via curl script)
claude doctor pasa todos los checks Claude autenticado y respondiendo Claude puede ejecutar comandos bash y acceder al filesystem settings.json global creado con modelo y deny rules

## 3. Ejercicio práctico 2: Tu primer CLAUDE.md + settings.json de proyecto

### Objetivo

Crear un CLAUDE.md funcional y un settings.json de proyecto, y observar cómo Claude los utiliza en conjunto.

### Contexto del ejercicio

Vas a crear un **contador de palabras en Python** — proyecto intencionalmente simple para enfocarse en la configuración, no en la complejidad del código.

### Pasos detallados

**3.1 Crear estructura del proyecto**

```
mkdir word-counter
cd word-counter
# Inicializar git (Claude lee git logs para entender contexto)
git init
# Crear estructura de Claude Code
mkdir -p .claude
```

**3.2 Crear CLAUDE.md siguiendo template WHAT/WHY/HOW**

Crea el archivo CLAUDE.md en la raíz del proyecto:
```
# Project: Word Counter CLI
## WHAT
Herramienta CLI en Python que cuenta palabras, líneas y caracteres
en archivos de texto. Similar a `wc` de Unix pero con output legible
y soporte para múltiples formatos (txt, md, csv).
## WHY
- **Python 3.11+**: Match statements y typing mejorado
- **Click**: Framework CLI con autocompletion y validación de args
- **pytest**: Testing framework estándar, fixtures potentes
- **Black + Ruff**: Formateo y linting automáticos sin configuración
## HOW
### Build
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
### Test
pytest tests/ -v --cov=word_counter --cov-report=term-missing
python -m black . --check
python -m ruff check .
### Conventions
- Docstrings en formato Google para todas las funciones públicas
- Type hints en todas las funciones y métodos
- Tests con cobertura mínima del 80%
- Commits siguiendo Conventional Commits (feat:, fix:, docs:)
- Un módulo por archivo, naming en snake_case
- Errores de usuario vía Click.echo + sys.exit(1), nunca excepciones raw
```
**Cuenta:** ~30 líneas. Espacio de sobra dentro del límite de 200.

**3.3 Crear settings.json del proyecto**

```
Crea .claude/settings.json:
{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allowedTools": [
      "Read",
      "Write(src/**)",
      "Write(tests/**)",
      "Write(requirements.txt)",
      "Edit(src/**)",
      "Edit(tests/**)",
      "Bash(pytest *)",
      "Bash(python *)",
      "Bash(pip *)",
      "Bash(black *)",
      "Bash(ruff *)",
      "Bash(git *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(.env)"
    ]
  }
}
```
Esto le dice a Claude:
• Puede leer cualquier archivo (Read sin restricción)
• Puede escribir SOLO en src/, tests/ y requirements.txt
• Puede ejecutar SOLO pytest, python, pip, black, ruff y git
• NO puede ejecutar rm -rf ni leer .env

**3.4 Hacer commit de la configuración**

```
git add CLAUDE.md .claude/settings.json
git commit -m "chore: add Claude Code configuration"
```
**¿Por qué commitear la configuración?** Porque .claude/settings.json es la capa 3 (PROJECT) — compartida con
todo el equipo. Si tu compañero clona el repo, hereda los mismos permisos y modelo. Las configuraciones personales van en .claude/settings.local.json (capa 4, gitignored).

**3.5 Interactuar con Claude usando CLAUDE.md + settings.json**

Ahora prueba estos comandos y **observa dos cosas**: que Claude sigue las convenciones DE CLAUDE.md, y que opera dentro de los permisos DE settings.json:
```
# Inicia el REPL interactivo de Claude Code
claude
# Comando 1: Inicializar proyecto
# Escribe en el REPL:
inicializa este proyecto creando requirements.txt, la estructura
de directorios y un archivo main básico
# OBSERVA: Claude crea requirements.txt con Click, pytest, black, ruff
# (porque los especificaste en WHY)
# OBSERVA: Claude crea archivos en src/ y tests/
# (porque solo tiene permiso de Write en esos dirs)
# Comando 2: Crear función principal
crea la función principal que cuente palabras, líneas y caracteres
en un archivo de texto dado como argumento CLI
# OBSERVA: Claude usa Click (CLAUDE.md → WHY)
# OBSERVA: Claude añade type hints y docstrings Google (CLAUDE.md → Conventions)
# OBSERVA: Claude escribe en src/ (settings.json → allowedTools)
# Comando 3: Crear tests
crea tests para la función que acabas de crear
# OBSERVA: Claude usa pytest (CLAUDE.md → WHY)
# OBSERVA: Claude incluye cobertura &gt;80% (CLAUDE.md → Conventions)
# Comando 4: Verificar (feedback loop)
ejecuta los tests y corrige cualquier error
# OBSERVA: Claude ejecuta pytest (settings.json → allowedTools permite "Bash(pytest *)")
# OBSERVA: Si algo falla, Claude lee el error y corrige
```

**3.6 Verificar la auto-memoria**

Después de la sesión anterior, Claude habrá guardado notas automáticamente:
```
# En una NUEVA sesión de Claude
claude
# Verifica qué aprendió
/memory
# Deberías ver notas como:
# - "Build: python -m venv venv &amp;&amp; pip install -r requirements.txt"
# - "Test: pytest tests/ -v"
# - "Project uses Click for CLI, Black for formatting"
```

### Entregable

1. Repositorio word-counter/ con:
• CLAUDE.md siguiendo template WHAT/WHY/HOW
• .claude/settings.json con permisos configurados
• requirements.txt generado por Claude
• src/word_counter/cli.py (o estructura equivalente) con función principal
• tests/test_cli.py con tests básicos
2. Screenshot de Claude siguiendo convenciones sin recordatorios explícitos
3. Screenshot de /memory mostrando notas auto-generadas

### Criterios de evaluación

CLAUDE.md sigue estructura WHAT/WHY/HOW, <200 líneas settings.json con allowedTools y deny rules coherentes Claude eligió tecnologías especificadas en WHY Código generado sigue Conventions (type hints, docstrings Google)
Tests tienen cobertura >80% Claude operó dentro de los permisos (solo escribió en src/ y tests/)
Auto-memoria capturó información relevante

## 4. Ejercicio práctico 3: Navegación de codebase existente con

## @referencias

### Objetivo

Usar Claude Code para entender y modificar un proyecto que NO creaste, usando @referencias para precisión.

### Setup del ejercicio

```
# Clonar un proyecto open-source real y mediano
git clone https://github.com/tiangolo/fastapi --depth 1
cd fastapi
```

### Concepto clave: @referencias

Claude Code permite referenciar recursos directamente en tus prompts con @:
```
# Referenciar un archivo específico
claude "revisa @docs_src/security/tutorial001.py y explícame qué hace"
# Referenciar un rango de líneas
claude "el patrón interesante está en @docs_src/security/tutorial001.py:15-30"
# Referenciar un directorio completo
claude "analiza toda la estructura de @docs_src/security/"
# Referenciar output de terminal (útil si hay un error)
claude "el error en @terminal:test-output, diagnostica qué lo causa"
```
Las @referencias son significativamente más precisas que describir archivos con texto natural. En lugar de "ese archivo de autenticación que vimos", dices @docs_src/security/tutorial001.py. Claude no tiene que adivinar a qué te refieres.

### Tareas de exploración

**4.1 Entender la estructura**

```
claude
# Pide análisis de un directorio concreto usando @referencia
analiza @docs_src/security/ y explícame los diferentes patrones
de autenticación implementados. Dame un resumen de 3-4 líneas
por cada archivo Python.
```

**Observa cómo Claude:**

• Lista archivos automáticamente (usa Glob para encontrarlos)
• Lee múltiples archivos (usa Read para cada uno)
• Sintetiza patrones comunes
• Identifica dependencias entre archivos

**4.2 Encontrar patrones específicos**

```
encuentra todos los archivos en @docs_src/ que usan
OAuth2PasswordBearer y muéstrame cómo se configura en cada caso
```

**Observa cómo Claude:**

• Usa Grep para búsqueda en todo el directorio
• Extrae snippets relevantes con contexto
• Compara implementaciones diferentes

**4.3 Modificación guiada**

```
toma @docs_src/security/tutorial001.py y agrégale rate limiting
usando slowapi. Mantén el mismo estilo de código que ya tiene el archivo.
```

**Observa cómo Claude:**

• Lee el estilo existente del archivo referenciado
• Busca documentación de slowapi (usa WebSearch si es necesario)
• Integra la modificación respetando convenciones
• Si tiene permiso (no hay settings.json restrictivo), escribe el archivo
**4.4 Usar** /init **para generar CLAUDE.md automático**
```
# Claude Code puede auto-generar un CLAUDE.md analizando el codebase
/init
```
/init analiza la estructura del proyecto, el stack tecnológico, los comandos de build/test, y genera un CLAUDE.md de base. Es un punto de partida — siempre deberías revisarlo y ajustarlo.

### Entregable

```
1. Documento analisis_fastapi.md con:
```
• Resumen de patrones de autenticación encontrados
• Lista de archivos usando OAuth2PasswordBearer
• Comparación entre diferentes enfoques
2. Versión modificada de tutorial001.py con rate limiting
3. CLAUDE.md auto-generado con /init y anotaciones de qué cambiarías

### Criterios de evaluación

Análisis correcto de los patrones existentes Uso efectivo de @referencias (archivos y directorios)
Búsqueda exhaustiva de OAuth2PasswordBearer Modificación respeta estilo original del archivo Rate limiting implementado correctamente /init ejecutado y output revisado críticamente

## 5. Ejercicio integrador: CLAUDE.md + settings.json para tu proyecto real

### Objetivo

Aplicar todo lo aprendido creando configuración completa de Claude Code para un proyecto personal o de trabajo.

### Instrucciones

**5.1 Selecciona un proyecto**

Criterios de selección:
• Proyecto activo (que estés desarrollando o vayas a desarrollar)
• Tamaño manejable (<10.000 líneas de código)
• Tecnología con la que estés familiarizado
**5.2 Usa** /init **como punto de partida**
```
cd tu-proyecto/
claude
/init
```
Revisa el CLAUDE.md generado. Ajusta:
• ¿El WHAT captura realmente lo que hace?
• ¿El WHY refleja tus decisiones arquitectónicas reales?
• ¿Los comandos de build/test son los correctos?
• ¿Las convenciones son las que realmente sigues?

**5.3 Diseña tu CLAUDE.md manual**

Si /init no captura bien tu proyecto, crea uno manual usando el template WHAT/WHY/HOW. Máximo 200 líneas.
Cada línea debe aportar valor.

**5.4 Crea settings.json del proyecto**

```
mkdir -p .claude
Define en .claude/settings.json:
```
• Modelo por defecto
• allowedTools: qué puede hacer Claude en TU proyecto
• deny: qué NUNCA debe hacer (secrets, borrados masivos, etc.)

**5.5 Valida con Claude**

```
claude
# Test 1: ¿Claude entiende el contexto?
lee CLAUDE.md y explícame en 3 frases qué hace este proyecto,
qué stack usa y qué convenciones debo seguir
# Test 2: ¿Claude sigue las convenciones?
crea un nuevo módulo/componente siguiendo las convenciones del proyecto
# Test 3: ¿Claude respeta los permisos?
intenta leer el archivo .env
# (debería ser bloqueado por deny rules)
# Test 4: ¿Claude usa los comandos correctos?
verifica que todo esté funcionando correctamente
# (debería usar los comandos de Test de tu CLAUDE.md)
```

**5.6 Documenta lo que falta**

Después de los 4 tests, habrás descubierto:
• Información que falta en CLAUDE.md (Claude tuvo que adivinar)
• Permisos que sobran o faltan en settings.json
• Convenciones que Claude no siguió (necesitan ser más explícitas)
Actualiza CLAUDE.md y settings.json con estos hallazgos. **Este ciclo de feedback es el patrón que usarás**

**siempre.**

### Entregable

1. CLAUDE.md de tu proyecto real (<200 líneas)
2. .claude/settings.json con permisos configurados
3. Transcript de las 4 interacciones de validación
4. Análisis reflexivo (200-300 palabras):
• ¿Qué funcionó bien?
• ¿Qué información faltaba en CLAUDE.md?
• ¿Los permisos de settings.json fueron apropiados?
• ¿Qué mejoraste después de los tests?

### Criterios de evaluación

CLAUDE.md sigue estructura WHAT/WHY/HOW, <200 líneas settings.json con allowedTools y deny rules coherentes Claude entiende correctamente el proyecto (Test 1)
Claude sigue convenciones sin recordatorios (Test 2)
Deny rules bloquean acceso a secrets (Test 3)
Claude ejecuta comandos apropiados (Test 4)
CLAUDE.md y settings.json actualizados post-validación Análisis reflexivo demuestra pensamiento crítico

## 6. Conceptos clave para memorizar

### El modelo mental correcto

1. **LLMs son stateless** → CLAUDE.md es tu memoria explícita, auto-memoria es memoria implícita, git history es
memoria técnica
2. **Claude Code es unopinionated** → Tú defines el workflow, no la herramienta
3. **El harness es crítico** → Context + Tools + Feedback Loops + Control Flow = Agente efectivo
4. **4 capas de configuración** → Managed > User > Project > Local — saber dónde poner cada cosa
5. **CLAUDE.md** ≠ **settings.json** → Instrucciones conversacionales vs permisos deterministas
6. **Progressive disclosure** → CLAUDE.md <200 líneas, documentación profunda en .claude/rules/ (Módulo 4)
7. **Feedback loops multiplican calidad** → Tests, builds, lint = Claude puede auto-verificar
8. **Instrucciones positivas > negaciones** → "Usar named exports" > "NO usar default exports"

### Antipatrones a evitar

**Instalar con curl script** → Usa claude install (auto-actualización incluida)
**CLAUDE.md de 500 líneas** → Partes críticas son deprioritizadas
**Permisos en CLAUDE.md** → Van en settings.json (determinista, no conversacional)
**Instrucciones no universales** → "Para este PR específico..." (no persiste entre sesiones)
**Comandos sin verificación** → Siempre da a Claude forma de auto-verificar su trabajo
**Contexto implícito** → "Ya sabes cómo funciona esto" (no, no sabe — es stateless)
**Múltiples convenciones** → Elige UNA forma de hacer cada cosa y documéntala
**No usar** /init → Genera un punto de partida automático, luego refinas
**Ignorar auto-memoria** → Verifica con /memory que lo que aprendió es correcto

### Las 22 herramientas en contexto

No necesitas memorizar las 22. Necesitas entender que Claude las elige autónomamente y que TÚ controlas cuáles puede usar (allowedTools) y cuáles no (deny). El sistema de permisos es tu red de seguridad.

### Preguntas de autoevaluación

1. ¿Cuáles son las 4 capas de configuración y en qué orden se aplican?
2. ¿Qué diferencia hay entre poner "no ejecutes rm -rf" en CLAUDE.md vs ponerlo en settings.json deny?
3. ¿Qué hace claude doctor y cuándo lo usarías?
4. ¿Cuándo usarías Opus 4.6 vs Sonnet 4.6 vs Haiku 4.5?
5. ¿Qué es la auto-memoria y en qué se diferencia de CLAUDE.md?
6. ¿Cuáles son los 4 componentes de un agent harness?
7. ¿Qué significa que Claude Code es "agent-first" vs que Cursor es "IDE-first"?
8. ¿Cómo referenciarías un archivo específico en un prompt de Claude Code?

## 7. Recursos complementarios

### Lecturas obligatorias

• Claude Code: Best Practices for Agentic Coding — El post de referencia de Boris Cherny (creador), sección
"Working with CLAUDE.md"
• Writing a Good CLAUDE.md — Guía completa con progressive disclosure y ejemplos reales

### Documentación oficial

• Claude Code Overview — Docs oficiales actualizados
• Setup Guide — Instalación y autenticación detallada
• CLI Reference — Todos los comandos y flags
• Settings — Sistema de configuración completo
• Memory — Auto-memoria y CLAUDE.md en profundidad
• Security — Modelo de permisos y seguridad
• Changelog — Cambios recientes

### Repositorios de referencia para este módulo

• anthropics/claude-code — Repositorio oficial (~81.600#)
• Cranot/claude-code-guide — Guía completa, auto-actualizada cada 2 días
• FlorianBruniaux/claude-code-ultimate-guide — De principiante a power user con quizzes
• Piebald-AI/claude-code-system-prompts — System prompts extraídos (~6.600#)
• jarrodwatts/claude-code-config — Ejemplo de configuración de referencia
• hesreallyhim/awesome-claude-code — Lista curada premier: skills, hooks, plugins

### Herramientas del ecosistema

• rtk-ai/rtk (~12.300#) — **Proxy CLI que reduce tokens 60-90%.** Intercepta comandos (git, cat, npm test) y
comprime su output antes de que llegue al contexto. Binario Rust, zero dependencias, <10ms overhead.
```
Instalación: brew install rtk && rtk init --global. Se profundiza en M12.
```
• smtg-ai/claude-squad (~5.600#) — Multi-agente con tmux (M8)
• anthropics/claude-code-action (~6.589#) — Claude Code en GitHub Actions (M12-M13)

### Comunidad

• **Threads de referencia de Boris Cherny** (creador de Claude Code): @boris_cherny — Tips directos del equipo
• **GitHub Discussions**: anthropics/claude-code — Q&A oficial
• **Reddit**: r/ClaudeAI — Casos de uso y troubleshooting
• **Twitter/X**: #ClaudeCode — Showcase de proyectos

## 8. Checklist de finalización del módulo

Antes de pasar al Módulo 2, asegúrate de que puedes marcar TODOS estos ítems:
Claude Code instalado via claude install y actualizado claude doctor pasa todos los checks Puedo ejecutar comandos bash a través de Claude Creé settings.json global con modelo y deny rules Creé CLAUDE.md funcional de <200 líneas con WHAT/WHY/HOW Creé settings.json de proyecto con allowedTools y deny rules Claude siguió mis convenciones sin recordatorios explícitos Claude respetó los permisos de settings.json (deny rules funcionan)
Navegué un codebase desconocido usando @referencias Usé /init para generar CLAUDE.md automático y lo revisé críticamente Verifiqué auto-memoria con /memory después de una sesión Puedo explicar las 4 capas de configuración con mis propias palabras Puedo explicar qué es un "agent harness" y sus 4 componentes Entiendo la diferencia entre CLAUDE.md y settings.json Completé el ejercicio integrador con mi proyecto real Puedo responder las 8 preguntas de autoevaluación correctamente

