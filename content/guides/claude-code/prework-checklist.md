---
title: "Prework — Checklist general"
date: "2026-04-18"
description: "Verificación rápida de todas las áreas de prework con test ejecutable."
excerpt: "Tiempo estimado: 2-4 horas (si ya tienes la base) / 1-2 semanas (si partes de cero en algún área) Objetivo: Verificar que tienes todo lo necesario antes de empezar el Módulo 1…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Prework: Conocimientos previos y preparación

**Tiempo estimado:** 2-4 horas (si ya tienes la base) / 1-2 semanas (si partes de cero en algún área)
**Objetivo:** Verificar que tienes todo lo necesario antes de empezar el Módulo 1

## ¿Para quién es este curso?

Este curso está diseñado para **profesionales técnicos que quieren dominar Claude Code Console como**
**herramienta de desarrollo**. No necesitas ser developer senior, pero sí necesitas soltura con terminal, git y al menos
un lenguaje de programación.

**Perfil ideal:**

• Developers (junior a senior) que quieren multiplicar su productividad
• Tech leads que quieren evaluar Claude Code para sus equipos
• Consultores de IA que necesitan dominar la herramienta para formar a otros
• DevOps/SRE que quieren integrar agentes en CI/CD

**No es para ti si:**

• Nunca has abierto una terminal
• No sabes qué es git ni un commit
• No has programado en ningún lenguaje
• Buscas un curso de "qué es la IA" (esto es 100% práctico)

## 1. Terminal / Línea de comandos

### Lo que necesitas saber

Debes poder moverte por la terminal sin buscar cada comando. El curso asume que sabes:
Comando Qué hace Ejemplo Cambiar directorio
```
cd
cd
~/projects/mi-app
ls / ls -la
```
Listar archivos
```
ls -la src/
```
Crear directorios
```
mkdir -p
```
(anidados)
```
mkdir -p
src/routes tests/
cat / head / tail
```
Ver contenido de archivos
```
cat package.json
```
Crear archivo vacío
```
touch
touch src/index.js
```
cp / mv / rm Copiar, mover, eliminar
```
cp template.md
CLAUDE.md
```
Imprimir / escribir a
```
echo
```
archivo
```
echo "hello" >
file.txt
```
Buscar texto en
```
grep
```
archivos
```
grep -r "TODO"
src/
```
Cambiar permisos
```
chmod
chmod +x script.sh
```
Hacer HTTP
```
curl
```
requests
```
curl http://localh
ost:3000/api
pipe (\
```
)
Encadenar comandos `cat file.txt \ grep "error"`
> / >>
Redirigir output
```
echo "line" >>
log.txt
```
Variables Definir y usar
```
NAME="test"; echo
$NAME
```
Variables de entorno
```
export
export PORT=3000
which / type
```
Encontrar ejecutables
```
which node
```

### Checklist de verificación

```
# Ejecuta estos comandos. Si todos funcionan, estás listo.
mkdir -p /tmp/prework-test &amp;&amp; cd /tmp/prework-test
echo '{"name": "test"}' &gt; package.json
cat package.json | grep name
ls -la
rm -rf /tmp/prework-test
# ¿Todo funcionó sin googlear? I Estás listo
# ¿Tuviste que buscar algo? → Repasa los recursos abajo
```

### Recursos para ponerse al día

• The Missing Semester (MIT) — Lecciones 1-4 (terminal, shell scripting)
• Linux Command Line Basics (freeCodeCamp) — Referencia rápida
• **Tiempo estimado:** 4-8 horas si partes de cero

## 2. Git

### Lo que necesitas saber

El curso usa git en CADA módulo. Claude Code genera commits, crea branches, y trabaja con worktrees. Necesitas entender qué está haciendo.
Concepto Comando Debes saber Inicializar repo Qué es un repositorio
```
git init
```
Añadir cambios
```
git add . / git add file
```
Staging area Commit Qué es un commit, por qué importa el
```
git commit -m "mensaje"
```
mensaje Ver estado Leer el output (staged, modified,
```
git status
```
untracked)
Ver historial Navegar el historial
```
git log --oneline
```
Crear branch Qué es una rama y por qué
```
git checkout -b feature/x
```
Cambiar de branch Moverse entre ramas
```
git checkout main
```
Merge Unir trabajo de dos ramas
```
git merge feature/x
```
Ver diferencias Leer un diff (+ y - )
```
git diff
```
Push / Pull Relación local ↔ remoto
```
git push origin main
```
Stash
```
git stash / git stash pop
```
Guardar cambios temporalmente .gitignore
```
Editar .gitignore
```
Qué archivos excluir
**Conceptos avanzados que se enseñan en el curso** (no necesitas saberlos antes):
• Git worktrees (-w en M7-M8) — se explica
• Conventional Commits (feat:, fix:) — se explica
• Cherry-pick, rebase — no se usan

