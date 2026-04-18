---
excerpt: "Nivel mínimo de JavaScript necesario para seguir los ejercicios del programa."
---

# Prework Área 4: JavaScript básico

## ¿Por qué es obligatorio?

Claude Code escribe JavaScript. Tú lo validas. Si no puedes leer el código que Claude genera, no puedes:
• Verificar que la lógica es correcta
• Detectar bugs antes de commitear
• Entender los tests que Claude crea
• Leer mensajes de error cuando algo falla
• Modificar manualmente si Claude se equivoca
**Lo que NO necesitas:** No necesitas ser capaz de escribir JavaScript desde cero. Claude lo escribe. Necesitas ser
capaz de **leer** y **entender** lo que Claude produce.
**Ajuste para developers de otros lenguajes:** Si ya programas en Python, Java, Go, etc., este paso es un repaso de
sintaxis (~2 horas). Los conceptos son los mismos — solo cambia la sintaxis.

## Ruta de estudio

### Paso 1 — Fundamentos: variables, tipos, operadores (1-2 horas)

**Recurso principal (elige UNO):**

Recurso Formato Interactivo Gratuito Ideal para JavaScript.info —
Part 1:
Fundamentals Texto + ejercicios Explicaciones I I detalladas MDN: JavaScript Guide Texto (referencia)
No Ya sabes programar I en otro lenguaje freeCodeCamp:
JavaScript Algorithms Interactivo en browser Empezar desde cero I I absoluto W3Schools:
JavaScript Tutorial Texto + "Try it"
Referencia rápida I I con ejemplos
**Mi recomendación:** JavaScript.info es el mejor recurso gratuito para JavaScript moderno. Lee las secciones 2.1 a
2.18 (fundamentos) y practica los ejercicios.

**Lo que necesitas dominar:**

```
// Variables: let y const (no usar var)
const name = 'Claude';      // No cambia
let count = 0;               // Puede cambiar
count = count + 1;
// Tipos
const str = 'texto';         // String
const num = 42;              // Number
const bool = true;           // Boolean
const arr = [1, 2, 3];       // Array
const obj = { key: 'value' };// Object
const nul = null;            // Null (vacío intencionado)
const und = undefined;       // Undefined (sin valor)
// Operadores
5 === 5      // true (comparación estricta — SIEMPRE usar ===)
5 !== '5'    // true
5 &gt; 3        // true
true &amp;&amp; false // false (AND)
true || false // true (OR)
!true         // false (NOT)
// Template literals
const greeting = `Hello ${name}, count is ${count}`;
// Ternario
const status = count &gt; 0 ? 'positive' : 'zero or negative';
```

### Paso 2 — Funciones y arrow functions (1 hora)

```
// Función clásica
function sum(a, b) {
  return a + b;
}
// Arrow function (lo que Claude usa más)
const sum = (a, b) =&gt; a + b;
// Arrow con cuerpo (múltiples líneas)
const processUser = (user) =&gt; {
  const name = user.name.toUpperCase();
  const age = user.age + 1;
  return { name, age };
};
// Parámetros por defecto
const greet = (name = 'World') =&gt; `Hello ${name}`;
greet();        // "Hello World"
greet('Alice'); // "Hello Alice"
// Rest parameters
const sumAll = (...numbers) =&gt; numbers.reduce((a, b) =&gt; a + b, 0);
sumAll(1, 2, 3, 4); // 10
```
**Recurso:** JavaScript.info — Functions + Arrow functions

### Paso 3 — Objetos y destructuring (1 hora)

Esto es lo que más aparece en código de Claude Code.
```
// Objetos
const user = {
  name: 'Alice',
  age: 30,
  role: 'admin',
  address: {
    city: 'Madrid',
    country: 'Spain'
  }
};
// Acceder a propiedades
user.name           // 'Alice'
user.address.city   // 'Madrid'
user['role']        // 'admin' (acceso dinámico)
// Destructuring — extraer propiedades (Claude usa MUCHO)
const { name, age } = user;
// Equivale a: const name = user.name; const age = user.age;
// Destructuring anidado
const { address: { city } } = user;
// city === 'Madrid'
// Destructuring con rename
const { name: userName } = user;
// userName === 'Alice'
// Spread operator — copiar/combinar objetos
const updated = { ...user, age: 31 };
// Copia user pero con age=31
// Shorthand properties
const name = 'Bob';
const age = 25;
const newUser = { name, age };
// Equivale a: { name: name, age: age }
```
**Recurso:** JavaScript.info — Objects + Destructuring

