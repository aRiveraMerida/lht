---
title: "Módulo 3 — TDD con Claude Code"
date: "2026-04-18"
description: "Test-Driven Development aplicado al trabajo con agentes: auto-verificación como patrón central."
excerpt: "Dependencias: Módulo 2 (workflow EXPLORE→PLAN→CODE→COMMIT + auto-verificación dominados) Modalidad: 100% práctica con ejercicios ejecutables Actualizado: Marzo 2026 Al finalizar…"
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: true
image: "/favicon.svg"
---

# Módulo 3: TDD con Claude Code

**Duración:** 5-6 horas
**Nivel:** Intermedio
**Dependencias:** Módulo 2 (workflow EXPLORE→PLAN→CODE→COMMIT + auto-verificación dominados)
**Modalidad:** 100% práctica con ejercicios ejecutables
**Actualizado:** Marzo 2026

## Objetivos de aprendizaje

Al finalizar este módulo serás capaz de:
1. **Aplicar el ciclo SPEC**→**RED**→**GREEN**→**VALIDATE**→**REFACTOR** con Claude como implementador
2. **Escribir tests antes que código** de forma sistemática, entendiendo por qué multiplica la calidad 2-3x
3. **Aplicar la regla de oro de Anthropic**: tests primero → confirmar que fallan → implementar → NO modificar
tests durante implementación
4. **Ejecutar tests en** /sandbox para aislamiento de filesystem y red
5. **Complementar TDD con** /security-review para detectar vulnerabilidades
6. **Configurar coverage como gate de calidad** (mínimo 80%)
7. **Integrar test runners como feedback loop** del harness (conexión directa con M1 y M2)

## 1. Fundamentos: Por qué TDD transforma el trabajo con Claude Code

### 1.1 El problema de "código primero" con LLMs

**Escenario sin TDD:**

```
Tú: "Implementa validación de email en el endpoint de registro"
Claude: [genera 80 líneas de código con regex complejo]
Tú: "¿Funciona?"
Claude: "Sí, debería funcionar"
# Pruebas manuales revelan:
# I No valida emails con + (user+tag@domain.com)
# I Acepta emails sin TLD (user@domain)
# I No maneja Unicode en domain (user@domäin.com)
```

**¿Por qué falla?**

• Claude no tiene una **especificación ejecutable** — "validación de email" es ambiguo
• Sin tests, Claude no puede auto-verificar (la "promesa" de que funciona vale ~10%)
• Debugging requiere múltiples iteraciones de ida y vuelta
• **Costo:** 30-40 minutos de debugging

### 1.2 El mismo problema resuelto con TDD

```
Tú: "Escribe tests primero para validación de email. Cubre:
- Válidos: user@domain.com, user+tag@domain.com, user@sub.domain.com
- Inválidos: @domain.com, user@, user@domain, no-at-sign
- Edge cases: Unicode en domain, email &gt;254 chars, espacios
No implementes aún, solo los tests."
Claude: [genera 12 tests específicos y ejecutables]
Tú: [revisas los tests — son tu especificación]
Tú: "Ahora implementa la función que pase TODOS estos tests.
Ejecuta los tests después de implementar. Si alguno falla,
corrige hasta que todos pasen."
Claude: [implementa → ejecuta → 11/12 pasan → corrige → 12/12 pasan]
# Resultado:
# I Código correcto desde el inicio
# I Cobertura completa de edge cases
# I 10 minutos total vs 40 sin TDD
```
**Costo:** 10 minutos. Código correcto. Sin debugging.

### 1.3 TDD como feedback loop del harness

En M1 aprendiste que un harness tiene 4 componentes: Context, Tools, Feedback Loops y Control Flow. En M2 aprendiste auto-verificación ("Y LUEGO verifica que..."). TDD es la **formalización de ese feedback loop** en su forma más potente:
```
AGENT HARNESS (con TDD como feedback loop)
Context: CLAUDE.md + settings.json
Instrucción: "implementa X"
LLM genera código
FEEDBACK LOOP (TDD)
Tests ejecutados automáticamente
¿Pasan?
Sí → VERDE → continuar
No → ROJO → Claude diagnostica
y corrige
[repite hasta VERDE]
```
"Dar a Claude forma de verificar su trabajo es probablemente lo más importante que puedes hacer. Multiplica la calidad 2-3x." — Boris Cherny, creador de Claude Code

**Formas de verificación ordenadas por efectividad:**

Mecanismo Efectividad Por qué

**Tests automatizados (TDD)**

~95% Especificación ejecutable, repetible, determinista

**Build/compile/type-check**

~70% Detecta errores de tipos y sintaxis

**Linters/formatters**

~50% Estilo y patrones, no lógica

**Screenshots (UI)**

~40% Validación visual, no funcional
**"Debería funcionar"** (Claude sin
tests)
~10% Promesa sin verificación Tests automatizados son el mejor feedback loop posible para coding agents. Todo este módulo trata de convertirte en un experto usándolos.

### 1.4 La regla de oro de Anthropic para TDD con agentes

La guía oficial de best practices documenta un patrón que la comunidad ha confirmado como el más efectivo:
```
1. Escribir tests ANTES de la implementación
2. Confirmar que los tests FALLAN (fase RED)
3. Implementar código hasta que PASEN (fase GREEN)
4. NUNCA modificar tests durante la implementación
5. Refactorizar código manteniendo tests verdes
```
**El punto 4 es crítico y contra-intuitivo:** Cuando Claude no logra hacer pasar un test, la tentación es pedirle que
"ajuste" el test. Resistir esa tentación. Si el test falla, el código está mal — no el test. Si el test realmente tiene un error, se corrige en una fase SPEC separada, no durante la implementación.

**Patrón completo adaptado a Claude Code:**

```
SPEC     (Humano/Claude):  Definir comportamiento como tests ejecutables
RED      (Claude):         Ejecutar tests, confirmar que fallan
GREEN    (Claude):         Implementar código mínimo que pasa todos los tests
VALIDATE (Humano):         Revisar implementación, aprobar approach
REFACTOR (Claude):         Mejorar código manteniendo tests verdes
```

