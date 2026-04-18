---
excerpt: "Evals: cómo medir y mejorar objetivamente la calidad del trabajo del agente."
---

# Módulo 11: Sistema de evaluaciones (Evals)

## 1. Fundamentos: Evals = TDD para agentes

### 1.1 El problema sin evals

```
# Mejoras el CLAUDE.md de tu harness overnight
# +200 líneas en instrucciones
# Ejecutas de nuevo
./overnight.sh 10 8
# ¿Es mejor o peor que antes?
# No sabes. Solo "parece" funcionar.
# Tal vez mejoró en una cosa y empeoró en tres.
```

**Con evals:**

```
# Antes del cambio
./run-evals.sh
# 18/25 passing (72%)
# Cambias CLAUDE.md
# ...
# Después del cambio
./run-evals.sh
# 22/25 passing (88%) → Mejora MEDIBLE: +16%
# Pero eval #7 (debugging) regresionó → detectado inmediatamente
```

### 1.2 La analogía con TDD (M3)

TDD (M3)
Evals (M11)
Tests validan **código**
Evals validan **agentes**
Red → Green → Refactor Fail → Improve prompt/harness → Pass Test se convierte en regression test Capability eval se convierte en regression eval Coverage mide completitud Pass rate mide capability npm test verifica
```
./run-evals.sh verifica
```

### 1.3 Anatomía de un eval

```
EVAL
INPUT (Task)          EXPECTED OUTPUT
"Implement FizzBuzz"  "Function that..."
AGENT EXECUTION
claude -p "task" → output
GRADER (compare actual vs expected)
PASS / I FAIL + score
```

**4 componentes:**

1. **Task:** Input que se le da al agente (markdown, prompt)
2. **Expected output:** Qué debería producir (código, comportamiento, test que pasa)
3. **Agent execution:** Claude ejecuta la tarea (claude -p)
4. **Grader:** Evalúa si el output es correcto (code-based, model-based, hybrid)

### 1.4 Capability vs Regression testing

**Capability testing:** "¿Puede el agente hacer X?"
• ¿Puede implementar una API REST desde spec?
• ¿Puede refactorizar sin romper tests?
• ¿Puede debuggear un error de producción?
**Regression testing:** "¿Sigue funcionando Y después de cambios?"
• Cambié CLAUDE.md → ¿las capabilities previas están intactas?
• Actualicé el modelo → ¿se perdieron habilidades?
**El ciclo:** Capability test pasa → se convierte en regression test. Regression test falla → capability se perdió →
investigar.

## 2. El roadmap de 8 pasos (Anthropic)

Anthropic documenta esta progresión de madurez para evals:
```
Step 1: Ejecutar manualmente, revisar visualmente
Step 2: Automatizar ejecución, revisar visualmente
Step 3: Escribir assertions explícitas
Step 4: Automatizar assertions (graders)
Step 5: Hacer reproducible con pass@k
Step 6: Expandir cobertura de evals
Step 7: Optimizar velocidad (paralelización)
Step 8: Ejecutar en CI (continuo)
```

### Steps 1-2: Manual → Automatizado

```
# Step 1: Manual (ejecutas y miras)
claude -p "$(cat evals/fizzbuzz/task.md)" &gt; evals/fizzbuzz/output.js
cat evals/fizzbuzz/output.js  # "¿Se ve bien?"
# Step 2: Script (automatiza ejecución, pero aún miras)
./run-eval.sh evals/fizzbuzz
cat evals/fizzbuzz/output.js  # Aún revisas tú
```

### Steps 3-4: Assertions → Graders automáticos

```
# Step 3: Assertions explícitas
# evals/fizzbuzz/assertions.json
{
  "assertions": [
    { "type": "file_exists", "file": "output.js" },
    { "type": "tests_pass", "command": "node test.js" },
    { "type": "contains", "pattern": "function fizzbuzz" }
  ]
}
# Step 4: Grader automático
./grade-eval.sh evals/fizzbuzz
# [1/3] File exists:
# [2/3] Tests pass:
# [3/3] Contains function:
# Result: 3/3 (100%) → PASS
```

### Step 5: pass@k para reproducibilidad

