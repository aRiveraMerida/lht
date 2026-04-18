---
excerpt: "Fundamentos de Git imprescindibles antes de empezar con Claude Code."
---

# Prework Área 2: Git

## ¿Por qué es obligatorio?

Claude Code genera commits automáticamente. Crea branches, hace merges, trabaja en worktrees. Si no entiendes git, no podrás:
• Validar que los commits de Claude tienen sentido
• Resolver conflictos cuando aparezcan
• Revertir cambios si Claude rompe algo
• Entender el patrón de worktrees (M7-M8)
• Usar git log como memoria entre sesiones (M10)

**Lo que Claude Code espera de ti:**

• Inicializar un repo y hacer tu primer commit antes de empezar a trabajar con Claude
• Leer git status y git diff para entender qué cambió
• Crear branches para features (Claude trabaja en branches)
• Mergear trabajo terminado a main
• Hacer push a un remoto (GitHub)

## Ruta de estudio

### Paso 1 — Entender qué es Git y por qué existe (30 min)

Recurso Formato Tiempo Lo que aporta Git - The Simple Guide Página web, visual 15 min La esencia de git en 1 página. Sin distracciones Atlassian: What is Git Texto + diagramas 15 min Contexto: por qué existe, qué problema resuelve
**Qué sacar:** Git es un sistema de control de versiones. Guarda "fotos" (commits) de tu proyecto. Puedes volver a
cualquier foto anterior. Múltiples personas pueden trabajar en paralelo (branches).

### Paso 2 — Flujo básico: init → add → commit → status → log (2 horas)

Este es el 80% de lo que necesitas. Practica hasta que sea automático.

**Recurso principal (elige UNO):**

Recurso Formato Interactivo Gratuito Tiempo Learn Git Branching Visual interactivo en browser 2-3h I I W3Schools: Git Tutorial Texto + ejercicios 2-3h I I Atlassian: Getting Started Texto + diagramas No 2h I Boot.dev: Learn Git Gamificado, en tu terminal Freemium 4-5h I
**Mi recomendación:** Empieza por **Learn Git Branching** (interactivo, visual, gratuito). Hazlo hasta completar la sección
"Main" (primeros ~10 niveles). Luego practica en tu terminal real.

**Qué cubrir obligatoriamente:**

#
Tema Comandos Practica hasta que...
1 Inicializar Puedas crear un repo en 5
```
git init
```
segundos 2 Estado Puedas leer el output sin
```
git status
```
confundirte (staged, modified, untracked)
3 Añadir
```
git add ., git add file
```
Entiendas staging area (archivos "preparados"
para commit)
4 Commit Puedas commitear con
```
git commit -m "mensaje"
```
mensaje descriptivo 5 Historial
```
git log --oneline, git
```
Puedas navegar el historial
```
log -5
```
6 Diferencias
```
git diff, git diff
```
Puedas leer un diff (+ = añadido, - = eliminado)
```
--staged
```
7 Ignorar Sepas ignorar
```
.gitignore
```
node_modules, .env, etc.

### Paso 3 — Branches y merge (1-2 horas)

Branches es el concepto que más usa Claude Code. Cada feature va en su branch.

**Recurso específico:**

• Learn Git Branching — Secciones "Ramping Up" y "Moving Work Around" (niveles 10-20)
• Atlassian: Using Branches — Explicación con diagramas

**Qué cubrir:**

#
Tema Comandos Practica hasta que...
1 Crear branch
```
git checkout -b
```
Puedas crear branch + moverte en 1 comando
```
feature/x o git switch -c
feature/x
```
2 Listar branches
```
git branch, git branch -a
```
Sepas en qué branch estás 3 Cambiar branch
```
git checkout main o git
```
Te muevas sin miedo
```
switch main
```
4 Merge Entiendas qué pasa
```
git merge feature/x
```
(fast-forward vs merge commit)
5 Borrar branch Limpies después de
```
git branch -d feature/x
```
mergear 6 Conflictos Editar archivo conflictuado,
No entres en pánico cuando aparezcan marcadores <<<<<<<
```
git add, git commit
```

**Patrón que usarás en el programa (memoriza):**

```
# 1. Crear branch para feature
git checkout -b feature/auth
# 2. Trabajar (Claude hace commits aquí)
# ... editar archivos ...
git add .
git commit -m "feat: add JWT authentication"
# 3. Volver a main y mergear
git checkout main
git merge feature/auth --no-ff -m "Merge feature: auth"
# 4. Limpiar
git branch -d feature/auth
```

### Paso 4 — Remotos: push, pull, clone (1 hora)

Necesitas saber interactuar con GitHub (el remoto).

**Recurso:**

• GitHub Docs: Getting Started — Secciones "Push" y "Pull"
• Atlassian: Syncing — push, pull, fetch explicados

**Qué cubrir:**

#
Comando Qué hace 1 Descargar un repo remoto a tu
```
git clone url
```
máquina 2 Ver qué remoto está configurado
```
git remote -v
```
3 Subir tus commits al remoto
```
git push origin main
```
4 Subir branch nueva al remoto
```
git push -u origin feature/x
```
5 Traer cambios del remoto
```
git pull origin main
```
6 Traer info del remoto sin mergear
```
git fetch
```

### Paso 5 — Operaciones de rescate (30 min)

Cuando Claude Code rompe algo, necesitas saber revertir. Esto no se enseña en tutoriales básicos pero es crítico.

**Recurso:**

• Oh Shit, Git!?! — Soluciones a los problemas más comunes de git. Directo, sin rodeos.

**Comandos de rescate:**

