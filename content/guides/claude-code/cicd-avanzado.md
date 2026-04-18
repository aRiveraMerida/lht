---
excerpt: "Patrones avanzados de CI/CD con Claude Code en entornos productivos."
---

# Módulo 13: CI/CD avanzado y operaciones en

**Duración:** 5-6 horas
**Nivel:** Experto
**Dependencias:** Módulos 1-12 (especialmente M11 Evals y M12 claude-code-action + RTK)
**Modalidad:** 100% práctica con pipelines reales en GitHub Actions
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Diseñar pipelines multi-stage** con quality gates escalonados
2. **Implementar PR-from-anywhere** — cualquier evento GitHub genera PRs automáticas
3. **Configurar issue triage + auto-implementación + auto-review** como pipeline unificado
4. **Orquestar múltiples repos** con workflows compartidos
5. **Monitorear agentes en producción** con métricas, alertas y dashboards
6. **Implementar safeguards de producción** — rate limiting, cost caps, rollback
7. **Cerrar el loop completo** del curso: idea → issue → agent → PR → review → evals → merge → deploy

## 1. De M12 a producción real

### 1.1 Lo que M12 cubre vs lo que falta

En M12 configuraste los building blocks: claude-code-action, security review, RTK, y evals como quality gate. Este módulo los ensambla en un **sistema operacional completo** con:
• **Pipelines multi-stage** que encadenan agentes
• **PR-from-anywhere** para cualquier trigger
• **Monitoreo** con métricas de éxito, costo y tiempo
• **Safeguards** para producción (rate limits, cost caps, rollback)
• **Multi-repo** para organizaciones con muchos proyectos

### 1.2 Arquitectura operacional completa

```
PRODUCTION AGENT SYSTEM
TRIGGERS                          AGENTS
Issue opened IIIIIIIIIIIIIII  Triage Agent
Label "agent:implement" III  Coding Agent
PR opened IIIIIIIIIIIIIIIIII  Review Agent
PR opened IIIIIIIIIIIIIIIIII  Security Agent
Cron (weekly) IIIIIIIIIIIIII  Maintenance Agent
Comment "/agent fix..." III  Quick-fix Agent
QUALITY GATES (cada PR)
Tests III Lint III Type check
Security review (claude-code-security-review)
Evals suite (M11)
Human approval (required)
MONITORING
Success rate por agente
Cost tracking (tokens × precio)
RTK savings (rtk gain --format json)
Alertas (Slack/email si failure rate &gt; threshold)
```

## 2. PR-from-anywhere: cualquier evento → PR automática

### 2.1 El concepto

En lugar de que solo issues con label generen PRs, cualquier evento GitHub puede triggear un agente que crea una PR:
Trigger Evento GitHub Agente Output Issue abierto + label Coding Agent PR con implementación
```
issues.labeled
```
Comentario /agent fix Quick-fix Agent PR con fix
```
issue_comment.created
...
```
PR con review "request changes"
Fix Agent Commit en la PR
```
pull_request_review.subm
itted
```
Cron semanal Maintenance Agent PR con refactor
```
schedule
```
Push a main Docs Agent PR actualizando docs
```
push
```

### 2.2 Comment-triggered agent

```
# .github/workflows/comment-agent.yml
name: Comment-Triggered Agent
on:
  issue_comment:
    types: [created]
jobs:
  agent:
    if: startsWith(github.event.comment.body, '/agent')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Parse command
        id: parse
        run:
          COMMENT="${{ github.event.comment.body }}"
          # /agent implement: Add pagination to /books
          # /agent fix: Login fails with special characters
          # /agent refactor: Extract auth middleware
          ACTION=$(echo "$COMMENT" | sed 's|/agent ||' | cut -d: -f1 | tr -d ' ')
          TASK=$(echo "$COMMENT" | sed 's|/agent [^:]*:||')
          echo "action=$ACTION" &gt;&gt; $GITHUB_OUTPUT
          echo "task=$TASK" &gt;&gt; $GITHUB_OUTPUT
      - name: Install RTK
        run:
          curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
          echo "$HOME/.local/bin" &gt;&gt; $GITHUB_PATH
          rtk init --global --auto-patch
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Task: ${{ steps.parse.outputs.task }}
            Action: ${{ steps.parse.outputs.action }}
            Triggered by comment on issue #${{ github.event.issue.number }}
            1. Create branch: ${{ steps.parse.outputs.action }}/issue-${{ github.event.issue.number }}
            2. Implement with TDD
            3. Run tests
            4. Commit and create PR with "Closes #${{ github.event.issue.number }}"
          allowed_tools: "Read,Write,Edit,Bash,Grep,Glob"
          max_turns: 25
      - name: React to comment
        run:
          gh api repos/${{ github.repository }}/issues/comments/${{ github.event.comment.id }}/reactions \
            -f content=rocket
```
**Uso:** En cualquier issue, escribe:
```
/agent implement: Add cursor-based pagination to GET /books
```
El bot reacciona con I y crea una PR automáticamente.