### Checklist de verificación

```
# Crea repo, haz commit, crea branch, mergea
mkdir /tmp/git-test &amp;&amp; cd /tmp/git-test
git init
echo "hello" &gt; README.md
git add . &amp;&amp; git commit -m "initial commit"
git checkout -b feature/test
echo "feature" &gt;&gt; README.md
git add . &amp;&amp; git commit -m "add feature"
git checkout main
git merge feature/test
git log --oneline
# Deberías ver 2 commits
rm -rf /tmp/git-test
```

### Recursos para ponerse al día

• Git - The Simple Guide — 15 minutos, lo esencial
• Learn Git Branching — Interactivo, visual, excelente
• Pro Git Book (capítulos 1-3) — Si quieres profundidad
• **Tiempo estimado:** 4-8 horas si partes de cero

## 3. Node.js y npm

### Lo que necesitas saber

Los ejercicios del curso usan Node.js como stack principal. No necesitas ser experto en JavaScript — Claude escribe la mayoría del código. Pero necesitas entender la estructura de un proyecto Node.js.
Concepto Comando/archivo Debes saber Instalar Node
```
node --version (≥18)
```
Tener Node 18+ instalado Inicializar proyecto Qué genera package.json
```
npm init -y
```
Instalar dependencias node_modules, package-lock
```
npm install express
```
Dev dependencies Diferencia prod vs dev
```
npm install --save-dev vitest
```
Ejecutar scripts
```
npm test, npm run build
```
Sección "scripts" de package.json ESM imports Diferencia con require()
```
import x from 'x'
```
package.json Habilitar ESM
```
"type": "module"
```

### Checklist de verificación

```
# Verificar Node.js instalado
node --version    # Debe ser ≥18
npm --version     # Debe funcionar
# Crear proyecto básico
mkdir /tmp/node-test &amp;&amp; cd /tmp/node-test
npm init -y
npm install --save-dev vitest
# Crear test simple
cat &gt; test.js &lt;&lt; 'EOF'
import { describe, it, expect } from 'vitest';
describe('test', () =&gt; {
  it('works', () =&gt; {
    expect(1 + 1).toBe(2);
  });
});
EOF
# Ejecutar
npx vitest run test.js
#  1 test passed
rm -rf /tmp/node-test
```

**Si Node no está instalado:**

```
# macOS
brew install node
# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Verificar
node --version &amp;&amp; npm --version
```

### Recursos para ponerse al día

• Node.js Official: Getting Started — Oficial, conciso
• JavaScript.info (Parte 1) — Fundamentos de JS si necesitas
• **Tiempo estimado:** 2-4 horas si ya programas en otro lenguaje

## 4. JavaScript básico

### Lo que necesitas saber

No necesitas ser experto en JavaScript. Claude escribe el código. Pero necesitas LEER y ENTENDER lo que Claude genera para validarlo.
Concepto Ejemplo Debes poder Funciones
```
function sum(a, b) { return a +
```
Leer y entender
```
b; }
```
Arrow functions Reconocer la sintaxis
```
const sum = (a, b) => a + b;
```
async/await Entender qué es asíncrono
```
const data = await fetch(url);
```
Destructuring Leer sin confundirte
```
const { name, age } = user;
```
Template literals ` Hello ${name} ` Usarlos en prompts Módulos (ESM)
```
export function x() {} / import {
```
Entender imports/exports
```
x } from './file.js'
```
Arrays
```
.map(), .filter(), .reduce()
```
Leer transformaciones Objetos JSON y objetos JS
```
{ key: value }
```
Try/catch Manejo de errores
```
try { ... } catch (err) { ... }
```
Classes Leer OOP básico
```
class User { constructor() {} }
```

### Checklist de verificación