El agente no es determinista. Un eval puede pasar una vez y fallar la siguiente. **pass@k** resuelve esto:
```
pass@k = "Ejecutar k veces, pasa si AL MENOS 1 de k tiene éxito"
Fórmula: pass@k = 1 - (1 - p)^k
donde p = probabilidad de éxito en un solo intento
Ejemplo con p=70%:
- pass@1 = 70% (solo 1 intento)
- pass@3 = 97% (3 intentos, al menos 1 pasa)
- pass@5 = 99.8%
```
**k=3 es el sweet spot:** Balance entre costo (3 ejecuciones) y confiabilidad (97% con p=70%).
```
#!/bin/bash
# run-eval-passk.sh
EVAL_DIR=$1
K=${2:-3}
SUCCESSES=0
for i in $(seq 1 $K); do
  claude -p "$(cat $EVAL_DIR/task.md)" -w --max-turns 15 &gt; $EVAL_DIR/output_$i.js
  if (cd $EVAL_DIR &amp;&amp; node test.js output_$i.js 2&gt;/dev/null); then
    SUCCESSES=$((SUCCESSES + 1))
  fi
done
echo "pass@$K: $SUCCESSES/$K successful"
[ $SUCCESSES -gt 0 ] &amp;&amp; echo "I PASS" || echo "I FAIL"
```

### Steps 6-7: Expandir y paralelizar

```
# Step 6: Suite de evals por categoría
evals/
code-generation/     # Generar código desde spec
01-fizzbuzz/
02-rest-api/
03-data-parser/
refactoring/         # Mejorar código existente
04-extract-function/
05-remove-duplication/
debugging/           # Encontrar y corregir bugs
06-fix-failing-test/
07-resolve-null-pointer/
integration/         # Features completas
08-add-auth/
09-add-search/
# Step 7: Paralelo con xargs
find evals/ -name "task.md" -exec dirname {} \; | \
  xargs -P 5 -I {} ./run-eval-passk.sh {} 3
```

### Step 8: CI continuo

```
# .github/workflows/evals.yml
name: Agent Evals
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 */6 * * *'  # Cada 6 horas
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Run eval suite: ./run-all-evals.sh"
      - uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: evals/*/result.txt
```

## 3. Tres tipos de graders

### 3.1 Code-based grader (determinista)

Código determinista evalúa el output. Rápido, barato, reproducible.
```
// evals/02-rest-api/grader.js
import { spawn } from 'child_process';
import fetch from 'node-fetch';
async function grade() {
  // Start the agent's output as server
  const server = spawn('node', ['output.js']);
  await new Promise(r =&gt; setTimeout(r, 2000));
  const results = [];
  try {
    // Test 1: GET /users returns array
    const res = await fetch('http://localhost:3000/users');
    const data = await res.json();
    results.push({ test: 'GET /users', pass: Array.isArray(data) });
    // Test 2: POST creates user
    const create = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test@test.com' })
    });
    results.push({ test: 'POST /users', pass: create.status === 201 });
    // ... más tests
  } finally {
    server.kill();
  }
  const passed = results.filter(r =&gt; r.pass).length;
  console.log(`${passed}/${results.length} passed`);
  process.exit(passed === results.length ? 0 : 1);
}
grade();
```
**Cuándo usar:** Output es comportamiento observable (API responde, tests pasan, archivo tiene estructura correcta).

### 3.2 Model-based grader (LLM judge)