### 2.3 Auto-fix en PRs con "request changes"

```
# .github/workflows/auto-fix-review.yml
name: Auto-Fix Review Comments
on:
  pull_request_review:
    types: [submitted]
jobs:
  fix:
    if: github.event.review.state == 'changes_requested'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.ref }}
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            A reviewer requested changes on this PR.
            Review comments:
            ${{ github.event.review.body }}
            Fix all issues mentioned. Run tests after fixing.
            Commit with message: "fix: address review feedback"
            Push to the same branch.
          allowed_tools: "Read,Write,Edit,Bash,Grep,Glob"
          max_turns: 20
```
**El reviewer pide cambios** → **Claude los corrige automáticamente** → **PR se actualiza.**

## 3. Pipeline multi-stage con quality gates

### 3.1 Pipeline escalonado

```
# .github/workflows/full-pipeline.yml
name: Full Agent Pipeline
on:
  issues:
    types: [labeled]
jobs:
  # Stage 1: Implementación
  implement:
    if: github.event.label.name == 'agent:implement'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    outputs:
      pr_number: ${{ steps.create-pr.outputs.pr_number }}
    steps:
      - uses: actions/checkout@v4
      - name: Install RTK
        run: curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh &amp;&amp; echo "
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Implement issue #${{ github.event.issue.number }}: ${{ github.event.issue.title }}
            Body: ${{ github.event.issue.body }}
            Use TDD. Create branch, implement, test, commit, push, create PR.
          allowed_tools: "Read,Write,Edit,Bash,Grep,Glob"
          max_turns: 30
      - name: Get PR number
        id: create-pr
        run:
          PR=$(gh pr list --head "*/issue-${{ github.event.issue.number }}*" --json number -q '.[0].number')
          echo "pr_number=$PR" &gt;&gt; $GITHUB_OUTPUT
  # Stage 2: Quality gates (se triggerea automáticamente con la PR)
  # Los workflows claude-review.yml, security-review.yml y eval-gate.yml
  # del M12 se activan automáticamente con on: pull_request
  # Stage 3: Notificación
  notify:
    needs: implement
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        run:
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"I Agent created PR #${{ needs.implement.outputs.pr_number }} for issue #${{ github.event.is
      - name: Comment on issue
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run:
          gh issue comment ${{ github.event.issue.number }} \
            --body "I PR #${{ needs.implement.outputs.pr_number }} created. Review and quality checks in progress."
```

### 3.2 Encadenamiento de workflows

Los workflows se encadenan naturalmente via eventos GitHub:
```
Issue labeled "agent:implement"
  → full-pipeline.yml: implement job
    → Crea PR
      → claude-review.yml (trigger: PR opened)
      → security-review.yml (trigger: PR opened)
      → eval-gate.yml (trigger: PR opened)
        → Todos pasan → PR ready for human review
        → Alguno falla → PR blocked
```
No necesitas orquestación manual — GitHub Events hace el routing.

## 4. Monitoreo de agentes en producción

### 4.1 Métricas esenciales

Métrica Cómo obtenerla Umbral de alerta

**Success rate**

PRs merged / PRs created <70% → investigar

**Time to merge**

PR created → PR merged
>48h → pipeline lento

**Cost per PR**

Tokens × precio por workflow
>$10/PR → optimizar

**RTK savings**

<50% → RTK mal configurado
```
rtk gain --format json
```

**Eval pass rate**

Evals passed / total <80% → agente degradado

**Security findings**

Critical findings por PR
>0 → bloquear merge

### 4.2 Dashboard workflow

