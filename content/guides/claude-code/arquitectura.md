---
excerpt: "Cómo diseñar un CLAUDE.md profesional que guíe al agente en proyectos reales."
---

# Módulo 4: Arquitectura de CLAUDE.md

## 1. El problema: cuando CLAUDE.md crece demasiado

### 1.1 Por qué tu CLAUDE.md se vuelve un problema

A lo largo de los módulos 1-3 has trabajado con CLAUDE.md de 30-50 líneas. Funcionan bien para proyectos simples.
Pero en proyectos reales crece rápidamente:
```
# CLAUDE.md real de un proyecto enterprise (320 líneas)
## WHAT
[3 líneas]
## WHY
[40 líneas: decisiones arquitectónicas, trade-offs, historia]
## HOW
### Build
[15 líneas: setup monorepo con workspaces]
### Test
[25 líneas: estrategia multinivel, unit/integration/e2e]
### Deploy
[20 líneas: CI/CD staging/production]
### API Conventions
[35 líneas: naming, versioning, error format, pagination]
### Database
[30 líneas: migrations, seeds, naming, indexes]
### Frontend Conventions
[25 líneas: componentes, state management, styling]
### Security
[20 líneas: auth, CORS, rate limiting, secrets]
### Conventions
[40 líneas: commits, branches, PRs, code review]
### Troubleshooting
[30 líneas: problemas comunes y soluciones]
```
**Resultado medido:** Claude deprioritiza secciones que considera "no relevantes" para la tarea actual. Pides "agrega
endpoint de API" → Claude ignora las convenciones de database. Pides "crea migración" → Claude ignora las convenciones de frontend. No es un bug — es un mecanismo de priorización diseñado para manejar contextos largos.
**El límite práctico documentado:** <200 líneas. Cada instrucción de bajo valor degrada las de alto valor. Más allá de
200 líneas, el rendimiento baja significativamente.

### 1.2 Las 4 capas de configuración — repaso y profundización

En M1 aprendiste las 4 capas. Ahora vamos a usarlas profesionalmente. Cada tipo de información tiene su lugar óptimo:
```
CLAUDE.md
→ Instrucciones conversacionales UNIVERSALES
→ Lo que Claude necesita en CADA tarea
→ WHAT, WHY, HOW básico
→ &lt;200 líneas
.claude/rules/                              ← NUEVO EN ESTE M4
→ Reglas por DOMINIO con carga CONDICIONAL
→ Se cargan SOLO cuando Claude trabaja con archivos que
matchean los paths del frontmatter
→ 0 tokens de overhead cuando no aplican
.claude/settings.json
→ Permisos (allowedTools, deny)
→ Modelo por defecto
→ Configuración determinista (no conversacional)
Auto-memoria (/memory)
→ Aprendizaje implícito que Claude guarda solo
→ Complementa CLAUDE.md, no lo reemplaza
→ Reduce necesidad de actualización manual
```
**Decisión clave de este módulo:** Aprender a poner cada instrucción en su capa correcta.

### 1.3 La solución oficial: .claude/rules/

Anthropic introdujo el directorio .claude/rules/ como mecanismo de **progressive disclosure nativo**. Los archivos en este directorio son reglas en markdown con un frontmatter YAML opcional que define **cuándo se cargan**.

**Dos tipos de reglas:**

Tipo Frontmatter Cuándo se carga

**Regla universal**

```
Sin paths:
```
SIEMPRE (como CLAUDE.md)

**Regla condicional**

```
Con paths:
```
SOLO cuando Claude trabaja con archivos que matchean

**Ejemplo de regla condicional:**

```
# .claude/rules/api-conventions.md
---
paths:
  - "src/routes/**"
  - "src/controllers/**"
  - "src/middleware/**"
---
# API Conventions
## Naming
- Rutas en kebab-case: /user-profiles, no /userProfiles
- Controladores en PascalCase: UserProfilesController
- Middleware en camelCase: requireAuth, validateInput
## Error Responses
Formato estándar para TODOS los errores:
```
{ "error": { "code": "VALIDATION_ERROR", "message": "Email is required", "details": [{ "field": "email", "reason": "required" }]
}
}
```
## Pagination
Usar cursor-based pagination en endpoints de listado:
- Query params: ?cursor=xxx&amp;limit=20
- Response: { data: [...], nextCursor: "xxx", hasMore: true }
## Versioning
- Prefijo /api/v1/ para todos los endpoints
- Breaking changes → nueva versión /api/v2/
- Mantener v1 mínimo 6 meses después de v2
```
**Cómo funciona:** Cuando Claude edita src/routes/users.js, este archivo se carga automáticamente. Cuando
Claude edita src/models/User.js, este archivo NO se carga (models/ no está en los paths). **Zero overhead cuando**

**no aplica.**

**Ejemplo de regla universal (sin paths):**

