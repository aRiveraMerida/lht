---
excerpt: "Los 5 proyectos capstone del curso con deployment real y evaluación completa."
---

# Proyectos Capstone: De cero a despliegue

**Posición en el curso:** Después de M13 (cierre del curso)
**Objetivo:** Construir 5 proyectos reales usando todo lo aprendido, cada uno desplegado en producción
**Formato:** Guía paso a paso con checkpoints verificables por fase

## Progresión de los proyectos

#
Tipo Proyecto Módulos que aplica Deploy Dificultad P1 Backend puro API de gestión de tareas M1-M6 Railway II P2 Herramienta interna Bot de monitoreo de precios M1-M7 (Ralph)
Railway + Cron III P3 Fullstack Plataforma de notas colaborativas M1-M8 (Multi-Claude)
Vercel + Railway III P4 Dashboard + integraciones Panel de métricas de equipo M1-M9 (Subagentes)
Vercel IIII P5 SaaS completo Plataforma de feedback de clientes M1-M13 (Todo)
Fly.io + Vercel IIIII
**Recomendación:** Hacer los proyectos en orden. Cada uno construye sobre habilidades del anterior.

## Proyecto 1: TaskFlow API

## API REST de gestión de tareas con autenticación

**Tipo:** Backend puro
**Módulos:** M1 (modelo mental), M2 (workflow), M3 (TDD), M4 (CLAUDE.md), M5 (skills), M6 (hooks)
**Deploy:** Railway
**Stack:** Express + SQLite + JWT + Vitest

### Briefing

Construir una API REST completa para gestión de tareas personales. Usuarios pueden registrarse, crear proyectos, y gestionar tareas dentro de cada proyecto. Incluye autenticación JWT, validación de datos, y documentación auto-generada.

### Fase 1: Setup con CLAUDE.md profesional (M1, M4)

**Objetivo:** Inicializar proyecto con configuración profesional de Claude Code.

**Pasos:**

```
1. Crear directorio y repo git
   mkdir taskflow-api &amp;&amp; cd taskflow-api &amp;&amp; git init
2. Ejecutar /init de Claude Code para generar CLAUDE.md base
   claude → /init
3. Refinar CLAUDE.md con WHAT/WHY/HOW (&lt;200 líneas):
   - WHAT: API REST para gestión de tareas
   - WHY: Express + SQLite + JWT + Vitest
   - HOW: Convenciones de código, estructura de directorios, patrones
4. Crear .claude/rules/ con reglas condicionales:
   - api-conventions.md (paths: src/routes/**)
   - database.md (paths: src/models/**, db/**)
   - testing.md (paths: tests/**)
5. Crear settings.json de proyecto con:
   - allowedTools apropiados
   - deny rules (no rm -rf, no force push)
6. Commit: "chore: initialize project with Claude Code config"
```

**Checkpoint 1:**

```
claude doctor pasa
```
CLAUDE.md tiene WHAT/WHY/HOW (<200 líneas)
.claude/rules/ tiene 3 archivos con paths:
settings.json tiene deny rules Commit inicial en git

### Fase 2: Modelos y base de datos con TDD (M3)

**Objetivo:** Crear modelos de datos con TDD estricto.

**Pasos:**

```
1. Instalar dependencias:
   npm install express better-sqlite3 jsonwebtoken bcryptjs joi
   npm install --save-dev vitest @vitest/coverage-v8 supertest
2. Pedir a Claude que implemente con TDD:
   "Implementa el modelo User con TDD.
    Campos: id (UUID), name, email (unique), password_hash, created_at.
    Tests primero en tests/models/user.test.js.
    Modelo en src/models/User.js.
    Usa better-sqlite3. Crea migración en db/migrations/001_users.sql."
3. Repetir para modelo Project:
   "Implementa modelo Project con TDD.
    Campos: id, name, description, user_id (FK), created_at.
    Sigue el mismo patrón que User."
4. Repetir para modelo Task:
   "Implementa modelo Task con TDD.
    Campos: id, title, description, status (pending/in_progress/done),
    priority (low/medium/high), project_id (FK), due_date, created_at."
5. Ejecutar: npm test -- --coverage
```