### 1.5 Testing framework: Vitest como recomendación

El curso usa **Vitest** como framework de testing por defecto:
Vitest Por qué ESM nativo Sin configuración para import/export Compatibilidad Jest Misma API (describe, it, expect) — migración trivial Velocidad 2-5x más rápido que Jest en proyectos medianos Watch mode HMR integrado, re-ejecuta solo tests afectados Coverage built-in
--coverage sin dependencias adicionales
TypeScript nativo Sin ts-jest ni configuración extra Si tu proyecto ya usa Jest, todo el conocimiento de este módulo aplica directamente — la API es la misma. Los ejemplos usan Vitest pero son intercambiables con Jest.

### 1.6 Coverage como gate de calidad

**Coverage mínimo recomendado por tipo de código:**

Tipo de código Coverage mínimo Razón Lógica de negocio 90%+ Aquí están los bugs críticos API endpoints 80%+ Contratos con clientes Utilities/helpers 85%+ Reutilizados en múltiples lugares UI components 70%+ Visual testing complementa Config/glue code 60%+ Poco lógica, más declarativo
**Configurar gate en** vitest.config.js**:**
```
// vitest.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
npx vitest run --coverage
# Si coverage está bajo el umbral:
# I ERROR: Coverage threshold not met
# Branches: 76.4% &lt; 80%
```

**Coverage no es la meta, es un indicador:**

• 100% coverage ≠ código correcto (puedes tener tests que no verifican nada)
• <80% coverage = probablemente faltan tests en caminos importantes
• Coverage te guía sobre DÓNDE escribir tests adicionales

### 1.7 Adaptación a otros stacks: Python y Java

Los ejercicios de este módulo usan JavaScript/Node.js con Vitest. Pero el workflow TDD con Claude Code es **idéntico**
en cualquier lenguaje — solo cambian las herramientas. Si trabajas con Python o Java, aquí tienes la traducción directa.

**Python con pytest:**

Concepto (Node.js)
Equivalente Python
```
vitest
pytest
unittest.mock.patch() o pytest-mock (fixture mocker)
vi.mock()
expect(x).toBe(y)
assert x == y
expect(fn).toThrow()
with pytest.raises(ValueError):
npx vitest run --coverage
pytest --cov=src --cov-report=term-missing
vitest.config.js con thresholds
pyproject.toml con [tool.coverage.report]
fail_under = 80
```
supertest (HTTP testing)
```
httpx con pytest-httpx, o TestClient de FastAPI
```
nock (mock HTTP)
```
responses o pytest-httpx
```

**Setup de proyecto Python con TDD:**

```
mkdir mi-proyecto &amp;&amp; cd mi-proyecto
python -m venv venv &amp;&amp; source venv/bin/activate
pip install pytest pytest-cov pytest-mock
# Estructura
mkdir src tests
touch src/__init__.py tests/__init__.py
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
[tool.coverage.report]
fail_under = 80
show_missing = true
```

**CLAUDE.md adaptado para Python:**

```
## HOW
### Test
pytest tests/ -v --cov=src --cov-report=term-missing
python -m mypy src/
python -m ruff check .
### Conventions
- Type hints (PEP 484) en todas las funciones públicas
- Docstrings en formato Google
- Tests con cobertura &gt;80%
- pytest fixtures para setup/teardown
```

**El ciclo TDD es idéntico:**

```
# SPEC
escribe tests en tests/test_validator.py para validación de email.
Usa pytest. NO implementes la función.
# RED
crea stub en src/validator.py que lance NotImplementedError.
Ejecuta pytest para confirmar RED.
# GREEN
/sandbox
implementa validate_email() para que todos los tests pasen.
Ejecuta pytest después de cada cambio.
```

**Java con JUnit 5:**

Concepto (Node.js)
Equivalente Java
```
JUnit 5 (@Test, Assertions)
vitest
Mockito.mock() y @Mock
vi.mock()
expect(x).toBe(y)
assertEquals(y, x)
expect(fn).toThrow()
assertThrows(Exception.class, () -> ...)
mvn test jacoco:report o gradle test
npx vitest run --coverage
jacocoTestReport
```
supertest (HTTP testing)
```
MockMvc (Spring) o REST Assured
```

**Setup de proyecto Java con TDD:**

```
&lt;!-- pom.xml (Maven) --&gt;
&lt;dependencies&gt;
  &lt;dependency&gt;
    &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
    &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
    &lt;version&gt;5.10.0&lt;/version&gt;
    &lt;scope&gt;test&lt;/scope&gt;
  &lt;/dependency&gt;
  &lt;dependency&gt;
    &lt;groupId&gt;org.mockito&lt;/groupId&gt;
    &lt;artifactId&gt;mockito-core&lt;/artifactId&gt;
    &lt;version&gt;5.8.0&lt;/version&gt;
    &lt;scope&gt;test&lt;/scope&gt;
  &lt;/dependency&gt;
&lt;/dependencies&gt;
```

**CLAUDE.md adaptado para Java:**

```
## HOW
### Test
mvn test
mvn jacoco:report
### Conventions
- JUnit 5 para testing, Mockito para mocks
- Javadoc en clases y métodos públicos
- Cobertura mínima 80% (JaCoCo)
- Un test class por production class
```
**Nota importante:** El workflow TDD, los patrones de interrupción, /sandbox, /security-review y todo lo demás de este
módulo funcionan exactamente igual con Python, Java o cualquier otro lenguaje. Claude Code es agnóstico al lenguaje — lo que cambia son los comandos de test, no el proceso.

## 2. /sandbox: Testing aislado

### 2.1 ¿Qué es /sandbox?

