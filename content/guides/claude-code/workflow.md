---
title: "Módulo 2 — Workflow EXPLORE → PLAN → CODE → COMMIT"
date: "2026-04-18"
description: "El workflow profesional de cuatro fases para trabajar con Claude Code en proyectos reales."
excerpt: "Dependencias: Módulo 1 (modelo mental + CLAUDE.md + settings.json configurados) Modalidad: 100% práctica con ejercicios ejecutables Actualizado: Marzo 2026 Al finalizar este…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Módulo 2: El workflow EXPLORE → PLAN →

# CODE → COMMIT

**Duración:** 5-6 horas
**Nivel:** Principiante-Intermedio
**Dependencias:** Módulo 1 (modelo mental + CLAUDE.md + settings.json configurados)
**Modalidad:** 100% práctica con ejercicios ejecutables
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Aplicar el workflow de 4 fases** en implementaciones reales de features
2. **Activar Plan Mode con Shift+Tab** y dominar la iteración sobre planes
3. **Controlar el esfuerzo de razonamiento** con /effort y extended thinking (Option+T)
4. **Gestionar contexto** usando /context (grid visual), /compact focus, auto-compactación y /clear
5. **Usar @referencias** para archivos, rangos de línea y output de terminal
6. **Dominar patrones de interrupción y recuperación**: Escape, doble-Escape, /rewind, y checkpointing
automático
7. **Enviar tareas a background** con Ctrl+B para trabajar en paralelo
8. **Iterar sin degradación** manteniendo calidad de código constante en sesiones largas

## 1. El workflow de 4 fases: Fundamentos

### 1.1 Por qué necesitas un workflow estructurado

**Problema sin workflow:**

```
Tú: "Agrega autenticación OAuth al proyecto"
Claude: [genera 500 líneas de código directamente]
Resultado: Código que "funciona" pero no se integra con tu arquitectura
```

**Qué salió mal:**

• Claude no exploró el contexto actual
• No planificó la integración con código existente
• Generó código sin verificarlo
• No creó commits semánticos
**Solución** → **Workflow de 4 fases:**
```
EXPLORE  →  Entender contexto actual antes de tocar nada
PLAN     →  Diseñar solución con Plan Mode (Shift+Tab)
CODE     →  Implementar incrementalmente con feedback loops
COMMIT   →  Integrar con git de forma atómica y semántica
```
"La mayoría de mis sesiones empiezan en Plan mode. Voy y vengo con Claude hasta que me gusta el plan.
Desde ahí, cambio a auto-accept edits y Claude generalmente lo clava en un solo intento." — Boris Cherny, creador de Claude Code

### 1.2 Fase 1: EXPLORE (Exploración del contexto)

**Objetivo:** Que Claude comprenda el estado actual antes de modificar nada.

**Patrón de comando con @referencias:**

```
antes de implementar [FEATURE], explora el proyecto y dame:
1. Estructura actual relevante para esta feature
2. Patrones existentes en @src/ que debo seguir
3. Dependencias o módulos que podría reutilizar
4. Posibles conflictos o breaking changes
```
Las **@referencias** hacen la exploración más precisa que describir archivos con texto:
```
# Sin @referencia (Claude tiene que adivinar qué archivo)
"mira cómo se hace la autenticación actual"
# Con @referencia (Claude sabe exactamente dónde mirar)
"analiza @src/middleware/auth.js y @src/utils/jwt.js para
entender el sistema de auth actual"
```

**Tipos de @referencia disponibles:**

Sintaxis Qué referencia Ejemplo Un archivo específico
```
@archivo
@src/auth.ts
```
Rango de líneas
```
@archivo:L1-L2
@src/auth.ts:45-60
```
Directorio completo
```
@directorio/
@src/middleware/
```
Output de un terminal
```
@terminal:nombre
@terminal:test-output
```

**Ejemplo real completo:**

```
antes de agregar autenticación OAuth, explora:
1. Lee @src/middleware/auth.js — ¿qué sistema de auth existe?
2. Lee @src/app.js — ¿qué patrón de middleware se usa?
3. Lee @.env.example — ¿hay variables de entorno configuradas?
4. Busca en @package.json — ¿qué librerías de auth ya están instaladas?
```

**Output esperado de Claude:**

```
Análisis del proyecto:
1. Auth existente: @src/middleware/auth.js
   - Usa JWT con jsonwebtoken@9.0.0
   - Middleware pattern: (req, res, next) =&gt; {...}
2. Patrones de middleware (@src/app.js):
   - Centralizados en src/middleware/
   - Registrados con app.use() ANTES de rutas
3. Reutilizable:
   - @src/utils/jwt.js tiene sign/verify helpers
   - @.env.example tiene JWT_SECRET placeholder
4. Posibles conflictos:
   - OAuth requiere session storage → actualmente stateless
   - Necesitarás agregar express-session o similar
```

**Criterio de calidad de la exploración:**

• Si Claude menciona "no encontré X" → contexto valioso, significa que el codebase no lo tiene
• Si Claude dice "asumo que..." → exploración insuficiente, pide que explore más
• Si Claude lista patrones existentes → puedes pedirle que los siga en la implementación

**Tip avanzado: Referenciar patrones existentes es más efectivo que describir:**

```
# I Describir lo que quieres (ambiguo)
"crea una nueva ruta API para proyectos con validación y middleware"
# I Apuntar al patrón existente (preciso)
"crea una nueva ruta API para /api/projects.
Sigue exactamente el mismo patrón que @src/routes/teams.js"
```
Claude reproducirá la estructura, middleware chain, error handling y estilo del archivo referenciado.

### 1.3 Fase 2: PLAN (Planificación con Plan Mode)

**La transformación crítica según Matt Pocock:**