```
# .claude/rules/commit-standards.md
# (sin frontmatter = se carga SIEMPRE)
# Commit Standards
- Conventional Commits: feat:, fix:, docs:, refactor:, test:, chore:
- Scope obligatorio: feat(auth):, fix(api):, test(db):
- Mensaje en inglés, cuerpo puede ser en español
- Un commit por cambio lógico, no por archivo
```
**Nota importante:** El frontmatter YAML con paths: es una feature que Anthropic ha ido evolucionando desde
su introducción. Antes de implementar en tu proyecto, **verifica el formato exacto actualizado** en la documentación oficial: docs.anthropic.com/en/docs/claude-code/memory (sección "Rules"). El concepto de carga condicional es estable, pero la sintaxis específica del frontmatter puede recibir mejoras o cambios menores entre versiones. Ejecuta claude doctor y revisa el changelog si algo no funciona como se describe aquí.

### 1.4 Qué va en cada capa — la tabla definitiva

Tipo de información Dónde Por qué Ejemplo Descripción del proyecto CLAUDE.md (WHAT)
Siempre necesario "API de gestión de tareas para equipos"
Decisiones arquitectónicas CLAUDE.md (WHY)
Guían todas las decisiones "Express por su ecosistema de middleware"
Comandos de build/test CLAUDE.md (HOW)
Se necesitan constantemente
```
npm test, npm run build
```
Convenciones de API
```
.claude/rules/ con
```
Solo relevante al editar rutas Naming, pagination, errors
```
paths: src/routes/**
```
Convenciones de DB
```
.claude/rules/ con
```
Solo relevante al editar modelos/migraciones Schema, migrations, indexes
```
paths: src/models/, db/
```
Convenciones de frontend
```
.claude/rules/ con
```
Solo relevante al editar UI React patterns, styling
```
paths: src/components/**
```
Convenciones de tests
```
.claude/rules/ con
```
Solo relevante al escribir tests Naming, structure, mocking
```
paths: tests/**
```
Reglas de commits
```
.claude/rules/ sin paths
```
Universal, se aplica siempre Conventional Commits format Permisos de herramientas Determinista, no
```
.claude/settings.json
```
conversacional allowedTools, deny Modelo por defecto Configuración técnica "claude-sonnet-4-6"
```
.claude/settings.json
```
MCP servers Configuración técnica Servidores MCP
```
.claude/settings.json
```
Insights de debugging Auto-memoria (/memory)
Claude aprende solo "npm run dev fails without PORT env"
Patrones del codebase Auto-memoria Claude los descubre "Project uses repository pattern"

### 1.5 El patrón agent_docs/ — complemento, no reemplazo

El patrón de agent_docs/ (documentación profunda en archivos separados referenciados desde CLAUDE.md) sigue siendo válido como complemento. La diferencia:
```
.claude/rules/
agent_docs/
```
**Carga automática** basada en paths
Claude tiene que **decidir** leer el archivo Nativo de Claude Code Patrón de la comunidad Ideal para **reglas y convenciones**
Ideal para **documentación de referencia**
Frontmatter YAML Sin frontmatter Se cargan al inicio Claude lee bajo demanda

**Cuándo usar cada uno:**

• **Convenciones que Claude debe SEGUIR siempre** → .claude/rules/ con paths
• **Documentación de referencia que Claude CONSULTA a veces** → agent_docs/ con referencia en
CLAUDE.md
• **Decisiones universales** → CLAUDE.md directamente

**Ejemplo de uso combinado:**

