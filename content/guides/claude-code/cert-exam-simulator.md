---
title: "Certificación C7 — Simulador de examen"
date: "2026-04-18"
description: "Capítulo 7: simulador de examen con preguntas tipo."
excerpt: "Formato: 50 preguntas multiple choice · 4 opciones · Score target: 720/1000 Distribución: D1 ~25% (13q) · D2 ~20% (10q) · D3 ~20% (10q) · D4 ~20% (10q) · D5 ~15% (7q) Tiempo…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Certificación — C7: Exam Simulator (50

# preguntas)

**Formato:** 50 preguntas multiple choice · 4 opciones · Score target: 720/1000
**Distribución:** D1 ~25% (13q) · D2 ~20% (10q) · D3 ~20% (10q) · D4 ~20% (10q) · D5 ~15% (7q)
**Tiempo sugerido:** 90 minutos
**Instrucciones:** Responde todas las preguntas sin mirar las respuestas. Puntúa al final. >36 correctas (~72%) =
aprobado.

## SECCIÓN A: Agentic Architecture & Orchestration (13 preguntas)

**A1.** An agentic loop runs indefinitely even though the task is complete. The developer checks and finds the loop
terminates by searching for "task done" in Claude's text output. What should they fix?
A) Make the search more robust with regex matching B) Replace text parsing with stop_reason == "end_turn" check C) Add a timeout to the loop D) Switch to a more deterministic model
**A2.** After a tool call in an agentic loop, what must be appended to the messages array?
A) Only the tool result B) Both the assistant's response (containing tool_use) and the tool result (with tool_use_id)
C) Only the assistant's response D) A new user message summarizing the tool result
**A3.** A developer sets MAX_ITERATIONS = 5 as the only loop control. What's the risk?
A) The loop runs too fast B) The agent may be cut off mid-task if it needs more than 5 iterations C) The model will produce lower quality output D) Token costs increase
**A4.** A coordinator delegates tasks to 3 subagents. Its allowedTools is [summarize, format_report]. Can it spawn
subagents?
A) Yes — any agent can spawn subagents by default B) No — allowedTools must include Task to spawn subagents C) Yes — if the subagents have Task in their tools D) No — subagents can only be created via the Agent SDK, not tools
**A5.** A coordinator passes its full 80-message conversation history to a subagent that only needs to research market
size. What happens?
A) The subagent works better with more context B) The subagent receives irrelevant context, wasting tokens and potentially confusing its task C) The coordinator loses its conversation history D) Nothing — context isolation prevents any issues
**A6.** Two subagents execute in parallel from a single coordinator response. Subagent A finishes in 2 seconds,
Subagent B in 30 seconds. What happens?
A) Subagent A's results are discarded while waiting for B B) Both results are collected and returned to the coordinator once all finish C) Subagent B is automatically killed after A finishes D) The coordinator processes A immediately and ignores B
**A7.** A support agent must block refunds above $500. Which approach is 100% reliable?
A) System prompt: "IMPORTANT: Block all refunds above $500"
B) PostToolUse hook that checks amount and returns exit code 2 if >$500 C) Fine-tuning the model on examples of blocked refunds D) Adding max_amount: 500 to the tool's input_schema
**A8.** A customer says "I'll cancel my subscription if this isn't fixed." Should the agent escalate?
A) Yes — cancellation threat indicates high churn risk (sentiment-based)
B) Only if the task exceeds the agent's capability, authority, or if there's a policy gap C) Yes — always escalate when customers mention cancellation D) Ask Claude to assess its confidence level and escalate if low
**A9.** An agent explores two possible solutions for a database design problem. Which session feature should it use?
A) --resume to continue the same session B) fork_session to branch without affecting the main session C) Start a completely new session with no context D) Use Ctrl+B to run in background
**A10.** A task requires processing 200 invoices in the same format. Which decomposition is best?
A) Dynamic adaptive decomposition B) Prompt chaining with a fixed pipeline (parse → validate → store)
C) One subagent per invoice D) Single prompt with all 200 invoices
**A11.** Data retrieved 3 hours ago in a session shows a product costs $99. The price changed to $149 in the database.
The agent uses $99 for a calculation. What happened?
A) Model hallucination B) Stale context — data retrieved early in a long session may be outdated C) The database is wrong D) Token corruption
**A12.** Task decomposition splits a codebase audit into "Check file A", "Check file B", "Check file C". A bug caused by
interaction between files A and B goes undetected. Why?
A) The model isn't powerful enough B) Overly narrow decomposition creates coverage gaps — cross-file interactions are missed C) The files were too large D) The subagents interfered with each other
**A13.** Which is a valid reason to escalate to a human agent?
A) The customer's sentiment is "very negative" (score: -0.9)
B) Claude's self-reported confidence is 0.3 (low)
C) The customer explicitly says "I want to speak with a person"
D) The conversation exceeds 20 messages

## SECCIÓN B: Tool Design & MCP (10 preguntas)

