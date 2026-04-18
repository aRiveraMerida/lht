---
excerpt: "Áreas opcionales de Python y SQL para quien quiera profundizar antes del programa."
---

# Prework Área 9: Python (opcional)

## ¿Cuándo lo necesitarás?

Módulo Uso de Python M9 Agent SDK (claude-agent-sdk Python): orquestación programática M10 overnight_sdk.py: harness overnight con guardrails Resto No se usa Python Si planeas seguir el programa solo con bash y JavaScript, puedes saltar esta área.

## Lo mínimo necesario

### Instalar Python

```
# Verificar si ya lo tienes
python3 --version    # Necesitas ≥3.10
# macOS
brew install python
# Linux
sudo apt install python3 python3-pip python3-venv
# Verificar
python3 --version &amp;&amp; echo "I Python instalado"
pip3 --version &amp;&amp; echo "I pip instalado"
```

### Instalar paquetes

```
# Equivalente a npm install
pip3 install nombre-paquete --break-system-packages
# O con virtual environment (recomendado)
python3 -m venv .venv
source .venv/bin/activate
pip install nombre-paquete
```

### Leer Python (para validar código de Claude)

```
# Variables
name = "Claude"
count = 42
items = [1, 2, 3]
user = {"name": "Alice", "age": 30}
# Funciones
def sum(a, b):
    return a + b
# Async (Agent SDK)
async def main():
    result = await some_async_function()
    print(result)
import asyncio
asyncio.run(main())
# Clases
class UserService:
    def __init__(self, db):
        self.db = db
    async def get_user(self, id):
        return await self.db.find(id)
# Try/except (equivalente a try/catch en JS)
try:
    result = risky_operation()
except Exception as e:
    print(f"Error: {e}")
```
**Si ya programas en JavaScript:** Python es muy similar conceptualmente. La diferencia principal es la indentación
(Python usa espacios, no llaves) y la sintaxis de async (async def + await, igual que JS pero sin function).

### Recurso

• Python.org Tutorial (capítulos 1-5) — Oficial, conciso
• Real Python: Getting Started — Más amigable

## Test de verificación

```
python3 --version &amp;&amp; echo "I Python instalado" || echo "I Instalar Python 3.10+"
python3 -c "
import asyncio
async def hello():
    return 'Hello from Python async'
result = asyncio.run(hello())
print(result)
print('I Async Python funciona')
"
```

## Prework Área 10: SQL básico (opcional)

**Tiempo estimado:** 1-2 horas
**Objetivo:** Entender SELECT, INSERT, CREATE TABLE para leer código de SQLite
**Obligatorio:** No. Los ejercicios usan SQLite (better-sqlite3) pero Claude genera todo el SQL

## ¿Cuándo lo necesitarás?

Varios ejercicios del programa usan SQLite como base de datos (simple, sin servidor, un solo archivo). Claude genera las queries, pero entender SQL básico te ayuda a validar que la lógica es correcta.

## Lo mínimo necesario

```
-- Crear tabla
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Insertar
INSERT INTO books (title, author, rating) VALUES ('Clean Code', 'Robert Martin', 4.5);
-- Leer
SELECT * FROM books;
SELECT title, rating FROM books WHERE rating &gt;= 4.0 ORDER BY rating DESC;
SELECT COUNT(*) as total FROM books;
-- Actualizar
UPDATE books SET rating = 4.8 WHERE id = 1;
-- Eliminar
DELETE FROM books WHERE id = 1;
-- Joins (Claude genera estos, solo necesitas leerlos)
SELECT b.title, r.text, r.score
FROM books b
JOIN reviews r ON r.book_id = b.id
WHERE b.id = 1;
```
**Si nunca has usado SQL:** Son 6 operaciones: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, JOIN. El
90% del SQL del programa es SELECT y INSERT.

### Recursos

Recurso Formato Tiempo SQLBolt Interactivo en browser 2-3h W3Schools SQL Tutorial Texto + "Try it"
2h Select Star SQL Interactivo, narrativo 3h

## Test de verificación

```
# Verificar con SQLite (viene con macOS y la mayoría de Linux)
sqlite3 --version 2&gt;/dev/null &amp;&amp; echo "I SQLite disponible" || echo "II SQLite no instalado (no es bloqueant
# Si tienes SQLite, test rápido:
sqlite3 :memory: &lt;&lt; 'EOF'
CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO test (name) VALUES ('hello');
SELECT * FROM test;
EOF
# Debe mostrar: 1|hello
```
**Nota:** No necesitas SQLite instalado como comando. Los ejercicios usan better-sqlite3 (paquete npm) que incluye
SQLite embebido. Este test es solo para verificar que puedes leer SQL.