```
.claude/
settings.json                  # Permisos y modelo
rules/
api-conventions.md         # Carga cuando edita routes/
db-conventions.md          # Carga cuando edita models/
frontend-rules.md         # Carga cuando edita components/
test-standards.md          # Carga cuando edita tests/
commit-standards.md        # Carga SIEMPRE (sin paths)
agents/                        # Subagentes (M9)
skills/                        # Skills (M5)
agent_docs/
architecture.md               # Claude lee si necesita entender el sistema
deployment.md                  # Claude lee si necesita deployar
troubleshooting.md             # Claude lee cuando debuggea
```
CLAUDE.md referencia a agent_docs/ pero NO a .claude/rules/ (esos se cargan solos):
```
# Project: Task Manager
## WHAT
API REST + frontend para gestión de tareas de equipos.
## WHY
- Express + PostgreSQL + React
- Repository pattern para abstracción de datos
- JWT auth con refresh tokens
## HOW
### Build
npm install &amp;&amp; npm run dev
### Test
npm test
npm run test:coverage
### Reference docs
- Architecture overview: `agent_docs/architecture.md`
- Deployment guide: `agent_docs/deployment.md`
- Troubleshooting: `agent_docs/troubleshooting.md`
```
40 líneas. Las convenciones están en .claude/rules/ y se cargan automáticamente. La documentación de referencia está en agent_docs/ y Claude la lee cuando la necesita.
Referencia: cómo se ve un agent_docs/ bien hecho Para que tengas una referencia concreta de qué profundidad se espera, aquí van ejemplos condensados de cada tipo de archivo. En tus proyectos serán más largos (100-200 líneas), pero la estructura y el tono son estos:
```
agent_docs/architecture.md — Ejemplo condensado:
# System Architecture
## Layers
Request → Route → Controller → Service → Repository → Database
Each layer has a single responsibility:
- **Routes**: URL mapping + middleware chain. No business logic.
- **Controllers**: Parse request, call service, format response.
- **Services**: Business logic. Doesn't know about HTTP.
- **Repositories**: Data access. Only layer that touches DB.
## Data Flow: Creating a Book
1. POST /api/v1/books hits route → requireAuth middleware → validateInput middleware
2. BooksController.create(req, res) extracts body, calls BookService
3. BookService.create(data) validates ISBN uniqueness, calculates defaults
4. BookRepository.insert(data) writes to PostgreSQL, returns created row
5. Controller formats response: { data: book, meta: { created: true } }
## Key Decisions
- **Repository pattern**: Allows swapping DB without touching business logic
- **Service layer**: Business rules testable without HTTP or DB
- **Middleware chain**: Auth → Validation → Rate Limit → Handler (this order matters)
## Error Propagation
Services throw typed errors (ValidationError, NotFoundError, ConflictError).
Controllers catch and map to HTTP status codes.
Global error handler catches unhandled errors → 500 with request ID.
agent_docs/database-schema.md — Ejemplo condensado:
# Database Schema
## Tables
### books
Column | Type | Constraints | Notes
|--------|------|-------------|-------|
id | UUID | PK, DEFAULT gen_random_uuid()
title | VARCHAR(255) | NOT NULL
author | VARCHAR(255) | NOT NULL
isbn | VARCHAR(13) | UNIQUE, NOT NULL | Validated: 10 or 13 digits
genre | VARCHAR(100) | | Optional
read | BOOLEAN | DEFAULT false
created_at | TIMESTAMP | DEFAULT NOW()
updated_at | TIMESTAMP | DEFAULT NOW() | Trigger on UPDATE
deleted_at | TIMESTAMP | NULLABLE | Soft delete
### reviews
Column | Type | Constraints | Notes
|--------|------|-------------|-------|
id | UUID | PK
book_id | UUID | FK → books(id) ON DELETE CASCADE | Indexed
rating | INTEGER | CHECK (1-5)
comment | TEXT | | Optional
created_at | TIMESTAMP | DEFAULT NOW()
## Indexes
- books_isbn_unique ON books(isbn)
- reviews_book_id_idx ON reviews(book_id)
- books_genre_idx ON books(genre) — for filtered listings
## Migrations
Location: db/migrations/
Naming: YYYYMMDDHHMMSS_descriptive_name.js
Create: npm run migrate:make add_publisher_to_books
Run: npm run migrate:latest
Rollback: npm run migrate:down
## Common Queries
-- Books with average rating (used in GET /books/:id)
SELECT b.*, COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(r.id) as review_count
FROM books b LEFT JOIN reviews r ON b.id = r.book_id
WHERE b.id = $1 AND b.deleted_at IS NULL
GROUP BY b.id;
agent_docs/troubleshooting.md — Ejemplo condensado:
# Troubleshooting
## Server won't start
1. Check PORT env var: echo $PORT (default: 3000)
2. Check DB connection: npm run db:check
3. Check if port in use: lsof -i :3000
4. Check logs: npm run dev 2&gt;&amp;1 | head -50
## Tests fail with "connection refused"
Test DB must be running: docker compose up test-db -d
Check DATABASE_TEST_URL in .env.test
Reset test DB: npm run db:reset:test
## Migration fails
Check current state: npm run migrate:status
If stuck: npm run migrate:unlock
If corrupted: npm run db:reset:dev (WARNING: destroys dev data)
Common cause: migration references table that doesn't exist yet — check ordering
## Coverage dropped below 80%
Run: npx vitest run --coverage
Look for: "Uncovered Lines" column in report
Common culprits: new error handlers without tests, new branches in validators
Fix: write tests specifically for uncovered lines, not just happy paths
## Claude generates code that violates conventions
1. Check .claude/rules/ — is the rule present for that domain?
2. Check paths: in frontmatter — does it match the file being edited?
3. If rule exists but Claude ignores: make instruction more specific and positive
4. If rule missing: add it, commit, start new session
```
Estos ejemplos muestran el nivel de profundidad esperado: información concreta, ejecutable, con comandos y ejemplos reales. No son teoría — son referencia que Claude puede usar directamente para tomar decisiones.

### 1.6 Instrucciones positivas: la forma correcta de escribir reglas