**B1.** A tool description says: "Searches for things." An agent frequently selects the wrong tool. What's the root cause?
A) The model needs more training B) The tool description is too vague — it should include purpose, input formats, edge cases, and boundaries C) The tool name is too short D) Too many similar tools exist
**B2.** A database connection times out. The tool returns {"customers": []}. What's wrong?
A) Nothing — empty results are valid B) The tool should return isError: true with errorCategory: "timeout" — empty results mask the access failure C) The tool should retry automatically D) The tool should return a 500 HTTP error
**B3.** An agent has 16 tools and frequently selects the wrong one. What's the fix?
A) Write longer tool descriptions B) Switch to Claude Opus for better tool selection C) Distribute tools across 4 specialized subagents with 4 tools each D) Remove tools the agent rarely uses
**B4.** Where should database credentials for a shared MCP server go?
A) Hardcoded in .mcp.json
```
B) In CLAUDE.md
```
C) Using ${DATABASE_URL} in .mcp.json with the value in environment variables D) In a .env file committed to git
**B5.** An agent needs to modify line 42 of server.ts. Which built-in tool?
A) Write (replace the entire file)
B) Edit (targeted change to specific content)
C) Bash("sed -i '42s/old/new/' server.ts")
D) Read the file and rewrite it
**B6.** An agent needs to find all .test.ts files. Which tool?
A) Grep("test.ts", ".")
B) Glob("*/.test.ts")
C) Bash("find . -name '*.test.ts'")
D) Read every directory listing
```
B7. tool_choice: {"type": "tool", "name": "extract_data"} is set. What does this guarantee?
```
A) Both structure and semantic correctness B) Schema compliance (fields and types) but NOT semantic correctness C) The model will always produce the right answer D) The tool will execute successfully
**B8.** A tool returns this error: {"error": "Something went wrong"}. What's missing?
A) Nothing — this is sufficient B) isError, errorCategory, isRetryable, and context fields for intelligent recovery C) An HTTP status code D) A stack trace
**B9.** .mcp.json is for _____ config and ~/.claude.json is for _____ config.
A) User / Project B) Project (shared, git) / User (personal, not shared)
C) CI/CD / Local development D) Production / Development
**B10.** An agent uses Bash("cat README.md") to read a file. What's the issue?
A) Nothing — Bash is a valid tool B) The Read tool should be used for file reading — Bash is for shell operations without a dedicated alternative C) cat doesn't work on markdown files D) The file might be too large

## SECCIÓN C: Claude Code Configuration (10 preguntas)

**C1.** Team coding standards should go in:
```
A) ~/.claude/CLAUDE.md
```
B) .claude/CLAUDE.md (project-level, committed to git)
C) Each developer's personal config D) A shared Google Doc
```
C2. A .claude/rules/testing.md file has paths: ["tests/", "src//*.test.ts"]. When is it loaded?
```
A) Always B) Only when Claude works on files matching those glob patterns C) Only during test execution D) Only when manually activated
**C3.** A task requires isolated code exploration without affecting the main session. What to use?
A) A custom command B) A skill with context: fork C) A hook
```
D) --resume
```
**C4.** A CI pipeline uses Claude for code generation AND review. What's critical?
A) Use the same session for efficiency B) Use separate sessions to prevent confirmation bias in the reviewer C) Use --resume to maintain context D) Use a different model for review
**C5.** A team processes 5,000 files in a weekly compliance scan. Best approach?
A) Synchronous claude -p for each file B) Message Batches API (50% savings, 24h processing)
C) One massive prompt D) Split into daily scans of 1,000 each (still synchronous)
```
C6. --output-format json in CI produces:
```
A) Human-readable formatted output B) Structured JSON output parseable by automated systems C) A JSON file saved to disk D) Compressed binary output
**C7.** When should you use plan mode instead of direct execution?
A) Always — planning improves all tasks B) For multi-file architectural changes where mistakes are expensive C) For fixing a single typo D) Only in CI/CD pipelines
**C8.** The TDD iteration pattern with Claude Code is:
A) Write code → hope it works → ship B) Write failing test → implement → run test → verify → refine while tests stay green C) Ask Claude to "make it better" repeatedly D) Write tests after implementation to verify
**C9.** @import ./rules/api.md in CLAUDE.md does what?
A) Downloads rules from the internet B) Includes the content of api.md as if it were inline in CLAUDE.md C) Creates a symbolic link D) Runs api.md as a script
**C10.** A skill's frontmatter has allowed-tools: [Read, Grep]. What happens if the skill tries to use Write?
A) Write works normally B) Write is blocked — the skill can only use Read and Grep C) An error is logged but Write still executes D) The skill crashes

## SECCIÓN D: Prompt Engineering & Structured Output (10 preguntas)