Otro LLM evalúa la calidad del output. Flexible, puede juzgar aspectos cualitativos.
```
// evals/04-refactor/model-grader.js
import Anthropic from '@anthropic-ai/sdk';
async function grade(originalCode, refactoredCode) {
  const anthropic = new Anthropic();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Grade this refactoring on a scale of 1-5:
ORIGINAL:
${originalCode}
REFACTORED:
${refactoredCode}
CRITERIA:
1. Functionally equivalent (same behavior)
2. More readable (better names, smaller functions)
3. No unnecessary complexity added
4. Tests still pass (if mentioned)
Respond with ONLY a JSON: {"score": N, "reason": "..."}`
    }]
  });
  const result = JSON.parse(response.content[0].text);
  console.log(`Score: ${result.score}/5 — ${result.reason}`);
  process.exit(result.score &gt;= 4 ? 0 : 1);  // Pass if score &gt;= 4
}
```
**Cuándo usar:** Aspectos cualitativos (readability, naming, design quality) que código no puede juzgar.
**Cuidado:** Model-based graders cuestan API calls y son no-deterministas. Usar como complemento de code-based, no
como reemplazo.

### 3.3 Hybrid grader (lo mejor de ambos)

```
// Grade en dos fases:
// 1. Code-based: ¿funciona? (determinista)
// 2. Model-based: ¿es bueno? (cualitativo)
async function hybridGrade() {
  // Phase 1: Tests pass? (determinista)
  const testsPass = await runTests();
  if (!testsPass) {
    console.log("I FAIL: Tests don't pass (code-based)");
    return process.exit(1);
  }
  // Phase 2: Code quality? (LLM judge)
  const qualityScore = await modelGradeQuality();
  if (qualityScore &lt; 4) {
    console.log(`II PASS with warnings: Quality ${qualityScore}/5`);
    return process.exit(0);  // Pass but flag
  }
  console.log(`I PASS: Tests pass + Quality ${qualityScore}/5`);
  process.exit(0);
}
```

## 4. Ejercicio práctico 1: Tu primera suite de evals

### Objetivo

Crear 5 evals con graders automatizados y ejecutarlos con pass@3.

### Setup

```
mkdir eval-suite &amp;&amp; cd eval-suite
git init
npm init -y
npm install @anthropic-ai/sdk
mkdir -p evals/{01-fizzbuzz,02-sort-array,03-validate-email,04-parse-csv,05-rest-endpoint}
```

### Crear 5 evals

```
crea 5 evals en el directorio evals/. Para cada eval:
1. task.md — Prompt de la tarea para Claude
2. test.js — Tests que verifican el output
3. grader.sh — Script que ejecuta claude -p, genera output, corre tests
evals/01-fizzbuzz/
  task.md: "Implement fizzbuzz(n) function in output.js"
  test.js: Assertions para 3, 5, 15, 7
evals/02-sort-array/
  task.md: "Implement sortByKey(array, key) that sorts objects by key"
  test.js: Assertions para arrays de objetos
evals/03-validate-email/
  task.md: "Implement validateEmail(email) returning boolean"
  test.js: Assertions para emails válidos e inválidos
evals/04-parse-csv/
  task.md: "Implement parseCSV(text) that returns array of objects"
  test.js: Assertions con CSV de ejemplo
evals/05-rest-endpoint/
  task.md: "Create Express server with GET /items endpoint"
  test.js: HTTP assertions con fetch
Cada grader.sh debe:
1. Ejecutar claude -p "$(cat task.md)" -w --max-turns 10 &gt; output.js
2. Ejecutar node test.js
3. Exit 0 si pasa, exit 1 si falla
```

### Ejecutar con pass@3

```
# Un eval
./run-eval-passk.sh evals/01-fizzbuzz 3
# Todos los evals
find evals/ -name "grader.sh" -exec dirname {} \; | \
  xargs -P 3 -I {} ./run-eval-passk.sh {} 3