"Claude Code con y sin plan mode es día y noche. Sin plan mode: código tan malo que es una liability. Con plan mode: básicamente tan bueno como yo lo escribiría."

**Cómo activar Plan Mode:**

Método Cómo Cuándo usar

**Shift+Tab**

En el REPL interactivo
**El más usado** — toggle rápido

**Prompt directo**

"Planifica antes de implementar, no escribas código aún"
Cuando quieres ser explícito
**Shift+Tab** es el método estándar. Lo pulsas antes de escribir tu prompt y Claude entra en Plan Mode: describe qué
hará paso a paso sin ejecutar nada. Tú revisas, iteras, y cuando estás satisfecho con el plan, cambias a modo normal para ejecutar.
```
# 1. Activa Plan Mode con Shift+Tab
# 2. Escribe tu instrucción:
implementa autenticación OAuth siguiendo los patrones
encontrados en la exploración
# 3. Claude responde con un plan detallado (NO escribe código)
# 4. Iteras:
"el plan no menciona backward compatibility con JWT,
agrégalo como paso 5"
# 5. Claude actualiza el plan
# 6. Cuando estés satisfecho, sales de Plan Mode (Shift+Tab de nuevo)
# 7. Claude ejecuta el plan aprobado
```

**Estructura de un buen plan:**

```
Plan para OAuth Integration
============================
1. Setup de dependencias
   - Instalar passport, passport-google-oauth20
   - Agregar express-session para session storage
2. Configuración
   - Agregar vars a .env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
   - Crear src/config/oauth.js con estrategia Google
3. Middleware chain
   - src/middleware/session.js → configurar express-session
   - src/middleware/passport.js → inicializar passport
   - Integrar en app.js ANTES de rutas protegidas
4. Rutas OAuth
   - GET /auth/google → iniciar flujo
   - GET /auth/google/callback → callback de Google
5. Integración con auth existente
   - Modificar @src/middleware/auth.js para aceptar session O JWT
   - Mantener backward compatibility
6. Tests
   - Mock de Google OAuth con nock
   - Tests de integración de flujo completo
```

**Red flags de un plan malo:**

• I "Paso 1: Implementar OAuth" (demasiado genérico — ¿qué archivos? ¿qué librerías?)
• I No menciona integración con código existente
• I No especifica orden de implementación
• I No incluye estrategia de testing
• I No referencia archivos existentes que se modificarán

**Red flags de un plan bueno:**

• I Cada paso nombra archivos específicos
• I Especifica dependencias entre pasos ("paso 3 requiere paso 2")
• I Incluye verificación después de cada paso
• I Referencia patrones existentes del codebase

### 1.4 El sistema de esfuerzo: /effort y extended thinking

Claude Code tiene un sistema graduado de profundidad de razonamiento. No son flags CLI — son controles interactivos:
**Control principal:** /effort
Nivel Comando Efecto Cuándo usar
**Low**
Razonamiento mínimo,
```
/effort low
```
respuestas rápidas Renombrar variables, formateo, queries simples
**Medium**
Balance estándar Features estándar,
```
/effort medium
```
refactors simples
**High** G
Razonamiento profundo,
```
/effort high
```
más tokens de thinking Arquitectura compleja, debugging difícil, migraciones

**Auto**

Claude decide según la
```
/effort auto
```
complejidad de la tarea

**Recomendado como**

**default**

```
# Configurar al inicio de sesión
/effort auto
# Escalar para tarea compleja
/effort high
refactoriza la capa de datos para soportar multi-tenancy
sin romper APIs existentes
# Bajar para tarea mecánica
/effort low
renombra userController a usersController en todos los imports
```

**Control complementario: Extended Thinking**

Atajo Función
**Option+T** (macOS) / **Alt+T** (Win/Linux)
Toggle extended thinking on/off

**Ctrl+O**

Modo verbose — ver el proceso de thinking de Claude Extended thinking permite a Claude "pensar en voz alta" antes de responder. Está activado por defecto. Con Ctrl+O puedes ver ESE pensamiento en tiempo real — útil para entender por qué Claude toma ciertas decisiones.

**Keywords en prompts que escalan profundidad:**

Además de /effort, estas keywords en tus prompts aumentan la profundidad del razonamiento:
```
# Escala creciente de profundidad
"implementa validación de email"          → razonamiento estándar
"think: implementa validación de email"    → razonamiento elevado
"think hard: implementa validación de email" → razonamiento profundo
"think harder: implementa validación..."   → razonamiento muy profundo
"ultra think: implementa validación..."    → máxima profundidad
```

**Variable de entorno para CI/CD:**

```
# Limitar tokens de thinking en pipelines automatizados
MAX_THINKING_TOKENS=10000 claude -p "analyze this codebase"
```
**Adaptive thinking (Opus 4.6):** El modelo determina autónomamente cuándo y cuánto razonar. Con Opus 4.6 y
/effort auto, generalmente no necesitas escalar manualmente.

**Regla práctica:**

• Usa /effort auto como default
• Escala a /effort high + keywords para decisiones arquitectónicas
• Baja a /effort low para tareas mecánicas (formateo, renombrado masivo)
• Los niveles bajos reducen significativamente el costo en tokens de thinking

### 1.5 Fase 3: CODE (Implementación incremental)

**Antipatrón:** Pedir a Claude "implementa todo el plan de una vez"
**Patrón correcto:** Implementación incremental con verificación en cada paso
```
# Paso 1: Dependencias
implementa solo el paso 1 del plan: setup de dependencias
# Claude ejecuta, tú validas:
# npm install funciona? → sí → continuar
# Paso 2: Configuración
ahora implementa el paso 2: archivos de configuración
# Claude ejecuta, tú validas:
# Archivos creados correctamente? → sí → continuar
# Paso 3: Middleware
implementa el paso 3: middleware chain
# Claude ejecuta, tú validas:
# npm test pasa? → sí → continuar
# Si no pasa → Claude debuggea antes de seguir
```