El comando /sandbox proporciona un entorno bash sandboxeado con:
• **Aislamiento de filesystem** (Linux bubblewrap / macOS seatbelt)
• **Aislamiento de red** (sin acceso a Internet)
• **84% menos prompts de permiso** — Claude ejecuta libremente dentro del sandbox
```
/sandbox
# Dentro del sandbox, Claude puede ejecutar libremente:
npm test
npx vitest run --coverage
python -m pytest tests/ -v
# Sin prompts de "¿Permitir ejecutar Bash(npm test)?"
# Sin riesgo de side effects fuera del proyecto
```

### 2.2 Cuándo usar /sandbox para testing

Escenario Usar /sandbox Sin /sandbox Test suite estándar Ideal Funciona pero con prompts Tests que escriben archivos temporales Aislado Riesgo de ensuciar filesystem Tests que hacen HTTP requests Sin red Necesita red (o mocks)
Tests con DB local Aislado Funciona Build + test completo Rápido (sin prompts)
Lento (aprobando cada comando)
**Tip:** Si tus tests usan mocks para HTTP (nock, msw), /sandbox es perfecto. Si necesitan red real, usa modo normal.

### 2.3 /sandbox integrado en workflow TDD

```
# Al inicio de la sesión TDD
/sandbox
# Ahora todo el ciclo RED→GREEN→REFACTOR ocurre sin interrupciones:
escribe tests para validación de email, ejecútalos para confirmar RED,
implementa la función, ejecútalos para confirmar GREEN,
refactoriza manteniendo GREEN
# Claude ejecuta vitest múltiples veces sin pedirte permiso cada vez
# El ciclo es significativamente más fluido
```

## 3. Ejercicio práctico 1: Primer ciclo completo

## SPEC→RED→GREEN→VALIDATE→REFACTOR

### Objetivo

Experimentar el ciclo TDD completo con una función pura, internalizando cada fase.

### Contexto

Implementar **validación de contraseñas** con reglas específicas. Función pura, sin dependencias — ideal para aprender el ciclo.

### Setup

```
mkdir password-validator &amp;&amp; cd password-validator
npm init -y
npm install --save-dev vitest @vitest/coverage-v8
mkdir src tests
Crea vitest.config.js:
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
Actualiza package.json:
{
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```
Crea CLAUDE.md:
```
# Project: Password Validator
## WHAT
Módulo de validación de contraseñas con reglas configurables.
## WHY
- **Vitest**: Testing framework moderno, ESM nativo
- **Función pura**: Sin side effects, fácil de testear
- **TDD**: Tests primero, implementación después
## HOW
### Test
npm test
npm run test:coverage
### Conventions
- ESM imports exclusivamente
- Type checking con JSDoc (no TypeScript)
- Tests con cobertura &gt;80%
- TDD: NUNCA modificar tests para que pasen — arreglar el código
git init &amp;&amp; git add -A &amp;&amp; git commit -m "chore: initial project setup"
```

### Fase SPEC: Especificar comportamiento como tests

**Requisitos de la contraseña:**

• Longitud: 8-64 caracteres
• Debe contener: mayúscula, minúscula, número, símbolo especial
• No puede contener: espacios, caracteres no-ASCII
• Edge cases: null, undefined, string vacío → false
```
lee los requisitos de validación de contraseñas en CLAUDE.md
y estos requisitos adicionales:
- Longitud: 8-64 caracteres
- Debe contener: mayúscula, minúscula, número, símbolo especial
- No puede contener: espacios, caracteres no-ASCII
- null, undefined, string vacío → false
Escribe tests en tests/passwordValidator.test.js que cubran:
1. Al menos 3 contraseñas válidas (variadas)
2. Un test por cada regla violada individualmente
3. Edge cases: null, undefined, empty, exactamente 8 chars, exactamente 64 chars, 65 chars
4. Combinaciones: múltiples reglas violadas
La función a testear: validatePassword(password) → boolean
NO implementes la función. Solo tests.
Usa describe/it/expect de vitest.
```

**Checklist de validación de los tests generados:**

¿Al menos 12 tests?
¿Cada regla tiene su propio test específico?
¿Edge cases cubiertos (null, undefined, empty)?
¿Casos límite exactos (8 chars válido, 7 chars inválido, 64 válido, 65 inválido)?
¿Tests son descriptivos? (el nombre dice qué valida)

**Si los tests no cubren suficiente:**

```
los tests no cubren el caso de contraseña con solo
símbolos especiales (sin letras). Agrega un test para eso.
También falta el caso de contraseña con Unicode (ñ, ü, é).
```

### Fase RED: Confirmar que fallan

```
crea @src/passwordValidator.js con solo la firma de la función:
export function validatePassword(password) {
  return false; // stub
}
Ejecuta los tests. Quiero ver cuáles pasan y cuáles fallan.
```

**Output esperado:**

```
 should reject null                    (pasa porque return false)
 should reject undefined               (pasa porque return false)
 should reject empty string            (pasa porque return false)
 should accept valid password           (FALLA — esto es correcto)
 should accept 8 character minimum      (FALLA — correcto)
[... más fallos]
Tests: 3 passed, 10 failed, 13 total
```
**Validación crítica:** Los tests de edge cases negativos pasan (null/undefined/empty → false es correcto), los tests de
contraseñas válidas fallan. Esto confirma que los tests detectan la ausencia de implementación. Si TODOS pasaran o TODOS fallaran, los tests tienen un problema.

### Fase GREEN: Implementar hasta que todos pasen

```
/sandbox
implementa validatePassword en @src/passwordValidator.js
para que TODOS los tests pasen.
Reglas:
1. Ejecuta los tests después de implementar
2. Si alguno falla, diagnostica y corrige
3. NO modifiques los tests — solo el código
4. Repite hasta que todos pasen
5. Muéstrame el output final con coverage
```

**Claude debería iterar autónomamente:**

```
Implementando validatePassword...
Ejecutando tests...
  11/13 passed, 2 failed
  Failing: "should reject password with Unicode characters"
  Diagnóstico: La regex no detecta caracteres Unicode correctamente
  Corrigiendo...
Ejecutando tests...
  13/13 passed
Coverage: Statements 100%, Branches 100%, Functions 100%, Lines 100%
```
**Observa:** Claude usó los tests como feedback loop automático. No le dijiste qué estaba mal — los tests se lo dijeron.
Sin TDD, habrías tenido que debuggear manualmente el caso de Unicode.