```
// ¿Puedes leer este código y entender qué hace?
export async function getUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`User ${id} not found`);
    }
    const { name, email, role } = await response.json();
    return { name, email, isAdmin: role === 'admin' };
  } catch (err) {
    console.error('Failed to get user:', err.message);
    return null;
  }
}
// Si entiendes:
// 1. Que es async y retorna una Promise
// 2. Que await espera la respuesta
// 3. Que destructura name, email, role del JSON
// 4. Que retorna un objeto nuevo con isAdmin calculado
// 5. Que catch maneja errores
// → I Estás listo
```

### Recursos para ponerse al día

• JavaScript.info — Partes 1 y 2 (fundamentos + objetos)
• MDN Web Docs: JavaScript Guide — Referencia oficial
• **Tiempo estimado:** 1-2 semanas si vienes de otro lenguaje / 3-4 semanas si es tu primer lenguaje

## 5. API REST (conceptos)

### Lo que necesitas saber

Varios ejercicios del curso construyen APIs REST. No necesitas haber creado una, pero necesitas entender los conceptos.
Concepto Qué es Ejemplo Endpoint URL que recibe requests
```
GET /api/v1/books
```
HTTP methods Verbo de la acción GET (leer), POST (crear), PATCH (actualizar), DELETE (borrar)
Status codes Código de respuesta 200 (ok), 201 (creado), 400 (error cliente), 404 (no encontrado), 500 (error servidor)
JSON Formato de datos
```
{"name": "Alice", "age": 30}
```
Request body Datos que envías
```
POST /users con {"name": "Alice"}
```
Query params Filtros en URL
```
GET /books?genre=fiction&page=2
```
Headers Metadatos del request
```
Content-Type: application/json,
Authorization: Bearer xxx
```

### Checklist de verificación

```
¿Puedes explicar qué hace cada línea?
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"title": "Clean Code", "isbn": "9780132350884"}'
# Respuesta: 201 Created
# {"data": {"id": "uuid", "title": "Clean Code"}}
# Si sabes que:
# 1. POST = crear recurso
# 2. -H = headers
# 3. -d = body en JSON
# 4. 201 = recurso creado exitosamente
# → I Estás listo
```

### Recursos para ponerse al día

• RESTful API Design (Microsoft) — Conceptos claros
• HTTP Status Codes (httpstatuses.com) — Referencia rápida
• **Tiempo estimado:** 2-4 horas

## 6. GitHub y GitHub CLI (gh)

### Lo que necesitas saber

El curso usa GitHub para repositories y GitHub CLI para automatización (especialmente M12-M13).
Necesitas Cómo verificar Cuenta de GitHub github.com → Sign in GitHub CLI instalado
```
gh --version
```
Autenticado con gh
```
gh auth status
```
Saber crear repo
```
gh repo create o desde web
```
Saber crear issues
```
gh issue create
```
Saber crear PRs
```
gh pr create
```

### Instalación de GitHub CLI

```
# macOS
brew install gh
# Linux
sudo apt install gh   # Ubuntu/Debian
sudo dnf install gh   # Fedora
# Autenticar
gh auth login
# Sigue las instrucciones (browser flow recomendado)
# Verificar
gh auth status
#  Logged in to github.com
```

### Recursos

• GitHub CLI Manual — Referencia oficial
• **Tiempo estimado:** 30 minutos

## 7. Editor de código

### Recomendado: VS Code

Claude Code funciona en terminal, pero necesitas un editor para revisar código. VS Code es el estándar de la industria y se integra con Claude Code via /ide.
```
# Verificar instalación
code --version
# Si no está instalado:
# macOS: brew install --cask visual-studio-code
# Linux: snap install code
# O descargar desde: https://code.visualstudio.com/
```
**Alternativas válidas:** Cualquier editor que puedas usar para leer/editar archivos. Vim, Neovim, Sublime, JetBrains,
etc. Lo importante es que puedas revisar el código que Claude genera.

## 8. Cuenta de Anthropic y Claude Code

### Lo que necesitas ANTES de empezar M1

Requisito Cómo obtener Cuenta de Anthropic console.anthropic.com → Sign up Plan con acceso a Claude Code Plan Pro, Team o Enterprise (verificar en claude.ai/settings)
API key (para M7+)
console.anthropic.com → API Keys

### Instalación de Claude Code

```
# Instalar
claude install
# Verificar
claude --version
claude doctor
# Si claude doctor pasa todos los checks → I listo
```
**Nota:** La instalación detallada se cubre en M1. Pero tener Claude Code instalado y autenticado ANTES de empezar
ahorra tiempo.