**Checkpoint 2:**

3 modelos con migraciones SQL Tests unitarios para cada modelo npm test pasa (15+ tests)
Coverage >80% en src/models/ Un commit por modelo (3 commits)

### Fase 3: Endpoints REST con validación (M2, M3)

**Objetivo:** CRUD completo para Users, Projects y Tasks.

**Pasos:**

```
1. Pedir a Claude (con Plan mode — Shift+Tab primero):
   "Planifica los endpoints REST para la API.
    Users: register, login
    Projects: CRUD (solo del usuario autenticado)
    Tasks: CRUD (solo del proyecto del usuario)
    Incluye validación con Joi."
2. Revisar el plan, ajustar si necesario, luego:
   "Implementa los endpoints según el plan. TDD:
    tests de integración con supertest primero."
3. Verificar que Claude ejecuta tests después de cada endpoint
4. Pedir documentación de API:
   "Genera agent_docs/api-reference.md con todos los endpoints,
    request/response examples, y status codes."
```

**Checkpoint 3:**

10+ endpoints funcionando Validación Joi en POST/PATCH Tests de integración (30+ tests)
```
npm test pasa
```
api-reference.md generado

### Fase 4: Autenticación JWT (M2, M6)

**Objetivo:** Registro, login, y protección de rutas con JWT.

**Pasos:**

```
1. "Implementa autenticación JWT:
    - POST /api/auth/register (email + password → user + token)
    - POST /api/auth/login (email + password → token)
    - Middleware authRequired que proteja rutas /api/v1/*
    - Token expira en 24h. Usa bcryptjs para passwords.
    TDD: tests de integración para cada caso (happy + error)."
2. Configurar hook PostToolUse para formateo (M6):
   En settings.json, hook que ejecute npx prettier --write
   en archivos .js modificados
3. Configurar hook PreToolUse para seguridad (M6):
   Denegar escritura a archivos .env
```

**Checkpoint 4:**

Register + login funcionando Middleware protege rutas Tests de auth (10+ tests)
Hooks de formateo y seguridad configurados No hay passwords en texto plano en ningún archivo

### Fase 5: Deploy a Railway (NUEVO)

**Objetivo:** La API funciona en producción.

**Pasos:**

```
1. Preparar para producción:
   "Prepara el proyecto para deploy:
    - Crear Procfile o start script
    - Variables de entorno (PORT, JWT_SECRET, DATABASE_URL)
    - Crear .env.example (sin valores reales)
    - Health endpoint GET /api/health
    - CORS configurado"
2. Instalar Railway CLI:
   npm install -g @railway/cli
   railway login
3. Crear proyecto en Railway:
   railway init
   railway up
4. Configurar variables de entorno:
   railway variables set JWT_SECRET=$(openssl rand -hex 32)
   railway variables set NODE_ENV=production
5. Verificar deploy:
   curl https://taskflow-api-production.up.railway.app/api/health
   # {"status": "ok"}
6. Probar endpoints en producción:
   curl -X POST https://...railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"secret123"}'
```

**Checkpoint 5 (FINAL):**

API funcionando en Railway con URL pública Health endpoint responde 200 Register + login funcionan en producción CRUD de tasks funciona con autenticación Variables de entorno configuradas (no hardcoded)
.env en .gitignore

### Entregable del Proyecto 1

