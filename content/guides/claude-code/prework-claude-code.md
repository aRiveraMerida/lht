---
title: "Prework 08 — Instalación de Claude Code"
date: "2026-04-18"
description: "Guía paso a paso para instalar Claude Code y dejarlo listo para el módulo 1."
excerpt: "Tiempo estimado: 15-30 minutos Objetivo: Claude Code instalado, autenticado, y claude doctor pasando todos los checks Requisito previo: Áreas 1-3 completadas (Terminal + Git +…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Prework Área 8: Claude Code (instalación y

# verificación)

**Tiempo estimado:** 15-30 minutos
**Objetivo:** Claude Code instalado, autenticado, y claude doctor pasando todos los checks
**Requisito previo:** Áreas 1-3 completadas (Terminal + Git + Node.js ≥18)

## ¿Por qué hacerlo antes de M1?

M1 asume que Claude Code ya está instalado. Si lo instalas durante M1, pierdes tiempo en troubleshooting que no es parte del contenido del módulo.

## Requisitos previos técnicos

Requisito Verificar con Mínimo Node.js ≥18
```
node --version
```
npm ≥8
```
npm --version
```
Git Cualquier versión reciente
```
git --version
```
Plan Anthropic claude.ai/settings Pro, Team o Enterprise

## Instalación

```
# Instalar Claude Code
claude install
# Si claude no está en PATH:
npm install -g @anthropic-ai/claude-code
# Verificar instalación
claude --version
# Verificar que todo funciona
claude doctor
# Debería pasar todos los checks:
#  Node.js version
#  Git available
#  Authentication
#  API connectivity
```

### Autenticación

La primera vez que ejecutes claude, te pedirá autenticarte:
```
claude
# → Se abre browser para login
# → Autorizar con tu cuenta de Anthropic
# → Volver a la terminal
# Verificar
claude doctor
```

### API Key (para M7+ headless mode)

Para módulos avanzados (M7 Ralph, M9 Agent SDK, M12 CI/CD), necesitarás una API key:
```
# Obtener en: console.anthropic.com → API Keys → Create Key
# Configurar
export ANTHROPIC_API_KEY="sk-ant-..."
# Para que persista:
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' &gt;&gt; ~/.zshrc  # macOS
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' &gt;&gt; ~/.bashrc # Linux
```
**No necesitas la API key para M1-M6.** Pero si la configuras ahora, ahorras tiempo después.

## Verificación

```
# 1. Versión instalada
claude --version &amp;&amp; echo "I Claude Code instalado"
# 2. Doctor checks
claude doctor &amp;&amp; echo "I Todos los checks pasan"
# 3. Test rápido (abre sesión interactiva)
# Escribe: "hello" → Claude debe responder
# Escribe: /exit → Salir
claude
```

### Evaluación

Resultado Siguiente paso

**claude doctor pasa**

Listo para M1

**Node.js version fail**

Actualiza Node a ≥18 (Área 3)

**Auth fail**

Re-ejecuta claude para re-autenticar

**No puedo instalar**

Verifica que tu plan incluye Claude Code en claude.ai/settings

## Recursos

• Claude Code Setup Guide — Instalación oficial
• Claude Code Security — Modelo de permisos
• Troubleshooting — Problemas comunes