```
# .github/workflows/agent-metrics.yml
name: Agent Metrics Dashboard
on:
  schedule:
    - cron: '0 8 * * 1'  # Lunes 8 AM
jobs:
  metrics:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt:
            Generate agent metrics dashboard for the last 30 days.
            Use gh CLI to gather:
            1. PRs created by agent (label: agent-generated)
            2. Merged vs closed vs open
            3. Average time to merge
            4. Workflow run success/failure rates
            5. Eval results from latest runs
            Generate AGENT_METRICS.md with:
            - Summary table
            - Trends (improving/declining)
            - Top 3 action items
            Commit and push to main.
          allowed_tools: "Read,Write,Bash,Grep,Glob"
          max_turns: 15
      - name: Notify if declining
        run:
          if grep -q "declining" AGENT_METRICS.md; then
            curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
              -d '{"text": "II Agent metrics declining. Check AGENT_METRICS.md"}'
          fi
```

## 5. Safeguards de producción

### 5.1 Rate limiting

```
# Limitar concurrencia de agentes
jobs:
  implement:
    concurrency:
      group: agent-implement
      cancel-in-progress: false  # No cancelar jobs en curso
    # Máximo 3 agentes simultáneos:
    strategy:
      max-parallel: 3
```

### 5.2 Cost cap por workflow

```
# En claude-code-action:
- uses: anthropics/claude-code-action@v1
  with:
    max_turns: 30              # Límite de turnos
    model: "claude-sonnet-4-6" # Sonnet (no Opus) para cost control
```
Con Agent SDK, usar max_budget_usd:
```
options=ClaudeAgentOptions(
    max_budget_usd=10.0,  # $10 max por workflow
    max_turns=30,
)
```

### 5.3 Rollback automático

```
# Si tests fallan después de merge:
name: Post-Merge Verification
on:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install &amp;&amp; npm test
      - name: Rollback if tests fail
        if: failure()
        run:
          git revert HEAD --no-edit
          git push origin main
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text": "I Auto-rollback: tests failed on main after merge"}'
```

### 5.4 Tabla de safeguards

Safeguard Implementación Previene Concurrency limit 100 issues = 100 sesiones = $$$$
```
concurrency: group
```
Max turns Loops infinitos
```
max_turns: 30
```
Cost cap (SDK)
Presupuesto desbordado
```
max_budget_usd
```
RTK Tokens desperdiciados (60-90%)
```
rtk init --global
```
Model selection Sonnet para workers Opus es 5x más caro Human approval Required reviews Bugs sutiles en producción Post-merge verify Tests on push to main Regressions post-merge Rollback automático git revert on failure Código roto en main

## 6. Multi-repo: workflows compartidos

### 6.1 Reusable workflows

Para organizaciones con múltiples repos, crea workflows compartidos:
```
# org/.github/workflows/claude-review-shared.yml
name: Shared Claude Review
on:
  workflow_call:
    secrets:
      ANTHROPIC_API_KEY:
        required: true
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Install RTK
        run: curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh &amp;&amp; echo "
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this PR for security, quality, and test coverage."
          allowed_tools: "Read,Grep,Glob"
```

**Usar en cada repo:**

```
# mi-repo/.github/workflows/review.yml
name: Code Review
on: [pull_request]
jobs:
  review:
    uses: mi-org/.github/workflows/claude-review-shared.yml@main
    secrets: inherit
```
**Resultado:** Un cambio en el workflow compartido → actualiza review en todos los repos de la organización.

## 7. Ejercicio práctico 1: Pipeline completo end-to-end

### Objetivo

Configurar el pipeline completo y probarlo con un issue real.

### Setup

Asegúrate de tener de M12:
• claude-review.yml (code review en PRs)
• security-review.yml (security review)
• eval-gate.yml (evals como gate)
• RTK instalado

### Añadir los workflows de M13

```
crea estos workflows adicionales:
1. .github/workflows/comment-agent.yml
   Trigger: /agent en comentarios de issues
2. .github/workflows/full-pipeline.yml
   Trigger: label "agent:implement"
   Stages: implement → notify
3. .github/workflows/auto-fix-review.yml
   Trigger: review "changes_requested"
4. .github/workflows/weekly-maintenance.yml
   Trigger: cron lunes 9 AM
```

### Test end-to-end

