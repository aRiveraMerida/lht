---
excerpt: "Instalación y uso básico de Node.js y npm, requisito técnico de Claude Code."
---

# Prework Área 3: Node.js y npm

**Objetivo:** Tener Node.js instalado, saber crear un proyecto con npm, ejecutar scripts y tests
**Requisito previo:** Áreas 1-2 (Terminal + Git) completadas

## ¿Por qué es obligatorio?

El curso usa Node.js como stack principal para todos los ejercicios. Claude Code genera código JavaScript/TypeScript que se ejecuta con Node.js. Necesitas:
• Node.js instalado y funcionando (≥18)
• Saber crear un proyecto con npm init
• Instalar dependencias con npm install
• Ejecutar scripts (npm test, npm run build)
• Entender package.json (scripts, dependencies, devDependencies)
• Entender módulos ESM (import/export)
**Nota importante:** No necesitas ser experto en Node.js. Claude escribe el código del servidor. Tú necesitas entender
la **infraestructura** (npm, packages, scripts) y poder **leer** lo que Claude genera.

## Ruta de estudio

### Paso 1 — Instalar Node.js (15 min)

```
# Verificar si ya lo tienes
node --version    # Necesitas ≥18
npm --version     # Viene con Node
# Si no está instalado:
# macOS (Homebrew — recomendado)
brew install node
# macOS/Linux (nvm — recomendado si necesitas múltiples versiones)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Reiniciar terminal, luego:
nvm install 20
nvm use 20
# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Windows (WSL2)
# Instalar dentro de WSL2 con el método Linux de arriba
# Verificar instalación
node --version    # Debe mostrar v20.x.x o similar
npm --version     # Debe mostrar 10.x.x o similar
```
**Si ya tienes Node pero es <18:** Actualiza. Node 16 está fuera de soporte. Node 20 o 22 son las versiones
recomendadas.

### Paso 2 — Entender npm y package.json (1 hora)

Recurso Formato Gratuito Tiempo Lo que aporta Node.js Official:
Introduction Texto 30 min Qué es Node, cómo I funciona, primeros pasos npm Docs: Getting Started Texto 30 min npm init, install,
I scripts, package.json

**Lo que necesitas dominar:**

```
# Crear proyecto nuevo
mkdir mi-proyecto &amp;&amp; cd mi-proyecto
npm init -y
# → Genera package.json con defaults
# Instalar dependencia de producción
npm install express
# → Añade a "dependencies" en package.json
# → Crea node_modules/ y package-lock.json
# Instalar dependencia de desarrollo
npm install --save-dev vitest
# → Añade a "devDependencies"
# Instalar todo (cuando clonas un repo)
npm install
# → Lee package.json e instala todo
```

**Entender package.json:**

```
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "type": "module",          // ← ESM imports (import/export)
  "scripts": {
    "start": "node src/index.js",
    "test": "vitest run",
    "dev": "node --watch src/index.js"
  },
  "dependencies": {
    "express": "^4.18.0"      // ← Producción
  },
  "devDependencies": {
    "vitest": "^1.0.0"        // ← Solo desarrollo/tests
  }
}
```
Campo Qué significa Habilita import/export (ESM) en lugar de require
```
"type": "module"
```
(CommonJS)
Comandos que ejecutas con npm run <nombre>
```
"scripts"
```
Librerías necesarias en producción
```
"dependencies"
```
Librerías solo para desarrollo (tests, lint, etc.)
```
"devDependencies"
```
Carpeta donde npm instala los paquetes. NUNCA la
```
node_modules/
```
commitees a git Versiones exactas de todo. SÍ commitear a git
```
package-lock.json
```

### Paso 3 — Scripts de npm y ejecución (30 min)

```
# Ejecutar scripts definidos en package.json
npm test            # Ejecuta lo que dice "test" en scripts
npm start           # Ejecuta lo que dice "start" en scripts
npm run dev         # Ejecuta lo que dice "dev" en scripts
npm run &lt;cualquiera&gt;  # Ejecuta cualquier script custom
# Ejecutar paquetes instalados sin script
npx vitest run      # Ejecuta vitest directamente
npx eslint .        # Ejecuta eslint directamente
# Ejecutar archivo Node directamente
node src/index.js   # Ejecuta un archivo JavaScript
```
**Diferencia** npm **vs** npx**:**
• npm install → instala paquetes
• npm run X → ejecuta script del package.json
• npx X → ejecuta un paquete directamente (instalado o temporal)