# Resultados
echo "III EVAL RESULTS III"
for dir in evals/*/; do
  name=$(basename $dir)
  result=$(cat $dir/result.txt 2&gt;/dev/null || echo "NOT RUN")
  echo "$name: $result"
done
```

### Entregable

1. 5 evals con task.md, test.js, grader.sh
2. pass@3 results para los 5
3. Al menos 4/5 pasando
4. Log con output de cada ejecución

## 5. Ejercicio práctico 2: Saturation testing

### Objetivo

Ejecutar un eval 30 veces para medir la tasa de éxito real (p) y calcular pass@k.

### Saturation test

```
#!/bin/bash
# saturation-test.sh
EVAL_DIR=$1
N=${2:-30}
SUCCESSES=0
echo "Saturation test: $EVAL_DIR ($N runs)"
for i in $(seq 1 $N); do
  claude -p "$(cat $EVAL_DIR/task.md)" -w --max-turns 10 &gt; $EVAL_DIR/output_sat_$i.js 2&gt;/dev/null
  if (cd $EVAL_DIR &amp;&amp; node test.js output_sat_$i.js 2&gt;/dev/null); then
    SUCCESSES=$((SUCCESSES + 1))
  fi
  echo -n "."
done
P=$(echo "scale=2; $SUCCESSES / $N" | bc)
PASS_AT_3=$(echo "scale=4; 1 - (1 - $P)^3" | bc)
echo ""
echo "III Saturation Results III"
echo "Success rate (p): $P ($SUCCESSES/$N)"
echo "pass@1: $P"
echo "pass@3: $PASS_AT_3"
```

**Interpretar resultados:**

```
Success rate (p): 0.73 (22/30)
pass@1: 0.73     → 73% de confiabilidad con 1 intento
pass@3: 0.98     → 98% con 3 intentos → I Muy confiable
Si p &lt; 0.50:
→ El agente no es capaz de esta tarea consistentemente
→ Mejorar prompt/instrucciones/contexto
Si p &gt; 0.80:
→ pass@1 es suficiente, no necesitas pass@3
```

### Entregable

1. Saturation test ejecutado (30 runs) para 2 evals
2. Cálculo de p y pass@k
3. Análisis: ¿qué eval es más confiable? ¿por qué?

## 6. Eval-driven development (EDD)

### 6.1 El concepto

EDD es TDD aplicado a agentes: escribes un eval que FALLA, mejoras el agente hasta que PASA, y el eval se convierte en regression test.
```
1. Escribir eval para nueva capability    (RED)
2. Eval falla                             (expected)
3. Mejorar CLAUDE.md / harness / prompt
4. Ejecutar eval de nuevo
5. Repetir 3-4 hasta que pase             (GREEN)
6. Eval se convierte en regression test
```

### 6.2 Ejercicio: EDD para debugging de race condition

```
# Step 1: Crear eval que FALLA
mkdir -p evals/debugging/race-condition
# task.md: Código con race condition + pedirle a Claude que lo debuggee
# test.js: Verificar que el fix resuelve la race condition
# Step 2: Ejecutar → FALLA (el agente no sabe debuggear race conditions)
./run-eval-passk.sh evals/debugging/race-condition 3
# I FAIL at pass@3 (0/3)
# Step 3: Mejorar CLAUDE.md con instrucciones de debugging
# Agregar a .claude/rules/debugging.md:
# "Para race conditions:
#  1. Identificar shared state
#  2. Buscar accesos concurrentes sin lock
#  3. Usar mutex/semaphore o hacer operación atómica
#  4. Agregar test que reproduce el timing"
# Step 4: Ejecutar de nuevo
./run-eval-passk.sh evals/debugging/race-condition 3
# I FAIL at pass@3 (1/3) → Mejora, pero no suficiente
# Step 5: Refinar más
# Agregar ejemplos concretos de race conditions y fixes
# Step 6: Ejecutar
./run-eval-passk.sh evals/debugging/race-condition 3
# I PASS at pass@3 (2/3) → Success!
# Step 7: Saturation test
./saturation-test.sh evals/debugging/race-condition 30
# p=0.67 → pass@3=0.96 → Confiable
# Step 8: Eval es ahora regression test permanente
```

### Entregable

1. Eval que inicialmente falla
2. 2-3 iteraciones de mejora de CLAUDE.md/rules/
3. Eval que finalmente pasa
4. Saturation test confirmando confiabilidad

## 7. Ejercicio integrador: Suite completa con dashboard

### Descripción

Crear suite de 10+ evals en 4 categorías con dashboard de resultados.

### Categorías

```
evals/
code-generation/        # Generar código desde spec
01-fizzbuzz/
02-sort-array/
03-rest-endpoint/
refactoring/            # Mejorar código existente
04-extract-function/
05-remove-duplication/
debugging/              # Encontrar y corregir bugs
06-fix-null-pointer/
07-fix-off-by-one/
08-fix-race-condition/
integration/            # Features completas con TDD
09-add-auth/
10-add-search/
```

### Dashboard de resultados

```
#!/bin/bash
# generate-dashboard.sh
echo "# Eval Dashboard" &gt; EVAL_DASHBOARD.md
echo "" &gt;&gt; EVAL_DASHBOARD.md
echo "Updated: $(date)" &gt;&gt; EVAL_DASHBOARD.md
echo "" &gt;&gt; EVAL_DASHBOARD.md
TOTAL=0; PASSED=0
for category in code-generation refactoring debugging integration; do
  echo "## $category" &gt;&gt; EVAL_DASHBOARD.md
  for dir in evals/$category/*/; do
    name=$(basename $dir)
    result=$(cat $dir/result.txt 2&gt;/dev/null || echo "NOT RUN")
    TOTAL=$((TOTAL + 1))
    [[ "$result" == *"PASS"* ]] &amp;&amp; PASSED=$((PASSED + 1))
    icon=$([[ "$result" == *"PASS"* ]] &amp;&amp; echo "I" || echo "I")
    echo "- $icon $name: $result" &gt;&gt; EVAL_DASHBOARD.md
  done
  echo "" &gt;&gt; EVAL_DASHBOARD.md