Este patrón ya lo viste en M1, pero en .claude/rules/ es donde más impacta:
```
# I INCORRECTO (negaciones — Claude tiene dificultad)
---
paths: ["src/routes/**"]
---
# API Rules
- NO uses query parameters para filtrado complejo
- NO retornes arrays directamente, siempre wrapea en objeto
- NO hardcodees strings de error
- NUNCA uses res.send() para JSON
# I CORRECTO (instrucciones positivas)
---
paths: ["src/routes/**"]
---
# API Rules
- Usar request body para filtrados complejos (POST /search)
- Retornar siempre { data: [...], meta: {...} } como wrapper
- Definir error codes en src/constants/errors.js y referenciarlos
- Usar exclusivamente res.json() para respuestas JSON
```
**La regla de Boris Cherny:** "Instrucciones deterministas (como permisos y atribución) van en settings.json.
Instrucciones conversacionales positivas van en CLAUDE.md o .claude/rules/."

## 2. Ejercicio práctico 1: Crear .claude/rules/ para password-validator

### Objetivo

Convertir un CLAUDE.md básico en arquitectura con reglas condicionales.

### Setup

```
cd password-validator  # Proyecto de M1/M3
mkdir -p .claude/rules
```

### Paso 1: Identificar dominios

Analiza qué archivos tiene tu proyecto y qué convenciones aplican a cada grupo:
```
src/
passwordValidator.js    → Lógica de validación
generatePassword.js     → Generación segura
index.js                → Entry point
tests/
passwordValidator.test.js
generatePassword.test.js
fixtures/
```

**Dominios identificados:**

1. **Código fuente** (src/) → Convenciones de implementación
2. **Tests** (tests/) → Convenciones de testing
3. **Universal** → Commits, estilo general

### Paso 2: Crear reglas condicionales

```
crea 3 archivos de reglas en .claude/rules/:
1. .claude/rules/implementation.md
   paths: src/**
   Convenciones de implementación:
   - JSDoc en todas las funciones exportadas
   - Usar crypto (no Math.random) para aleatoriedad
   - Extraer regex a constantes nombradas
   - Validar inputs al inicio de cada función pública
   - Lanzar errores descriptivos (no genéricos)
2. .claude/rules/testing.md
   paths: tests/**
   Convenciones de testing:
   - Vitest con vi.mock() para mocking
   - Estructura Arrange-Act-Assert
   - Un assertion principal por test
   - Nombres descriptivos: "should [behavior] when [condition]"
   - Parametrized tests para múltiples inputs
   - Coverage mínimo 80%
3. .claude/rules/general.md
   (sin paths — siempre activo)
   - Conventional Commits con scope
   - ESM imports exclusivamente
   - Formatear con prettier antes de commit
```

### Paso 3: Simplificar CLAUDE.md

Ahora que las convenciones están en reglas, CLAUDE.md se reduce:
```
refactoriza CLAUDE.md. Las convenciones detalladas ya están
en .claude/rules/ (se cargan automáticamente).
CLAUDE.md solo debe tener:
- WHAT (2-3 líneas)
- WHY (stack y razones, 5-6 líneas)
- HOW (build + test commands, 5-6 líneas)
Meta: &lt;25 líneas.
```

### Paso 4: Validar carga condicional

```
# Test 1: Editar código fuente
modifica @src/passwordValidator.js — agrega soporte
para contraseñas con emojis como caracteres especiales
# Verificar: ¿Usó JSDoc? ¿Validó input? ¿Extrajo regex a constante?
# (Regla implementation.md debería estar activa)
# Test 2: Editar test
crea test adicional en @tests/passwordValidator.test.js
para el caso de emojis como caracteres especiales
# Verificar: ¿Usó Arrange-Act-Assert? ¿Nombre descriptivo?
# (Regla testing.md debería estar activa)
# Test 3: Commit
haz commit de los cambios
# Verificar: ¿Conventional Commits con scope?
# (Regla general.md debería estar activa — siempre lo está)
```

### Entregable

1. .claude/rules/ con 3 archivos (implementation, testing, general)
2. CLAUDE.md reducido a <25 líneas
3. Log de los 3 tests de validación mostrando que las reglas se aplican correctamente

### Criterios de evaluación

Reglas con paths: correcto en frontmatter CLAUDE.md significativamente más corto que antes Claude sigue convenciones de implementación al editar src/ Claude sigue convenciones de testing al editar tests/ Claude sigue convenciones generales siempre Sin duplicación entre CLAUDE.md y rules/

## 3. Ejercicio práctico 2: Proyecto multi-dominio con rules/ + agent_docs/

### Objetivo

Aplicar la arquitectura completa en un proyecto con múltiples dominios (API + DB + frontend).

### Contexto