```
# 1. Crear issue
gh issue create \
  --title "Add endpoint GET /api/v1/books/export" \
  --body "Export library as CSV or JSON. Query param: ?format=csv|json"
# 2. Esperar triage (~2 min)
# Issue debería recibir labels y label "agent:implement"
# 3. Esperar implementation (~5 min)
# PR debería aparecer
# 4. Esperar reviews (~3 min)
# Code review + security review automáticos
# 5. Esperar evals (~3 min)
# Quality gate debería pasar
# 6. Verificar checks
gh pr checks &lt;PR_NUMBER&gt;
# 7. Si todo pasa → merge (requiere approval humano)
gh pr review &lt;PR_NUMBER&gt; --approve
gh pr merge &lt;PR_NUMBER&gt; --squash
```

### Alternativa: Test con comment trigger

```
# En un issue existente:
gh issue comment &lt;N&gt; --body "/agent implement: Add rate limiting middleware (100 req/min per IP)"
# Esperar ~5 min
# PR debería aparecer con implementación
```

### Entregable

1. 4+ workflows YAML nuevos (además de los de M12)
2. Pipeline completo probado end-to-end
3. Screenshots o logs de cada stage
4. Tiempo total del pipeline (issue → PR merged)

## 8. Ejercicio práctico 2: Dashboard de métricas

### Objetivo

Crear sistema de monitoreo para los agentes en producción.
```
crea .github/workflows/agent-metrics.yml que:
1. Se ejecute cada lunes a las 8 AM (cron)
2. Use claude-code-action para generar AGENT_METRICS.md
3. Recopile:
   - PRs creadas por agent en últimos 30 días (label: agent-generated)
   - Tasa de merge vs close
   - Tiempo promedio issue → PR merged
   - Eval pass rate
   - Costo estimado (tokens × precio)
4. Envíe alerta a Slack si success rate &lt; 70%
5. Commit AGENT_METRICS.md a main
Incluye también rtk gain --format json para métricas de ahorro de tokens.
```

### Entregable

1. Workflow de métricas funcional
2. AGENT_METRICS.md generado
3. Alerta Slack configurada (o webhook.site para testing)

## 9. Ejercicio integrador: Sistema operacional completo

### Descripción

Ensamblar TODOS los módulos del curso en un sistema de producción funcional.

### Checklist del sistema completo

Componente Módulo Estado CLAUDE.md profesional M1, M4 .claude/ configurado
```
.claude/rules/ con paths
```
M4 Reglas condicionales Skills + plugins M5
```
.claude/skills/
```
Hooks (format, security)
M6 settings.json Slash commands M6
```
.claude/commands/
```
TDD como estándar M3 Tests en CI Subagentes M9
```
.claude/agents/
```
RTK optimización M12
```
rtk init --global
```
Code review CI M12, M13 claude-review.yml Security review CI M12 security-review.yml Issue triage CI M12, M13 claude-triage.yml Auto-implementation CI M13 full-pipeline.yml Comment-triggered CI M13 comment-agent.yml Evals quality gate M11, M12 eval-gate.yml Monitoring M13 agent-metrics.yml Safeguards M13 Rate limits, cost caps

### Test final

```
# El test definitivo:
# 1. Abre un issue describiendo una feature
# 2. El sistema automáticamente:
#    a. Triagea el issue
#    b. Lo implementa con TDD
#    c. Crea PR
#    d. Revisa código (security + quality)
#    e. Ejecuta evals
#    f. Notifica por Slack
# 3. Tú apruebas y mergeas
# 4. Post-merge verification pasa
# 5. Métricas se actualizan
# Todo esto sin que escribas una línea de código.
```

### Entregable final

1. **Repositorio completo** con todos los workflows configurados
2. **PRODUCTION_REPORT.md:**
• Arquitectura del sistema (diagrama)
• Workflows y sus triggers (tabla)
• Quality gates activos
• Safeguards implementados
• Métricas de 1 semana de operación
• Costo real vs estimado
• RTK savings (%)
• Lecciones aprendidas
• Qué funciona bien, qué mejorarías
3. **Demo end-to-end** documentada (issue → merge, con tiempos)

## 10. Conceptos clave para memorizar

### Pipeline de producción

```
Issue → Triage → Label → Implement → PR → Review → Security → Evals → Approve → Merge → Verify
```

### PR-from-anywhere

