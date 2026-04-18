---
excerpt: "Primera sesión práctica con Claude Code antes de entrar en los módulos."
---

# Prework Área 9: Hablar con un agente de código


## ¿Por qué es importante?

Tener Claude Code instalado no significa saber usarlo. El gap más común entre "instalar" y "ser productivo" no es técnico — es **comunicacional**. La gente que fracasa con Claude Code suele:
• Dar instrucciones vagas ("haz una app")
• Esperar que lea su mente
• No dar contexto suficiente
• No iterar (aceptar la primera respuesta sin refinar)
• Confundir Claude.ai (chatbot) con Claude Code (agente autónomo)
Esta área te da las bases de comunicación con LLMs **antes** de que M1 entre en el modelo mental profundo.

## 1. Claude.ai vs Claude Code: expectativas correctas

### Qué es Claude.ai (chat)

Lo que probablemente ya conoces: una interfaz de chat en el navegador donde hablas con Claude.
```
Tú: "Explícame qué es React"
Claude: [párrafos de explicación]
Tú: "Escríbeme una función que ordene un array"
Claude: [bloque de código que tú copias/pegas]
```
**Claude.ai es conversacional.** Tú preguntas, Claude responde. El código que genera se queda en la ventana de chat.
Tú lo copias y lo pegas en tu editor.

### Qué es Claude Code (agente)

Algo fundamentalmente distinto: un **agente autónomo** que trabaja directamente en tu proyecto.
```
Tú: "implementa autenticación JWT con tests"
Claude Code:
  → Lee tu proyecto (archivos, estructura, package.json)
  → Crea src/auth/login.js
  → Crea src/auth/middleware.js
  → Instala jsonwebtoken con npm
  → Crea tests/auth.test.js
  → Ejecuta npm test
  → Si falla, corrige y re-ejecuta
  → Hace git commit cuando todo pasa
```
**Claude Code ACTÚA.** No te da código para copiar — lo escribe directamente en tu filesystem, ejecuta comandos, y
verifica resultados.

### Tabla de diferencias

Claude.ai (chat)
Claude Code (agente)

**Dónde**

Browser (claude.ai)
Terminal

**Output**

Texto/código en chat Archivos en tu proyecto

**Ejecuta código**

No Sí (bash, npm, tests)

**Lee tu proyecto**

No (solo lo que pegas)
Sí (todo el filesystem)

**Modifica archivos**

No Sí (crea, edita, borra)

**Git**

No Sí (commits automáticos)

**Instala paquetes**

No Sí (npm install)

**Modo de trabajo**

Conversación Agente autónomo

**Analogía**

Consultor al teléfono Desarrollador sentado en tu máquina

### Implicaciones para ti

Con Claude.ai haces Con Claude Code haces "Escríbeme código" → copias/pegas "Implementa esto" → Claude lo crea directamente Tú decides dónde poner el archivo Claude decide (o tú le indicas con @ruta)
Tú ejecutas tests manualmente Claude ejecuta tests y corrige si fallan Sin riesgo (código en el chat)
Riesgo real (modifica archivos, ejecuta comandos)
No necesitas git Git es esencial (para revertir si algo sale mal)
**El ajuste mental más importante:** Con Claude Code no estás "preguntando" — estás **delegando trabajo** a un
agente que actúa en tu proyecto real. Por eso necesitas:
• Git configurado (para revertir)
• Instrucciones claras (para que actúe bien)
• Verificación (para validar el resultado)

## 2. Prompting básico: cómo dar instrucciones a un LLM

### Los 5 principios

**1. Sé específico, no vago**

```
"Haz una API"
   → ¿De qué? ¿Con qué stack? ¿Qué endpoints?
"Crea un endpoint GET /api/v1/books que retorne
   todos los libros de la base de datos SQLite,
   con paginación por cursor (limit y cursor params)"
   → Claude sabe exactamente qué hacer
```

**2. Da contexto**

```
"Añade autenticación"
   → ¿JWT? ¿Sessions? ¿OAuth? ¿A qué rutas?
"Añade autenticación JWT al proyecto.
   - POST /api/auth/login (email + password → token)
   - Middleware que proteja rutas /api/v1/*
   - Token expira en 24h
   - Usa la librería jsonwebtoken"
   → Claude tiene todo lo que necesita
```

**3. Especifica el formato de output**

```
"Escribe tests"
   → ¿Unitarios? ¿Integración? ¿Qué framework? ¿Para qué módulo?
"Escribe tests de integración con Vitest para
   el endpoint GET /api/v1/books. Cubre:
   - Retorna array de libros (200)
   - Retorna 404 si no hay libros
   - Paginación funciona con ?limit=10&amp;cursor=abc"
```

**4. Itera — no esperes perfección en el primer intento**

```
Intento 1: "Implementa búsqueda de libros"
→ Claude genera algo, pero no tiene filtros por género
Intento 2: "Añade filtro por género: GET /api/v1/books?genre=fiction"
→ Claude añade el filtro
Intento 3: "Añade también filtro por rating mínimo: ?rating_min=4.0"
→ Claude refina
Cada iteración es más específica porque ves el resultado anterior.
```

