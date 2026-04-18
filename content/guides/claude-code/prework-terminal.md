---
excerpt: "Ruta de estudio de terminal y línea de comandos como prerrequisito del curso."
---

# Prework Área 1: Terminal y línea de comandos

**Objetivo:** Moverte por la terminal con soltura, sin buscar cada comando
**Plataformas:** macOS (Terminal/iTerm2) · Linux (cualquier terminal) · Windows (WSL2)

## ¿Por qué es obligatorio?

Claude Code vive en la terminal. No tiene interfaz gráfica. Cada interacción — desde instalar Claude hasta ejecutar tests, ver archivos, hacer commits — ocurre en la línea de comandos. Si no puedes navegar con fluidez, Claude Code será frustrante en lugar de productivo.

**Lo que Claude Code espera de ti:**

• Abrir terminal y navegar a tu proyecto (cd)
• Leer archivos y buscar texto (cat, grep)
• Crear estructuras de directorios (mkdir -p)
• Entender output de comandos (errores, logs, tests)
• Encadenar comandos con pipes (|, >, >>)
• Usar variables de entorno (export, $VAR)

## Ruta de estudio

### Paso 1 — Entender qué es la terminal (30 min)

Lee UNO de estos (elige según tu sistema operativo):
Recurso Plataforma Formato Idioma Command line crash course — MDN Todas Texto EN Terminal para principiantes — Ubuntu Linux Texto EN macOS Terminal —
Academind (YouTube)
macOS Video 31min EN
**Qué sacar:** Qué es la terminal, cómo abrirla, concepto de "comandos", concepto de directorio actual.

### Paso 2 — Comandos esenciales (2-3 horas)

Este es el bloque principal. Necesitas practicar HACIENDO, no solo leyendo.

**Recurso principal (elige UNO):**

Recurso Formato Interactivo Tiempo Nivel Learn Enough Command Line —
Michael Hartl Texto + ejercicios 3-4h Desde cero I freeCodeCamp:
Command Line Handbook Texto largo No 2-3h Desde cero Codecademy: Learn the Command Line Interactivo en browser 3-4h Desde cero I Ryan's Tutorials:
Linux Tutorial Texto + ejercicios 4-5h Desde cero I
**Mi recomendación:** Si nunca has usado terminal, empieza por **Codecademy** (interactivo, no necesitas configurar
nada). Si ya has usado terminal pero quieres afianzar, **Learn Enough Command Line** es más rápido y práctico.

**Qué cubrir obligatoriamente (en el orden que sea):**

#
Tema Comandos Practica hasta que...
1 Navegación
```
pwd, cd, ls, ls -la
```
Puedas ir a cualquier directorio sin pensar 2 Crear/borrar
```
mkdir, mkdir -p,
```
Puedas crear estructura de proyecto en 30 seg
```
touch, rm, rm -rf,
rmdir
```
3 Ver archivos
```
cat, head, tail, less,
```
Puedas inspeccionar cualquier archivo rápido
```
wc -l
```
4 Copiar/mover
```
cp, cp -r, mv
```
Entiendas la diferencia entre copiar y mover 5 Buscar
```
grep, grep -r, find
```
Puedas encontrar texto en archivos del proyecto 6 Permisos
```
chmod +x, ls -la
```
(leer permisos)
Puedas hacer un script ejecutable 7 Redirección
>, >>, `\
, 2>&1` Puedas guardar output en archivo y encadenar 8 Variables
```
export VAR=value,
```
Entiendas variables de entorno
```
echo $VAR, $HOME,
$PATH
```
9 Miscelánea
```
which, man, clear,
```
Puedas buscar ayuda por ti mismo
```
history, !!
```

### Paso 3 — Pipes y redirección (1 hora)

Este concepto específico es el que más se usa con Claude Code (output de un comando como input de otro).

**Recurso específico:**

• The Missing Semester (MIT) — Lección 1: Shell Tools — Excelente sección sobre pipes y redirección

**Practica estos patrones:**

```
# Encadenar comandos
ls -la | grep ".js"              # Listar solo archivos .js
cat package.json | grep "test"   # Buscar "test" en package.json
history | grep "git" | tail -5   # Últimos 5 comandos con "git"
# Redirigir output
echo "hello" &gt; file.txt          # Crear archivo con contenido
echo "world" &gt;&gt; file.txt         # Añadir al final
ls -la &gt; listing.txt             # Guardar listado en archivo
npm test 2&gt;&amp;1 | tee output.log   # Ver output Y guardarlo
# Variables
export PORT=3000
echo "Server on port $PORT"
echo "Home: $HOME"
echo "Path: $PATH"
```

### Paso 4 — Scripts bash básicos (1 hora)

Claude Code genera scripts bash y tú necesitas leerlos. No necesitas ser experto, pero sí entender la estructura.

**Recurso:**

• The Missing Semester (MIT) — Lección 2: Shell Scripting — Sección de scripting

**Lo mínimo que necesitas entender:**