**El patrón de auto-verificación (el más importante del módulo):**

```
implementa el middleware de session Y DESPUÉS verifica que:
1. npm test pase
2. El servidor arranque sin errores
3. /auth/google retorne 302 redirect
Si alguna verificación falla, diagnostica y corrige
ANTES de continuar al siguiente paso.
```
Esto convierte a Claude en un agente que se auto-corrige. Sin auto-verificación, Claude genera código y sigue adelante sin saber si funciona. CON auto-verificación, Claude detecta y corrige errores inmediatamente.
"Dar a Claude forma de verificar su trabajo es probablemente lo más importante que puedes hacer. Multiplica la calidad 2-3x." — Boris Cherny, creador de Claude Code

**Ventajas de implementación incremental:**

1. **Detectas errores temprano** → Menos código que debuggear
2. **Claude mantiene contexto fresco** → Cada paso informa el siguiente
3. **Puedes intervenir** → Corriges dirección antes de mucho código malo
4. **Git commits granulares** → Historia limpia y reversible
5. **Checkpoints automáticos** → Claude guarda estado antes de cada cambio, puedes revertir

### 1.6 Fase 4: COMMIT (Integración semántica)

**El problema de "commit todo junto":**

```
# I Antipatrón
git add .
git commit -m "agregué oauth"
# Resultado: 47 archivos, imposible review, rollback es todo o nada
```

**Patrón correcto: Commits atómicos**

```
revisa los cambios actuales (git diff) y propón una estrategia
de commits siguiendo Conventional Commits.
Cada commit debe:
1. Ser deployable independientemente
2. Pasar tests por sí solo
3. Tener scope claro (deps, config, middleware, routes, tests)
```

**Ejemplo de estrategia generada:**

```
Propuesta de commits:
1. feat(deps): add OAuth dependencies
   - package.json, package-lock.json
2. feat(config): add OAuth configuration
   - .env.example, src/config/oauth.js
3. feat(middleware): add session and passport middleware
   - src/middleware/session.js, src/middleware/passport.js
   - src/app.js (integration)
4. feat(auth): implement OAuth routes
   - src/routes/auth.js
5. refactor(auth): support session and JWT auth
   - src/middleware/auth.js (backward compatible)
6. test(oauth): add OAuth integration tests
   - tests/integration/oauth.test.js
```
**Slash command para automatizar:** Boris Cherny usa /commit-push-pr "docenas de veces al día". Aprenderás a
crear custom slash commands en Módulo 6.

## 2. Las herramientas de gestión de sesión

### 2.1 Monitoreo de contexto: /context y /cost

**Problema:** Claude Code tiene ventana de hasta 1M tokens (Opus 4.6 / Sonnet 4.6), pero la calidad se degrada mucho
antes de llenarla. Monitorear proactivamente es crítico.

**Herramientas de monitoreo:**

Comando Qué muestra Cuándo usar
**Grid coloreado** de uso de contexto
Monitoreo visual rápido — el más útil
```
/context
```
Estadísticas detalladas de tokens
```
/cost
```
consumidos Análisis de gasto económico Uso del plan de suscripción
```
/usage
```
(Pro/Max)
Tracking de límites mensuales
```
# Visualización rápida del contexto
/context
# Output: grid coloreado donde verde = libre, amarillo = usándose, rojo = lleno
```

**Umbrales de acción:**

Uso de contexto Estado Acción 0-50% Normal Trabajar libremente 50-70% Atención Usar /compact con foco selectivo 70-90% Crítico /clear obligatorio + reinicializar 90%+ Emergencia /clear inmediato, calidad ya degradada

### 2.2 Compactación inteligente: /compact

**¿Qué hace** /compact**?**
• Comprime historial de conversación
• Mantiene información crítica, descarta detalles
• CLAUDE.md sobrevive intacto (se relee desde disco)
**Novedad:** /compact **con foco selectivo**
```
# Compact genérico (Claude decide qué preservar)
/compact
# Compact con foco (TÚ decides qué preservar)
/compact focus on auth implementation and test strategy
# Compact preservando múltiples temas
/compact focus on database schema, API design, pending tasks
```
El foco selectivo es significativamente más efectivo que el compact genérico. Claude preserva contexto sobre los temas que especificas y descarta el resto.
**Cuándo usar** /compact **vs** /clear**:**
Situación Comando Razón Debugging largo, muchos intentos Mantiene historial de qué se probó
```
/compact focus on bug diagnosis
```
Contexto al 55%, misma feature Reduce sin perder hilo
```
/compact focus on current feature
```
Cambio completo de feature Contexto anterior irrelevante
```
/clear
```
Contexto al 80%+ /compact puede no reducir suficiente
```
/clear
```
Mitad de refactor complejo
```
/compact focus on refactor plan,
```
Necesitas contexto de decisiones
```
decisions
```

### 2.3 Limpieza total: /clear

**¿Qué hace** /clear**?**
• Borra historial de conversación completo
• MANTIENE archivos editados en disco
• MANTIENE CLAUDE.md (se relee automáticamente)
• MANTIENE auto-memoria (persiste entre sesiones)
• Resetea token counter a 0
**Patrón de** /clear **efectivo en 3 pasos:**
```
# PASO 1: Antes de /clear — documenta estado
resume en 4 bullets qué hemos logrado y qué falta
# Claude responde:
# Completado:
# - Middleware de API Key auth implementado
# - Tests de integración pasando (12/12)
# - 3/6 commits realizados
# Pendiente:
# - Endpoints de webhooks
# - Tests de retry logic
# PASO 2: Ejecuta /clear
/clear
# PASO 3: Reinicializa con contexto mínimo suficiente
lee CLAUDE.md y los últimos 5 commits (git log --oneline -5).
Estamos implementando webhooks — los modelos, service y worker
ya están completos y commiteados. Siguiente paso: implementar
endpoints REST para webhooks (CRUD + logs).
```
**Auto-compactación:** Claude Code activa compactación automáticamente cuando el contexto se acerca a los límites.
En la mayoría de sesiones, la auto-compactación es suficiente y no necesitas /compact ni /clear manualmente. Pero en sesiones largas (2+ horas), el monitoreo proactivo sigue siendo importante.