Toma la Library API del M3 o crea un proyecto nuevo con esta estructura:
```
library-api/
src/
routes/          # API endpoints
controllers/     # Request handlers
services/        # Business logic
models/          # Data access
validators/      # Input validation
middleware/       # Auth, error handling
db/
migrations/      # Schema changes
seeds/           # Dev/test data
tests/
unit/
integration/
CLAUDE.md
.claude/
settings.json
rules/
agent_docs/
```

### Paso 1: Diseñar reglas condicionales por dominio

```
# [Shift+Tab] Plan Mode
analiza la estructura de este proyecto y propón archivos
para .claude/rules/ con paths apropiados.
Dominios a cubrir:
1. API (routes, controllers, middleware)
2. Database (models, migrations, seeds)
3. Validators (validation logic)
4. Tests (unit, integration)
5. General (commits, estilo, universal)
Para cada regla, especifica:
- paths: qué archivos la activan
- Contenido: 10-20 líneas de convenciones positivas
- Ejemplo: un caso concreto de la regla aplicada
```

**Estructura esperada:**

```
.claude/rules/
api-conventions.md          # paths: src/routes/**, src/controllers/**, src/middleware/**
database-conventions.md     # paths: src/models/**, db/**
validation-rules.md         # paths: src/validators/**
testing-standards.md        # paths: tests/**
general.md                  # (sin paths — siempre activo)
```

### Paso 2: Crear agent_docs/ para documentación de referencia

```
crea agent_docs/ con documentación profunda que Claude
consultará bajo demanda (no reglas, sino referencia):
1. agent_docs/architecture.md
   - Diagrama de capas (routes → controllers → services → models)
   - Flujo de un request completo
   - Dependencias entre componentes
2. agent_docs/database-schema.md
   - DDL completo de todas las tablas
   - Relaciones e índices
   - Ejemplos de queries frecuentes
3. agent_docs/api-reference.md
   - Todos los endpoints con request/response examples
   - Códigos de error por endpoint
   - Ejemplos con curl
Cada archivo debe tener &gt;100 líneas de contenido útil.
```

### Paso 3: CLAUDE.md minimalista

```
refactoriza CLAUDE.md:
- WHAT: 2-3 líneas
- WHY: stack + 3-4 decisiones clave
- HOW: build + test + commands esenciales
- References: links a agent_docs/ para consulta
Las convenciones están en .claude/rules/ y se cargan solas.
Meta: &lt;40 líneas.
```

### Paso 4: settings.json profesional

```
actualiza .claude/settings.json con permisos granulares
para este proyecto:
- allowedTools: Read, Write/Edit solo en src/ y tests/
- Bash: solo npm, vitest, git, curl
- deny: rm -rf, lectura de .env, lectura de secrets
```

### Paso 5: Validación cruzada

```
# Test 1: Feature que toca API
agrega endpoint GET /books/:id/similar que retorna libros
del mismo género. Sigue nuestras convenciones.
# Verificar que Claude:
# - Carga api-conventions.md (routes + controllers)
# - Carga database-conventions.md (queries eficientes)
# - Lee agent_docs/database-schema.md para ver schema
# - NO carga validation-rules.md (no toca validators)
# Test 2: Migración de DB
necesito agregar campo 'publisher' a tabla books.
Crea la migración.
# Verificar que Claude:
# - Carga database-conventions.md (naming, patterns)
# - Lee agent_docs/database-schema.md (estado actual)
# - NO carga api-conventions.md (no toca routes)
# Test 3: Bug que cruza dominios
los tests de integración fallan después del cambio.
Diagnostica y corrige.
# Verificar que Claude:
# - Carga testing-standards.md (debugging patterns)
# - Lee agent_docs/api-reference.md (qué debería retornar)
# - Combina info de múltiples fuentes
```

### Entregable

1. .claude/rules/ con 5 archivos, paths correctos
2. agent_docs/ con 3 archivos de referencia (>100 líneas cada uno)
3. CLAUDE.md <40 líneas
4. .claude/settings.json con permisos granulares
5. Log de 3 tests de validación cruzada

### Criterios de evaluación

Cada regla tiene paths apropiados (no demasiado amplios ni restrictivos)
agent_docs/ tiene documentación profunda de referencia CLAUDE.md <40 líneas, sin duplicación con rules/ Settings.json con permisos coherentes con el proyecto Claude carga reglas correctas según qué archivos edita (validado en 3 tests)
Claude consulta agent_docs/ cuando necesita referencia profunda Sin duplicación entre capas

## 4. El patrón de actualización continua

### 4.1 El problema de la documentación desactualizada

```
Semana 1: Creas reglas perfectas en .claude/rules/
Semana 4: Migras de REST a GraphQL
Semana 8: Claude sigue usando convenciones REST
           (lee reglas que ya no aplican)
```
Documentación desactualizada es PEOR que no tener documentación — Claude genera código que sigue reglas obsoletas con confianza total.

