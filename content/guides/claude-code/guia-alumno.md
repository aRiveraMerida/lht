---
excerpt: "Cómo navegar el curso, ritmo recomendado y recursos de apoyo."
---

# Guía del alumno: Cómo navegar el curso según

# tu perfil

## ¿Cuál es tu perfil?

### Perfil A: Developer (junior a mid)

**Quién eres:** Programas en JavaScript/Python/otro lenguaje. Usas git y terminal a diario. Quieres que Claude Code
multiplique tu productividad.

**Tu ruta:**

```
Prework: Verificar checklist (probablemente ya cumples todo)
         Hacer Área 9 (primer contacto) aunque seas dev — es rápido
Bloque I (obligatorio, en orden):
  M1 → M2 → M3
Bloque II (obligatorio, en orden):
  M4 → M5 → M6
Bloque III (seleccionar):
  M7 ← Obligatorio (Ralph cambia tu forma de trabajar)
  M8 ← Si trabajas en proyectos con múltiples features paralelas
  M9 ← Si quieres orquestación programática (Python/TS)
Bloque IV (seleccionar):
  M10 ← Si haces proyectos de varios días
  M11 ← Si quieres medir calidad sistemáticamente
  M12-M13 ← Si quieres CI/CD automatizado
Proyectos: P1 (backend) → P3 (fullstack) mínimo
```
**Foco:** TDD (M3), Ralph (M7), y CLAUDE.md profesional (M4). Esto es el 80% del valor para un developer.
**Tiempo:** 4-6 semanas

### Perfil B: Developer senior / Tech lead

**Quién eres:** Lideras equipo, defines arquitectura, revisas PRs. Quieres evaluar Claude Code para tu equipo y diseñar
workflows.

**Tu ruta:**

```
Prework: Verificar checklist + Área 9
Bloque I (rápido, foco en M1):
  M1 (completo — modelo mental es clave para tomar decisiones)
  M2 (lectura rápida — ya conoces workflows de desarrollo)
  M3 (completo — TDD es la base de calidad con agentes)
Bloque II (completo — esto defines tú para tu equipo):
  M4 → M5 → M6
Bloque III (completo — esto evalúas para tu equipo):
  M7 → M8 → M9
Bloque IV (OBLIGATORIO — esto es lo que escalas):
  M10 → M11 → M12 → M13
Proyectos: P1 (rápido) → P4 (dashboard, relevante para leads) → P5 (SaaS, simula proyecto real)
```
**Foco:** Configuración de equipo (M4-M6), evals (M11), y CI/CD (M12-M13). Tu valor es diseñar el sistema, no solo
usarlo.
**Tiempo:** 6-8 semanas

### Perfil C: Consultor de IA / Formador

**Quién eres:** Ayudas a organizaciones a adoptar herramientas de IA. Necesitas dominar Claude Code para enseñarlo
a otros.

**Tu ruta:**

```
Prework: Hacer TODAS las áreas (incluyendo opcionales)
         Necesitas poder resolver dudas de alumnos en cualquier área
Bloque I-IV: COMPLETO, en orden, sin saltar nada
  M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9 → M10 → M11 → M12 → M13
Proyectos: Los 5, en orden
  P1 → P2 → P3 → P4 → P5
Documentos complementarios: Leer glosario + quick reference
  Para poder referenciarlos durante formaciones
```
**Foco:** Todo. Como formador necesitas haber recorrido cada módulo para poder adaptarlo a diferentes audiencias. El
glosario y la quick reference son tus herramientas de aula.
**Tiempo:** 10-14 semanas

### Perfil D: DevOps / SRE

**Quién eres:** Gestionas infraestructura, CI/CD, deployment. Quieres automatizar con agentes en pipelines.

**Tu ruta:**

```
Prework: Verificar checklist (probablemente ya cumples)
Bloque I (selectivo):
  M1 (completo — modelo mental)
  M2 (lectura rápida)
  M3 (lectura rápida — los tests los escribe Claude)
Bloque II (foco en M6):
  M4 (rápido — necesitas entender CLAUDE.md para configurar pipelines)
  M5 (lectura — plugins para integración)
  M6 (COMPLETO — hooks son tu herramienta principal)
Bloque III (foco en M7):
  M7 (COMPLETO — headless mode es tu base)
  M8 (lectura — multi-agente en CI)
  M9 (completo si quieres Agent SDK)
Bloque IV (OBLIGATORIO — todo):
  M10 → M11 → M12 → M13
Proyectos: P2 (bot con cron) → P5 (SaaS con CI/CD completo)
```
**Foco:** Hooks (M6), headless mode (M7), evals en CI (M11), y CI/CD completo (M12-M13). El deploy de los proyectos
es tu zona de confort.
**Tiempo:** 5-7 semanas

## Rutas express (tiempo limitado)

### Ruta mínima: "Quiero ser productivo en 2 semanas"

```
Semana 1: M1 + M2 + M3
Semana 2: M4 + M7
Proyecto: P1 (TaskFlow API)
```
**Lo que consigues:** Modelo mental, workflow profesional, TDD, CLAUDE.md, y Ralph para ejecución autónoma.
Cubres el 80% del valor del curso.

### Ruta intermedia: "Tengo 1 mes"

```
Semana 1: M1 + M2
Semana 2: M3 + M4
Semana 3: M6 + M7 + M8
Semana 4: M12 + P1
```
**Lo que consigues:** Todo lo anterior + hooks, multi-Claude, y CI/CD básico.

### Ruta completa: "Tengo 3 meses"

```
Todo el curso + P1 + P3 + P5
```

## Módulos que puedes saltar (y cuándo)

Módulo Puedes saltar si...
Riesgo de saltar M5 (Skills)
No planeas crear skills reutilizables Bajo — puedes volver después M8 (Multi-Claude)
No trabajas con múltiples features en paralelo Medio — pierdes velocidad M9 (Subagentes)
No necesitas orquestación programática Bajo — M8 cubre lo básico M10 (Harnesses)
No haces proyectos de varios días con agentes Bajo — Ralph (M7) es suficiente para sesiones cortas M11 (Evals)
No necesitas medir calidad sistemáticamente Alto — sin evals no sabes si tu agente mejora o empeora
**NUNCA saltar:** M1 (modelo mental), M3 (TDD), M4 (CLAUDE.md), M7 (headless/Ralph).

## Cómo usar los documentos complementarios

Documento Cuándo usarlo
```
Glosario (15_glosario.md)
```
Cuando encuentres un término que no recuerdas.
Consulta durante cualquier módulo
```
Quick Reference (17_quick_reference.md)
```
Cheat sheet para tener abierto mientras trabajas con Claude Code
**Este documento** (16_guia_alumno.md)
Al inicio del curso para planificar tu ruta, y al terminar cada bloque para decidir qué sigue
```
Índice (00_indice_curso_v2.md)
```
Para ver la estructura completa y encontrar archivos