1. **Repo en GitHub** con código completo
2. **URL de Railway** funcionando
3. **README.md** con: setup local, endpoints, deploy instructions
4. **Tests:** npm test con >80% coverage
5. **CLAUDE.md + .claude/** configuración profesional
6. **Git history** limpio (commits semánticos)

## Proyecto 2: PriceWatch Bot

## Bot de monitoreo de precios con alertas

**Tipo:** Herramienta interna (scraper + bot)
**Módulos:** M1-M7 (Ralph para ejecución autónoma)
**Deploy:** Railway (cron job)
**Tiempo estimado:** 10-14 horas
**Stack:** Node.js + cheerio + better-sqlite3 + nodemailer

### Briefing

Construir un bot que monitorea precios de productos en 2-3 sitios web, almacena histórico, detecta bajadas de precio, y envía alertas por email. Incluye CLI para gestionar productos monitoreados y un Ralph loop para scraping autónomo.

### Fase 1: Setup + CLI básica (M1, M4, M5)

**Pasos:**

```
1. Inicializar proyecto con CLAUDE.md profesional
2. Crear skill para web scraping en .claude/skills/scraper.md
3. Implementar CLI con commander:
   pricewatch add &lt;url&gt; --name "iPhone 15" --target-price 800
   pricewatch list
   pricewatch history &lt;product-id&gt;
   pricewatch check       # Scrape una vez
   pricewatch watch       # Loop continuo (Ralph)
4. Base de datos SQLite: products, price_checks, alerts
```

**Checkpoint 1:**

CLI funciona: add, list, history Base de datos con schema Skill de scraping en .claude/skills/ Tests unitarios para modelos

### Fase 2: Scraping engine (M3, M5)

**Pasos:**

```
1. "Implementa un scraper genérico con cheerio que:
    - Reciba URL y selectores CSS (configurables por producto)
    - Extraiga precio actual
    - Maneje errores (timeout, 403, precio no encontrado)
    - Soporte al menos 2 sitios (Amazon, MediaMarkt o similar)
    Tests: mock de HTML para cada sitio."
2. Integrar con comando 'check':
   pricewatch check
   # Checking 3 products...
   # iPhone 15: 899€ (target: 800€) — no alert
   # AirPods Pro: 199€ (target: 220€) — I BELOW TARGET!
```

**Checkpoint 2:**

Scraper funciona con 2 sitios Tests con HTML mockeado Comando check funciona Precios se guardan en DB con timestamp

### Fase 3: Sistema de alertas (M3, M6)

**Pasos:**

```
1. "Implementa sistema de alertas:
    - Detecta cuando precio cae por debajo del target
    - Detecta bajadas de &gt;10% vs último check
    - Envía email con nodemailer (SMTP configurable)
    - Log de alertas en DB (no enviar duplicadas)"
2. Configurar hooks (M6):
   - Hook PostToolUse: logging de cada scrape
   - Hook Stop: reporte de sesión
```

**Checkpoint 3:**

Alertas se generan correctamente Email se envía (o se simula en tests)
No hay alertas duplicadas Hooks configurados

### Fase 4: Ralph loop para monitoreo autónomo (M7)

**Pasos:**

```
1. Implementar modo watch con Ralph pattern:
   - Headless: claude -p "run pricewatch check" --max-turns 10
   - Loop bash que ejecuta check cada 30 minutos
   - PROGRESS.md con log de cada ejecución
   - Stop si hay error 3 veces consecutivas
   - Completion promise: "stop after 24 hours"
2. Script overnight:
   ./watch-overnight.sh --hours 8 --interval 30
```

**Checkpoint 4:**

pricewatch watch ejecuta loop autónomo PROGRESS.md se actualiza en cada check Stop automático después de timeout o errores Funciona 2+ horas sin intervención

### Fase 5: Deploy a Railway con cron (NUEVO)

**Pasos:**

```
1. Preparar para Railway:
   - Crear Dockerfile o Procfile
   - Variables de entorno (SMTP_*, CHECK_INTERVAL)
   - Persistir SQLite en volume
2. Deploy:
   railway init &amp;&amp; railway up
3. Configurar cron job en Railway:
   - Ejecutar check cada 30 minutos
   - O usar Railway's built-in cron
4. Verificar en producción:
   - Añadir producto via CLI local
   - Esperar 30 min
   - Verificar que el check se ejecutó (logs de Railway)
```

**Checkpoint 5 (FINAL):**

Bot corriendo en Railway con cron Checks automáticos cada 30 min Alertas email funcionando Dashboard de logs en Railway README con setup y configuración

## Proyecto 3: NoteHub

## Plataforma de notas colaborativas (fullstack)

**Tipo:** Fullstack (backend + frontend React)
**Módulos:** M1-M8 (Multi-Claude: backend + frontend en paralelo)
**Deploy:** Vercel (frontend) + Railway (backend)
**Tiempo estimado:** 14-20 horas
**Stack:** Express + SQLite + JWT (backend) · React + Tailwind (frontend)

### Briefing

Plataforma donde usuarios crean, editan y organizan notas en carpetas. Soporte markdown, búsqueda full-text, y compartir notas por link público. Backend API + frontend React, desarrollados en paralelo con Multi-Claude.

### Fase 1: Setup dual backend + frontend (M1, M4, M8)

**Pasos:**

```
1. Crear monorepo:
   mkdir notehub &amp;&amp; cd notehub
   mkdir backend frontend
   git init
2. Configurar CLAUDE.md raíz con:
   - Descripción del proyecto completo
   - Instrucciones para backend (Express) y frontend (React)
   - Convenciones compartidas (API contract)
3. Configurar .claude/rules/ con paths:
   - backend-conventions.md (paths: backend/**)
   - frontend-conventions.md (paths: frontend/**)
   - api-contract.md (paths: **) — endpoints compartidos
4. Setup backend (en backend/):
   npm init, instalar Express, SQLite, JWT, Vitest
5. Setup frontend (en frontend/):
   npm create vite@latest . -- --template react
   npm install tailwindcss axios react-router-dom
```

**Checkpoint 1:**

Monorepo con backend/ y frontend/ CLAUDE.md raíz con proyecto completo .claude/rules/ con paths condicionales Ambos proyectos inicializados

### Fase 2: Backend API con TDD (M3, M6)

**Pasos:**

```
1. Usar Claude Code en backend/:
   "Implementa la API completa de NoteHub con TDD:
   Modelos: User, Folder, Note
   Auth: register, login (JWT)
   Endpoints:
   - CRUD de folders (por usuario)
   - CRUD de notas (dentro de folder)
   - GET /api/notes/:id/public (sin auth, para notas compartidas)
   - GET /api/search?q=... (full-text search)
   - PATCH /api/notes/:id/share (toggle share_link)
   Tests de integración para cada endpoint."
2. Configurar hooks PostToolUse para formateo
```

**Checkpoint 2:**

Backend API completa (15+ endpoints)
Auth JWT funcionando Full-text search Tests pasando (40+ tests, >80% coverage)

### Fase 3: Frontend React (M8 — Multi-Claude)

**Objetivo:** Usar Multi-Claude para desarrollar frontend en paralelo.

**Pasos:**

```
1. Abrir segunda terminal (o usar claude-squad):
   # Terminal 1: Backend (ya completo, ejecutando en puerto 3000)
   cd backend &amp;&amp; npm start
   # Terminal 2: Frontend con Claude Code
   cd frontend &amp;&amp; claude -w
2. Pedir a Claude (frontend):
   "Construye el frontend de NoteHub con React + Tailwind:
   Páginas:
   - /login y /register
   - /dashboard (lista de folders + notas recientes)
   - /folder/:id (notas en folder)
   - /note/:id (editor markdown con preview)
   - /note/:id/public (vista pública, sin auth)
   - /search (búsqueda)
   Componentes: Sidebar, NoteEditor, MarkdownPreview, SearchBar
   State: React Context para auth (token en localStorage)
   API: axios calls a http://localhost:3000/api/
   Usa Tailwind para styling. Dark mode opcional."
3. Mientras Claude trabaja en frontend, en Terminal 1:
   Usar @reviewer para revisar el backend (M9 preview)
```

**Checkpoint 3:**

Frontend React funcional con todas las páginas Conectado al backend API Auth flow completo (register → login → dashboard)
Editor markdown con preview Búsqueda funcional

### Fase 4: Pulido y testing E2E (M3)

**Pasos:**

```
1. "Implementa tests E2E básicos con Vitest:
    - Flow completo: register → login → crear folder → crear nota → buscar
    - Verificar que nota compartida es accesible sin auth"
2. "Revisa responsive design: la app debe funcionar en móvil.
    Usa Tailwind breakpoints."
3. "Añade error handling global:
    - Frontend: toast notifications para errores de API
    - Backend: error middleware centralizado"
```

**Checkpoint 4:**

Tests E2E pasando Responsive en móvil Error handling completo

### Fase 5: Deploy dual Vercel + Railway (NUEVO)

**Pasos:**

```
1. Deploy backend a Railway:
   cd backend
   railway init &amp;&amp; railway up
   railway variables set JWT_SECRET=... NODE_ENV=production
   # Obtener URL: https://notehub-backend.up.railway.app
2. Deploy frontend a Vercel:
   cd frontend
   # Configurar variable de entorno:
   # VITE_API_URL=https://notehub-backend.up.railway.app/api
   npx vercel
   # O conectar repo GitHub → auto-deploy
3. Configurar CORS en backend:
   # Permitir origin del frontend Vercel
4. Verificar producción:
   # Abrir URL de Vercel
   # Register → login → crear nota → compartir → abrir link público
```

**Checkpoint 5 (FINAL):**

Frontend en Vercel con URL pública Backend en Railway con URL pública Flow completo funciona en producción Notas compartidas accesibles por link CORS configurado correctamente

## Proyecto 4: TeamPulse Dashboard

## Panel de métricas de equipo con integraciones

**Tipo:** Dashboard + integraciones
**Módulos:** M1-M9 (Subagentes para cada integración)
**Deploy:** Vercel (app completa con API routes)
**Tiempo estimado:** 16-22 horas
**Stack:** Next.js + Tailwind + Chart.js + APIs externas

### Briefing

Dashboard interno que agrega métricas de un equipo de desarrollo desde múltiples fuentes: GitHub (PRs, issues), tiempo de respuesta de APIs (health checks), y métricas custom (ingresadas manualmente). Usa subagentes para cada integración.

### Fase 1: Setup Next.js con subagentes (M1, M4, M9)

**Pasos:**

```
1. Crear proyecto Next.js:
   npx create-next-app@latest teampulse --typescript --tailwind --app
   cd teampulse &amp;&amp; git init
2. Configurar CLAUDE.md para Next.js:
   - App Router (no Pages Router)
   - API Routes en app/api/
   - Server Components por defecto
   - Convenciones de naming
3. Crear .claude/agents/ con subagentes especializados:
   - github-agent.md (allowed-tools: Read, Bash(gh *))
     "Fetch GitHub metrics using gh CLI"
   - health-agent.md (allowed-tools: Read, Bash(curl *))
     "Check health of configured endpoints"
   - chart-agent.md (allowed-tools: Read, Write)
     "Generate Chart.js configurations from data"
   - data-agent.md (allowed-tools: Read, Write, Bash)
     "Process and aggregate metrics data"
```

**Checkpoint 1:**

Next.js app funcional 4 subagentes en .claude/agents/ CLAUDE.md con convenciones Next.js Settings con TypeScript configurado

### Fase 2: GitHub integration (M9 — subagentes)

**Pasos:**

```
1. Usar @github-agent:
   "@github-agent implementa la integración con GitHub:
    - API Route: GET /api/metrics/github
    - Fetch: PRs abiertos, PRs mergeados (últimos 30 días),
      issues abiertos, tiempo promedio de merge
    - Usa GitHub API (Octokit) o gh CLI
    - Cache de 5 minutos (no llamar en cada request)
    - Config: GITHUB_TOKEN + GITHUB_REPO en env vars"
2. Crear componente GithubMetrics con Chart.js:
   "@chart-agent crea componente React que muestra:
    - Bar chart: PRs por semana (últimas 8 semanas)
    - Stat cards: PRs abiertos, issues, avg merge time
    - Usa Chart.js con react-chartjs-2"
```

**Checkpoint 2:**

API route de GitHub funciona Chart de PRs por semana Stat cards con métricas Cache implementado Tests para la API route

### Fase 3: Health checks + métricas custom (M9)

**Pasos:**

```
1. "@health-agent implementa health checker:
    - API Route: GET /api/metrics/health
    - Config: lista de endpoints en JSON
    - Check cada endpoint con timeout 5s
    - Almacenar resultado en SQLite (status, response_time, timestamp)
    - Histórico de últimas 24h"
2. "@data-agent implementa métricas custom:
    - API Route: CRUD /api/metrics/custom
    - Métricas manuales: nombre, valor, categoría, fecha
    - Útil para KPIs que no vienen de APIs"
3. Componentes de dashboard para cada fuente
```

**Checkpoint 3:**

Health checks funcionando con N endpoints Histórico de disponibilidad CRUD de métricas custom Dashboard muestra las 3 fuentes

### Fase 4: Dashboard unificado (M8, M9)

**Pasos:**

```
1. "Crea la página principal del dashboard que integre:
    - Sección GitHub (PRs, issues, chart)
    - Sección Health (status de servicios, uptime %)
    - Sección Custom (KPIs configurables)
    - Auto-refresh cada 60 segundos
    - Responsive: funciona en desktop y tablet
    - Dark mode con toggle"
2. Usar Multi-Claude para pulido:
   # Terminal 1: Claude mejora UI/UX
   # Terminal 2: Claude añade tests
```

**Checkpoint 4:**

Dashboard unificado con 3 secciones Auto-refresh funciona Responsive Dark mode Tests pasando

### Fase 5: Deploy a Vercel (NUEVO)

**Pasos:**

```
1. Configurar para Vercel:
   - next.config.js con output apropiado
   - Variables de entorno: GITHUB_TOKEN, GITHUB_REPO, ENDPOINTS_CONFIG
2. Deploy:
   npx vercel
   # O conectar repo GitHub → auto-deploy en cada push
3. Configurar variables en Vercel dashboard:
   vercel env add GITHUB_TOKEN
   vercel env add GITHUB_REPO
4. Verificar:
   # Abrir URL de Vercel
   # Dashboard carga métricas de GitHub real
   # Health checks ejecutan contra endpoints reales
```

**Checkpoint 5 (FINAL):**

Dashboard en Vercel con URL pública GitHub metrics reales cargando Health checks ejecutándose Auto-refresh funcionando Dark mode en producción

## Proyecto 5: FeedbackLoop SaaS

## Plataforma multi-tenant de feedback de clientes

**Tipo:** SaaS completo
**Módulos:** M1-M13 (todos los módulos del curso)
**Deploy:** Fly.io (backend) + Vercel (frontend)
**Tiempo estimado:** 24-32 horas
**Stack:** Express + PostgreSQL + JWT + React + Tailwind + Stripe (test mode)

### Briefing

Plataforma SaaS donde empresas (tenants) crean formularios de feedback, los embeben en sus productos, y visualizan respuestas con analytics. Incluye: multi-tenancy, auth con roles, billing con Stripe (test mode), API pública con API keys, dashboard de analytics, y CI/CD completo.
Este proyecto usa TODOS los módulos del curso.

### Fase 1: Arquitectura y setup enterprise (M1, M4, M5, M6)

**Pasos:**

```
1. Crear monorepo:
   mkdir feedbackloop &amp;&amp; cd feedbackloop
   mkdir backend frontend shared
   git init
2. CLAUDE.md profesional (&lt;200 líneas):
   - WHAT: SaaS multi-tenant de feedback
   - WHY: Express + PostgreSQL + React + Stripe
   - HOW: Convenciones, patrones, seguridad
3. .claude/rules/ con paths para:
   - api-conventions.md (paths: backend/src/routes/**)
   - database.md (paths: backend/src/models/**, backend/db/**)
   - multi-tenancy.md (paths: backend/src/middleware/tenant**)
   - frontend.md (paths: frontend/**)
   - security.md (paths: **/auth/**, **/middleware/**)
4. .claude/skills/ con:
   - tdd.md (workflow de TDD)
   - multi-tenant.md (patrón de tenant isolation)
5. Hooks en settings.json:
   - PostToolUse: formateo con Prettier
   - PreToolUse: bloquear escritura a .env, secrets
   - Stop: reporte de sesión
6. Setup backend:
   npm init, Express, pg (PostgreSQL), Vitest
7. Setup frontend:
   npm create vite@latest frontend -- --template react-ts
```

**Checkpoint 1:**

Monorepo con configuración completa CLAUDE.md + rules/ + skills/ + hooks PostgreSQL local funcionando (o Docker)
Ambos proyectos inicializados

### Fase 2: Multi-tenancy + Auth (M3, M9 — subagentes)

**Pasos:**

```
1. Crear subagentes en .claude/agents/:
   - db-architect.md (Read, Write db/migrations)
   - auth-specialist.md (Read, Write src/auth/**)
   - tenant-specialist.md (Read, Write src/middleware/tenant**)
2. "@db-architect diseña el schema multi-tenant:
    Tablas: tenants, users (belong to tenant), api_keys,
    forms, form_fields, responses, response_values
    Tenant isolation: tenant_id en cada tabla
    Migraciones SQL numeradas"
3. "@auth-specialist implementa auth con TDD:
    - Register (crea tenant + primer user como admin)
    - Login (JWT con tenant_id en payload)
    - Invite user (admin invita a su tenant)
    - Roles: admin, member, viewer
    - Middleware: authRequired + tenantIsolation"
4. "@tenant-specialist implementa middleware:
    - Extrae tenant_id del JWT
    - Inyecta en todas las queries
    - Verifica que usuario pertenece al tenant
    - Rate limiting por tenant"
```

**Checkpoint 2:**

Schema multi-tenant con migraciones Auth completa con roles Tenant isolation verificada con tests 50+ tests pasando

### Fase 3: Core features — Forms + Responses (M7 — Ralph)

**Pasos:**

```
1. Usar Ralph loop para implementar features en secuencia:
   "Implementa estas features usando TDD. Después de cada feature,
    ejecuta tests, actualiza PROGRESS.md, y continúa:
    Feature 1: CRUD de formularios (Form)
    - POST/GET/PATCH/DELETE /api/v1/forms
    - Form tiene: title, description, fields[]
    - Fields: text, rating (1-5), choice, textarea
    Feature 2: API pública de respuestas
    - POST /api/v1/public/forms/:formId/responses
    - Autenticado con API key (no JWT)
    - Validación de campos según field type
    - Rate limiting por API key
    Feature 3: Dashboard de respuestas
    - GET /api/v1/forms/:id/responses (paginado)
    - GET /api/v1/forms/:id/analytics
      (avg rating, response count, distribution)
    Feature 4: Embed widget
    - GET /api/v1/public/forms/:id/embed
    - Retorna HTML/JS snippet para embeber en cualquier sitio"
2. Ejecutar como Ralph headless:
   claude -p "$(cat features.md)" --max-turns 50 -w
```

**Checkpoint 3:**

CRUD de formularios API pública con API keys Analytics de respuestas Embed widget generando HTML PROGRESS.md con log de features 80+ tests pasando

### Fase 4: Billing con Stripe (M3)

**Pasos:**

```
1. "Implementa integración con Stripe (test mode):
    - Planes: Free (100 responses/mes), Pro (unlimited, $29/mes)
    - POST /api/v1/billing/checkout → Stripe Checkout session
    - Webhook: /api/v1/webhooks/stripe (handle checkout.completed)
    - Middleware: checkQuota (bloquear si Free + &gt;100 responses)
    - Modelo: subscriptions (tenant_id, plan, stripe_id, status)
    Usar Stripe test keys. No manejar dinero real.
    Tests con Stripe mock."
2. Configurar Stripe CLI para testing local:
   stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe
```

**Checkpoint 4:**

Stripe Checkout funciona (test mode)
Webhook procesa pagos Quota enforcement (Free limitado a 100)
Tests con Stripe mock

### Fase 5: Frontend React (M8 — Multi-Claude)

**Pasos:**

```
1. Usar claude-squad o 2 terminales con -w:
   # Agent 1: Páginas de auth + dashboard
   # Agent 2: Form builder + analytics
2. Páginas necesarias:
   - /login, /register (crea tenant)
   - /dashboard (overview: forms, responses, plan)
   - /forms (lista) → /forms/:id (responses + analytics)
   - /forms/new (form builder drag &amp; drop simple)
   - /settings (API keys, invite members, billing)
   - /forms/:id/embed (instrucciones de embed)
3. Componentes de analytics:
   - Chart de responses por día (últimos 30 días)
   - Distribution de ratings
   - Table de responses con filtros
```

**Checkpoint 5:**

Frontend completo con todas las páginas Form builder funcional Analytics charts Billing page con link a Stripe Responsive

### Fase 6: Evals + CI/CD (M11, M12, M13)

**Pasos:**

```
1. Crear eval suite (M11):
   - 5 evals: CRUD forms, auth flow, tenant isolation,
     billing quota, API key validation
   - Graders code-based
   - pass@3
2. Configurar CI/CD (M12-M13):
   - .github/workflows/tests.yml (tests en cada PR)
   - .github/workflows/claude-review.yml (code review)
   - .github/workflows/security-review.yml
   - RTK en todos los workflows
3. Configurar claude-code-action para issue triage
```

**Checkpoint 6:**

5 evals pasando con pass@3 CI/CD pipeline funcional Code review automático en PRs Security review configurado RTK instalado en CI

### Fase 7: Deploy Fly.io + Vercel (NUEVO)

**Pasos:**

```
1. Backend a Fly.io:
   cd backend
   fly launch
   fly secrets set DATABASE_URL=... JWT_SECRET=... STRIPE_KEY=...
   fly deploy
   # URL: https://feedbackloop-api.fly.dev
2. Base de datos PostgreSQL en Fly.io:
   fly postgres create --name feedbackloop-db
   fly postgres attach feedbackloop-db
3. Frontend a Vercel:
   cd frontend
   vercel
   # Configurar VITE_API_URL=https://feedbackloop-api.fly.dev/api
4. Stripe webhook en producción:
   # Dashboard Stripe → Webhooks → Add endpoint
   # URL: https://feedbackloop-api.fly.dev/api/v1/webhooks/stripe
5. Verificar producción completa:
   - Register → crea tenant
   - Crear formulario → obtener embed code
   - Pegar embed en HTML local → enviar response
   - Ver response en dashboard
   - Upgrade a Pro (Stripe test card: 4242 4242 4242 4242)
```

**Checkpoint 7 (FINAL):**

Backend en Fly.io con PostgreSQL Frontend en Vercel Flow completo funciona en producción Stripe billing funciona (test mode)
Embed widget funciona desde sitio externo CI/CD ejecutándose en cada push Multi-tenancy verificada (2 tenants no ven datos del otro)

### Entregable del Proyecto 5

1. **Monorepo en GitHub** con código completo
2. **URLs de producción:** Fly.io (backend) + Vercel (frontend)
3. **Demo grabada** (5 min): register → crear form → embed → ver responses → billing
4. **README.md** completo: setup, deploy, arquitectura
5. **CLAUDE.md + .claude/** configuración enterprise
6. **CI/CD** pipeline funcional con code review + security + evals
7. **Tests:** >80% coverage backend, evals pasando
8. **Post-mortem:** Documento con:
• Horas reales vs estimadas
• Qué módulos del curso usaste más
• Dónde Claude Code fue más efectivo
• Dónde tuviste que intervenir manualmente
• Lecciones aprendidas

## Resumen de los 5 proyectos

P1: TaskFlow P2: PriceWatch P3: NoteHub P4: TeamPulse P5:
FeedbackLoop

**Tipo**

Backend API Bot/scraper Fullstack Dashboard SaaS

**Módulos**

M1-M6 M1-M7 M1-M8 M1-M9 M1-M13

**Deploy**

Railway Railway+cron Vercel+Railway Vercel Fly.io+Vercel

**DB**

SQLite SQLite SQLite SQLite PostgreSQL

**Auth**

JWT N/A JWT GitHub token JWT + roles

**Billing**

No No No No Stripe

**CI/CD**

No No No No Completo

**Horas**

8-12 10-14 14-20 16-22 24-32

**Dificultad**

II III III IIII IIIII
**Total estimado:** 72-100 horas (los 5 proyectos)
**Mínimo recomendado:** Hacer al menos P1 + P3 + P5 (backend + fullstack + SaaS) para cubrir toda la gama del
curso.