```
Issue labeled    → claude-code-action → PR
Comment /agent   → claude-code-action → PR
Review changes   → claude-code-action → Fix commit
Cron weekly      → claude-code-action → PR
```

### Safeguards (no negociables)

```
1. Human approval (siempre requerido para merge)
2. RTK (60-90% menos tokens en cada sesión)
3. Concurrency limit (no 100 agentes simultáneos)
4. Max turns (no loops infinitos)
5. Post-merge verify (rollback si tests fallan)
```

### Multi-repo

```
Shared workflow en org/.github/ → Todos los repos heredan
Un cambio → actualiza review en N repos
```

## 11. Antipatrones a evitar

**Merge automático sin human approval** → Agentes pueden introducir bugs sutiles → siempre require review
**Sin rate limiting** → Issue flood = 100 sesiones = $500+ → concurrency limit
**Sin RTK en CI** → Cada workflow gasta 3-5x más tokens → siempre instalar RTK
**Opus para todo** → 5x más caro que Sonnet → usar Sonnet para workers, Opus solo para decisiones complejas
**Sin monitoreo** → No sabes si el sistema funciona → dashboard semanal mínimo
**Sin rollback** → Código roto en main durante horas → post-merge verify + auto-revert
**Workflows duplicados** → Misma lógica en 10 repos → reusable workflows
**Secrets en logs** → API keys visibles → GitHub Secrets siempre

## 12. Recursos complementarios

### Repositorios

• anthropics/claude-code-action (~6.589#) — Action oficial
• anthropics/claude-code-security-review (~2.800#) — Security en CI
• rtk-ai/rtk (~12.300#) — Token optimization

### Documentación

• Claude Code in CI/CD — Guía oficial
• GitHub Reusable Workflows — Compartir workflows
• Manage costs — Optimización de costos

## 13. Checklist de finalización del módulo

Configuré PR-from-anywhere (label, comment, cron triggers)
Comment-triggered agent funciona (/agent en issues)
Auto-fix en PRs con "request changes" funciona Pipeline multi-stage completo: issue → triage → implement → review → evals → merge Safeguards configurados (rate limit, max turns, human approval)
Rollback automático si tests fallan post-merge Dashboard de métricas generado semanalmente RTK instalado en TODOS los workflows CI Reusable workflow creado (al menos 1)
Test end-to-end documentado con tiempos PRODUCTION_REPORT.md con análisis completo

## Conclusión del curso

Has completado los **13 módulos de "Claude Code Console: De cero a experto"**.

### El stack completo que dominas

```
LOCAL                              CI/CD
Claude Code (terminal)             claude-code-action (GitHub Actions)
CLAUDE.md + .claude/               claude-code-security-review
rules/ (convenciones)         Evals como quality gate
skills/ (workflows)           RTK en CI (60-90% menos tokens)
agents/ (subagentes)          PR-from-anywhere
commands/ (slash cmds)        Auto-triage + auto-implement
settings.json (hooks)         Monitoring + alertas
RTK (60-90% menos tokens)         Safeguards
Agent SDK (orquestación)           II Human approval
Ralph/Harness (overnight)          II Rate limiting
Agent Teams (paralelo)             II Cost caps
Post-merge verify
```

### Los 13 módulos en una línea cada uno

1. **Modelo mental** — Context + Tools + Feedback Loops + Control Flow
2. **Workflow** — EXPLORE → PLAN → CODE → COMMIT con auto-verificación
3. **TDD** — Tests como feedback loop definitivo, /sandbox, /security-review
4. **Arquitectura** — CLAUDE.md + .claude/rules/ + settings.json + agent_docs/
5. **Skills/Plugins** — Progressive disclosure de capacidades, frontmatter YAML
6. **Commands/Hooks** — 30+ commands built-in, hooks en settings.json, exit 2
7. **Ralph** — Headless loops con completion promises y stop hooks
8. **Multi-Claude** — Agent Teams, claude-squad, Ctrl+B, -w, --teleport
9. **Subagentes/SDK** — .claude/agents/, Agent SDK con guardrails
10. **Harnesses** — Sistema dual para proyectos multi-día con feature_list.json
11. **Evals** — TDD para agentes: pass@k, graders, eval-driven development
12. **RTK + CI basics** — Token optimization + claude-code-action + security review
13. **CI/CD avanzado** — Pipelines, PR-from-anywhere, monitoreo, safeguards, producción

