---
title: "Prework 06 — GitHub y GitHub CLI"
date: "2026-04-18"
description: "Uso básico de GitHub y de la CLI para los flujos de trabajo del curso."
excerpt: "Tiempo estimado: 30-60 minutos Objetivo: Cuenta de GitHub activa, GitHub CLI instalado y autenticado, saber crear repos/issues/PRs desde terminal Requisito previo: Áreas 1-2…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Prework Área 6: GitHub y GitHub CLI

**Tiempo estimado:** 30-60 minutos
**Objetivo:** Cuenta de GitHub activa, GitHub CLI instalado y autenticado, saber crear repos/issues/PRs desde terminal
**Requisito previo:** Áreas 1-2 (Terminal + Git) completadas

## ¿Por qué es obligatorio?

Los módulos M12-M13 usan GitHub Actions y GitHub CLI extensivamente. Pero incluso desde M1, necesitas:
• Un repo en GitHub para alojar tus proyectos del curso
• gh para crear issues y PRs desde la terminal (M12-M13 lo automatizan)
• Autenticación configurada para git push sin problemas

## Ruta de estudio

### Paso 1 — Cuenta de GitHub (5 min)

Si no tienes cuenta: github.com/signup Si ya la tienes, verifica que puedes hacer login.

### Paso 2 — Instalar GitHub CLI (10 min)

```
# macOS
brew install gh
# Linux (Ubuntu/Debian)
sudo apt install gh
# Si no está en repos:
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-arch
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.gi
sudo apt update &amp;&amp; sudo apt install gh
# Windows (WSL2)
# Mismos pasos que Linux
# Verificar
gh --version
```

### Paso 3 — Autenticar (5 min)

```
gh auth login
# Seleccionar: GitHub.com
# Seleccionar: HTTPS (recomendado)
# Seleccionar: Login with a web browser
# Copiar el código, abrir browser, pegar código
# Autorizar
# Verificar
gh auth status
#  Logged in to github.com as &lt;tu-usuario&gt;
```

### Paso 4 — Comandos esenciales (15 min)

```
# Crear repo
gh repo create mi-proyecto --public --clone
cd mi-proyecto
# Crear issue
gh issue create --title "Add login feature" --body "Implement JWT auth"
# Listar issues
gh issue list
# Crear PR (después de push a branch)
git checkout -b feature/test
echo "test" &gt; test.txt
git add . &amp;&amp; git commit -m "test"
git push -u origin feature/test
gh pr create --title "Test PR" --body "Testing gh CLI"
# Listar PRs
gh pr list
# Ver PR
gh pr view 1
```
**Recurso:** GitHub CLI Manual — Referencia oficial completa

## Referencia rápida

```
AUTENTICACIÓN
  gh auth login             Autenticar
  gh auth status            Verificar estado
REPOS
  gh repo create NAME       Crear repo
  gh repo clone OWNER/REPO  Clonar repo
ISSUES
  gh issue create           Crear issue
  gh issue list             Listar issues
  gh issue view N           Ver issue N
PULL REQUESTS
  gh pr create              Crear PR
  gh pr list                Listar PRs
  gh pr view N              Ver PR N
  gh pr merge N             Mergear PR N
  gh pr checks N            Ver checks de PR
WORKFLOWS (M12-M13)
  gh run list               Listar workflow runs
  gh run view ID            Ver run
  gh run watch ID           Monitorear en tiempo real
```

## Test de verificación

```
# Verificar que todo funciona
gh --version &amp;&amp; echo "I gh instalado"
gh auth status &amp;&amp; echo "I gh autenticado"
# Test rápido: crear repo de prueba
gh repo create prework-test-$(date +%s) --public --clone 2&gt;/dev/null &amp;&amp; echo "I puede crear repos" || echo "I
```

### Evaluación

Resultado Siguiente paso

**gh instalado y autenticado**

Pasa a Área 7

**Instalación falló**

Sigue instrucciones de cli.github.com

**Auth falló**

Verifica tu cuenta GitHub y re-intenta gh auth login