### Fase VALIDATE: Revisión humana

```
muéstrame la implementación completa de @src/passwordValidator.js
Quiero verificar:
1. ¿La lógica es clara y mantenible?
2. ¿Las regex son correctas para las reglas?
3. ¿Hay código innecesariamente complejo?
```
Lee el código. Si algo no te convence:
```
la validación de símbolos especiales usa una lista hardcodeada
muy limitada. Cambia a usar regex que detecte cualquier carácter
que no sea letra, número o espacio.
Ejecuta tests después del cambio — todos deben seguir pasando.
```

### Fase REFACTOR: Mejorar manteniendo GREEN

```
refactoriza @src/passwordValidator.js:
1. Extrae regex a constantes con nombres descriptivos
2. Agrupa validaciones en un array iterable
3. Agrega JSDoc con @param y @returns
CRÍTICO: Ejecuta tests después de CADA cambio.
Si algún test falla, revierte ese cambio y hazlo diferente.
```

**Verificar que tests siguen verdes post-refactor:**

```
npm run test:coverage
# Tests: 13 passed
# Coverage: 100%
```
Si coverage bajó, el refactor introdujo código no testeado → o agregar tests para el nuevo código, o simplificar el refactor.

### Entregable

1. **Código:**
• src/passwordValidator.js implementado y refactorizado
```
• tests/passwordValidator.test.js con 12+ tests
```
• Coverage 100% (función pura, debe ser alcanzable)
2. TDD_LOG.md documentando:
• Tests escritos (fase SPEC)
• Output de fase RED (qué pasó, qué falló)
• Iteraciones en fase GREEN (cuántas veces Claude ejecutó tests)
• Cambios del refactor
• Learning: ¿cuánto tiempo tomó vs si hubieras hecho código primero?

### Criterios de evaluación

Tests escritos ANTES de implementación Fase RED documentada (tests fallando correctamente)
Fase GREEN alcanzada sin modificar tests Refactor mejoró código sin romper tests Coverage 100% mantenido post-refactor /sandbox usado durante la fase GREEN TDD_LOG demuestra comprensión del ciclo

## 4. Ejercicio práctico 2: TDD con mocking de dependencias

### Objetivo

Aplicar TDD en contexto más realista: lógica de negocio + dependencias mockeadas.

### Contexto

Implementar un **servicio de carrito de compras** con lógica de negocio + persistencia.

**Reglas de negocio:**

• Usuario puede agregar items al carrito
• No puede agregar mismo item más de 5 veces (lanza error)
• Total = suma de (precio × cantidad) por item
• Descuentos: subtotal >100€ → 10% off, subtotal >200€ → 15% off
• Carrito vacío tiene total 0

### Setup

```
mkdir shopping-cart &amp;&amp; cd shopping-cart
npm init -y
npm install --save-dev vitest @vitest/coverage-v8
mkdir src tests
```
CLAUDE.md:
```
# Project: Shopping Cart Service
## WHAT
Servicio de carrito de compras con reglas de negocio y descuentos.
## WHY
- **Vitest**: Testing framework, ESM nativo
- **Mocking**: Unit tests mockean la capa de datos
- **TDD**: Tests primero, implementación después
## HOW
### Test
npx vitest run
npx vitest run --coverage
### Conventions
- ESM imports exclusivamente
- Async/await para operaciones de datos
- vi.mock() para mockear módulos
- TDD: tests primero, NO modificar tests durante implementación
```

### Fase SPEC: Tests con mocks

```
escribe tests para CartService en tests/CartService.test.js.
La clase CartService usa un módulo src/database.js que tiene:
- getCartItems(userId) → array de {itemId, price, quantity}
- addCartItem(userId, itemId, price, quantity) → void
- clearCartItems(userId) → void
Mockea database.js con vi.mock().
Métodos a testear:
- addItem(userId, itemId, price, quantity) → void
- getCart(userId) → array de items
- getTotal(userId) → número con descuento aplicado
- clearCart(userId) → void
Reglas de negocio:
- No agregar mismo item &gt;5 veces (throw Error)
- Descuentos: &gt;100€ → 10%, &gt;200€ → 15%
Escribe AL MENOS 15 tests cubriendo:
- Happy paths de cada método
- Regla de &gt;5 items (error esperado)
- Descuentos en límites exactos (99.99€, 100€, 199.99€, 200€)
- Carrito vacío
- Múltiples items con cantidades diferentes
NO implementes CartService ni database.js aún.
```

**Los tests deben incluir setup de mocks:**

```
// tests/CartService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartService } from '../src/CartService.js';
import * as db from '../src/database.js';
vi.mock('../src/database.js');
describe('CartService', () =&gt; {
  let cartService;
  beforeEach(() =&gt; {
    vi.clearAllMocks();
    cartService = new CartService();
    // Defaults
    db.getCartItems.mockResolvedValue([]);
    db.addCartItem.mockResolvedValue();
    db.clearCartItems.mockResolvedValue();
  });
  describe('addItem', () =&gt; {
    it('should add item to cart', async () =&gt; {
      await cartService.addItem('user1', 'item1', 10, 2);
      expect(db.addCartItem).toHaveBeenCalledWith('user1', 'item1', 10, 2);
    });
    it('should throw when adding same item beyond 5 units', async () =&gt; {
      db.getCartItems.mockResolvedValue([
        { itemId: 'item1', quantity: 5 }
      ]);
      await expect(
        cartService.addItem('user1', 'item1', 10, 1)
      ).rejects.toThrow('Cannot add more than 5 of the same item');
    });
  });
  describe('getTotal', () =&gt; {
    it('should return 0 for empty cart', async () =&gt; {
      expect(await cartService.getTotal('user1')).toBe(0);
    });
    it('should calculate total without discount for &lt;100€', async () =&gt; {
      db.getCartItems.mockResolvedValue([
        { itemId: 'item1', price: 30, quantity: 2 },
        { itemId: 'item2', price: 20, quantity: 1 }
      ]);
      expect(await cartService.getTotal('user1')).toBe(80);
    });
    it('should apply 10% discount for subtotal of exactly 100€', async () =&gt; {
      db.getCartItems.mockResolvedValue([
        { itemId: 'item1', price: 50, quantity: 2 }
      ]);
      expect(await cartService.getTotal('user1')).toBe(90); // 100 - 10%
    });
    it('should apply 15% discount for subtotal of exactly 200€', async () =&gt; {
      db.getCartItems.mockResolvedValue([
        { itemId: 'item1', price: 100, quantity: 2 }
      ]);
      expect(await cartService.getTotal('user1')).toBe(170); // 200 - 15%
    });
    // ... más tests de límites
  });
});
```