### 2.4 Checkpointing y recuperación: /rewind y doble-Escape

Claude Code hace **checkpointing automático** antes de cada cambio en archivos. Esto te da una red de seguridad:
Método de recuperación Cómo Qué hace Slash command Revierte archivos al checkpoint
```
/rewind
```
anterior

**Doble-Escape**

Escape + Escape rápido Revierte al checkpoint Y vuelve al chat Comando git Revertir via git (si hubo commit)
```
git checkout
# Claude editó 3 archivos y rompió algo
# Opción 1: /rewind
/rewind
# Los archivos vuelven al estado anterior a la última edición
# Opción 2: Doble-Escape (más rápido)
# [Escape][Escape]
# Los archivos se revierten Y sales del modo agente
```

**Cuándo usar cada uno:**

• /rewind: Claude editó mal pero quieres seguir hablándole sobre el tema
• **Doble-Escape**: Claude tomó un camino completamente incorrecto y quieres empezar de nuevo con esos
archivos
• **git checkout**: Los cambios se commitearon y necesitas revertir el commit

### 2.5 Background tasks: Ctrl+B

Mientras Claude trabaja en una tarea, puedes enviarlo a background y seguir con otra cosa:
```
# Claude está ejecutando algo largo (tests, build, análisis)
# Ctrl+B → La tarea se mueve a background
# Puedes:
# - Iniciar otra conversación
# - Trabajar en tu IDE
# - Abrir otra tab de Claude Code
# La tarea en background sigue ejecutándose
# Claude te notifica cuando termina
# Para ver/terminar tareas en background:
# Ctrl+F (doble pulsación) → Terminar agentes en background
```
Esto es especialmente útil cuando lanzas tests largos o análisis de codebase grandes.

## 3. Los atajos de teclado esenciales

Estos atajos transforman tu velocidad con Claude Code. No necesitas memorizarlos todos ahora — los irás incorporando naturalmente:
Atajo Función Cuándo lo usarás

**Shift+Tab**

Toggle Plan Mode Antes de cada feature (PLAN phase)

**Option+T / Alt+T**

Toggle extended thinking Cuando necesitas más/menos profundidad

**Ctrl+O**

Modo verbose (ver thinking)
Para entender decisiones de Claude

**Ctrl+B**

Enviar a background Tests largos, análisis pesados
**Ctrl+F** (x2)
Terminar agentes background Cuando necesitas parar background tasks

**!**

Toggle modo shell Ejecutar comando bash rápido

**@**

Referenciar archivo/dir Ser preciso sobre qué archivo

**Escape**

Pausar ejecución Cuando Claude va en dirección incorrecta

**Escape x2**

Revertir + volver a chat Cuando quieres deshacer Y empezar de nuevo
**Los 3 que debes dominar HOY:** Shift+Tab (Plan Mode), Escape (interrupción), y @ (referencias).

## 4. Patrones de interrupción y corrección

### 4.1 El problema de interrumpir mal

```
# Claude ejecutando:
# npm install nodemailer twilio firebase-admin
# Creando src/services/email.js...
# Creando src/services/sms.js...
# Te das cuenta: NO quieres SMS, solo email y push
# ¿Qué haces?
```

### 4.2 Escape simple: redirigir sin perder contexto

**Cuándo usar:** Claude está ejecutando algo incorrecto pero quieres mantener la conversación.
```
# Claude instalando twilio...
# [Escape]
Claude: Interrupted. What would you like to do?
Tú: "cancela twilio, no vamos a implementar SMS.
Solo email con nodemailer y push con firebase-admin"
Claude: Understood. Removing twilio...
# Claude continúa con dirección corregida
```
**Patrón:** Escape → Claude pregunta → Tú clarificas → Claude ajusta

### 4.3 Doble-Escape: revertir y empezar de nuevo

**Cuándo usar:** Claude fue por un camino completamente incorrecto y quieres deshacer sus cambios.
```
# Claude creando una arquitectura de microservicios completa
# cuando tú querías un monolito...
# [Escape][Escape]
# Los archivos que Claude creó/editó se revierten
# Vuelves al chat limpio
# Puedes reformular tu instrucción desde cero
```

### 4.4 /rewind: revertir solo los archivos

**Cuándo usar:** Claude terminó de ejecutar pero el resultado no te gusta.
```
# Claude terminó de refactorizar pero introdujo un bug
/rewind
# Los archivos vuelven al estado anterior
# La conversación se mantiene
# Puedes dar nuevas instrucciones
```

### 4.5 Regla de oro: interrumpir TEMPRANO

```
# I Esperar a que Claude termine (ya instaló 5 dependencias,
# creó 8 archivos, modificó 3 existentes)
# Revertir esto es costoso
# I Interrumpir a los 10 segundos cuando detectas dirección incorrecta
# Revertir es trivial
```
Cuanto más esperes, más difícil es corregir. Apenas detectes que Claude va en dirección incorrecta: Escape. No esperes "a ver si se arregla solo".

## 5. Ejercicio práctico 1: Feature completa con workflow

### Objetivo

Implementar una feature real siguiendo las 4 fases, con Plan Mode, @referencias y verificación.