### 4.2 Tres mecanismos de actualización

**Mecanismo 1: Bugs** → **Regla actualizada (manual, inmediato)**
```
# Bug: Claude creó migración sin ON DELETE CASCADE
# Fix código
git commit -m "fix(db): add ON DELETE CASCADE to book_reviews FK"
# Fix regla (MISMO PR)
# Editar .claude/rules/database-conventions.md:
# Agregar: "Foreign keys SIEMPRE usan ON DELETE CASCADE
# salvo justificación explícita en el PR"
git commit -m "docs: clarify CASCADE requirement in db rules"
```
**Tip de Boris Cherny:** "Cada vez que Claude hace algo mal, añade una línea al CLAUDE.md [o a rules/]. Pero
también revisa periódicamente y elimina las que ya no aplican."

**Mecanismo 2: Auto-memoria (automático, gradual)**

Claude Code guarda aprendizajes automáticamente entre sesiones:
```
# Después de una sesión donde debuggeaste un problema de DB:
/memory
# Claude muestra:
# - "npm run migrate:latest requires DATABASE_URL set"
# - "Book model uses soft deletes via deleted_at column"
# - "Integration tests need test DB reset between runs"
```
La auto-memoria complementa las reglas: las reglas dicen QUÉ hacer, la auto-memoria recuerda CÓMO se hizo en la práctica.

**Gestión de auto-memoria:**

```
/memory              # Ver todas las notas guardadas
/memory clear        # Borrar notas incorrectas
# Si una nota de auto-memoria es tan importante que debería
# ser una regla formal:
# 1. Léela en /memory
# 2. Crea una regla en .claude/rules/
# 3. Borra la nota de /memory (ya está formalizada)
```

**Mecanismo 3: CI validation (automatizado, preventivo)**

```
# scripts/docs-check.sh
#!/bin/bash
# Detecta cambios en código sin actualización de reglas
CHANGED_SRC=$(git diff --name-only HEAD~1 -- src/)
CHANGED_RULES=$(git diff --name-only HEAD~1 -- .claude/rules/)
CHANGED_DOCS=$(git diff --name-only HEAD~1 -- agent_docs/)
if [ -n "$CHANGED_SRC" ] &amp;&amp; [ -z "$CHANGED_RULES" ] &amp;&amp; [ -z "$CHANGED_DOCS" ]; then
  echo "II  Code changed but no rules/docs updated."
  echo "   Changed files: $CHANGED_SRC"
  echo "   If behavior changed, update .claude/rules/ or agent_docs/"
  exit 1
fi
echo " Code and docs updated together (or no code changed)"
exit 0
```

### 4.3 Ejercicio: Implementar sistema de actualización

```
implementa sistema de actualización continua para el proyecto:
1. .github/PULL_REQUEST_TEMPLATE.md con checklist:
   - [ ] Si cambia comportamiento, ¿.claude/rules/ actualizado?
   - [ ] Si cambia schema, ¿agent_docs/database-schema.md actualizado?
   - [ ] Tests pasan y coverage no baja?
2. scripts/docs-check.sh (script de arriba)
3. GitHub Action (.github/workflows/docs-check.yml):
   - Ejecuta docs-check.sh en cada PR
   - Comenta en PR si detecta posible desactualización
```

### Entregable

1. PR template con checklist de docs
2. Script de validación funcional
3. GitHub Action configurada

### Criterios de evaluación

PR template incluye checklist de reglas/docs Script detecta cambios de código sin actualización de docs Sistema es útil sin ser burocrático (no bloquea cambios triviales)

## 5. Caso especial: Proyectos enterprise multi-módulo

### 5.1 El desafío de los monorepos

En monorepos con múltiples servicios, el sistema de rules/ escala naturalmente:
```
monorepo/
CLAUDE.md                          # Overview general (&lt;50 líneas)
.claude/
settings.json                  # Permisos globales
rules/
general.md                 # Commits, estilo (siempre activo)
api-gateway.md             # paths: services/gateway/**
auth-service.md            # paths: services/auth/**
product-service.md         # paths: services/products/**
order-service.md           # paths: services/orders/**
frontend-react.md          # paths: frontend/src/**
infrastructure.md          # paths: infra/**
database-shared.md         # paths: **/models/**, **/migrations/**
testing-shared.md          # paths: **/tests/**, **/*.test.*
agent_docs/
architecture.md               # System-wide architecture
service-communication.md       # How services talk to each other
deployment.md                  # CI/CD pipeline
services/
gateway/
auth/
products/
orders/
```
**Ventaja de rules/ con paths vs agent_docs/:** Cuando Claude edita services/auth/src/controllers/login.js, solo
se cargan auth-service.md, general.md y potencialmente testing-shared.md (si hay tests). Las reglas de gateway, products, orders, frontend e infra tienen **0 tokens de overhead**.