### Fase RED → GREEN (en /sandbox)

```
/sandbox
crea stubs vacíos para @src/database.js y @src/CartService.js.
Ejecuta tests para confirmar RED.
Luego implementa CartService para que TODOS pasen.
NO modifiques los tests.
Ejecuta vitest después de cada cambio y muéstrame el progreso.
```
**Claude debería llegar a GREEN en 1-3 iteraciones** gracias a los tests claros.

### Post-TDD: Implementar la capa de datos real

Una vez la lógica de negocio está validada por tests (con mocks), implementar la DB real:
```
la lógica de negocio en CartService está validada.
Ahora implementa @src/database.js con SQLite real.
Tabla: cart_items (userId, itemId, price, quantity)
Los tests unitarios de CartService usan mocks,
así que no se romperán.
Crea también un test de integración en
tests/integration/cart.integration.test.js
que pruebe el flujo completo con DB real.
```

### Entregable

1. **Tests unitarios:** 15+ tests mockeados, todos pasando, coverage >90% en CartService
2. **Implementación en capas:** CartService (lógica) + database.js (persistencia)
3. **Test de integración:** Flujo completo con DB real
4. **Reflexión (en TDD_LOG.md):** Por qué mockear la DB en unit tests pero usar DB real en integration tests

### Criterios de evaluación

Tests escritos antes de CartService Mocking de database.js correcto (vi.mock)
Todos los tests pasan sin modificar tests Coverage >90% en CartService Descuentos en límites exactos testeados Integración con DB real funcional Entiende unit tests (mocked) vs integration tests (real)

## 5. /security-review: Complemento del TDD

### 5.1 Por qué TDD no es suficiente solo

TDD valida que tu código hace lo que especificaste. Pero no valida que tu código sea **seguro**. Puedes tener 100% coverage y aun así tener SQL injection, XSS o secrets hardcodeados.
Claude Code incluye un análisis de seguridad integrado:
```
/security-review
```
Este comando ejecuta un análisis que busca:
• SQL injection
• Cross-site scripting (XSS)
• Fallos de autenticación y autorización
• Manejo inseguro de datos sensibles
• Vulnerabilidades de dependencias
• Secrets hardcodeados
• Path traversal

### 5.2 Integrando security review en el workflow TDD

El patrón completo de calidad ahora es:
```
SPEC (tests) → RED → GREEN → VALIDATE → REFACTOR
SECURITY REVIEW
COMMIT (solo si tests pasan Y security review limpio)
# Después de que todos los tests pasan:
/security-review
# Claude analiza el código y reporta:
# I CRITICAL: SQL injection in database.js line 23
# I WARNING: API key hardcoded in config.js
# I INFO: Consider adding rate limiting to /api/cart
```
Si encuentra issues, corriges antes de commitear:
```
corrige el SQL injection en @src/database.js:23
usando prepared statements. Ejecuta tests después
para confirmar que no rompiste nada.
```

### 5.3 Security review en CI/CD (preview)