### Setup inicial

```
# Clonar proyecto base (o usar tu proyecto del M1)
mkdir api-tasks &amp;&amp; cd api-tasks
git init
# Crear estructura base
mkdir -p src/routes src/middleware src/models tests
```
Crea un CLAUDE.md para el proyecto:
```
# Project: Tasks API
## WHAT
API REST en Node.js/Express para gestión de tareas.
Endpoints CRUD con validación y error handling.
## WHY
- **Express**: Framework HTTP minimalista, patrón middleware
- **Vitest**: Testing framework moderno, ESM nativo
- **Supertest**: Testing de HTTP endpoints
- **Zod**: Validación de schemas en runtime
## HOW
### Build
npm install
### Test
npx vitest run
npx vitest run --coverage
### Conventions
- ESM imports exclusivamente (no require)
- Zod schemas para toda validación de input
- Error responses: { error: string, status: number }
- Handlers async con try/catch centralizados
- Commits siguiendo Conventional Commits
Crea .claude/settings.json:
{
  "permissions": {
    "allowedTools": [
      "Read", "Write(src/**)", "Write(tests/**)",
      "Edit(src/**)", "Edit(tests/**)",
      "Bash(npm *)", "Bash(npx vitest *)", "Bash(git *)", "Bash(curl *)"
    ],
    "deny": ["Bash(rm -rf *)"]
  }
}
git add -A &amp;&amp; git commit -m "chore: initial project setup"
```
Ahora pide a Claude que inicialice el proyecto:
```
inicializa este proyecto: crea package.json con las dependencias
de CLAUDE.md, instala, y crea un endpoint básico GET /tasks que
retorne un array vacío. Incluye un test que verifique.
```
Una vez funcional, comiteamos:
```
git add -A &amp;&amp; git commit -m "feat: initial API with GET /tasks"
```

### Tarea: Implementar autenticación con API Key

**Requisitos:**

• Proteger todas las rutas de /tasks
• API Keys en variable de entorno
```
• Header: Authorization: Bearer <api-key>
```
• 401 si API Key inválida o ausente

### Fase 1: EXPLORE (10-15 min)

```
explora el proyecto actual y documenta:
1. Lee @src/app.js — ¿cómo se registran los middleware?
2. Lee @src/routes/tasks.js — ¿qué handlers existen?
3. Lee @src/middleware/ — ¿hay middleware existente?
4. Lee @tests/ — ¿qué framework de testing y qué patrón usan?
Dime qué patrones debo seguir para agregar autenticación.
```

**Antes de avanzar, verifica:**

Claude identificó el patrón de middleware Claude encontró dónde se registran los middleware Claude sabe qué testing framework se usa Claude identificó patrones de error handling

### Fase 2: PLAN (15-20 min)

Activa Plan Mode:
```
# Pulsa Shift+Tab para activar Plan Mode
# Luego escribe:
basándote en la exploración, crea un plan paso a paso para
implementar autenticación con API Key.
El plan debe:
1. Seguir los patrones existentes en @src/middleware/
2. Incluir estrategia de testing con vitest
3. Especificar qué archivos se crean y cuáles se modifican
4. Definir estrategia de commits
5. Mantener backward compatibility
```

**Valida el plan — checklist:**

¿Nombra archivos específicos? (no solo "crear middleware")
¿Especifica dónde en app.js se registra?
¿Incluye modificación de tests existentes?
¿Tiene 5+ pasos granulares?
¿Define variables de entorno necesarias?
Si falta algo:
```
el plan no menciona qué pasa con tests existentes que no envían
API key. Actualiza el plan especificando cómo se adaptan.
```
Cuando el plan esté completo, guárdalo:
```
guarda este plan en PLAN_auth.md
```

### Fase 3: CODE (60-90 min)

Sal de Plan Mode (Shift+Tab) y comienza implementación incremental:
```
# Monitoreo inicial
/context
# Paso 1: Setup de variables de entorno
implementa SOLO el paso 1 del plan: configuración de
variables de entorno. Verifica que el archivo se creó bien.
# Paso 2: Middleware de autenticación
implementa el paso 2: middleware de API Key.
Después de implementar, ejecuta los tests. Si fallan, diagnostica
y corrige ANTES de continuar.
# Monitoreo de contexto
/context
# Paso 3: Integración en app.js
implementa el paso 3: registrar middleware.
Verifica que:
1. El servidor arranque sin errores
2. curl http://localhost:3000/tasks retorne 401
3. curl -H 'Authorization: Bearer test-key' retorne 200
# Paso 4: Actualizar tests
implementa el paso 4: actualizar tests para incluir API Key.
Ejecuta npx vitest run — TODOS deben pasar.
```
**Si necesitas** /compact **durante CODE (contexto al 55%):**
```
/compact focus on auth implementation plan and current step
```
**Si necesitas** /clear **(contexto al 75%):**
```
# Antes de clear
resume progreso: qué pasos completamos y cuál sigue
/clear
# Después de clear
lee CLAUDE.md, PLAN_auth.md y últimos 5 commits.
Implementando auth, completados pasos 1-3. Siguiente: paso 4
(actualizar tests existentes para incluir API Key).
```

### Fase 4: COMMIT (15-20 min)

```
revisa todos los cambios con git diff y propón estrategia de
commits atómicos con Conventional Commits. Cada commit debe
pasar tests independientemente.
Después de proponer, ejecuta los commits mostrándome cada uno.
```
Valida:
```
# Verificar historia
git log --oneline
# Verificar que cada commit es funcional
git stash
git checkout HEAD~2
npm test  # Debería pasar
git checkout main
git stash pop
```

### Entregable del ejercicio

1. **Código funcional** con auth implementada y tests pasando
2. **PLAN_auth.md** con plan aprobado
3. **Git history** con 4-6 commits atómicos
4. **Log de /context** mostrando gestión proactiva de contexto