### 5.2 CLAUDE.md para monorepo

```
# Project: E-Commerce Platform
## WHAT
Plataforma e-commerce con microservicios.
4 services (Gateway, Auth, Products, Orders) + React frontend.
## WHY
- Monorepo: código compartido, versionado atómico
- Microservicios: escalado independiente por servicio
- Event-driven: RabbitMQ para comunicación asíncrona
- PostgreSQL: una DB lógica por servicio
## HOW
### Setup
./scripts/dev-setup.sh    # Docker Compose, todos los servicios
### Test
npm run test:all          # Tests de todos los servicios
npm run test:service auth # Tests de un servicio específico
### Deploy
./scripts/deploy.sh staging
./scripts/deploy.sh prod
## Reference Docs
- System architecture: agent_docs/architecture.md
- Service communication: agent_docs/service-communication.md
- Deployment pipeline: agent_docs/deployment.md
```
~30 líneas. Las convenciones de cada servicio se cargan automáticamente vía rules/.

### 5.3 Ejercicio: Diseñar rules/ para monorepo (ejercicio de diseño)

```
# [Shift+Tab] Plan mode
diseña la estructura de .claude/rules/ para un monorepo
con estos servicios:
1. API Gateway (Node.js/Express) — proxy + rate limiting
2. Auth Service (Node.js/Express) — JWT + OAuth2
3. Product Service (Node.js/Express) — CRUD productos + search
4. Order Service (Node.js/Express) — carrito + checkout + pagos
Shared:
- PostgreSQL (una DB lógica por servicio)
- Vitest para todos los tests
- RabbitMQ para eventos
Para cada regla define:
- Nombre del archivo
- paths: exactos
- Contenido: 10-15 convenciones positivas específicas del dominio
- Ejemplo concreto de la regla aplicada
Prioriza: ¿qué convenciones son más críticas de que Claude siga?
```
Este es un ejercicio de DISEÑO — no necesitas implementar el monorepo completo. El objetivo es practicar el pensamiento de "qué información necesita Claude en cada contexto".

### Entregable

1. Estructura de rules/ diseñada (archivos + paths + contenido)
2. CLAUDE.md de monorepo (<35 líneas)
3. Justificación de decisiones: ¿por qué estos paths? ¿por qué estas reglas?

## 6. Ejercicio integrador: Refactorizar Library API con arquitectura

## profesional

### Objetivo

Tomar la Library API del M3 y aplicar la arquitectura completa: CLAUDE.md minimalista + .claude/rules/ condicionales + agent_docs/ de referencia + settings.json profesional + auto-memoria gestionada.

### Fase 1: Auditar la configuración actual

```
analiza el estado actual de configuración de este proyecto:
1. Lee CLAUDE.md — ¿qué debería quedarse y qué debería moverse?
2. Lee .claude/settings.json — ¿los permisos son apropiados?
3. Verifica /memory — ¿hay insights útiles que formalizar en reglas?
4. Identifica dominios del proyecto (API, DB, validadores, tests)
Propón plan de refactoring con:
- Qué mover a .claude/rules/ (con paths específicos)
- Qué mover a agent_docs/ (documentación de referencia)
- Qué queda en CLAUDE.md (universal)
- Qué actualizar en settings.json
```

### Fase 2: Crear reglas condicionales

```
crea los archivos de .claude/rules/ según el plan.
Para cada archivo:
1. Frontmatter con paths correctos
2. 10-20 convenciones positivas (no negaciones)
3. Al menos 1 ejemplo concreto por regla
```

### Fase 3: Crear agent_docs/ de referencia

```
crea agent_docs/ con documentación profunda:
1. agent_docs/api-reference.md
   - Todos los endpoints con curl examples
   - Códigos de error y su significado
   - Reglas de validación por endpoint
2. agent_docs/database-schema.md
   - DDL completo de todas las tablas
   - Relaciones e índices
   - Queries frecuentes con ejemplos
3. agent_docs/architecture.md
   - Diagrama de capas
   - Flujo de un request
   - Dónde vive cada tipo de lógica
Cada archivo &gt;100 líneas de contenido útil y ejecutable.
```

### Fase 4: Reducir CLAUDE.md

```
refactoriza CLAUDE.md a &lt;35 líneas.
Solo debe contener:
- WHAT (2 líneas)
- WHY (5 líneas con decisiones clave)
- HOW (build + test, 5 líneas)
- References a agent_docs/ (3 líneas)
Las convenciones están en .claude/rules/.
Los detalles están en agent_docs/.
Los permisos están en settings.json.
```

### Fase 5: Validación exhaustiva (5 tests)

