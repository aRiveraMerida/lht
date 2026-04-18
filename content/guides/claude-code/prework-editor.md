---
excerpt: "Configuración del editor de código recomendado para trabajar con Claude Code."
---

# Prework Área 7: Editor de código

## ¿Por qué es obligatorio?

Claude Code trabaja en la terminal, pero tú necesitas un editor para:
• Revisar archivos que Claude creó o modificó
• Editar CLAUDE.md, settings.json, y configuración manualmente
• Leer código con syntax highlighting (mucho más legible que cat)
• Usar la integración /ide de Claude Code para abrir archivos directamente

## Recomendación: VS Code

VS Code es el estándar de la industria y tiene la mejor integración con Claude Code.

### Instalar

```
# macOS
brew install --cask visual-studio-code
# Linux (Ubuntu/Debian)
sudo snap install code --classic
# O descargar: https://code.visualstudio.com/
# Verificar
code --version
# Abrir proyecto desde terminal
cd mi-proyecto
code .
```

### Configurar command line (macOS)

Si code . no funciona en macOS:
1. Abrir VS Code
2. Cmd+Shift+P → "Shell Command: Install 'code' command in PATH"
3. Reiniciar terminal

### Extensiones útiles (opcionales)

Extensión Qué hace ESLint Marca errores de JavaScript en tiempo real Prettier Formateador automático GitLens Visualiza git blame inline Error Lens Muestra errores inline (no solo subrayados)

## Alternativas válidas

Cualquier editor que puedas usar para leer/editar archivos funciona:
Editor Instalación Nota

**VS Code**

```
brew install --cask
```
Recomendado
```
visual-studio-code
```

**Cursor**

cursor.com Fork de VS Code con IA integrada

**Vim/Neovim**

Ya instalado en macOS/Linux Para usuarios avanzados

**Sublime Text**

sublimetext.com Ligero y rápido

**JetBrains (WebStorm)**

jetbrains.com IDE completo (de pago)

## Test de verificación

```
# Verificar que puedes abrir editor desde terminal
code --version 2&gt;/dev/null &amp;&amp; echo "I VS Code listo" || \
  vim --version &gt; /dev/null 2&gt;&amp;1 &amp;&amp; echo "I Vim disponible" || \
  echo "II Instala un editor (VS Code recomendado)"
```
