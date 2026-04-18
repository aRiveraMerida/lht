---
title: "Prework 05 — API REST (conceptos)"
date: "2026-04-18"
description: "Conceptos de API REST necesarios para entender la arquitectura del agente."
excerpt: "Tiempo estimado: 2-3 horas (desde cero) / 30 min (repaso) Objetivo: Entender HTTP methods, status codes, JSON, y poder leer/probar endpoints Requisito previo: Áreas 1-4…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Prework Área 5: API REST (conceptos)

**Tiempo estimado:** 2-3 horas (desde cero) / 30 min (repaso)
**Objetivo:** Entender HTTP methods, status codes, JSON, y poder leer/probar endpoints
**Requisito previo:** Áreas 1-4 completadas

## ¿Por qué es obligatorio?

Los ejercicios del curso (M2-M10) construyen APIs REST. Claude genera endpoints, y tú necesitas:
• Entender qué hace cada endpoint (GET, POST, PATCH, DELETE)
• Leer status codes en respuestas (200, 201, 400, 404, 500)
• Probar endpoints con curl desde la terminal
• Validar que Claude generó la API correctamente
• Entender request/response (headers, body, query params)
**No necesitas** haber creado una API antes. Claude la construye. Necesitas entender la **anatomía** de una petición
HTTP y saber probarla.

## Ruta de estudio

### Paso 1 — Qué es una API REST (30 min)

**Recurso (elige UNO):**

Recurso Formato Tiempo Lo que aporta MDN: An overview of HTTP Texto 20 min Qué es HTTP, request/response, headers freeCodeCamp: What is a REST API?
Texto 15 min REST explicado sin jerga RESTful API Design —
Microsoft Texto 30 min Best practices (más profundo)

**Concepto clave:**

```
API REST = interfaz para que programas hablen entre sí via HTTP
Cliente (tu app, curl, tests) IIHTTP requestIII Servidor (Express)
                                IIIHTTP responseII
```
Cada recurso (users, books, orders) tiene una URL base, y usas HTTP methods para operar sobre él.

### Paso 2 — HTTP Methods (verbos) (30 min)

Method Acción Ejemplo Body Leer/listar No
```
GET
GET /api/books
```
Crear Sí
```
POST
POST /api/books
```
Actualizar parcialmente Sí
```
PATCH
PATCH /api/books/42
```
Reemplazar
```
PUT
```
completamente Sí
```
PUT /api/books/42
```
Eliminar No
```
DELETE
DELETE /api/books/42
```
**Patrón CRUD estándar** (lo que Claude genera en cada ejercicio):
```
Recurso: /api/v1/books
GET    /api/v1/books          → Listar todos los libros
GET    /api/v1/books/42       → Obtener libro con id=42
POST   /api/v1/books          → Crear libro nuevo
PATCH  /api/v1/books/42       → Actualizar libro 42
DELETE /api/v1/books/42       → Eliminar libro 42
```

### Paso 3 — Status codes (30 min)

No necesitas memorizar todos. Estos son los que aparecen en el curso:
Código Significado Cuándo

**200**

OK GET/PATCH exitoso

**201**

Created POST exitoso (recurso creado)

**204**

No Content DELETE exitoso (sin body de respuesta)

**400**

Bad Request Datos inválidos (falta campo, formato malo)

**401**

Unauthorized No autenticado (falta token)

**403**

Forbidden Autenticado pero sin permiso

**404**

Not Found Recurso no existe

**409**

Conflict Duplicado (email ya existe)

**500**

Internal Server Error Bug en el servidor

**Regla rápida:**

• **2xx** = Todo bien
• **4xx** = Error del cliente (tú mandaste algo mal)
• **5xx** = Error del servidor (bug en el código)
**Recurso:** HTTP Status Codes — httpstatuses.com — Referencia visual

### Paso 4 — JSON (30 min)

JSON es el formato de datos de las APIs. Si entiendes objetos JavaScript (Área 4), ya entiendes JSON.
```
{
  "data": {
    "id": 42,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "rating": 4.5,
    "genres": ["programming", "software engineering"],
    "available": true,
    "publisher": null
  }
}
```

**Diferencias JSON vs JavaScript:**

• Las keys van SIEMPRE entre comillas dobles ("key")
• No hay funciones, solo datos
• No hay trailing commas
• Los valores pueden ser: string, number, boolean, null, array, object

### Paso 5 — Probar APIs con curl (30 min)