### Paso 4 — Arrays y métodos funcionales (1 hora)

Claude usa .map(), .filter(), .find() constantemente.
```
const books = [
  { title: 'Clean Code', rating: 4.5 },
  { title: 'Refactoring', rating: 4.8 },
  { title: 'Design Patterns', rating: 3.9 },
];
// .map() — transformar cada elemento
const titles = books.map(book =&gt; book.title);
// ['Clean Code', 'Refactoring', 'Design Patterns']
// .filter() — filtrar elementos
const good = books.filter(book =&gt; book.rating &gt;= 4.5);
// [{ title: 'Clean Code', ... }, { title: 'Refactoring', ... }]
// .find() — encontrar el primero que cumple
const best = books.find(book =&gt; book.rating &gt; 4.7);
// { title: 'Refactoring', rating: 4.8 }
// .reduce() — acumular valor
const avgRating = books.reduce((sum, b) =&gt; sum + b.rating, 0) / books.length;
// 4.4
// .some() / .every()
books.some(b =&gt; b.rating &gt; 4);   // true (al menos uno)
books.every(b =&gt; b.rating &gt; 4);  // false (no todos)
// .forEach() — ejecutar sin retorno
books.forEach(book =&gt; console.log(book.title));
// Spread con arrays
const moreBooks = [...books, { title: 'New Book', rating: 4.0 }];
// Destructuring de arrays
const [first, second, ...rest] = books;
// first = { title: 'Clean Code', ... }
```
**Recurso:** JavaScript.info — Array methods

### Paso 5 — Async/await y Promises (1-2 horas)

Claude genera código asíncrono constantemente (llamadas a APIs, lectura de archivos, etc.). Es el concepto más difícil pero es imprescindible.
```
// Concepto: operaciones que TARDAN (red, disco, DB)
// No bloquean el programa — JavaScript sigue ejecutando
// Promise = "promesa de un valor futuro"
// async/await = forma limpia de trabajar con Promises
// Función async
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  // await = "espera a que termine"
  // El programa NO se bloquea; otras cosas pueden pasar
  if (!response.ok) {
    throw new Error('User not found');
  }
  const user = await response.json();
  // Convierte la respuesta a objeto JavaScript
  return user;
}
// Usar la función async
try {
  const user = await getUser(1);
  console.log(user.name);
} catch (error) {
  console.error('Error:', error.message);
}
// Patrón común en Express (Claude genera esto)
app.get('/api/users/:id', async (req, res) =&gt; {
  try {
    const user = await db.findUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```
**La regla para leerlo:** await = "espera el resultado". async = "esta función contiene awaits". try/catch = "si algo falla,
catch lo maneja".
**Recurso:** JavaScript.info — Async/await (leer también Promises basics para contexto)

### Paso 6 — Módulos, clases y error handling (1 hora)

```
// III Módulos (ya cubierto en Área 3, repaso rápido)
export function sum(a, b) { return a + b; }
export default class UserService { /* ... */ }
import { sum } from './math.js';
import UserService from './services/UserService.js';
// III Clases (Claude las genera para models y services)
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  toJSON() {
    return { name: this.name, email: this.email };
  }
  static fromDB(row) {
    return new User(row.name, row.email);
  }
}
const user = new User('Alice', 'alice@test.com');
user.toJSON(); // { name: 'Alice', email: 'alice@test.com' }
// III Error handling
// throw = lanzar error
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
// try/catch = capturar error
try {
  divide(10, 0);
} catch (err) {
  console.error(err.message); // "Division by zero"
}
```
**Recurso:** JavaScript.info — Classes + Error handling

## Conceptos que NO necesitas antes del programa

Concepto Por qué no DOM manipulation El programa es backend (Node.js), no frontend React, Vue, Angular No se usan Prototypal inheritance Clases modernas son suficientes Generators, iterators Claude los usa raramente Proxy, Reflect Avanzado, no necesario RegExp avanzado Claude los escribe si los necesita TypeScript Opcional, todo funciona con JS puro Web APIs (fetch en browser)
Se usa en Node, no en browser