### Paso 4 — Módulos ESM: import/export (30 min)

El curso usa ESM (ECMAScript Modules) con import/export, no CommonJS con require.

**Recurso:**

• Node.js Official: ESM — Guía oficial de ESM en Node

**Lo esencial:**

```
// III Exportar (archivo: src/math.js)
export function sum(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}
// III Importar (archivo: src/app.js)
import { sum, multiply } from './math.js';
console.log(sum(2, 3));       // 5
console.log(multiply(2, 3));  // 6
// III Export default
// src/server.js
export default function createServer() {
  // ...
}
// src/index.js
import createServer from './server.js';
```
**Requisito:** "type": "module" en package.json para que funcione.

### Paso 5 — Testing con Vitest (30 min)

El curso usa Vitest (compatible con Jest) desde M3. No necesitas dominarlo — se enseña en profundidad en M3. Pero necesitas poder EJECUTAR tests.
```
# Setup
npm install --save-dev vitest @vitest/coverage-v8
// package.json — añadir script
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
// tests/sum.test.js
import { describe, it, expect } from 'vitest';
import { sum } from '../src/math.js';
describe('sum', () =&gt; {
  it('adds two positive numbers', () =&gt; {
    expect(sum(1, 2)).toBe(3);
  });
  it('handles zero', () =&gt; {
    expect(sum(0, 5)).toBe(5);
  });
  it('handles negatives', () =&gt; {
    expect(sum(-1, 1)).toBe(0);
  });
});
# Ejecutar
npm test
#  sum &gt; adds two positive numbers
#  sum &gt; handles zero
#  sum &gt; handles negatives
# 3 tests passed
```
**No necesitas más.** El M3 enseña TDD en profundidad. Aquí solo necesitas saber que npm test ejecuta tests y que
los tests usan describe, it, expect.

### Paso 6 (opcional) — Express.js básico (1 hora)

Los ejercicios del curso construyen APIs con Express. Claude escribe el código, pero ayuda entender la estructura.

**Recurso:**

• Express.js: Getting Started — 4 páginas: installing, hello world, routing, generator

**Lo mínimo:**

```
// src/index.js
import express from 'express';
const app = express();
app.use(express.json());  // Parsear JSON en requests
app.get('/api/hello', (req, res) =&gt; {
  res.json({ message: 'Hello World' });
});
app.listen(3000, () =&gt; {
  console.log('Server running on http://localhost:3000');
});
# Ejecutar
node src/index.js
# Server running on http://localhost:3000
# Probar (en otra terminal)
curl http://localhost:3000/api/hello
# {"message":"Hello World"}
```
**No es obligatorio** saber Express antes del curso. Pero si ya lo conoces, irás más rápido en M2-M3.

## Conceptos que NO necesitas antes del curso

Concepto Por qué no Streams, Buffers, Event Loop Se mencionan pero Claude los maneja Clustering, Worker Threads No se usan en el curso TypeScript Opcional, todo funciona con JS puro Frameworks (Nest, Fastify, Koa)
El curso usa Express Bases de datos avanzadas Se usa SQLite (simple), no Postgres/MongoDB Docker / deployment No es foco del curso

## Referencia rápida