## 9. Primer contacto con Claude Code

Antes de empezar M1, completa una sesión guiada de 30 minutos con Claude Code para familiarizarte con:
• La diferencia entre Claude.ai (chat) y Claude Code (agente que actúa en tu proyecto)
• Cómo dar instrucciones claras a un LLM (ser específico, dar contexto, iterar, pedir verificación)
• Qué pasa cuando Claude Code crea archivos, ejecuta comandos y hace commits en tu proyecto real
**Guía detallada:** prework_09_primer_contacto.md — Incluye sesión guiada paso a paso con 7 instrucciones.

## 10. Conocimientos opcionales (mejoran la experiencia)

No son obligatorios, pero te dan ventaja:
Conocimiento Dónde ayuda Nivel necesario

**Python**

M3 (adaptación TDD), M9 (Agent SDK)
Leer y ejecutar scripts

**TypeScript**

Variante de ejercicios Leer código con tipos

**Docker**

Ejercicios opcionales, capstone P5
```
docker run, docker compose up
```

**SQL**

Ejercicios con SQLite SELECT, INSERT, CREATE TABLE

**Testing**

M3 (TDD)
Concepto de test unitario

**CI/CD**

M12-M13 Concepto de pipeline

**tmux**

M8 (claude-squad)
Navegación básica
**Guías opcionales detalladas:** prework_10_11_opcionales.md
**El curso enseña todo lo que necesitas de estas herramientas.** Si ya las conoces, avanzarás más rápido. Si no, los
módulos explican lo necesario.

## 11. Checklist final de preparación

Marca todo lo que puedas hacer SIN buscar en Google:

### Obligatorio (bloquea si no lo tienes)

Navegar la terminal (cd, ls, mkdir, cat, grep)
Crear scripts bash sencillos (variables, echo, pipes)
Git: init, add, commit, branch, merge, push, status, log, diff Node.js ≥18 instalado (node --version)
npm: init, install, run scripts Leer código JavaScript (funciones, async/await, imports)
Entender API REST (métodos HTTP, status codes, JSON)
GitHub account + GitHub CLI instalado y autenticado Editor de código funcional Claude Code instalado y claude doctor pasa Completé la sesión guiada de primer contacto (Área 9)

### Recomendado (mejora la experiencia)

Python 3.10+ instalado (para M9 Agent SDK)
Concepto de tests unitarios (assert, expect)
Concepto de CI/CD (qué es un pipeline, qué es GitHub Actions)
SQL básico (SELECT, INSERT, CREATE TABLE)
tmux básico (para M8 claude-squad)

### Cómo saber si estás listo

```
# El test definitivo: ejecuta esto sin ayuda
mkdir /tmp/prework-final &amp;&amp; cd /tmp/prework-final
git init
npm init -y
npm install --save-dev vitest
echo '{ "type": "module", "scripts": { "test": "vitest run" } }' &gt; package.json
cat &gt; sum.js &lt;&lt; 'EOF'
export function sum(a, b) {
  return a + b;
}
EOF
cat &gt; sum.test.js &lt;&lt; 'EOF'
import { describe, it, expect } from 'vitest';
import { sum } from './sum.js';
describe('sum', () =&gt; {
  it('adds two numbers', () =&gt; {
    expect(sum(1, 2)).toBe(3);
  });
});
EOF
npm test
git add . &amp;&amp; git commit -m "feat: add sum with test"
git log --oneline
rm -rf /tmp/prework-final
# Si esto funcionó sin errores y entiendes cada línea:
# I Estás 100% preparado para el Módulo 1
```

## Tiempo estimado de preparación

Tu situación Tiempo de prework Developer con experiencia en JS/Node/Git
**0h** — verifica checklist y empieza M1
Developer en otro lenguaje (Python, Java, Go)
**4-8h** — familiarizarte con Node.js/npm
Junior developer con algo de terminal y git
**1-2 semanas** — reforzar git, JS, API REST
Sin experiencia en terminal
**3-4 semanas** — hacer cursos de terminal + git + JS
primero
**Recomendación:** Si el checklist obligatorio tiene más de 3 ítems sin marcar, invierte el tiempo en ponerte al día
ANTES de empezar. El curso avanza rápido y asume que la base está sólida.