## Referencia rápida

```
VARIABLES
  const x = 5;              Constante (no cambia)
  let y = 10;               Variable (puede cambiar)
TIPOS
  'string'  42  true  null  undefined  []  {}
FUNCIONES
  function f(a) {}           Clásica
  const f = (a) =&gt; a + 1;   Arrow (1 línea, return implícito)
  const f = (a) =&gt; { ... }  Arrow (múltiples líneas)
OBJETOS
  const { a, b } = obj;     Destructuring
  const nuevo = { ...obj };  Spread (copiar)
  { a, b }                   Shorthand ({ a: a, b: b })
ARRAYS
  arr.map(x =&gt; ...)          Transformar cada elemento
  arr.filter(x =&gt; ...)       Filtrar
  arr.find(x =&gt; ...)         Encontrar primero
  arr.reduce((acc, x) =&gt; ..., init)  Acumular
  [...arr, nuevo]            Spread (copiar + añadir)
ASYNC
  async function f() {}      Función asíncrona
  const data = await f();    Esperar resultado
  try { } catch (err) { }   Manejo de errores
MÓDULOS (ESM)
  export function x() {}    Exportar
  export default class X {} Export default
  import { x } from './f.js' Importar named
  import X from './f.js'     Importar default
CLASES
  class X { constructor() {} }  Definir clase
  new X()                       Crear instancia
  static method() {}            Método de clase
COMPARACIÓN
  ===  !==                   Siempre usar estricto (no == ni !=)
UTILIDADES
  console.log()              Imprimir
  JSON.stringify(obj)        Objeto → string JSON
  JSON.parse(str)            String JSON → objeto
  typeof x                   Tipo de variable
```

## Test de verificación

**Este test NO se ejecuta en terminal.** Es un test de LECTURA. Necesitas poder leer cada bloque y explicar qué hace.

### Bloque 1: ¿Qué retorna esta función?

```
const processBooks = (books) =&gt; {
  return books
    .filter(b =&gt; b.rating &gt;= 4.0)
    .map(b =&gt; ({ ...b, recommended: true }))
    .sort((a, b) =&gt; b.rating - a.rating);
};
```
Filtra libros con rating ≥ 4.0, les añade recommended: true a cada uno (sin modificar el original gracias a spread), y los ordena por rating descendente (mayor primero).

### Bloque 2: ¿Qué hace este endpoint?

```
app.post('/api/users', async (req, res) =&gt; {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }
    const user = await db.createUser({ name, email });
    res.status(201).json({ data: user });
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});
```
Endpoint POST para crear usuario. Destructura name y email del body. Si falta alguno, retorna 400. Si todo ok, crea usuario en DB y retorna 201. Si email duplicado, retorna 409. Cualquier otro error, retorna 500.

### Bloque 3: ¿Qué hace este test?

```
describe('UserService', () =&gt; {
  it('creates user with hashed password', async () =&gt; {
    const user = await UserService.create({
      name: 'Alice',
      email: 'alice@test.com',
      password: 'secret123'
    });
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect(user.password).toBeUndefined();
    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBe('secret123');
  });
});
```
Verifica que al crear un usuario: el nombre y email se guardan correctamente, el password en texto plano NO se almacena (undefined), y se genera un hash del password que es diferente al password original.

### Evaluación

Resultado Siguiente paso

**Entendí los 3 bloques sin problemas**

Pasa a Área 5 (API REST)

**Bloque 1 ok pero Bloque 2 confuso**

Repasa async/await (Paso 5)

**Destructuring y spread me confunden**

Repasa Paso 3 con JavaScript.info — Destructuring

**No entendí casi nada**

Haz el programa completo de JavaScript.info Part 1 (1-2 semanas)

## Recursos adicionales (solo si quieres profundizar)

Recurso Qué aporta Tiempo JavaScript.info — Complete tutorial La referencia más completa y moderna (gratuita)
20-40h Eloquent JavaScript (3rd ed.)
Libro gratuito, profundo, con ejercicios 15-25h freeCodeCamp: JS Algorithms & Data Structures 300 ejercicios interactivos 15-20h Codecademy: Learn JavaScript Interactivo, guiado 10-15h MDN: JavaScript Reference Referencia oficial de cada función/método Referencia