```
# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1
# Deshacer último commit (perder cambios)
git reset --hard HEAD~1
# Descartar cambios en un archivo
git checkout -- archivo.js
# o en git moderno:
git restore archivo.js
# Descartar TODOS los cambios locales
git checkout .
# o:
git restore .
# Guardar cambios temporalmente
git stash
# Recuperar
git stash pop
# Ver qué se hizo (para debug)
git reflog
```

## Conceptos que NO necesitas antes del programa

Estos se enseñan en los módulos correspondientes:
Concepto Dónde se enseña Git worktrees M7-M8 (Claude Code -w flag)
Conventional Commits (feat:, fix:)
M2 (workflow)
Git hooks (pre-commit, etc.)
M6 (hooks de Claude Code, no git hooks)
Rebase interactivo No se usa en el programa Cherry-pick No se usa en el programa Submodules No se usa en el programa

## Referencia rápida

```
SETUP
  git init                     Crear repo nuevo
  git clone &lt;url&gt;              Clonar repo remoto
  git config user.name "Nombre"   Configurar nombre
  git config user.email "email"   Configurar email
FLUJO BÁSICO
  git status                   Ver estado (¡ÚSALO SIEMPRE!)
  git add .                    Añadir todo al staging
  git add archivo              Añadir archivo específico
  git commit -m "mensaje"      Crear commit
  git log --oneline            Ver historial compacto
  git log --oneline -10        Últimos 10 commits
  git diff                     Ver cambios no staged
  git diff --staged            Ver cambios staged
BRANCHES
  git branch                   Listar branches
  git checkout -b nombre       Crear y mover a branch
  git checkout main            Mover a main
  git merge nombre             Mergear branch actual con 'nombre'
  git branch -d nombre         Borrar branch (ya mergeada)
REMOTOS
  git remote -v                Ver remotos
  git push origin main         Subir a remoto
  git push -u origin branch    Subir branch nueva
  git pull origin main         Traer cambios
  git fetch                    Traer info sin mergear
RESCATE
  git reset --soft HEAD~1      Deshacer último commit (mantener cambios)
  git reset --hard HEAD~1      Deshacer último commit (perder cambios)
  git restore archivo          Descartar cambios en archivo
  git stash / git stash pop    Guardar/recuperar cambios temporalmente
  git reflog                   Historial completo (para debug)
IGNORAR ARCHIVOS
  # .gitignore
  node_modules/
  .env
  dist/
  *.log
```

## Test de verificación

Ejecuta este bloque completo **sin buscar nada**. Si todo funciona y entiendes cada paso, estás listo.
```
# === TEST PREWORK ÁREA 2: GIT ===
# 1. Crear repo con configuración
mkdir /tmp/prework-git &amp;&amp; cd /tmp/prework-git
git init
git config user.name "Prework Test"
git config user.email "test@test.com"
# 2. Primer commit
echo '{"name": "git-test"}' &gt; package.json
echo "node_modules/" &gt; .gitignore
git add .
git commit -m "chore: initial setup"
# 3. Verificar
git status
# Debe decir: "nothing to commit, working tree clean"
git log --oneline
# Debe mostrar 1 commit
# 4. Crear branch y trabajar
git checkout -b feature/auth
echo 'export function login() { return true; }' &gt; auth.js
git add auth.js
git commit -m "feat: add login function"
echo 'export function logout() { return false; }' &gt;&gt; auth.js
git add .
git commit -m "feat: add logout function"
# 5. Ver diferencias entre branches
git log --oneline
# Debe mostrar 3 commits (initial + 2 de auth)
# 6. Volver a main y verificar aislamiento
git checkout main
ls auth.js 2&gt;/dev/null &amp;&amp; echo "ERROR: auth.js no debería estar en main" || echo "I auth.js no existe en main
# 7. Merge
git merge feature/auth --no-ff -m "Merge feature: auth"
ls auth.js &amp;&amp; echo "I auth.js ahora está en main"
git log --oneline
# Debe mostrar 4 entries (initial + 2 auth + merge commit)
# 8. Limpiar branch
git branch -d feature/auth
git branch
# Solo debe mostrar: * main
# 9. Simular rescate
echo "BREAKING CHANGE" &gt;&gt; auth.js
git status
# Debe mostrar: modified auth.js
git restore auth.js
git status
# Debe decir: "nothing to commit"
# 10. Stash
echo "WIP: work in progress" &gt; temp.js
git add temp.js
git stash
git status
# Debe decir: "nothing to commit"
git stash pop
git status
# Debe mostrar: temp.js de vuelta
# Cleanup
cd /tmp &amp;&amp; rm -rf /tmp/prework-git
echo ""
echo "I Test completado — Git dominado"
```

### Evaluación

Resultado Siguiente paso

**Todo funcionó, entendí cada comando**

Pasa a Área 3 (Node.js y npm)

**Funcionó pero branches me confunden**

Haz 10 niveles más de Learn Git Branching

**Varios comandos desconocidos**

Haz el Paso 2 completo y repite el test

**No tengo git instalado**

```
Instala git: brew install git (mac) / sudo apt install
```
git (linux)

## Recursos adicionales (solo si quieres profundizar)

Recurso Qué aporta Tiempo Pro Git Book (cap. 1-3)
La biblia de git. Gratuito, completo 6-8h Oh Shit, Git!?!
Soluciones a problemas comunes 30 min GitByBit Curso interactivo dentro de VS Code 3-4h Git Cheat Sheet (GitHub)
PDF imprimible con todos los comandos Referencia Visualizing Git Herramienta visual para entender commits/branches Referencia