**5. Pide verificación**

```
"Implementa X"
   → Claude implementa, pero ¿funciona?
"Implementa X. Después ejecuta los tests para verificar.
   Si algún test falla, corrige el código y re-ejecuta
   hasta que todos pasen."
   → Claude auto-verifica su trabajo
```

### Patrones que Claude Code entiende bien

Patrón Ejemplo TDD "Escribe tests primero, luego implementa código para pasarlos"
Paso a paso "Primero crea el modelo, luego las rutas, luego los tests"
Referencia a archivos "Mira cómo está implementado @src/routes/users.js y haz lo mismo para books"
Restricciones "Usa Express, no Fastify. Usa Vitest, no Jest. No uses TypeScript"
Verificación "Ejecuta npm test después de cada cambio"

### Recurso recomendado

• Anthropic: Prompt Engineering Overview — Guía oficial de prompting (aplica tanto a chat como a Claude Code)

## 3. Primera sesión guiada con Claude Code (30 min)

### Objetivo

Completar un mini-proyecto desde cero usando Claude Code para que llegues a M1 con la experiencia de haberlo usado al menos una vez.

### Preparación

```
mkdir mi-primer-proyecto &amp;&amp; cd mi-primer-proyecto
git init
npm init -y
```

### Sesión guiada

Abre Claude Code:
```
claude
```

**Instrucción 1 — Exploración:**

```
¿Qué hay en este directorio? Lista los archivos y su contenido.
```
Claude debería leer package.json y reportar que es un proyecto Node.js vacío.

**Instrucción 2 — Crear estructura:**

```
Crea la estructura básica para una API REST con Express:
- src/index.js (servidor Express en puerto 3000)
- src/routes/health.js (GET /api/health → {"status": "ok"})
- Instala express como dependencia
- Añade script "start" en package.json
```
Observa cómo Claude:
• Crea archivos en tu filesystem real
```
• Ejecuta npm install express
• Modifica package.json
```
• Te pide permiso antes de ejecutar comandos (la primera vez)

**Instrucción 3 — Verificar:**

```
Ejecuta el servidor y prueba el endpoint /api/health con curl.
Muéstrame el resultado.
```
Claude debería arrancar el servidor y hacer curl. Verifica que ves {"status": "ok"}.

**Instrucción 4 — Añadir feature:**

```
Añade un endpoint GET /api/hello/:name que retorne
{"message": "Hello, &lt;name&gt;!"}.
Después de implementarlo, pruébalo con curl usando el nombre "Claude".
```

**Instrucción 5 — Tests:**

```
Instala vitest y supertest como devDependencies.
Crea tests de integración para los dos endpoints (health y hello).
Ejecuta los tests.
```

**Instrucción 6 — Commit:**

```
Haz git add de todo y commit con mensaje
"feat: initial API with health and hello endpoints"
```

**Instrucción 7 — Revisar lo que pasó:**

```
/exit
```
Ahora en tu terminal:
```
# Ver lo que Claude creó
ls -R src/
cat src/index.js
# Ver tests
ls tests/
cat tests/*.test.js
# Ver historial de git
git log --oneline
# Ejecutar tests por tu cuenta
npm test
```

### Reflexión (importante)

Después de la sesión, hazte estas preguntas:
1. **¿Claude creó archivos reales en tu disco?** → Sí. No es simulación.
2. **¿Ejecutó comandos reales (npm install, npm test)?** → Sí. Tuvo que pedir permiso.
3. **¿Hizo git commit por ti?** → Sí. Los commits son reales.
4. **¿Podrías revertir todo?** → Sí, con git reset --hard HEAD~1.
5. **¿Qué pasa si le hubieras dado instrucciones vagas?** → Resultado impredecible.
6. **¿Qué pasa si no tuvieras tests?** → No habría forma de verificar que funciona.
**Esto es lo que M1 formaliza** como modelo mental: Claude Code tiene **tools** (22 herramientas), trabaja en un **context**
(tu proyecto), necesita **feedback loops** (tests, builds), y tú controlas el **control flow** (permisos, instrucciones).

## Test de verificación

No hay test ejecutable para esta área. La verificación es:
Pregunta Respuesta esperada ¿Completaste la sesión guiada?
Sí ¿Claude creó archivos reales en tu proyecto?
Sí ¿Los tests pasan?
Sí ¿Hay un commit en git log?
Sí ¿Puedes explicar la diferencia entre Claude.ai y Claude Code?
Sí ¿Sabes por qué "implementa autenticación" es mejor prompt que "haz algo de auth"?
Sí Si todo es I, estás listo para M1.

## Recursos

Recurso Qué aporta Tiempo Anthropic: Prompt Engineering Guía oficial de prompting 30 min Anthropic: Claude Code Best Practices Cómo trabajar con Claude Code efectivamente (se profundiza en M1)
20 min Claude Code Docs: Overview Qué es y qué puede hacer 15 min