done
echo "## Summary" &gt;&gt; EVAL_DASHBOARD.md
echo "**Overall: $PASSED/$TOTAL ($((PASSED * 100 / TOTAL))%)**" &gt;&gt; EVAL_DASHBOARD.md
```

### Entregable

1. **10+ evals** en 4 categorías
2. **Graders:** Mix de code-based y model-based
3. **pass@3** para todos los evals
4. **Saturation test** para 3 evals críticos
5. **1 ciclo EDD** completo (eval falla → mejora → eval pasa)
6. **EVAL_DASHBOARD.md** generado
7. **CI workflow** (GitHub Actions) corriendo la suite
8. **EVAL_ANALYSIS.md:**
• Fortalezas del agente (categorías >80%)
• Debilidades (categorías <70%)
• Acciones de mejora basadas en datos
• Comparación: antes y después de EDD

## 8. Conceptos clave para memorizar

### Evals = TDD para agentes

```
Tests → validan código
Evals → validan agentes
Test falla → código está mal
Eval falla → agente necesita mejores instrucciones
```

### El roadmap de 8 pasos

```
1. Manual + eyeball → 8. CI continuo
Cada paso añade automatización y confiabilidad.
```

### pass@k

```
pass@k = 1 - (1 - p)^k
k=3 es el sweet spot:
  p=70% → pass@3 = 97%
  p=50% → pass@3 = 88%
  p=30% → pass@3 = 66% → agente no es capaz
```

### 3 tipos de graders

```
Code-based: Determinista, rápido, barato → ¿funciona?
Model-based: Cualitativo, flexible, cuesta API → ¿es bueno?
Hybrid: Primero code-based, luego model-based → best of both
```

### Capability → Regression

```
Nuevo eval: "¿puede debuggear race conditions?"
  Falla → EDD → Mejora → Pasa
  Ahora es regression test: "¿SIGUE pudiendo?"
```

## 9. Antipatrones a evitar

**Sin evals** → No sabes si mejoraste o empeoraste tu harness/prompt
**Solo eyeballing** → No escala, no reproducible, sesgado
**Solo pass@1** → Alta varianza, fallas aleatorias → usar pass@3
**Solo code-based graders** → No capturan calidad, solo funcionalidad → complementar con model-based
**Solo model-based graders** → Caros, no-deterministas → usar code-based como base
**Evals sin categorización** → No sabes dónde el agente es débil → taxonomía clara
**Evals solo al final del proyecto** → No guían desarrollo → EDD desde el inicio
**Saturation testing con N=5** → Muy pocos samples para estimar p → usar N=30+

## 10. Recursos complementarios

### Documentación oficial

• Anthropic: Building Effective Evals — Roadmap de 8 pasos
• Claude Code Action (~6.589#) — CI/CD con Claude (preview M12)

### Benchmarks de referencia

• SWE-bench — Eval suite para software engineering agents
• HumanEval — Benchmark de generación de código

### Lecturas

• Anthropic: Claude Code Best Practices — Evals — Sección de evaluaciones
• Anthropic: Effective Harnesses — Evals integrados en harnesses