Para equipos, existe anthropics/claude-code-security-review (~2.800#) como GitHub Action:
```
# .github/workflows/security.yml
name: Security Review
on: [pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-security-review@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```
Con Opus 4.6, Anthropic encontró **500+ vulnerabilidades en codebases open-source de producción** que habían pasado desapercibidas durante años. La combinación TDD + security review es significativamente más robusta que cualquiera por separado.

### 5.4 Triaje de findings: no todo es un bug real

/security-review es potente pero puede generar falsos positivos — señalar algo como problema cuando en tu contexto es aceptable. Saber triagear findings es parte de la competencia.

**Niveles de severidad y cómo actuar:**

Nivel Significado Acción Ejemplo
**CRITICAL**
Vulnerabilidad explotable, impacto alto

**Arreglar SIEMPRE antes**

**de commit**

SQL injection, secrets en código, auth bypass
**WARNING**
Riesgo potencial, depende del contexto
**Evaluar**: ¿aplica a tu
caso?
Input no sanitizado (¿es input interno o externo?),
HTTP sin HTTPS (¿es dev local?)
**INFO**
Sugerencia de mejora, no vulnerabilidad
**Ignorar si justificado**,
anotar para futuro "Considera rate limiting", "Añade CORS headers"

**Patrón de triaje con Claude:**

```
/security-review me reportó estos findings:
CRITICAL: SQL injection en database.js:23
WARNING: API key leída de process.env sin validación
WARNING: No hay rate limiting en endpoints
INFO: Considerar helmet.js para headers de seguridad
Para cada finding, dime:
1. ¿Es un riesgo real en este contexto?
2. Si sí, corrígelo
3. Si no, explica por qué es falso positivo
Contexto: esto es una API interna, no expuesta a internet,
y las API keys se validan en el middleware de auth.
```

**Claude debería responder algo como:**

```
1. I SQL injection → REAL. Usando string concatenation en query.
   Corrigiendo con prepared statements...
2. I API key sin validación → FALSO POSITIVO en tu contexto.
   Ya se valida en el middleware auth. No requiere doble validación.
3. I Rate limiting → VÁLIDO pero no crítico para API interna.
   Recomiendo añadir en el futuro si se expone externamente.
4. I helmet.js → Buena práctica, no urgente. Anotar para M12.
```

**Regla de decisión:**

• **CRITICAL siempre se arregla** — sin excepciones
• **WARNING se evalúa** con contexto: ¿el finding aplica a tu caso de uso? Si dudas, arréglalo
• **INFO se anota** para futuro: crea un ticket/TODO, pero no bloquea el commit
**Antipatrón: ignorar todos los findings.** Si /security-review reporta 5 findings y ignoras los 5 sin evaluarlos, estás
desperdiciando la herramienta. Triagear es evaluar cada uno conscientemente, no descartarlos en bloque.

## 6. Ejercicio práctico 3: Feature nueva con TDD + Security Review

### Objetivo

Agregar una función al password-validator del ejercicio 1 usando TDD completo + security review.
```
Feature: generateStrongPassword(length)
```

**Especificación:**

• Genera contraseña aleatoria que pasa validatePassword()
• Longitud entre 8-64 (parámetro obligatorio)
• Debe incluir al menos: 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
• Cada ejecución debe producir un resultado diferente
• Error si length fuera de rango

### Ejecución

```
cd password-validator
# Fase SPEC
escribe tests para generateStrongPassword(length) en
@tests/generatePassword.test.js:
1. Genera contraseña de longitud especificada
2. Contraseña generada pasa validatePassword()
3. Dos ejecuciones producen resultados diferentes
4. Error para length &lt; 8
5. Error para length &gt; 64
6. Funciona con length exactamente 8 y exactamente 64
NO implementes la función.
# Fase RED
/sandbox
crea stub en @src/generatePassword.js que solo lanza
"Not implemented". Ejecuta tests para confirmar RED.
# Fase GREEN
implementa generateStrongPassword para que todos los tests pasen.
NO modifiques los tests. Ejecuta vitest y muéstrame progreso.
# VALIDATE: Revisión
muéstrame la implementación. ¿Es criptográficamente segura?
¿Usa Math.random() (inseguro) o crypto.randomBytes (seguro)?
# REFACTOR si necesario
si usa Math.random(), refactoriza para usar crypto.
Ejecuta tests después.
# SECURITY REVIEW
/security-review
# Debería verificar:
# - ¿Usa fuente de aleatoriedad criptográficamente segura?
# - ¿Hay sesgos en la distribución de caracteres?
# - ¿La función es determinista (predecible)?
```

### Entregable

1. Función generateStrongPassword implementada con crypto seguro
2. Tests pasando, coverage >90%
3. Security review limpio (sin warnings)
4. Comparación en TDD_LOG.md: workflow manual (ejercicio 1) vs este ejercicio

### Criterios de evaluación

Tests antes de implementación Contraseñas generadas pasan validatePassword()
Usa crypto.randomBytes (no Math.random)
Security review sin issues Coverage mantenido >90%

## 7. Preview: El skill TDD (adelanto del Módulo 5)

### 7.1 ¿Qué es un skill?

Un **skill** es una carpeta con un archivo SKILL.md que enseña a Claude cómo manejar un tipo de tarea específico.
Cuando el skill está activo, Claude sigue automáticamente el workflow que describe — sin que tú tengas que dirigir cada paso.
En M5 aprenderás el ecosistema completo de skills. Aquí vas a probar uno para experimentar la diferencia entre TDD manual (como hiciste en los ejercicios 1-3) y TDD asistido por skill.

### 7.2 Mini-ejercicio: TDD con skill (15-20 minutos)

**Paso 1: Crear el skill en tu proyecto**

```
cd password-validator
mkdir -p .claude/skills/tdd
Crea .claude/skills/tdd/SKILL.md:
---
name: tdd
description: Test-Driven Development workflow
---
# TDD Workflow
When implementing any new function or feature:
1. ALWAYS ask for specifications before writing any code
2. Write complete test suite FIRST covering:
   - Happy paths (at least 3)
   - Edge cases (null, undefined, empty, boundary values)
   - Error cases (invalid input, overflow, type errors)
3. Create a stub that makes tests fail (confirm RED)
4. Implement minimum code to pass ALL tests (reach GREEN)
5. NEVER modify tests to make them pass — fix the code
6. After GREEN, suggest refactoring opportunities
7. After each refactor, run tests to confirm still GREEN
8. Report final coverage
Always run tests after EVERY code change. Show pass/fail count.
```

**Paso 2: Probar el skill en acción**

```
implementa una función slugify(text) que convierta
texto a URL-friendly slug.
Ejemplos:
- "Hello World" → "hello-world"
- "  Spaces  Everywhere  " → "spaces-everywhere"
- "Ñoño año" → "nono-ano"
- "Price: $100!" → "price-100"
```
**Observa la diferencia:** Con el skill activo, Claude debería:
1. Preguntar por especificaciones adicionales antes de codear
2. Escribir tests automáticamente (no necesitas pedirlo)
3. Confirmar RED
4. Implementar hasta GREEN
5. Sugerir refactor
6. Reportar coverage
**Sin el skill** (como en ejercicios 1-3), TÚ dirigías cada fase manualmente.

**Paso 3: Comparar**

En tu TDD_LOG.md, añade una sección:
```
## Comparación: TDD manual vs skill TDD
### Manual (ejercicios 1-3)
- Yo pedía cada fase explícitamente
- Tiempo: ~X minutos
- Nivel de dirección requerida: alto
### Con skill
- Claude seguía el workflow solo
- Tiempo: ~Y minutos
- Nivel de dirección requerida: bajo
### Conclusión
[¿El skill redujo la dirección necesaria?
¿Produjo tests de calidad similar?
¿Lo usarías como default?]
```
**Nota:** En M5 aprenderás a instalar skills de la comunidad (ComposioHQ, obra/superpowers), crear skills avanzados
con frontmatter YAML (model, tools, isolation), y gestionar el ecosistema de plugins. Este ejercicio es solo un preview para que veas el concepto.

## 8. Ejercicio integrador: API REST completo con TDD

### Objetivo

Aplicar TDD en un proyecto real: API REST con endpoints, validación, persistencia, y reglas de negocio.

### Descripción

**API de gestión de biblioteca personal**

**Endpoints:**

• POST /books → Agregar libro
• GET /books → Listar (filtros: genre, read/unread)
• GET /books/:id → Detalle con rating promedio
• PATCH /books/:id → Actualizar
• DELETE /books/:id → Eliminar
• POST /books/:id/review → Agregar reseña (rating 1-5 + comment)

**Reglas de negocio:**

• ISBN debe ser válido (10 o 13 dígitos con checksum)
• Rating de reseña: 1-5 (enteros)
• Libro puede tener múltiples reseñas
• Rating promedio calculado automáticamente
• No duplicados: mismo ISBN no puede registrarse dos veces
**Stack:** Express + SQLite + Vitest + Supertest

### Setup

```
mkdir library-api &amp;&amp; cd library-api
npm init -y
npm install express better-sqlite3
npm install --save-dev vitest @vitest/coverage-v8 supertest
```
Crea CLAUDE.md, settings.json, y vitest.config.js apropiados.
```
git init &amp;&amp; git add -A &amp;&amp; git commit -m "chore: initial setup"
```

### Fase SPEC: Test suite completa ANTES de cualquier código

```
# [Shift+Tab] Plan Mode
/effort high
vamos a crear la API de biblioteca con TDD.
Endpoints y reglas de negocio:
[PEGA ESPECIFICACIÓN DE ARRIBA]
Escribe TODA la test suite primero. Estructura:
1. tests/unit/validators.test.js
   - Validación de ISBN (10 y 13 dígitos, checksums)
   - Validación de rating (1-5, no strings, no decimales)
2. tests/unit/services/BookService.test.js
   - Lógica de negocio (cálculo de rating promedio)
   - Regla de no-duplicados (mismo ISBN)
   - Mockeada la capa de datos
3. tests/integration/books.test.js
   - Happy paths de cada endpoint con Supertest
   - Validaciones (ISBN inválido → 400, rating inválido → 400)
   - Edge cases (libro no existe → 404, duplicado → 409)
   - Filtros de listado (genre, read/unread)
Meta: AL MENOS 30 test cases total.
NO implementes nada de código. Solo tests completos.
Guarda cada archivo de tests y muéstrame el conteo total.
```

**Validación del test suite:**

¿30+ tests total?
¿Unit tests usan vi.mock para la DB?
¿Integration tests usan Supertest con servidor real?
¿Cada regla de negocio tiene test específico?
¿Error cases cubiertos (400, 404, 409)?

### Implementación TDD por capas

Implementar de abajo hacia arriba: validadores → servicios → rutas.

**Capa 1: Validadores (función pura, TDD puro)**

```
/sandbox
implementa @src/validators/isbn.js para que pasen
los tests de ISBN en tests/unit/validators.test.js.
Ciclo: implementa → ejecuta tests → corrige → repite.
NO modifiques tests.
Muéstrame cuáles pasan/fallan en cada iteración.
ahora implementa @src/validators/rating.js para que pasen
los tests de rating.
```

**Capa 2: Service layer (con mocks)**

```
implementa @src/services/BookService.js para que pasen
tests/unit/services/BookService.test.js.
Los tests mockean la DB — enfócate solo en lógica de negocio.
Ejecuta tests después de cada cambio.
```

**Capa 3: Routes/Controllers (integración)**

```
implementa @src/routes/books.js, @src/app.js y
la capa de DB @src/database.js.
Tests relevantes: tests/integration/books.test.js
Estos usan Supertest y DB real — prueban todo el stack.
Ejecuta:
npx vitest run tests/integration/books.test.js
Itera hasta que todos pasen.
```

**Capa 4: Coverage total**

```
/context
npx vitest run --coverage
# Meta: &gt;85% global, &gt;90% en lógica de negocio
# Si coverage bajo:
identifica código no cubierto y escribe tests adicionales.
```

**Capa 5: Security review**

```
/security-review
# Verificar especialmente:
# - SQL injection en queries
# - Validación de input en endpoints
# - Manejo de errores (no exponer stack traces)
```

### Validación end-to-end

```
# Arrancar servidor
npm start
# Agregar libro
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin",
       "isbn": "9780132350884", "genre": "Programming"}'
# Listar
curl http://localhost:3000/books
# Agregar reseña
curl -X POST http://localhost:3000/books/1/review \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Excelente"}'
# Ver detalle con rating promedio
curl http://localhost:3000/books/1
# Debería mostrar averageRating: 5.0
# Intentar duplicado
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin",
       "isbn": "9780132350884", "genre": "Programming"}'
# Debería retornar 409: "ISBN already exists"
```

### Entregables del integrador

1. **Test suite completa:**
• 30+ tests (unit + integration)
• Todos pasando
• Coverage >85% global
2. **API funcional:**
• 6 endpoints implementados
• Validaciones de ISBN y rating
• DB persistiendo datos
• Security review limpio
```
3. TDD_PROCESS.md:
```
• Orden de implementación (por qué validadores→servicios→rutas)
• Iteraciones por capa (cuántas veces ejecutó tests Claude)
• Bugs que TDD previno (qué habría fallado sin tests)
• Tiempo estimado con TDD vs sin TDD
• Hallazgos de /security-review
4. **Git history:**
• Commits separados por capa (tests, validators, services, routes)
• Cada commit tiene tests pasando

### Criterios de evaluación

**Test-first:** Tests escritos antes de CADA componente
**RED confirmado:** Documentado que tests fallaban antes de implementar
**GREEN sin modificar tests:** Claude no tocó tests para hacerlos pasar
**Coverage:** >85% global, >90% en lógica de negocio
**Mocking:** Unit tests mockean DB, integration tests usan DB real
**Security:** /security-review ejecutado, issues corregidos
/sandbox**:** Usado durante fases GREEN
**Calidad:** Código limpio, sin duplicación
**TDD_PROCESS.md:** Demuestra comprensión profunda del ciclo

## 9. Conceptos clave para memorizar

### TDD con coding agents — el modelo mental

**Tests son especificación ejecutable:**

• En lugar de describir lo que quieres con palabras, lo describes con tests
• Los tests son precisos, no ambiguos — Claude no tiene que interpretar
• Claude puede auto-verificar en cada iteración

**El ciclo adaptado:**

```
SPEC → RED → GREEN → VALIDATE → REFACTOR → SECURITY → COMMIT
```

**La regla de oro:**

• Tests ANTES de código
• Confirmar que FALLAN
• Implementar hasta que PASEN
• **NUNCA** modificar tests para que pasen — arreglar el CÓDIGO

**Mocking estratégico:**

• Unit tests: mockear dependencias externas (DB, APIs, filesystem)
• Integration tests: usar servicios reales
• TDD permite desarrollar lógica ANTES que infraestructura

### /sandbox para flujo sin interrupciones

• 84% menos prompts de permiso
• Aislamiento de filesystem y red
• Ideal para ciclos RED→GREEN donde Claude ejecuta tests repetidamente
• No usar cuando tests necesitan red real (sin mocks)

### /security-review como complemento

• TDD valida funcionalidad — security review valida seguridad
• Ejecutar DESPUÉS de GREEN, ANTES de commit
• anthropics/claude-code-security-review para CI/CD

### Coverage como indicador, no meta

• 100% coverage ≠ código correcto
• <80% coverage = probablemente faltan tests en caminos importantes
• Lógica de negocio: 90%+ | APIs: 80%+ | Config: 60%+

## 10. Antipatrones a evitar

**"Escribiré tests después"** → Nunca llegan, o son superficiales. Tests primero SIEMPRE.
**Modificar tests para que pasen** → Si el test falla, el código está mal. No el test.
**Tests que testean implementación** → Testear COMPORTAMIENTO, no detalles internos. Si refactorizas y los
tests se rompen, son frágiles.
**Buscar 100% coverage a toda costa** → Tiempo mal invertido en código declarativo. Enfoca coverage en lógica de
negocio.
**No mockear en unit tests** → Tests lentos, frágiles, y que fallan por razones ajenas a tu lógica.
**Tests sin assertions claras** → expect(result).toBeDefined() no verifica nada útil. Verifica VALORES concretos.
**Saltar fase RED** → Sin RED, no sabes si tus tests realmente detectan errores. El stub que falla es esencial.
**Ignorar security review** → 100% coverage con SQL injection sigue siendo un bug en producción.
**Tests que dependen del orden** → Cada test debe poder ejecutarse aisladamente. beforeEach para resetear
estado.

## 11. Recursos complementarios

### Lecturas obligatorias

• Anthropic: Best Practices — "Give Claude verification mechanisms"
• ComposioHQ/awesome-claude-skills: test-driven-development — Skill de TDD

### Repositorios de referencia

• anthropics/claude-code-security-review (~2.800#) — Security review en CI/CD
• shinpr/ai-coding-project-boilerplate — Boilerplate con workflow TDD pre-configurado
• ComposioHQ/awesome-claude-skills (~6.600#) — Catálogo de skills incluyendo TDD

### Documentación oficial

• Claude Code Security — Modelo de seguridad y sandbox
• Claude Code Sandboxing — Deep dive en sandboxing (84% menos prompts)

### Testing frameworks (Node.js)

• Vitest — Testing framework recomendado (ESM nativo, Jest-compatible)
• Supertest — Testing de HTTP endpoints
• nock — Mock de HTTP requests (para tests que no necesitan red real)
• msw — Mock Service Worker (alternativa moderna a nock)

### Testing frameworks (Python)

• pytest — Framework estándar, fixtures potentes
• pytest-cov — Coverage integrado con pytest
• pytest-mock — Fixture mocker para mocking limpio
• responses — Mock de HTTP requests
• httpx + pytest-httpx — Testing de APIs async

### Testing frameworks (Java)

• JUnit 5 — Framework estándar
• Mockito — Mocking framework
• JaCoCo — Coverage reporting
• REST Assured — Testing de APIs REST

## 12. Checklist de finalización del módulo

Completé ciclo SPEC→RED→GREEN→VALIDATE→REFACTOR en función pura Confirmé fase RED (tests fallando correctamente con stub)
Llegué a GREEN sin modificar tests Usé /sandbox para ejecución fluida de tests Implementé servicio con mocking de dependencias (vi.mock)
Entiendo diferencia entre unit tests (mocked) e integration tests (real)
Coverage >80% en todos los ejercicios Ejecuté /security-review y triagé findings (critical/warning/info)
Corregí issues CRITICAL de security review antes de commitear Probé el skill TDD (preview M5) y comparé con TDD manual Completé API completa con TDD (integrador: library-api)
Documenté proceso en TDD_PROCESS.md con reflexión sobre bugs prevenidos Puedo explicar por qué TDD multiplica calidad 2-3x con Claude Code Puedo explicar la regla de oro: no modificar tests durante implementación Sé cómo adaptar el workflow TDD a Python (pytest) o Java (JUnit 5)

## Próximos pasos

En **Módulo 4: Arquitectura de CLAUDE.md profesional** aprenderás:
• .claude/rules/ con frontmatter YAML paths: para carga condicional
• Diferencia entre CLAUDE.md (instrucciones), settings.json (permisos), y rules/ (condiciones)
• Patrón de actualización continua (bugs → reglas + auto-memoria)
• Cómo escalar para proyectos enterprise sin que Claude ignore instrucciones
• Auto-memoria (/memory) como complemento de actualización implícita
**Preparación para M4:** El CLAUDE.md que has usado hasta ahora tiene <50 líneas. Funciona para proyectos simples.
M4 te enseñará a escalar a proyectos con múltiples dominios (frontend, backend, API, infra) donde necesitas reglas diferentes según qué archivos estés editando — sin sobrecargar el contexto.
