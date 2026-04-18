---
excerpt: "Skills y plugins de Claude Code: cómo extender al agente con capacidades específicas."
---

# Módulo 5: Skills, plugins y el ecosistema

# extensible

**Duración:** 5-6 horas
**Nivel:** Intermedio-Avanzado
**Dependencias:** Módulos 1-4 (CLAUDE.md + .claude/rules/ + settings.json dominados)
**Modalidad:** 100% práctica con instalación, creación y composición
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Comprender skills como progressive disclosure de capacidades** — el mismo patrón de M4 aplicado a
workflows
2. **Crear skills con frontmatter YAML avanzado** (model, allowed-tools, disable-model-invocation, isolation)
3. **Diferenciar los dos tipos de invocación** — user-invoked vs model-invoked
4. **Instalar y gestionar plugins** — paquetes que agrupan commands + agents + hooks + MCP
```
5. Usar el ecosistema — anthropics/skills, anthropics/claude-plugins-official, ComposioHQ,
```
obra/superpowers
6. **Diferenciar skills vs plugins vs MCP vs hooks vs** .claude/rules/ — cuándo usar cada uno
7. **Gestionar el budget de skills** — 2% de contexto para descripciones, tool search automático

## 1. Fundamentos: ¿Qué son los skills?

### 1.1 Skills = Progressive disclosure para capacidades