### Criterios de evaluación

Usó Shift+Tab para Plan Mode antes de implementar Usó @referencias en la exploración Plan tiene 5+ pasos granulares con archivos específicos Implementación incremental (paso a paso, no todo junto)
Auto-verificación en cada paso (tests, curl)
Gestión de contexto proactiva (/context, /compact o /clear si necesario)
Commits atómicos siguiendo Conventional Commits Tests pasando con coverage >80%

## 6. Ejercicio práctico 2: Gestión de contexto en sesión larga

### Objetivo

Dominar /context, /compact focus, /clear y auto-compactación implementando 3 features secuenciales.

### Tareas secuenciales (simular 3+ horas)

```
# === FEATURE 1: Rate Limiting (40-50 min) ===
/context  # Checkpoint inicial
# [Shift+Tab] Plan Mode
planifica rate limiting con express-rate-limit para el API.
100 requests por minuto por IP. Endpoint /api/rate-limit/status
para ver estado actual.
# [Shift+Tab] Ejecutar
# Implementar paso a paso con verificación
# Comitear atómicamente
/context  # Checkpoint 1: probablemente ~25-35%
# === FEATURE 2: Logging con Winston (40-50 min) ===
/context  # Verificar antes de empezar
# [Shift+Tab] Plan Mode
planifica logging estructurado con Winston.
- Todas las requests loggeadas (método, path, status, duration)
- Errores con stack trace completo
- Formato JSON para producción, colorizado para desarrollo
# [Shift+Tab] Ejecutar
# Implementar paso a paso
# Comitear
/context  # Checkpoint 2: probablemente ~50-65%
# === DECISIÓN DE CONTEXTO ===
# Si ~55%: /compact focus on rate limiting and logging implementation
# Si ~65%: /clear con reinicialización
# Si &lt;50%: continuar normalmente
# === FEATURE 3: Soft Delete (40-50 min) ===
# Si hiciste /clear:
lee CLAUDE.md y últimos 10 commits. Implementamos rate limiting
y logging. Siguiente: soft delete para tasks (campo deletedAt,
GET no muestra deleted, DELETE hace soft delete).
# [Shift+Tab] Plan Mode
# [Shift+Tab] Ejecutar
# Comitear
/context  # Checkpoint final
```

### Entregable

1. **3 features completas** y commiteadas
2. **Log de /context** en cada checkpoint (screenshots o notas)
3. **Registro de decisiones de contexto**: cuándo usaste /compact, /clear, y por qué
4. **Comparación de calidad**: ¿la feature 3 tiene la misma calidad que la feature 1?

### Criterios de evaluación

Usó /context en al menos 4 momentos Tomó decisión proactiva de /compact o /clear antes del 75% Reinicialización post-/clear incluyó contexto suficiente No hay degradación de calidad entre feature 1 y feature 3 Cada feature tiene commits atómicos Tests pasando para las 3 features

## 7. Ejercicio práctico 3: Patrones de interrupción

### Objetivo

Practicar Escape, doble-Escape y /rewind en escenarios reales.

### Escenario 1: Interrupción y redirección (Escape)

```
# Da instrucción deliberadamente ambigua:
implementa un dashboard de métricas para el API
# Claude probablemente empezará a:
# - Instalar librerías de charting frontend
# - Crear rutas /dashboard con HTML
# - Agregar dependencias de UI
# Después de ~10 segundos: [Escape]
# Clarifica:
detén. El dashboard es solo backend — endpoints JSON:
- GET /metrics/requests → contador de requests por hora
- GET /metrics/errors → errores por tipo y frecuencia
- GET /metrics/uptime → tiempo activo del servidor
Sin frontend, sin charts, sin HTML.
# Claude debe:
# - Revertir instalaciones de frontend
# - Simplificar scope
# - Implementar solo endpoints JSON
```

### Escenario 2: Revertir cambios (doble-Escape)

```
# Pide un refactor que resulta malo:
refactoriza @src/routes/tasks.js para usar un patrón
de controller classes
# Claude refactoriza... pero el resultado es peor
# que el código original (overengineering)
# [Escape][Escape]
# Los archivos se revierten al estado anterior
# Reformula:
mantén @src/routes/tasks.js como funciones.
Solo extrae la lógica de validación a @src/validators/tasks.js
```

### Escenario 3: Rewind post-ejecución

```
# Claude terminó de implementar algo
# Funciona pero no te gusta el approach
# Opción: /rewind
/rewind
# Archivos revertidos, conversación intacta
# Puedes dar nuevas instrucciones:
rehaz esto pero usando el patrón de @src/middleware/errorHandler.js
en lugar de try/catch en cada handler
```

### Entregable

Log detallado de los 3 escenarios mostrando:
• Instrucción original
• Momento de interrupción (qué detectaste)
• Método usado (Escape / doble-Escape / /rewind)
• Resultado después de la corrección

### Criterios de evaluación

Interrumpiste ANTES de que Claude hiciera cambios masivos Clarificación post-Escape fue específica y accionable Doble-Escape revirtió archivos correctamente /rewind restauró estado anterior sin perder conversación Resultado final después de corrección es lo que querías

## 8. Ejercicio integrador: Feature compleja end-to-end

### Descripción de la feature

**Feature:** Sistema de webhooks para el API de tasks

**Requisitos:**

• Usuarios registran webhook URLs para eventos específicos
```
• Eventos: task.created, task.updated, task.deleted
```
• Payload JSON con event type y task data
• Retry logic: 3 intentos con exponential backoff (2^attempt segundos)
• Logs de deliveries (success/failure/pending)
• Endpoint GET /webhooks/logs para historial
**Por qué este ejercicio:** Requiere las 4 fases, gestión de contexto (sesión larga), interrupciones (lógica de retry es
compleja), y múltiples commits atómicos.