```
INSTALACIÓN
  brew install node              macOS con Homebrew
  nvm install 20                 Con nvm (múltiples versiones)
  node --version                 Verificar versión
  npm --version                  Verificar npm
PROYECTO
  npm init -y                    Crear package.json
  npm install express            Instalar dependencia
  npm install --save-dev vitest  Instalar dev dependency
  npm install                    Instalar todo de package.json
EJECUTAR
  node archivo.js                Ejecutar archivo
  npm test                       Ejecutar script "test"
  npm run &lt;script&gt;               Ejecutar cualquier script
  npm start                      Ejecutar script "start"
  npx vitest run                 Ejecutar paquete directamente
MÓDULOS (ESM)
  export function x() {}        Exportar función
  export default x               Exportar por defecto
  import { x } from './file.js' Importar named export
  import x from './file.js'     Importar default export
PACKAGE.JSON CLAVE
  "type": "module"               Habilitar ESM
  "scripts": { "test": "..." }   Scripts ejecutables con npm run
  "dependencies": {}              Librerías de producción
  "devDependencies": {}           Librerías de desarrollo
ARCHIVOS IMPORTANTES
  package.json                   Configuración del proyecto
  package-lock.json              Versiones exactas (commitear)
  node_modules/                  Paquetes instalados (NO commitear)
  .gitignore → node_modules/     Siempre ignorar en git
```

## Test de verificación

```
# === TEST PREWORK ÁREA 3: NODE.JS Y NPM ===
# 1. Verificar instalación
node --version || { echo "I Node.js no instalado"; exit 1; }
npm --version || { echo "I npm no instalado"; exit 1; }
# 2. Crear proyecto
mkdir /tmp/prework-node &amp;&amp; cd /tmp/prework-node
npm init -y
echo '{ "name": "prework-node", "type": "module", "scripts": { "test": "vitest run", "start": "node src/index.js" } }' &
# 3. Instalar dependencias
npm install express
npm install --save-dev vitest
# 4. Verificar node_modules
ls node_modules/express &gt; /dev/null &amp;&amp; echo "I express instalado"
ls node_modules/vitest &gt; /dev/null &amp;&amp; echo "I vitest instalado"
# 5. Crear módulo con ESM
mkdir -p src tests
cat &gt; src/math.js &lt;&lt; 'EOF'
export function sum(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}
EOF
# 6. Crear test
cat &gt; tests/math.test.js &lt;&lt; 'EOF'
import { describe, it, expect } from 'vitest';
import { sum, multiply } from '../src/math.js';
describe('math', () =&gt; {
  it('sums two numbers', () =&gt; {
    expect(sum(2, 3)).toBe(5);
  });
  it('multiplies two numbers', () =&gt; {
    expect(multiply(4, 5)).toBe(20);
  });
});
EOF
# 7. Ejecutar tests
npm test
# Debe mostrar: 2 tests passed
# 8. Crear servidor Express básico
cat &gt; src/index.js &lt;&lt; 'EOF'
import express from 'express';
const app = express();
app.use(express.json());
app.get('/api/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});
const server = app.listen(3456, () =&gt; {
  console.log('Server running on port 3456');
});
// Auto-close after 2 seconds (for test)
setTimeout(() =&gt; { server.close(); process.exit(0); }, 2000);
EOF
# 9. Ejecutar servidor
node src/index.js &amp;
sleep 1
# 10. Probar endpoint
RESPONSE=$(curl -s http://localhost:3456/api/health)
echo "Response: $RESPONSE"
echo "$RESPONSE" | grep -q "ok" &amp;&amp; echo "I Express funciona" || echo "I Express no responde"
wait  # Esperar a que el servidor se cierre solo
# Cleanup
cd /tmp &amp;&amp; rm -rf /tmp/prework-node
echo ""
echo "I Test completado — Node.js y npm dominados"
```

### Evaluación

Resultado Siguiente paso

**Todo funcionó, entiendo package.json y ESM**

Pasa a Área 4 (JavaScript)

**Funcionó pero ESM me confunde**

Lee la guía oficial de ESM y repite

**npm install falló**

Verifica Node ≥18. Si usas nvm: nvm install 20 &&
```
nvm use 20
```

**No tengo Node instalado**

Sigue el Paso 1 de esta guía

## Recursos adicionales (solo si quieres profundizar)

Recurso Qué aporta Tiempo NodeSchool: learnyounode Ejercicios interactivos de Node en tu terminal 3-4h The Odin Project: NodeJS path Currículo completo y gratuito 20-40h W3Schools: Node.js Tutorial Referencia rápida con ejemplos 2-3h freeCodeCamp: Back End Development Proyectos con Node + Express 10-15h npm documentation Referencia oficial de npm Referencia