curl es tu herramienta principal para probar endpoints. Claude genera código de servidor; tú verificas con curl.
```
# GET — Obtener datos
curl http://localhost:3000/api/books
curl http://localhost:3000/api/books/42
# GET con query params
curl "http://localhost:3000/api/books?genre=fiction&amp;limit=10"
# POST — Crear recurso
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "New Book", "author": "Author Name"}'
# PATCH — Actualizar recurso
curl -X PATCH http://localhost:3000/api/books/42 \
  -H "Content-Type: application/json" \
  -d '{"rating": 4.8}'
# DELETE — Eliminar recurso
curl -X DELETE http://localhost:3000/api/books/42
# Con autenticación (JWT)
curl http://localhost:3000/api/books \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
# Ver headers de respuesta
curl -i http://localhost:3000/api/books
# -i muestra headers + body
# Solo status code
curl -o /dev/null -s -w "%{http_code}" http://localhost:3000/api/books
# 200
# Pretty-print JSON (con jq)
curl -s http://localhost:3000/api/books | jq .
```
**Instalar jq** (formateador de JSON en terminal):
```
brew install jq        # macOS
sudo apt install jq    # Linux
```

### Paso 6 — Request y Response anatomy (15 min)

```
POST /api/v1/books HTTP/1.1          ← Method + URL
Host: localhost:3000                  ← Header
Content-Type: application/json        ← Header (tipo de body)
Authorization: Bearer xxx...          ← Header (autenticación)
{                                     ← Body (JSON)
  "title": "Clean Code",
  "author": "Robert Martin"
}
HTTP/1.1 201 Created                  ← Status code
Content-Type: application/json        ← Header
{                                     ← Body (JSON)
  "data": {
    "id": 42,
    "title": "Clean Code",
    "author": "Robert Martin",
    "created_at": "2026-03-28T10:00:00Z"
  }
}
```

**Los 3 componentes de un request:**

1. **URL + Method** — Qué recurso y qué acción
2. **Headers** — Metadatos (Content-Type, Authorization)
3. **Body** — Datos (solo en POST, PATCH, PUT)

**Los 3 componentes de un response:**

1. **Status code** — Resultado (200, 404, 500...)
2. **Headers** — Metadatos de respuesta
3. **Body** — Datos retornados (JSON)

## Conceptos que NO necesitas antes del curso

Concepto Por qué no GraphQL El curso usa REST WebSockets No se usan OAuth2 / OpenID Connect Se menciona pero Claude lo implementa API versioning strategies Se usa /v1/ simple Rate limiting implementation Claude lo implementa si se pide OpenAPI / Swagger Se menciona en M9 pero Claude lo genera CORS Claude lo configura

## Referencia rápida

```
HTTP METHODS
  GET      Leer (no body)
  POST     Crear (con body)
  PATCH    Actualizar parcial (con body)
  PUT      Reemplazar completo (con body)
  DELETE   Eliminar (no body)
STATUS CODES
  200 OK              GET/PATCH exitoso
  201 Created         POST exitoso
  204 No Content      DELETE exitoso
  400 Bad Request     Datos inválidos
  401 Unauthorized    Sin autenticación
  404 Not Found       No existe
  409 Conflict        Duplicado
  500 Server Error    Bug
CURL
  curl URL                          GET simple
  curl -X POST URL -H "..." -d '{}' POST con body
  curl -X PATCH URL -H "..." -d '{}' PATCH
  curl -X DELETE URL                DELETE
  curl -i URL                       Ver headers
  curl -s URL | jq .               Pretty-print JSON
HEADERS COMUNES
  Content-Type: application/json    Body es JSON
  Authorization: Bearer &lt;token&gt;     JWT authentication
PATRÓN CRUD
  GET    /api/v1/resource           Listar
  GET    /api/v1/resource/:id       Obtener uno
  POST   /api/v1/resource           Crear
  PATCH  /api/v1/resource/:id       Actualizar
  DELETE /api/v1/resource/:id       Eliminar
```

## Test de verificación

### Parte 1: Lectura (sin terminal)