### Fase 1: EXPLORE (15-20 min)

```
vamos a implementar webhooks. Antes de planear, explora:
1. Lee @src/routes/tasks.js — ¿cómo se manejan create/update/delete?
2. Lee @src/models/ — ¿qué ORM o patrón de datos se usa?
3. Busca en @package.json — ¿hay librerías de queue o HTTP client?
4. Lee @tests/ — ¿cómo se testean llamadas externas?
5. ¿Hay algún patrón de retry o job queue existente?
```

### Fase 2: PLAN (20-30 min)

```
# [Shift+Tab] Plan Mode
/effort high
basándote en la exploración, crea plan DETALLADO para webhooks.
Incluye:
1. Modelo de datos (webhooks, delivery_logs)
2. Notificación asíncrona (justifica síncrono vs asíncrono)
3. Retry con exponential backoff (algoritmo específico)
4. Endpoints REST (CRUD + logs)
5. Testing strategy (mocks de HTTP calls)
6. Estrategia de commits (8+ commits atómicos)
7. Qué archivos se crean y cuáles se modifican
Guarda en PLAN_webhooks.md cuando esté aprobado.
```

**Validación del plan:**

¿Modelo de datos tiene todos los campos necesarios?
¿Justifica la elección de async vs sync?
¿Algoritmo de backoff está especificado (2^attempt seconds)?
¿Tests mencionan nock o similar para mockear HTTP?
¿8+ pasos granulares con archivos nombrados?

### Fase 3: CODE (2-3 horas)

```
# [Shift+Tab] Salir de Plan Mode
/context  # Checkpoint inicial
# Paso 1: Modelo de webhooks
implementa SOLO el modelo Webhook con campos:
url, events (array), active (boolean), createdAt.
Verifica que funciona.
# Paso 2: Modelo de delivery logs
implementa WebhookDelivery: webhookId, event, payload,
status (pending/success/failed), attempts, lastError.
Verifica relaciones.
/context  # Checkpoint
# Paso 3: Service de notificación
implementa WebhookService.notifyWebhooks(event, taskData):
1. Buscar webhooks activos para ese event
2. Crear WebhookDelivery con status='pending'
3. Ejecutar delivery asíncronamente
# Paso 4: Worker con retry (la parte más compleja)
/effort high
implementa el worker de delivery:
1. HTTP POST a webhook.url con payload JSON
2. Success (2xx): status='success'
3. Failure: incrementar attempts
4. Si attempts &lt; 3: retry con delay 2^attempts segundos
5. Si attempts &gt;= 3: status='failed', guardar lastError
Después de implementar, muéstrame la lógica de retry
para que la revise antes de continuar.
# [MOMENTO PROBABLE DE INTERRUPCIÓN]
# Si la lógica de retry no te convence: Escape + clarificar
# Si todo está mal: doble-Escape + /rewind
/context  # Checkpoint — probablemente 40-55%
# Si &gt;55%:
/compact focus on webhook models, service, retry logic
# Paso 5: Integración en task routes
implementa integración en @src/routes/tasks.js:
- POST /tasks → notifyWebhooks('task.created', task)
- PATCH /tasks/:id → notifyWebhooks('task.updated', task)
- DELETE /tasks/:id → notifyWebhooks('task.deleted', task)
IMPORTANTE: Notificaciones asíncronas, NO bloquear response.
Verifica que npm test sigue pasando.
# Paso 6: Endpoints de webhooks
implementa:
- POST /webhooks → crear webhook (validar URL y events)
- GET /webhooks → listar webhooks del usuario
- DELETE /webhooks/:id → eliminar webhook
- GET /webhooks/logs → delivery logs (últimos 100)
Sigue el patrón de @src/routes/tasks.js para consistencia.
# Paso 7: Tests
implementa tests para:
1. Registrar webhook → crear task → verificar delivery
2. Simular fallo HTTP → verificar retry logic
3. Verificar logs de deliveries
4. Verificar que task response no se bloquea por webhook
Usa nock para mockear HTTP. Tests sin servidor externo real.
/context  # Checkpoint final
```

### Fase 4: COMMIT (20-30 min)

```
git status &amp;&amp; git diff --stat
propón estrategia de 8+ commits atómicos:
1. Modelo Webhook
2. Modelo WebhookDelivery
3. WebhookService
4. Worker con retry
5. Integración en task routes
6. Endpoints CRUD de webhooks
7. Tests
8. Documentación / ajustes
Cada commit debe pasar tests. Ejecuta los commits y
muéstrame cada uno.
```

### Validación final end-to-end

```
# Arrancar servidor
npm start
# Registrar webhook (usa webhook.site para testing)
curl -X POST http://localhost:3000/webhooks \
  -H "Authorization: Bearer test-key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://webhook.site/[tu-uuid]", "events": ["task.created"]}'
# Crear task → debe triggear webhook
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer test-key" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test webhook", "description": "Testing"}'
# Verificar en webhook.site que recibiste el POST
# Verificar logs
curl http://localhost:3000/webhooks/logs \
  -H "Authorization: Bearer test-key"
```

### Entregables del integrador

1. **Código funcional:** Webhooks completos, tests pasando, coverage >80%
2. **PLAN_webhooks.md** con plan aprobado
3. **PROGRESS_webhooks.md** con registro de:
• Checkpoints de /context (valores en cada momento)
• Si usaste /compact o /clear y por qué
• Interrupciones (Escape / doble-Escape / /rewind) con justificación
• Decisiones de /effort (cuándo escalaste/bajaste)
4. **Git history:** 8+ commits atómicos, Conventional Commits
5. **Testing E2E:** Screenshot de webhook.site recibiendo notificación