**D1.** A code review prompt says "find all issues." The result flags 60 issues, 80% are false positives. What's the fix?
A) Use a more powerful model B) Replace with explicit, measurable criteria: "flag functions >50 lines, async without try-catch, hardcoded secrets"
C) Add "be more precise" to the prompt D) Reduce temperature
**D2.** How many few-shot examples for a support ticket classification task?
A) 0 B) 1 C) 2-4 (including edge cases)
D) 15+
**D3.** tool_use with a forced schema extracts vendor_name: "ABC Corp" from an invoice. The real vendor is "XYZ Inc."
What happened?
A) The schema was wrong B) tool_use guarantees structure but NOT semantic correctness — the value is wrong despite valid format C) The model hallucinated due to high temperature D) The tool_use feature is broken
**D4.** A validation-retry loop detects errors. The retry prompt says "Try again." What's wrong?
A) Nothing — "try again" is standard B) The retry should append specific errors (which field, wrong value, expected format) for targeted correction C) The retry should use a different model D) Retries are never effective
**D5.** A code review pipeline has Claude generate AND review code in the same session. The review rarely finds issues.
Why?
A) The code is perfect B) Same-session self-review retains reasoning context, creating confirmation bias C) The review prompt is too lenient D) Claude can't find its own bugs
**D6.** A schema for document classification has enum: ["invoice", "receipt"]. A purchase order is submitted. What
happens?
A) It's correctly rejected B) It's forced into either "invoice" or "receipt" — misclassification C) The extraction fails D) A new enum value is automatically created
**D7.** Which multi-pass review strategy catches cross-file integration bugs?
A) Pass 1 only: per-file local analysis B) Pass 1 (per-file local) + Pass 2 (cross-file integration)
C) A single pass that reviews all files simultaneously D) Random sampling of files
```
D8. tool_choice: "any" means:
```
A) Claude can respond with text only B) Claude MUST use a tool but can choose which one C) Claude must use all available tools D) A specific tool is forced
**D9.** An enum field has values ["high", "medium", "low", "other"] plus "priority_detail". Why include "other"?
A) It's not necessary — 3 values cover all cases B) Unexpected priority levels get captured instead of being forced into existing categories C) It makes the schema longer D) Claude prefers having 4+ enum values
**D10.** The best iterative refinement pattern for verifiable tasks is:
A) "Make it better" (vague)
B) TDD iteration: write test → implement → verify → refine C) Ask Claude to self-assess quality D) Increase max_tokens for longer output

## SECCIÓN E: Context Management & Reliability (7 preguntas)

**E1.** In a 40-message support conversation, the customer's account number from message 2 is lost. Why?
A) The model has a short memory B) Progressive summarization compressed earlier messages, losing specific details C) The account number was in the wrong format D) The token limit was exceeded
**E2.** Where should critical customer data be placed in the context?
A) At the end of the prompt B) In the middle with other conversation history C) In an immutable "case facts" block at the START (high-recall position)
D) In a system prompt addendum
**E3.** An extraction pipeline shows 93% aggregate accuracy. Per-type breakdown: invoices 65%, receipts 99%. Is it
production-ready?
A) Yes — 93% exceeds the 85% threshold B) No — invoices at 65% are critically below threshold, masked by receipt volume C) Yes — but only deploy for receipts D) Run more tests to confirm 93%
**E4.** A 6-hour agent session starts making errors about decisions from hour 1. What's the mitigation?
A) Restart the session B) Use scratchpad files to persist critical state, /compact to free context, re-read scratchpad after compact C) Accept the errors as inevitable D) Switch to a model with a larger context window
**E5.** Subagent A reports market size $42B (IDC). Subagent B reports $38B (blog). The coordinator averages to $40B.
What's wrong?
A) Nothing — averaging is reasonable B) The coordinator should track provenance (source, confidence) and annotate the conflict instead of silently resolving it C) Discard both — conflicting data is useless D) Always use the higher number
**E6.** A customer is angry but has a simple address change request. What trigger is INVALID for escalation?
A) Customer explicitly asks for a human B) Customer's negative sentiment score C) The task exceeds agent authority D) A policy gap is detected
**E7.** A subagent fails to connect to an API and returns {"results": []}. The coordinator tells the customer "No results
found." What went wrong?
A) The API has no data B) The subagent silently suppressed an access failure as an empty result — the coordinator can't distinguish "no data"
from "couldn't check"
C) The coordinator misinterpreted the results D) The API is rate-limited

## Scoring

Cuenta tus respuestas correctas:
Rango Resultado Acción
**45-50** (90-100%)
Excelente — listo para el examen Repasar los errores y presentar
**36-44** (72-88%)
Aprobado — pero con áreas débiles Repasar los dominios donde fallaste
**25-35** (50-70%)
Cercano — necesitas más estudio Estudiar C1-C5 en profundidad
**<25** (<50%)
Necesitas más preparación Rehacer el curso + C1-C5 antes de reintentar

### Distribución de errores

Si fallaste más de 2 preguntas en una sección:
Sección Estudiar A (D1)
```
cert_C1_agentic_architecture.md
```
B (D2)
```
cert_C2_tool_design_mcp.md
```
C (D3)
```
cert_C3_claude_code_config.md
```
D (D4)
```
cert_C4_prompt_engineering.md
```
E (D5)
```
cert_C5_context_reliability.md
```