¿Puedes explicar qué hace cada línea?
```
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"name": "Alice", "email": "alice@test.com", "role": "admin"}'
```
Envía un POST request al endpoint /api/v1/users para crear un nuevo usuario. Los headers indican que el body es JSON y que el request está autenticado con un Bearer token. El body contiene nombre, email y rol del usuario a crear.
¿Qué significan estas respuestas?
```
HTTP/1.1 201 Created       →  ?
HTTP/1.1 400 Bad Request   →  ?
HTTP/1.1 404 Not Found     →  ?
HTTP/1.1 401 Unauthorized  →  ?
```
• 201: Recurso creado exitosamente (el usuario se creó)
• 400: Datos inválidos (probablemente falta un campo requerido)
• 404: El recurso no existe (URL incorrecta o ID inexistente)
• 401: No autenticado (token falta o es inválido)

### Parte 2: Práctica (en terminal)

```
# === TEST PREWORK ÁREA 5: API REST ===
# 1. Crear servidor Express rápido
mkdir /tmp/prework-api &amp;&amp; cd /tmp/prework-api
npm init -y
echo '{"type":"module","scripts":{"start":"node server.js"}}' &gt; package.json
npm install express
cat &gt; server.js &lt;&lt; 'SERVEREOF'
import express from 'express';
const app = express();
app.use(express.json());
const books = [
  { id: 1, title: 'Clean Code', rating: 4.5 },
  { id: 2, title: 'Refactoring', rating: 4.8 },
];
let nextId = 3;
app.get('/api/books', (req, res) =&gt; res.json({ data: books }));
app.get('/api/books/:id', (req, res) =&gt; {
  const book = books.find(b =&gt; b.id === parseInt(req.params.id));
  book ? res.json({ data: book }) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/books', (req, res) =&gt; {
  const { title, rating } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const book = { id: nextId++, title, rating: rating || 0 };
  books.push(book);
  res.status(201).json({ data: book });
});
app.delete('/api/books/:id', (req, res) =&gt; {
  const idx = books.findIndex(b =&gt; b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  books.splice(idx, 1);
  res.status(204).end();
});
app.listen(3456, () =&gt; console.log('API running on port 3456'));
SERVEREOF
# 2. Arrancar servidor
node server.js &amp;
SERVER_PID=$!
sleep 1
# 3. Probar GET (listar)
echo "=== GET /api/books ==="
curl -s http://localhost:3456/api/books | jq . 2&gt;/dev/null || curl -s http://localhost:3456/api/books
# 4. Probar GET (uno)
echo ""
echo "=== GET /api/books/1 ==="
curl -s http://localhost:3456/api/books/1 | jq . 2&gt;/dev/null || curl -s http://localhost:3456/api/books/1
# 5. Probar POST (crear)
echo ""
echo "=== POST /api/books ==="
curl -s -X POST http://localhost:3456/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Design Patterns", "rating": 4.2}'
# 6. Probar POST con error (sin title)
echo ""
echo "=== POST sin title (esperar 400) ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3456/api/books \
  -H "Content-Type: application/json" \
  -d '{"rating": 3.0}')
echo "Status: $STATUS"
[ "$STATUS" = "400" ] &amp;&amp; echo "I 400 correcto" || echo "I Esperaba 400"
# 7. Probar DELETE
echo ""
echo "=== DELETE /api/books/1 ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3456/api/books/1)
echo "Status: $STATUS"
[ "$STATUS" = "204" ] &amp;&amp; echo "I 204 correcto" || echo "I Esperaba 204"
# 8. Probar GET de recurso eliminado (esperar 404)
echo ""
echo "=== GET /api/books/1 (después de DELETE) ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/api/books/1)
echo "Status: $STATUS"
[ "$STATUS" = "404" ] &amp;&amp; echo "I 404 correcto" || echo "I Esperaba 404"
# Cleanup
kill $SERVER_PID 2&gt;/dev/null
cd /tmp &amp;&amp; rm -rf /tmp/prework-api
echo ""
echo "I Test completado — API REST dominado"
```

### Evaluación

Resultado Siguiente paso

**Entendí la parte de lectura + el test práctico funcionó**

Pasa a Área 6 (GitHub CLI)

**Lectura ok pero curl me confunde**

Practica los patrones de curl del Paso 5

**No entiendo los status codes**

Lee httpstatuses.com y repite

**No sé qué es HTTP**

Lee el recurso del Paso 1 (MDN HTTP overview)

## Recursos adicionales

Recurso Qué aporta Tiempo httpstatuses.com Todos los status codes con explicación Referencia Postman Learning Center Herramienta visual para probar APIs (alternativa a curl)
1h JSONPlaceholder API falsa para practicar GET/POST/etc. sin montar servidor Práctica curl cookbook Patrones de curl avanzados Referencia