### Criterios de evaluación

**Exploración:** Usó @referencias para archivos específicos
**Plan:** Shift+Tab activado, 8+ pasos, justifica decisiones
**Esfuerzo:** /effort high para retry logic, auto/medium para el resto
**Código:** Funcional, tests pasando, auto-verificación en cada paso
**Contexto:** /context en 3+ momentos, decisión proactiva de compact/clear
**Interrupciones:** Al menos 1 interrupción documentada con justificación
**Commits:** 8+ atómicos, cada uno pasa tests
**E2E:** Webhook delivery exitoso documentado
**Calidad:** Sin TODOs, sin código comentado, coverage >80%

## 9. Conceptos clave para memorizar

### El workflow en acción

**EXPLORE** → **Contexto antes de código**
• @referencias para ser preciso sobre qué explorar
• Referenciar patrones existentes es más efectivo que describir
• "asumo que..." = exploración insuficiente
**PLAN** → **Shift+Tab previene thrashing**
• Plan Mode transforma calidad radicalmente
• Iterar sobre el plan ANTES de escribir código
• Un buen plan nombra archivos, especifica orden, incluye tests
**CODE** → **Incremental con auto-verificación**
• Paso a paso, nunca todo junto
• "Y LUEGO verifica que..." en cada paso
• /effort según complejidad del paso
**COMMIT** → **Historia limpia es productividad futura**
• Commits atómicos, deployables independientemente
• Conventional Commits para automatización
• Cada commit pasa tests

### Gestión de contexto

**Monitoreo:** /context es tu mejor amigo — grid visual rápido
**50-70%:** /compact focus on [temas] — preserva lo importante
**70%+:** /clear + reinicializar con git log y plan
**Auto:** La auto-compactación maneja la mayoría de sesiones

### Interrupción y recuperación

**Escape:** Pausa, Claude pregunta qué hacer, tú clarificas
**Doble-Escape:** Revierte archivos, vuelve a chat, empezar de nuevo
/rewind**:** Revierte archivos, mantiene conversación
**Regla:** Interrumpir TEMPRANO, no esperar a que Claude termine

## 10. Antipatrones a evitar

**Usar** --plan **como flag CLI** → No existe. Plan Mode se activa con **Shift+Tab**
**Usar** --think-hard **/** --ultrathink → No son flags CLI. Usa /effort y **keywords en prompts**
**"Hazlo todo de una vez"** → Implementación incremental siempre
**Saltar EXPLORE** → Contexto incorrecto = código que no se integra
**Describir archivos con texto** → Usar @src/auth.js en lugar de "el archivo de auth"
**Ignorar** /context → Degradación silenciosa de calidad
**Esperar a 90% de contexto** → Actuar al 55-65%
**Commits masivos** → "feat: webhook system (47 files changed)"
**No auto-verificar** → Claude sin feedback loop = código sin garantía
**Interrumpir muy tarde** → Cuanto más esperes, más difícil revertir
/clear **sin reinicializar** → Claude pierde todo el hilo sin contexto suficiente

## 11. Recursos complementarios

### Lecturas obligatorias

• Claude Code: Best Practices for Agentic Coding — El post de Boris Cherny, secciones "Plan before coding" e
"Iterating effectively"
• Getting Started with Ralph — Workflow fundamentals
• My Experience with Claude Code 2.0 — Casos de uso reales y gestión de contexto

### Documentación oficial

• CLI Reference — Todos los comandos y flags reales
• Memory and Context — Cómo funciona la gestión de contexto
• Costs — Impacto de /effort en costos

### Threads de referencia

• Boris Cherny: Tips from the Claude Code team — Workflow real del creador
• Matt Pocock: Plan mode is night and day — La cita más importante sobre Plan Mode
• Geoffrey Litt: Workflow patterns — Patrones avanzados

### Herramientas

• Status line customization — HUD personalizado para Claude Code
• GermanDZ/ai-guided-project — Proyecto guiado por IA

## 12. Checklist de finalización del módulo

Completé feature con workflow EXPLORE→PLAN→CODE→COMMIT Activé Plan Mode con **Shift+Tab** (no con flags CLI)
Usé @referencias para archivos y directorios en exploración Iteré sobre un plan antes de implementar Usé /effort para ajustar profundidad de razonamiento Togglé extended thinking con Option+T / Alt+T Monitoré contexto con /context múltiples veces Usé /compact focus on [tema] para compactación selectiva Hice /clear correctamente (documenta estado → clear → reinicializa)
Auto-verificación en cada paso del CODE ("Y LUEGO verifica que...")
Interrumpí con Escape cuando Claude iba en dirección incorrecta Probé doble-Escape para revertir archivos Probé /rewind para recuperar estado anterior Envié tarea a background con Ctrl+B Commits atómicos con Conventional Commits Completé ejercicio integrador (webhooks) exitosamente Puedo explicar diferencia entre Escape, doble-Escape y /rewind

## Próximos pasos

En **Módulo 3: TDD con Claude Code** aprenderás:
• Ciclo Red-Green-Refactor adaptado a coding agents
• Por qué tests-first multiplica calidad 2-3x (confirmado por Boris Cherny)
• /sandbox para testing aislado (84% menos prompts de permiso)
• Security review con /security-review como complemento del TDD
• Skills de testing (test-driven-development de ComposioHQ)
• Coverage como gate de calidad, no solo métrica
• Integración de test runners en el workflow de auto-verificación
**Preparación para M3:** Asegúrate de dominar el workflow de M2 — especialmente la auto-verificación ("Y LUEGO
verifica que..."). TDD es exactamente este patrón elevado a sistema: los tests SON el mecanismo de verificación. Si la auto-verificación no es un hábito, TDD no funcionará.
