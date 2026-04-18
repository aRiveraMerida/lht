---
excerpt: "Integración de Claude Code en pipelines de CI/CD para automatización real."
---

# Módulo 12: Operacionalización y CI/CD

**Duración:** 5-6 horas
**Nivel:** Experto
**Dependencias:** Módulos 1-11 (todo el curso)
**Modalidad:** 100% práctica con deployment en producción
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Usar** claude-code-action (~6.589#) para integrar Claude Code en GitHub Actions
2. **Automatizar code review** en cada PR con Claude
3. **Implementar issue triage** automático con labeling
4. **Configurar security review** en CI con claude-code-security-review
5. **Optimizar costos** con RTK (~12.300#) — reducción de 60-90% de tokens
6. **Ejecutar evals en CI** como quality gate (conexión con M11)
7. **Cerrar el loop** completo: issue → agent → PR → review → merge → monitor

## 1. Fundamentos: De desarrollo local a producción

### 1.1 El gap entre local y CI/CD

**Todo lo que hiciste en M1-M11** fue en tu máquina local:
• Claude Code interactivo en tu terminal
• Supervisión humana (tú apruebas cada acción)
• Un proyecto, un desarrollador
**Producción (M12)** es diferente:
• Claude ejecuta headless en GitHub Actions
• Cero supervisión humana (triggers automáticos)
• Múltiples repos, múltiples triggers, múltiples agentes

### 1.2 Las herramientas del stack de producción

Herramienta Rol
#
anthropics/claude-code-action ~6.589 GitHub Action oficial para Claude Code en CI anthropics/claude-code-security-revie w ~2.800 Security review automatizado en PRs rtk-ai/rtk ~12.300 Proxy CLI que reduce tokens 60-90% Agent SDK (M7/M9)
~5.745 Orquestación programática

### 1.3 Arquitectura del pipeline

```
PRODUCTION PIPELINE
TRIGGERS
Issue opened → Triage Agent (label + assign)
PR opened → Review Agent (security + quality)
Label "agent:implement" → Coding Agent (auto-PR)
Cron (weekly) → Maintenance Agent (refactor)
QUALITY GATES (en cada PR)
Tests (npm test)
Lint + type check
Security review (claude-code-security-review)
Evals (M11 suite)
Human approval (final)
COST OPTIMIZATION
RTK: 60-90% reducción de tokens en cada sesión
```

## 2. claude-code-action: La pieza central

### 2.1 Qué es

claude-code-action es el **GitHub Action oficial de Anthropic** que ejecuta Claude Code en workflows de CI/CD. Es el equivalente headless de lo que haces localmente, pero en GitHub Actions.

### 2.2 Workflow: Code review en cada PR

```
# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Review this PR. Focus on:
            1. Security issues (SQL injection, XSS, auth bypass)
            2. Performance problems (N+1 queries, unnecessary loops)
            3. Missing tests for changed code
            4. Breaking changes not documented
            Be constructive. For each issue, provide:
            - Severity (I Critical / I Warning / I Info)
            - File and line
            - Suggested fix
            If the PR looks good, approve with a brief summary.
          allowed_tools: "Read,Grep,Glob"
          model: "claude-sonnet-4-6"
```

**Qué hace:**

1. Se triggerea en cada PR (opened + synchronize)
2. Ejecuta Claude Code con tools read-only
3. Claude analiza el diff y comenta en la PR
4. Los comentarios aparecen como review de GitHub

### 2.3 Workflow: Issue triage automático

```
# .github/workflows/claude-triage.yml
name: Issue Triage
on:
  issues:
    types: [opened]
jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      issues: write
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Triage this issue:
            Title: ${{ github.event.issue.title }}
            Body: ${{ github.event.issue.body }}
            1. Classify: bug / feature / refactor / question
            2. Estimate complexity: simple / medium / complex
            3. Determine if an agent can implement it (yes/no)
            If agent-implementable:
            - Add label "agent:implement"
            - Comment explaining what the agent will do
            If not:
            - Add appropriate labels (type, priority)
            - Comment with analysis for human developer
          allowed_tools: "Read,Grep,Glob,Bash(gh issue *)"
```

### 2.4 Workflow: Implementación automática (Issue → PR)

```
# .github/workflows/claude-implement.yml
name: Agent Implement
on:
  issues:
    types: [labeled]
jobs:
  implement:
    if: github.event.label.name == 'agent:implement'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Setup
        run: npm install
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Implement this issue:
            Title: ${{ github.event.issue.title }}
            Body: ${{ github.event.issue.body }}
            Workflow:
            1. Read CLAUDE.md for project conventions
            2. Create branch: fix/issue-${{ github.event.issue.number }}
            3. Implement with TDD (tests first)
            4. Run tests to verify
            5. Commit: feat: ${{ github.event.issue.title }} (#${{ github.event.issue.number }})
            6. Push and create PR with "Fixes #${{ github.event.issue.number }}" in body
          allowed_tools: "Read,Write,Edit,Bash,Grep,Glob"
          model: "claude-sonnet-4-6"
          max_turns: 30
```

### 2.5 Security review en CI

```
# .github/workflows/security-review.yml
name: Security Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  security:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-security-review@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```
Este Action específico usa Opus 4.6 para análisis de seguridad profundo. Anthropic reportó 500+ vulnerabilidades encontradas en codebases OSS con este approach.

## 3. RTK: Optimización de costos (60-90% menos tokens)

### 3.1 ¿Qué es RTK?

RTK (Rust Token Killer, ~12.300#) es un proxy CLI que filtra y comprime la salida de comandos antes de que lleguen al contexto del LLM. Binario Rust único, zero dependencias, <10ms de overhead.

**El impacto en una sesión de 30 minutos:**

Operación Frecuencia Sin RTK Con RTK Ahorro 20x 15.500
3.600
-77%
```
git
status/diff/log
```
cat/read archivos 20x 40.000 12.000
-70%
```
npm test / cargo
```
5x 25.000
2.500
-90%
```
test
```
8x 16.000
3.200
-80%
```
grep/rg
```

**Total**

**~118.000**

**~23.900**

**-80%**

### 3.2 Cómo funciona

```
Sin RTK:
Claude  --git status--&gt;  shell  --&gt;  git
  ^
~2,000 tokens (raw)
  +-----------------------------------+
Con RTK:
Claude  --git status--&gt;  RTK  --&gt;  git
  ^
~200 tokens        | filter
  +------- (filtered) ---+----------+
```
RTK aplica 4 estrategias por tipo de comando:
1. **Smart Filtering** — Elimina ruido (comentarios, whitespace, boilerplate)
2. **Grouping** — Agrupa items similares (archivos por directorio, errores por tipo)
3. **Truncation** — Mantiene contexto relevante, corta redundancia
4. **Deduplication** — Colapsa líneas de log repetidas con contadores

### 3.3 Instalación

```
# macOS (Homebrew — recomendado)
brew install rtk
# Linux/macOS (script)
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
# Cargo (desde source)
cargo install --git https://github.com/rtk-ai/rtk
# Verificar
rtk --version
rtk gain    # Estadísticas de ahorro
```

### 3.4 Configurar para Claude Code

```
# Instalar hook global para Claude Code
rtk init --global
# Sigue las instrucciones para registrar en ~/.claude/settings.json
# Reiniciar Claude Code
# Verificar
rtk init --show
```
**Qué hace el hook:** Intercepta comandos Bash de Claude y los reescribe automáticamente:
Comando raw Reescrito a
```
git status
rtk git status
git diff
rtk git diff
cat file.js
rtk read file.js
npm test
rtk test npm test
grep pattern .
rtk grep pattern .
cargo test
rtk cargo test
```
Claude no ve la reescritura — solo recibe output comprimido. 100% transparente.

### 3.5 RTK en CI/CD

```
# En cualquier workflow de GitHub Actions:
steps:
  - name: Install RTK
    run:
      curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
      echo "$HOME/.local/bin" &gt;&gt; $GITHUB_PATH
  - name: Setup RTK hook
    run: rtk init --global --auto-patch
  # Ahora todos los claude-code-action usan RTK automáticamente
  - uses: anthropics/claude-code-action@v1
    with:
      anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
      prompt: "..."
```

### 3.6 Monitorear ahorros

```
# Resumen de ahorros
rtk gain
# Gráfico ASCII (últimos 30 días)
rtk gain --graph
# Historial de comandos
rtk gain --history
# Exportar para dashboards
rtk gain --all --format json
# Oportunidades de ahorro perdidas
rtk discover
```

### 3.7 Ejercicio: Medir impacto de RTK

```
# 1. Sesión SIN RTK (baseline)
# Desactiva RTK temporalmente:
# Edita ~/.claude/settings.json, comenta el hook de RTK
# Trabaja 30 minutos normalmente
# Anota /cost al final
# 2. Sesión CON RTK
# Reactiva RTK
rtk init --global
# Trabaja 30 minutos en las mismas tareas
# Anota /cost al final
# 3. Comparar
rtk gain
# Debería mostrar 60-80% de ahorro
```

## 4. Ejercicio práctico 1: Pipeline completo con claude-code-action

### Objetivo

Configurar 3 workflows de GitHub Actions usando claude-code-action.

### Setup

```
cd library-api  # Tu proyecto del curso
mkdir -p .github/workflows
```

### Crear 3 workflows

```
crea 3 archivos de GitHub Actions:
1. .github/workflows/claude-review.yml
   - Trigger: PR opened/synchronized
   - Action: claude-code-action con prompt de code review
   - Tools: Read, Grep, Glob (solo lectura)
   - Model: claude-sonnet-4-6
2. .github/workflows/claude-triage.yml
   - Trigger: Issue opened
   - Action: claude-code-action con prompt de triage
   - Labels: type (bug/feature), complexity, agent:implement
   - Tools: Read, Grep, Glob, Bash(gh issue *)
3. .github/workflows/claude-implement.yml
   - Trigger: Issue labeled "agent:implement"
   - Action: claude-code-action con prompt de implementación
   - TDD: tests primero
   - Tools: Read, Write, Edit, Bash, Grep, Glob
   - Max turns: 30
   - Crea PR automáticamente
```

### Probar el pipeline

```
# 1. Crear issue
gh issue create \
  --title "Add endpoint GET /api/v1/books/stats" \
  --body "Return total books, average rating, top genres"
# 2. Verificar triage (esperar ~2 min)
gh issue view &lt;N&gt; --json labels
# Debería tener labels: type:feature, complexity:simple, agent:implement
# 3. Esperar implementación (esperar ~5 min)
gh pr list
# Debería haber PR creado por el agent
# 4. Verificar review (esperar ~2 min)
gh pr view &lt;N&gt; --json reviews
# Debería tener review del code review agent
```

### Entregable

1. 3 workflows YAML funcionales
2. Issue triageado automáticamente
3. PR creado por el agent
4. Review automático en la PR
5. Log del pipeline completo (screenshots o gh CLI output)

## 5. Ejercicio práctico 2: RTK en tu workflow diario

### Objetivo

Instalar RTK, medir el impacto en tokens, y configurar para CI/CD.

### Paso 1: Instalar y configurar

```
brew install rtk    # o método alternativo
rtk init --global
# Reiniciar Claude Code
```

### Paso 2: Sesión de trabajo con RTK

```
# Trabajar normalmente durante 30 minutos
# RTK intercepta automáticamente git, cat, npm test, etc.
# Al final:
/cost
rtk gain
rtk gain --graph
```

### Paso 3: Configurar en CI

```
# Agregar RTK a todos los workflows:
- name: Install RTK
  run: curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh &amp;&amp; echo "$HOME/
- name: Setup RTK
  run: rtk init --global --auto-patch
```

### Entregable

1. RTK instalado y funcionando
2. rtk gain output mostrando ahorros
3. Comparación: tokens con vs sin RTK
4. RTK integrado en al menos 1 workflow de CI

## 6. Ejercicio práctico 3: Evals como quality gate en CI

### Objetivo

Integrar la suite de evals de M11 como quality gate bloqueante en el pipeline CI/CD.

### Workflow

```
# .github/workflows/eval-gate.yml
name: Eval Quality Gate
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - name: Install RTK
        run: curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh &amp;&amp; echo "
      - name: Run eval suite
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run:
          rtk init --global --auto-patch
          ./run-all-evals.sh
      - name: Generate dashboard
        run: ./generate-dashboard.sh
      - uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: EVAL_DASHBOARD.md
```
**Si los evals fallan, la PR no se puede mergear** (quality gate bloqueante).

## 7. Ejercicio integrador: Sistema operacional completo

### Descripción

Ensamblar todo el curso en un sistema de producción funcional.

### Componentes del sistema

Componente Módulo de origen Implementación CI/CD CLAUDE.md + rules/ M4 Ya en el repo Skills + plugins M5 Ya en .claude/ Hooks (format, security)
M6 settings.json + CI TDD como estándar M3 Tests en CI Security review M3 claude-code-security-review en CI Code review M8 (write-review)
claude-code-action en PR Issue triage Nuevo en M12 claude-code-action en issues Auto-implementation M7-M10 (harness)
claude-code-action en labels Evals M11 Quality gate en CI Cost optimization M12 RTK en local + CI

### Configuración completa

```
.github/workflows/
claude-review.yml          # Code review en cada PR
claude-triage.yml          # Triage de issues
claude-implement.yml       # Implementación automática
security-review.yml        # Security review (Opus)
eval-gate.yml              # Evals como quality gate
weekly-maintenance.yml     # Refactoring semanal (cron)
```

### Weekly maintenance (cron)

```
# .github/workflows/weekly-maintenance.yml
name: Weekly Maintenance
on:
  schedule:
    - cron: '0 9 * * 1'  # Lunes 9 AM
jobs:
  maintenance:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Install RTK
        run: curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh &amp;&amp; echo "
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Weekly maintenance tasks:
            1. Run /security-review — fix any Critical findings
            2. Check test coverage — add tests for uncovered code
            3. Update outdated dependencies (patch versions only)
            4. Create PR with all changes
            Title: "chore: weekly maintenance $(date +%Y-%m-%d)"
          allowed_tools: "Read,Write,Edit,Bash,Grep,Glob"
          max_turns: 25
```

### Test end-to-end

```
# 1. Crear issue
gh issue create --title "Add pagination to GET /books" \
  --body "Implement cursor-based pagination with limit and cursor params"
# 2. Esperar pipeline (5-10 min):
#    Triage → label → implement → PR → review → security → evals
# 3. Verificar
gh issue view &lt;N&gt; --json labels    # Triageado
gh pr list                          # PR creada
gh pr view &lt;PR&gt; --json reviews      # Review + security
gh pr checks &lt;PR&gt;                   # Evals passed
# 4. Merge si todo pasa
gh pr merge &lt;PR&gt; --squash
```

### Entregable

1. **6 workflows YAML** funcionales en .github/workflows/
2. **RTK configurado** en local y CI
3. **Pipeline completo** probado: issue → triage → implement → review → evals → merge
4. **Métricas:**
• Tokens ahorrados con RTK (rtk gain)
• Tiempo del pipeline completo (issue → merge)
• Evals passing rate
• Security findings corregidos
5. **PRODUCTION_REPORT.md:**
• Arquitectura del sistema (diagrama)
• Workflows configurados y su trigger
• Quality gates activos
• Costo estimado mensual (tokens × precio)
• RTK savings (% reducción)
• Qué funciona bien, qué mejorarías
• ¿Implementarías esto en un proyecto real?

## 8. Conceptos clave para memorizar

### claude-code-action = Claude Code en CI

```
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "..."
    allowed_tools: "Read,Grep,Glob"
    model: "claude-sonnet-4-6"
    max_turns: 30
```

### RTK = 60-90% menos tokens

```
brew install rtk
rtk init --global        # Hook para Claude Code
rtk gain                 # Ver ahorros
rtk discover             # Oportunidades perdidas
```

### Pipeline de producción

```
Issue → Triage Agent → Label
Label → Coding Agent → PR
PR → Review Agent → Comments
PR → Security Review → Findings
PR → Evals → Quality gate
PR → Human approval → Merge
```

### Quality gates

```
Tests + Lint + Type check → Código funciona
Security review → Código es seguro
Evals → Agente produce calidad esperada
Human approval → Decisión final
```

## 9. Antipatrones a evitar

**claude-code-action sin allowed_tools** → Claude con acceso total en CI = riesgo → limitar herramientas por
workflow
**Sin RTK en CI** → Cada sesión consume 3-5x más tokens de lo necesario → instalar RTK siempre
**Sin security review en PR** → Vulnerabilidades llegan a producción → claude-code-security-review en cada PR
**Merge automático sin human approval** → Agente puede introducir bugs sutiles → siempre require approval
**Sin evals como gate** → No sabes si el agente está produciendo calidad → evals bloqueantes
**Secrets en logs** → ANTHROPIC_API_KEY visible en logs de CI → usar GitHub Secrets siempre
**Sin rate limiting** → 100 issues = 100 sesiones simultáneas = $$$$ → limitar concurrencia

## 10. Recursos complementarios

### Repositorios oficiales

• anthropics/claude-code-action (~6.589#) — GitHub Action oficial
• anthropics/claude-code-security-review (~2.800#) — Security review en CI
• rtk-ai/rtk (~12.300#) — Token optimization proxy

### Documentación oficial

• Claude Code in CI/CD — Guía de integración
• Manage costs — Optimización de costos
• RTK Documentation — Guía completa de RTK

### Lecturas

• Anthropic: Claude Code Best Practices — Sección de CI/CD
• RTK README_es.md — Documentación en español

## 11. Checklist de finalización del módulo

Configuré claude-code-action para code review en PRs Configuré triage automático de issues Configuré implementación automática (issue → PR)
Configuré security review en CI Configuré evals como quality gate Instalé y configuré RTK (local + CI)
Medí ahorro de tokens con rtk gain Pipeline completo funciona: issue → triage → implement → review → evals → merge Weekly maintenance cron configurado Métricas documentadas (tiempo, costo, tokens, quality)
PRODUCTION_REPORT.md con análisis completo

## Conclusión de M12

Este módulo introdujo las herramientas operacionales: RTK para optimización de costos, claude-code-action para CI/CD, y security review en producción. El **Módulo 13** profundiza en pipelines avanzados, PR-from-anywhere, monitoreo, safeguards de producción, y el sistema operacional completo.

## Próximos pasos

En **Módulo 13: CI/CD avanzado y producción** aprenderás:
• PR-from-anywhere (comment, label, cron, review triggers)
• Pipelines multi-stage con quality gates escalonados
• Auto-fix de review comments
• Monitoreo con dashboard semanal y alertas
• Safeguards: rate limiting, cost caps, rollback automático
• Reusable workflows para multi-repo
• El sistema operacional completo (13 módulos ensamblados)
**Conexión con M12:** M12 configuró los building blocks (RTK, claude-code-action, security review). M13 los ensambla
en un sistema de producción con pipelines, monitoreo y safeguards.