```
# Test 1: Agregar nuevo endpoint
agrega GET /books/:id/similar que retorna libros del mismo género
# Test 2: Crear migración
agrega campo 'publisher' a tabla books con migración
# Test 3: Debugging de test
el test de POST /books falla con 400. Diagnostica.
# Test 4: Onboarding simulation
soy nuevo. Quiero correrlo localmente y hacer mi primer cambio.
# Test 5: Cambio de convención
cambiamos rating de 1-5 a 1-10. ¿Qué debo actualizar?
```
Para cada test, verifica que Claude:
• Cargó las reglas correctas (no más, no menos)
• Consultó agent_docs/ cuando necesitó referencia
• Siguió convenciones sin recordatorios
• No usó información obsoleta

### Fase 6: Sistema de actualización

```
implementa sistema de actualización:
1. PR template con checklist
2. docs-check.sh script
3. Formaliza 2+ notas de /memory en reglas de .claude/rules/
```

### Entregables

1. .claude/rules/ con 4-5 archivos condicionales + 1 universal
2. agent_docs/ con 3 archivos de referencia (>100 líneas cada uno)
3. CLAUDE.md <35 líneas
4. .claude/settings.json con permisos granulares
5. Log de 5 tests de validación
6. Sistema de actualización (PR template + script)
```
7. REFACTORING_LOG.md:
```
• Qué moviste de CLAUDE.md a rules/
• Qué creaste en agent_docs/
• Qué formalizaste de /memory a reglas
• Antes/después: líneas de CLAUDE.md, tokens de contexto estimados

### Criterios de evaluación

**Rules/ profesional:** 5+ archivos con paths correctos
**Agent_docs/ útil:** 3 archivos >100 líneas de referencia real
**CLAUDE.md mínimo:** <35 líneas, sin duplicación
**Settings.json coherente:** Permisos que matchean el proyecto
**Carga condicional validada:** Claude carga reglas correctas en 5/5 tests
**Auto-memoria gestionada:** /memory revisado, insights formalizados
**Sistema de actualización:** PR template + script funcionando
**Sin duplicación:** Cada instrucción vive en exactamente un lugar

## 7. Conceptos clave para memorizar

### La arquitectura de 4 capas

```
CLAUDE.md           → QUÉ hacer, DÓNDE encontrar detalles (universal)
.claude/rules/      → CÓMO hacerlo, con carga condicional por paths
.claude/settings.json → Permisos y configuración determinista
Auto-memoria        → Lo que Claude aprende solo entre sesiones
agent_docs/         → Documentación de referencia bajo demanda
```

### Regla de oro de progressive disclosure

Cada instrucción debe estar en **exactamente un lugar**. Si está en dos, eventualmente se desincronizarán.

### Cuándo usar .claude/rules/ vs agent_docs/

**Rules/** → Convenciones que Claude debe SEGUIR (carga automática)
**agent_docs/** → Información que Claude debe CONSULTAR (carga bajo demanda)

### El ciclo de actualización

```
Bug → ¿Docs lo causaron? → SÍ → Actualizar regla (mismo PR)
                          → NO → Solo fix código
/memory → ¿Insight valioso? → SÍ → Formalizar en regla
                             → NO → Dejar en auto-memoria
```

## 8. Antipatrones a evitar

**Convenciones en CLAUDE.md que deberían estar en rules/** → Si solo aplica a un dominio, va en rules/ con
paths
**Permisos en CLAUDE.md o rules/** → Van en settings.json (determinista)
**Rules/ sin paths para todo** → Sin paths = siempre activo = mismo problema que CLAUDE.md largo
**Paths demasiado amplios** → paths: ["**"] anula el propósito de carga condicional
**Duplicación entre capas** → La misma instrucción en CLAUDE.md Y en rules/ → se desincronizarán
**agent_docs/ como dump sin estructura** → Sin organización, Claude no sabe qué leer
**Reglas con negaciones** → "NO hagas X" → "Hacer siempre Y"
**Auto-memoria sin gestionar** → /memory puede contener aprendizajes incorrectos
**No actualizar docs con el código** → Docs desactualizadas son peor que no tener docs

## 9. Recursos complementarios

### Documentación oficial

• Claude Code Memory — CLAUDE.md, rules/, auto-memoria
• Claude Code Settings — Sistema jerárquico de configuración
• Claude Code Security — Permisos y sandboxing

### Lecturas obligatorias

• Writing a Good CLAUDE.md — Progressive disclosure y ejemplos reales
• CLAUDE.md Best Practices: From Basic to Adaptive — Patrones avanzados
• Claude Code Configuration Blueprint — Guía completa para equipos

### Repositorios de referencia

• jarrodwatts/claude-code-config — Configuración de referencia completa
• alinaqi/claude-bootstrap — Bootstrapping con guardrails
• shinpr/ai-coding-project-boilerplate — Boilerplate con 10 agentes y estructura profesional
• repomirrorhq/repomirror — Documentación profunda de referencia