En M4 aprendiste progressive disclosure para CONTEXTO: .claude/rules/ carga convenciones solo cuando son relevantes. Los skills aplican el **mismo principio a CAPACIDADES**: Claude escanea las descripciones de todos los skills (~100 tokens cada uno) y carga completamente solo los relevantes para la tarea actual (<5.000 tokens cuando se activan).
```
Sin skill:
"implementa feature usando TDD: primero escribe tests que fallen,
luego implementa código mínimo para pasarlos, ejecuta tests después
de cada cambio, refactoriza manteniendo tests verdes, asegura
coverage &gt;80%..."
→ ~50 tokens cada vez que pides TDD
Con skill:
"implementa feature usando TDD"
→ Claude detecta que el skill TDD aplica
→ Carga skill completo (~3.000 tokens, una vez)
→ Sigue workflow automáticamente
```
**Diferencia clave con** .claude/rules/**:**
```
.claude/rules/ (M4)
```
Skills (M5)
Carga basada en **archivos que editas** (paths)
Carga basada en **tarea que describes**
Define **convenciones** (cómo debe ser el código)
Define **workflows** (cómo hacer el trabajo)
Específico de un proyecto Reutilizable entre proyectos Ejemplo: "APIs usan kebab-case"
Ejemplo: "Workflow TDD en 5 pasos"

### 1.2 Dónde viven los skills

Los skills se almacenan en dos niveles:
```
~/.claude/skills/              ← Skills de USUARIO (todos los proyectos)
tdd/
SKILL.md
.claude/skills/                ← Skills de PROYECTO (solo este proyecto)
deploy/
SKILL.md
```

**Gestión con slash commands:**

```
/skills              # Lista todos los skills disponibles
/commands            # Lista todos los skills + custom commands
/skill-name          # Ejecuta un skill user-invoked directamente
```

### 1.3 Anatomía de un skill

Un skill es una carpeta con un archivo SKILL.md como mínimo:
```
skill-name/
SKILL.md              # Archivo principal (OBLIGATORIO)
examples/             # Ejemplos opcionales
example1.md
templates/            # Templates opcionales
template.js
```

**SKILL.md con frontmatter YAML completo:**

```
# .claude/skills/code-review/SKILL.md
---
name: code-review
description: Comprehensive code review with security, performance and maintainability analysis
disable-model-invocation: false    # Claude puede auto-invocarlo cuando detecta relevancia
allowed-tools: Read, Grep, Glob    # Tools restringidos (reviewer no necesita Write)
model: claude-sonnet-4-6           # Modelo específico para este skill
---
# Code Review Skill
## When to use
Use this when reviewing code changes before merge.
## Workflow
1. Read all modified files (git diff)
2. Check for security issues (SQL injection, XSS, auth bypass)
3. Evaluate performance (N+1 queries, unnecessary loops, memory leaks)
4. Assess maintainability (naming, complexity, duplication)
5. Verify test coverage for changed code
6. Generate structured report with severity levels
## Output format
For each finding:
- **Severity**: I Critical | I Warning | I Info
- **File**: path/to/file.js:line
- **Issue**: Description
- **Fix**: Suggested change
## Best practices
- Focus on logic errors, not style (formatters handle style)
- Flag security issues as Critical always
- Suggest, don't demand (except for Critical)
```

### 1.4 Los campos del frontmatter

Campo Valores Efecto String Identificador del skill
```
name
```
String Lo que Claude escanea (~100
```
description
```
tokens) para decidir si cargar
```
true / false
```
Si true: solo se activa con
```
disable-model-invocation
```
/skill-name (user-invoked). Si false: Claude decide cuándo usarlo (model-invoked)
Lista de herramientas Restringe qué tools puede usar
```
allowed-tools
```
durante el skill (ej: Read, Grep para reviewer)
Nombre de modelo Modelo específico para este skill (ej:
```
model
```
opus para tareas complejas)
worktree / ninguno Si worktree: ejecuta en git worktree
```
isolation
```
aislado

### 1.5 Dos tipos de invocación

```
User-invoked (disable-model-invocation: true):
```
• Se activa SOLO cuando tú escribes /skill-name
• Útil para workflows que quieres controlar manualmente
• Ejemplo: /deploy — no quieres que Claude deployee sin que lo pidas
```
Model-invoked (disable-model-invocation: false):
```
• Claude decide autónomamente cuándo usarlo basándose en la description
• Útil para capacidades que aplican en muchas situaciones
• Ejemplo: code-review — Claude lo usa cuando detecta que estás revisando código
```
# User-invoked: solo cuando TÚ lo pides
---
name: deploy
description: Production deployment workflow
disable-model-invocation: true
---
# Model-invoked: Claude decide
---
name: code-review
description: Comprehensive code review
disable-model-invocation: false
---
```

### 1.6 Budget de skills: el límite del 2%

Claude Code asigna el **2% de la ventana de contexto** (mínimo 16.000 caracteres) como presupuesto para descripciones de skills. Cada skill consume ~100 tokens en escaneo. Cuando tienes muchos skills, Claude prioriza los más relevantes.

**Implicación práctica:**

• Con contexto de 200K tokens: budget de ~4.000 tokens para descripciones ≈ 40 skills
• Con contexto de 1M tokens (Opus 4.6): budget mucho mayor
**Cuando las descripciones de herramientas (skills + MCP tools) exceden el 10% del contexto,** Claude activa **tool**
**search automático**: difiere definiciones y las carga bajo demanda. No necesitas hacer nada — es transparente.
**Regla práctica:** Si tienes <20 skills, no te preocupes por el budget. Si tienes 50+, escribe descripciones concisas (1-2
líneas) y usa disable-model-invocation: true para skills que no necesitan auto-activación.

### 1.7 Skills vs MCP vs Hooks vs Plugins vs Rules — la tabla definitiva

Extensión Propósito Scope Formato Cuándo usar Convenciones de
```
.claude/rules/
```
código Este proyecto Markdown + paths YAML "Las APIs usan kebab-case"

**Skills**

Workflows reutilizables Usuario o proyecto SKILL.md + frontmatter "Proceso de TDD en 5 pasos"

**Plugins**

Paquetes compartibles Instalable desde GitHub Bundle (commands + agents + hooks + MCP)
"Suite completa de code review"

**MCP Servers**

Herramientas externas Sistema-wide Servidor Python/TS "Conectar con Jira/GitHub/Slack"

**Hooks**

Interceptar acciones Proyecto JSON en settings "Formatear automáticamente al guardar"

**Slash commands**

Acciones single-shot Proyecto Markdown en .claude/commands/ "/commit-push-pr"

**Subagentes**

Especialización de rol Proyecto Markdown en .claude/agents/ "Reviewer read-only"

**Árbol de decisión:**

```
¿Es específico de TU proyecto?
SÍ → ¿Es una convención de código? → .claude/rules/
¿Es una acción rápida? → Slash command (.claude/commands/)
¿Es un rol especializado? → Subagente (.claude/agents/)
¿Intercepta una acción? → Hook (settings.json)
NO → ¿Es un workflow multi-paso reutilizable? → Skill
          ¿Es una herramienta externa (API/servicio)? → MCP Server
          ¿Es un paquete completo (commands + hooks + agents)? → Plugin
```

## 2. El sistema de plugins

### 2.1 ¿Qué son los plugins?

Los **plugins** son paquetes que agrupan múltiples extensiones en un bundle instalable y compartible:
```
mi-plugin/
plugin.json          # Metadata y configuración
commands/            # Slash commands incluidos
deploy.md
agents/              # Subagentes incluidos
reviewer.md
hooks/               # Hooks incluidos
format-on-save.json
mcp/                 # Servidores MCP bundled
config.json
```
Un plugin puede incluir cualquier combinación de estos componentes. La diferencia con un skill es que un skill es UN archivo de workflow; un plugin es un PAQUETE que puede incluir skills, commands, agents, hooks y MCP juntos.

### 2.2 Gestión de plugins

```
/plugin                           # Interfaz interactiva
/plugin install github-user/repo  # Instalar desde GitHub
/plugin list                      # Ver plugins instalados
/plugin remove nombre             # Desinstalar
2.3 Directorio oficial: anthropics/claude-plugins-official
```
Anthropic mantiene un directorio curado de plugins de alta calidad (~2.800#):
```
# Explorar plugins oficiales
# https://github.com/anthropics/claude-plugins-official
```

**Plugins destacados del directorio oficial:**

• **code-review**: Review multi-agente con security analysis
• **aws-serverless**: Deploy y gestión de Lambda + API Gateway
• **CodeRabbit integration**: Code review automatizado
• Múltiples plugins third-party curados

### 2.4 Cuándo crear un plugin vs un skill

Escenario Skill Plugin Workflow de TDD Overkill I Suite completa de deployment (command + hooks + agent)
Insuficiente I Checklist de code review Overkill I Integración con servicio externo (Jira + MCP + hooks)
Insuficiente I Compartir con la comunidad vía GitHub Posible Diseñado para esto
**Regla simple:** Si necesitas MÁS que un SKILL.md, necesitas un plugin.

## 3. Ejercicio práctico 1: Explorar el ecosistema

### Objetivo

Conocer los repositorios clave, instalar skills y plugins, y entender la oferta disponible.

### 3.1 Repositorios esenciales del ecosistema

Repositorio Qué ofrece
#
anthropics/skills ~102.854 Repositorio público oficial de Agent Skills anthropics/claude-plugins-official ~2.800 Directorio oficial de plugins curado ComposioHQ/awesome-claude-skills ~6.600 Catálogo comunitario categorizado VoltAgent/awesome-claude-skills N/A Skills + subagentes (100+)
obra/superpowers Popular 20+ skills battle-tested (TDD, debugging, collaboration)
shinpr/claude-code-workflows N/A 17 agentes especializados hesreallyhim/awesome-claude-code Premier Lista curada: skills, hooks, plugins

### 3.2 Explorar skills oficiales

```
# Ver skills disponibles
/skills
# Si no hay skills instalados, empezar por explorar el repo oficial
# https://github.com/anthropics/skills
# Listar comandos disponibles (skills + custom commands)
/commands
```

### 3.3 Instalar skills de comunidad

Los skills se instalan copiándolos al directorio apropiado:
```
# Skills de usuario (disponibles en todos los proyectos)
mkdir -p ~/.claude/skills
# Clonar repositorio de skills
git clone https://github.com/ComposioHQ/awesome-claude-skills.git /tmp/claude-skills
# Copiar skills que te interesan
cp -r /tmp/claude-skills/skills/test-driven-development ~/.claude/skills/
cp -r /tmp/claude-skills/skills/code-review ~/.claude/skills/
cp -r /tmp/claude-skills/skills/software-architecture ~/.claude/skills/
# Para skills de obra/superpowers (20+ skills battle-tested)
git clone https://github.com/obra/superpowers.git /tmp/superpowers
cp -r /tmp/superpowers/skills/* ~/.claude/skills/
# Verificar
/skills
```

**Skills de proyecto (solo este proyecto):**

```
# En la raíz de tu proyecto
mkdir -p .claude/skills
# Copiar skills específicos para este proyecto
cp -r /tmp/claude-skills/skills/api-design .claude/skills/
```

### 3.4 Instalar un plugin

```
# Desde la interfaz interactiva
/plugin
# O directamente desde GitHub
/plugin install anthropics/claude-plugins-official/code-review
```

### 3.5 Ejercicio de exploración

```
# Después de instalar 5+ skills:
# Test 1: ¿Claude detecta skills relevantes?
implementa una función de validación de ISBN con TDD
# Verificar: ¿Claude activó el skill TDD automáticamente?
# (Si disable-model-invocation: false, debería auto-activarse)
# Test 2: Invocar skill manualmente
/code-review
# Verificar: ¿Se ejecutó el workflow del skill?
# Test 3: Ver qué skills tiene Claude disponibles
/skills
/commands
```

### Entregable

1. 5+ skills instalados (mix de oficiales y comunidad)
2. 1+ plugin instalado
3. Log de los 3 tests de verificación
4. Lista personal de "top 5 skills" con justificación

### Criterios de evaluación

Skills instalados correctamente en ~/.claude/skills/ Plugin instalado via /plugin Claude auto-activa skills model-invoked Claude ejecuta skills user-invoked con /nombre /skills y /commands muestran skills instalados

## 4. Ejercicio práctico 2: Crear skill personalizado con frontmatter avanzado

### Objetivo

Crear un skill desde cero para un workflow real, usando todas las opciones de frontmatter.

### 4.1 Identificar candidato a skill

**Criterios de un buen candidato:**

**Repetitivo** → Lo haces >3 veces por semana
**Multi-paso** → Tiene 5+ pasos bien definidos
**Reutilizable** → Aplica a múltiples proyectos
**Estandarizable** → Todos en el equipo deberían hacerlo igual

**Ejemplos:**

• Deployment checklist (pre-deploy → deploy → post-deploy)
• Feature implementation (spec → design → implement → test → PR)
• Bug triage (reproduce → diagnose → fix → regression test)
• Database migration (create → test up/down → deploy)
• API endpoint creation (route → controller → validation → tests → docs)

### 4.2 Crear skill de API endpoint

Vamos a crear un skill que automatice la creación de endpoints API:
```
mkdir -p .claude/skills/create-endpoint
crea un skill en .claude/skills/create-endpoint/SKILL.md
para automatizar la creación de endpoints REST.
Frontmatter:
- name: create-endpoint
- description: Creates a complete REST endpoint with route, controller,
  validation, tests, and documentation
- disable-model-invocation: true (solo cuando yo lo pida)
- allowed-tools: Read, Write, Edit, Bash, Grep, Glob
- model: claude-sonnet-4-6
El workflow debe:
1. Pedir especificación del endpoint (método, path, request/response)
2. Crear ruta siguiendo las convenciones de .claude/rules/ si existen
3. Crear controller con validación de input (Zod)
4. Crear tests (unit + integration con supertest)
5. Ejecutar tests para confirmar GREEN
6. Actualizar documentación de API si existe agent_docs/api-reference.md
7. Mostrar resumen de archivos creados/modificados
Incluir sección de ejemplos con un endpoint concreto.
```

**Resultado esperado del SKILL.md:**

```
---
name: create-endpoint
description: Creates a complete REST endpoint with route, controller, validation, tests, and documentation
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
model: claude-sonnet-4-6
---
# Create API Endpoint
## When to use
Invoke with `/create-endpoint` when adding a new API endpoint.
## Prerequisites
- Project has Express (or compatible) setup
- Test framework configured (Vitest/Jest)
- Validation library available (Zod recommended)
## Workflow
### 1. Gather specification
Ask the user for:
- HTTP method (GET/POST/PATCH/DELETE)
- Path (e.g., /api/v1/users/:id/preferences)
- Request body schema (if POST/PATCH)
- Response schema (success and error cases)
- Authentication required? (yes/no)
- Rate limiting? (yes/no)
### 2. Analyze existing patterns
Read existing routes to identify:
- File organization pattern (routes/, controllers/, etc.)
- Middleware chain order
- Error handling pattern
- Validation approach
Reference: .claude/rules/ if available
### 3. Create route
Create route file following existing patterns.
Register in app router.
### 4. Create controller
Implement handler with:
- Input validation (Zod schema)
- Service call
- Response formatting (consistent with existing endpoints)
- Error handling (typed errors)
### 5. Create tests
Write tests covering:
- Happy path (valid request → expected response)
- Validation errors (invalid input → 400)
- Auth errors (no token → 401, bad token → 403)
- Not found (invalid ID → 404)
- Edge cases specific to endpoint
Run tests: confirm GREEN.
### 6. Update documentation
If agent_docs/api-reference.md exists, add endpoint documentation.
Include: curl example, request/response schemas, error codes.
### 7. Summary
Show:
- Files created/modified (with paths)
- Tests passing count
- Curl example to test manually
## Example
### Creating GET /api/v1/books/:id/reviews
Specification:
- Method: GET
- Path: /api/v1/books/:id/reviews
- Response: { data: Review[], meta: { total: number, avgRating: number } }
- Auth: required
- Rate limit: 100/min
Files created:
- src/routes/bookReviews.js
- src/controllers/BookReviewsController.js
- src/validators/bookReviewsSchema.js
- tests/integration/bookReviews.test.js
Tests: 8 passing, coverage 94%
```

### 4.3 Probar el skill

```
cd library-api  # O tu proyecto con API
# Invocar el skill
/create-endpoint
# Claude debería:
# 1. Preguntar por la especificación
# 2. Analizar patrones existentes en tu código
# 3. Crear todos los archivos siguiendo convenciones
# 4. Ejecutar tests
# 5. Mostrar resumen
# Ejemplo de uso:
quiero un endpoint GET /api/v1/books/search
que permita buscar por título, autor o ISBN.
Query params: ?q=search_term&amp;genre=fiction&amp;page=1&amp;limit=20
Response paginada con cursor.
Requiere autenticación.
```

### 4.4 Crear segundo skill: security-audit (model-invoked)

```
mkdir -p .claude/skills/security-audit
crea un skill en .claude/skills/security-audit/SKILL.md
que Claude active AUTOMÁTICAMENTE cuando detecte código
con potenciales issues de seguridad.
Frontmatter:
- name: security-audit
- description: Automatic security analysis for code with database
  queries, authentication logic, or user input handling
- disable-model-invocation: false (Claude lo activa cuando detecta relevancia)
- allowed-tools: Read, Grep, Glob (SOLO lectura — no modifica código)
- model: claude-sonnet-4-6
Workflow:
1. Identificar tipo de código (DB queries, auth, input handling)
2. Aplicar checklist OWASP relevante
3. Reportar findings con severidad
4. Sugerir fixes (sin implementar — solo lectura)
```

**Test del skill model-invoked:**

```
# NO invoques /security-audit explícitamente
# En su lugar, pide algo que debería activarlo automáticamente:
implementa endpoint POST /api/v1/users/login
que recibe email y password, valida contra la DB,
y retorna JWT token
# Claude debería:
# 1. Implementar el endpoint
# 2. AUTO-ACTIVAR security-audit porque detecta auth + DB + input
# 3. Reportar findings de seguridad del código que acaba de generar
```

### Entregable

1. **Skill create-endpoint** con frontmatter completo (user-invoked)
2. **Skill security-audit** con auto-activación (model-invoked)
3. Log de uso de create-endpoint con endpoint real creado
4. Log mostrando que security-audit se auto-activó
5. Comparación: endpoint creado CON skill vs SIN skill (tiempo, completitud, calidad)

### Criterios de evaluación

Frontmatter YAML completo y correcto user-invoked funciona con /create-endpoint model-invoked se auto-activa cuando aplica allowed-tools restringe herramientas apropiadamente Workflow tiene 5+ pasos con outputs claros Sección de ejemplos con caso concreto Skill es genuinamente útil (no toy example)

## 5. Ejercicio práctico 3: Skills de comunidad en acción

### Objetivo

Usar skills de la comunidad para un workflow multi-agente real.

### 5.1 Setup: Instalar skills de VoltAgent

VoltAgent ofrece 100+ subagentes con tool permissions por rol:
```
git clone https://github.com/VoltAgent/awesome-claude-skills.git /tmp/voltagent
cp -r /tmp/voltagent/skills/code-reviewer ~/.claude/skills/
cp -r /tmp/voltagent/skills/test-writer ~/.claude/skills/
cp -r /tmp/voltagent/skills/refactorer ~/.claude/skills/
cp -r /tmp/voltagent/skills/documentation-writer ~/.claude/skills/
```

**Características de estos skills:**

• **code-reviewer**: allowed-tools = Read, Grep, Glob (SOLO lectura)
• **test-writer**: allowed-tools = Read, Write(tests/**) (lee código, escribe tests)
• **refactorer**: allowed-tools = Read, Write, Edit, Bash (full pero ejecuta tests)
• **documentation-writer**: allowed-tools = Read, Write(docs/**) (lee código, escribe docs)

### 5.2 Workflow secuencial con skills de VoltAgent

```
cd library-api
# Paso 1: Review con código read-only
usa el skill code-reviewer para revisar @src/services/BookService.js
Quiero un análisis de seguridad, performance y mantenibilidad.
# Claude carga code-reviewer (allowed-tools: Read, Grep, Glob)
# NO puede modificar código — solo analizar
# Paso 2: Identificar gaps de testing
usa el skill test-writer para identificar qué tests faltan
basándose en el review anterior
# Claude carga test-writer (allowed-tools: Read, Write(tests/**))
# Lee código, escribe tests en tests/ — no modifica código fuente
# Paso 3: Refactorizar basándose en el review
usa el skill refactorer para mejorar @src/services/BookService.js
según los findings del review
# Claude carga refactorer (allowed-tools: Read, Write, Edit, Bash)
# Modifica código Y ejecuta tests para confirmar GREEN
# Paso 4: Actualizar documentación
usa el skill documentation-writer para actualizar
la documentación de BookService
# Claude carga documentation-writer (allowed-tools: Read, Write(docs/**))
# Lee código actualizado, escribe docs — no modifica código
```
**Observa la separación de responsabilidades:** Cada skill tiene tools restringidos. El reviewer NO puede modificar
código. El test-writer NO puede tocar el código fuente. Esto es seguridad por diseño.

### 5.3 Skills de obra/superpowers

```
git clone https://github.com/obra/superpowers.git /tmp/superpowers
ls /tmp/superpowers/skills/
# 20+ skills battle-tested incluyendo:
# - tdd/
# - debugging/
# - collaboration/
# - code-quality/
# - architecture/
# Instalar los que te interesen
cp -r /tmp/superpowers/skills/debugging ~/.claude/skills/
cp -r /tmp/superpowers/skills/code-quality ~/.claude/skills/
# Probar
hay un bug en @src/services/BookService.js:45 — el cálculo
de average rating retorna NaN cuando no hay reviews.
Diagnostica y corrige.
# El skill debugging debería guiar el proceso de diagnóstico
```

### Entregable

1. 4 skills de VoltAgent instalados y probados
2. 2+ skills de obra/superpowers instalados y probados
3. Log del workflow secuencial (reviewer → test-writer → refactorer → doc-writer)
4. Evidencia de que allowed-tools restringe correctamente (reviewer no modifica)

### Criterios de evaluación

Skills de comunidad instalados correctamente Workflow secuencial ejecutado con 4 skills Tool restrictions respetadas (reviewer solo lee)
Tests generados por test-writer pasan Código refactorizado pasa tests Documentación actualizada refleja cambios

## 6. Ejercicio integrador: Sistema de skills + plugins para tu equipo

### Objetivo

Crear una suite completa de skills personalizados para tu contexto profesional, con interoperabilidad documentada.

### Fase 1: Identificar workflows de tu equipo

```
# [Shift+Tab] Plan Mode
analizo mi contexto profesional (consultora IA / empresa SaaS / agencia).
Mis workflows repetitivos principales son:
1. [Workflow A — ej: implementación de feature completa]
2. [Workflow B — ej: bug triage y fix]
3. [Workflow C — ej: code review pre-merge]
4. [Workflow D — ej: deployment a staging/prod]
5. [Workflow E — ej: onboarding de nuevo developer]
Para cada workflow, propón:
- ¿Debería ser skill, plugin, o slash command?
- ¿User-invoked o model-invoked?
- ¿Qué allowed-tools necesita?
- ¿Depende de otros skills?
```

### Fase 2: Crear 3 skills interoperables

```
crea 3 skills que trabajen juntos:
Skill 1: [Workflow principal — user-invoked]
- El workflow completo de tu proceso principal
- Llama a Skill 2 y Skill 3 en pasos específicos
Skill 2: [Skill auxiliar — model-invoked]
- Capacidad que se usa en múltiples contextos
- Claude lo activa automáticamente cuando aplica
Skill 3: [Skill con tools restringidos]
- Rol específico con permisos limitados (ej: solo lectura)
- Seguridad por diseño
Para cada uno, crea SKILL.md completo con:
- Frontmatter con todos los campos relevantes
- Workflow de 5+ pasos
- Sección de ejemplos
- Notas de interoperabilidad
```

### Fase 3: Crear plugin que agrupe los skills

```
organiza los 3 skills como un plugin compartible:
mi-plugin/
plugin.json
skills/
workflow-principal/
III SKILL.md
skill-auxiliar/
III SKILL.md
skill-seguro/
SKILL.md
README.md
plugin.json debe definir:
- name, version, description
- skills incluidos
- dependencies (si las hay)
```

### Fase 4: Testing de interoperabilidad

```
# Test 1: Workflow completo
/workflow-principal
# Ejecuta tarea real de tu contexto
# Verifica que llama a skill-auxiliar cuando corresponde
# Test 2: Auto-activación
# Ejecuta tarea que debería activar skill-auxiliar automáticamente
# Sin invocarlo explícitamente
# Test 3: Tool restrictions
# Verifica que skill-seguro no puede modificar código
# (solo las herramientas permitidas)
```

### Entregable

1. **3 skills con frontmatter completo:**
• Workflow principal (user-invoked, complejo)
• Skill auxiliar (model-invoked, auto-activable)
• Skill seguro (tools restringidos)
2. **Plugin que agrupa los 3:**
• plugin.json
• README con uso e interoperabilidad
3. **Testing documentado:**
• Log de workflow completo
• Evidencia de auto-activación
• Evidencia de tool restrictions
4. **Comparación:**
• Tiempo con skills vs sin skills para una tarea real
• Errores evitados por checklists automáticos del skill

### Criterios de evaluación

3 skills con frontmatter YAML completo y correcto Interoperabilidad: Skill 1 llama a Skill 2 y 3 Model-invoked se auto-activa correctamente Tool restrictions funcionan (skill seguro solo lee)
Plugin agrupa los 3 skills correctamente Testing documenta los 3 escenarios Skills son genuinamente útiles para tu contexto real

## 7. Conceptos clave para memorizar

### Skills como progressive disclosure de capacidades

```
.claude/rules/  → Progressive disclosure de CONTEXTO (paths)
Skills          → Progressive disclosure de CAPACIDADES (descripción)
```
**Budget:** 2% de ventana de contexto para descripciones. ~100 tokens por skill en escaneo, <5K cuando se activa.

### Dos tipos de invocación

**User-invoked** (disable-model-invocation: true) → Solo con /nombre → Control manual
**Model-invoked** (disable-model-invocation: false) → Claude decide → Auto-activación

### Frontmatter clave

```
---
name: skill-name
description: One line that Claude uses to decide relevance
disable-model-invocation: true/false
allowed-tools: Read, Grep, Glob       # Security by design
model: claude-sonnet-4-6              # Model override
---
```

### Skills vs Plugins

**Skill** = UN archivo de workflow (SKILL.md)
**Plugin** = PAQUETE de extensiones (commands + agents + hooks + MCP + skills)

### El árbol de decisión

```
Convención de código → .claude/rules/
Workflow reutilizable → Skill
Paquete compartible → Plugin
Herramienta externa → MCP Server
Interceptar acción → Hook
Acción rápida → Slash command
Rol especializado → Subagente (.claude/agents/)
```

## 8. Antipatrones a evitar

**Skill demasiado específico** → "deploy-api-v2-to-aws-us-east-1" (no reutilizable — esto es un slash command, no
un skill)
**Skill demasiado genérico** → "write good code" (no accionable — esto es un principio, no un workflow)
**Skill sin examples** → Difícil de entender qué produce el skill
**Model-invoked para acciones destructivas** → Deployment, database drops → SIEMPRE user-invoked
**Todos los skills como model-invoked** → Saturan el budget de descripciones y Claude puede activar skills no
deseados
**Duplicar lógica entre skills** → Checklist de code-review en 3 skills → extraer a un skill y referenciar
**Skills sin allowed-tools** → Un reviewer que puede escribir archivos es un reviewer que modifica lo que revisa
**Instalar 50 skills "por si acaso"** → Budget se satura, Claude prioriza mal
**Confundir skills con .claude/rules/** → Rules son convenciones (qué estándar seguir). Skills son workflows (cómo
hacer el trabajo)

## 9. Recursos complementarios

### Repositorios oficiales

• anthropics/skills (~102.854#) — Repositorio oficial de Agent Skills
• anthropics/claude-plugins-official (~2.800#) — Directorio oficial de plugins

### Repositorios de comunidad

• ComposioHQ/awesome-claude-skills (~6.600#) — Catálogo comunitario
• VoltAgent/awesome-claude-skills — 100+ subagentes con tool permissions
• obra/superpowers — 20+ skills battle-tested
• shinpr/claude-code-workflows — 17 agentes especializados
• hesreallyhim/awesome-claude-code — Lista premier: skills, hooks, plugins

### Documentación oficial

• Extend Claude with skills — Docs de skills y commands
• Customize Claude Code with plugins — Announcement de plugins
• Agent Skills engineering blog — Deep dive técnico

### Recursos adicionales de fuentes

• Anthropic: Claude Code Best Practices — Skills en contexto del workflow completo
• Matt Pocock thread — Skills en práctica

## 10. Checklist de finalización del módulo

Entiendo skills como progressive disclosure de capacidades (diferencia con rules/ de M4)
Instalé 5+ skills de comunidad (ComposioHQ, VoltAgent, obra/superpowers)
Instalé 1+ plugin desde /plugin Uso /skills y /commands para ver skills disponibles Creé skill user-invoked con frontmatter completo Creé skill model-invoked que se auto-activa correctamente Configuré allowed-tools para restringir herramientas por skill Entiendo el budget de 2% y cuándo tool search se activa Completé workflow secuencial con 4 skills de VoltAgent Creé plugin que agrupa 3 skills interoperables Puedo decidir cuándo usar skill vs plugin vs MCP vs hook vs rules/ vs command Sé identificar candidatos a skill (repetitivo, multi-paso, reutilizable)