```
#!/bin/bash
# Esto es un comentario
# Variables
NAME="proyecto"
COUNT=0
# Condicionales
if [ -f "package.json" ]; then
  echo "Es un proyecto Node.js"
else
  echo "No es Node.js"
fi
# Loops
for file in *.js; do
  echo "Archivo: $file"
  COUNT=$((COUNT + 1))
done
echo "Total: $COUNT archivos JS"
# Argumentos
# Si ejecutas: ./script.sh hola mundo
# $1 = "hola", $2 = "mundo", $# = 2
echo "Primer argumento: $1"
echo "Número de argumentos: $#"
```
**No necesitas memorizar la sintaxis.** Solo necesitas poder LEER un script y entender qué hace. Claude escribe los
scripts; tú los validas.

## Referencia rápida

Imprime o guarda esta tabla. La usarás constantemente durante el curso:
```
NAVEGACIÓN
  pwd                  Dónde estoy
  cd ~/projects        Ir a directorio
  cd ..                Subir un nivel
  cd -                 Volver al anterior
  ls                   Listar archivos
  ls -la               Listar con detalles y ocultos
ARCHIVOS
  cat file.txt         Ver contenido
  head -20 file.txt    Primeras 20 líneas
  tail -20 file.txt    Últimas 20 líneas
  touch file.txt       Crear archivo vacío
  cp orig.txt copia.txt  Copiar
  mv viejo.txt nuevo.txt Renombrar/mover
  rm file.txt          Borrar archivo
  rm -rf directorio/   Borrar directorio y contenido
DIRECTORIOS
  mkdir nombre         Crear directorio
  mkdir -p a/b/c       Crear anidados
  rmdir nombre         Borrar directorio vacío
BUSCAR
  grep "texto" file    Buscar en archivo
  grep -r "texto" .    Buscar en todos los archivos
  grep -rn "texto" .   Buscar con número de línea
  find . -name "*.js"  Encontrar archivos por nombre
REDIRECCIÓN
  cmd &gt; file           Output a archivo (sobrescribe)
  cmd &gt;&gt; file          Output a archivo (añade)
  cmd1 | cmd2          Pipe: output de cmd1 → input de cmd2
  cmd 2&gt;&amp;1             Redirigir errores junto con output
VARIABLES
  export VAR=valor     Definir variable de entorno
  echo $VAR            Mostrar variable
  echo $HOME           Directorio home
  echo $PATH           Rutas de ejecutables
PERMISOS
  chmod +x script.sh   Hacer ejecutable
  ls -la               Ver permisos (rwxrwxrwx)
UTILIDADES
  which node           Dónde está un ejecutable
  man ls               Manual de un comando
  history              Historial de comandos
  clear / Ctrl+L       Limpiar pantalla
  Ctrl+C               Cancelar comando
  Ctrl+D               Cerrar terminal
```

## Test de verificación

Ejecuta este bloque completo **sin buscar nada**. Si todo funciona y entiendes cada línea, estás listo.
```
# === TEST PREWORK ÁREA 1: TERMINAL ===
# 1. Crear estructura de proyecto
mkdir -p /tmp/prework-terminal/src/utils /tmp/prework-terminal/tests
cd /tmp/prework-terminal
# 2. Crear archivos con contenido
echo '{"name": "prework-test", "version": "1.0.0"}' &gt; package.json
echo 'export function sum(a, b) { return a + b; }' &gt; src/utils/math.js
echo 'export function greet(name) { return `Hello ${name}`; }' &gt; src/utils/strings.js
echo '// TODO: write tests' &gt; tests/math.test.js
echo 'console.log("app started");' &gt; src/index.js
# 3. Verificar estructura
ls -la
ls -R src/
# 4. Buscar texto
grep -r "export" src/
grep -rn "TODO" .
# 5. Contar archivos
find . -name "*.js" | wc -l
# Debe retornar: 4
# 6. Pipes y redirección
cat package.json | grep "name"
ls -la src/utils/ | grep ".js" &gt; js_files.txt
cat js_files.txt
# 7. Variables
export PROJECT_NAME="prework-test"
echo "Project: $PROJECT_NAME"
echo "Home: $HOME"
echo "Current dir: $(pwd)"
# 8. Permisos
echo '#!/bin/bash' &gt; run.sh
echo 'echo "running"' &gt;&gt; run.sh
chmod +x run.sh
./run.sh
# Debe imprimir: running
# 9. Cleanup
cd /tmp
rm -rf /tmp/prework-terminal
echo ""
echo "I Test completado — estás listo para el curso"
```

### Evaluación

Resultado Siguiente paso

**Todo funcionó sin buscar**

Pasa a Área 2 (Git)

**Funcionó pero tuve que recordar algún comando**

Repasa la referencia rápida y repite el test mañana

**Varios comandos no los conocía**

Haz el Paso 2 completo (Codecademy o Learn Enough) y repite el test

**No sé qué es una terminal**

Empieza por el Paso 1 y dedica 1 semana a este área

## Recursos adicionales (solo si quieres profundizar)

Estos NO son necesarios para el curso, pero te harán más productivo:
Recurso Qué aporta Tiempo The Missing Semester (MIT) —
Lecciones 1-5 Profundidad en shell, scripting, regex, data wrangling 10h Explain Shell Pega cualquier comando y te explica cada parte Referencia tldr pages Alternativa a man con ejemplos prácticos Referencia Boot.dev: Learn Linux Curso gamificado, ejecutas en tu terminal 8-10h Bash scripting cheatsheet Referencia rápida de sintaxis bash Referencia
