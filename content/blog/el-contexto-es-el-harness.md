---
title: "El contexto es el harness"
date: "2026-04-19"
description: "Gestión de sesiones en Claude Code con 1M tokens. Cinco acciones (Continue, /rewind, /clear, /compact, subagentes) son en realidad tres decisiones — y lo que las guías de divulgación no te cuentan."
excerpt: "Cinco acciones (Continue, /rewind, /clear, /compact, subagentes) son en realidad tres decisiones. Lo que las guías de divulgación no te cuentan sobre gestión de contexto."
category: "Sin Filtro"
authors:
  - alberto-rivera
featured: false
image: "/favicon.svg"
---

**Gestión de sesiones en Claude Code con 1M tokens — y lo que las guías de divulgación no te cuentan**

El 15 de abril de 2026 Anthropic publicó dos cosas a la vez: el comando `/usage` y una guía de gestión de contexto firmada por Thariq Shihipar, del equipo de Claude Code. La guía se viralizó. Al día siguiente ya había media docena de hilos resumiéndola en inglés y otra media en español. Casi todos comparten el mismo error: tratan las cinco acciones (`Continue`, `/rewind`, `/clear`, `/compact`, subagentes) como cinco botones que hay que aprenderse. Como si fuera una lista de atajos de teclado.

No lo es. Las cinco acciones son **tres decisiones**, y la mayor parte del valor está en una sola de ellas. Esta guía reescribe el post de Thariq con los matices que aparecen cuando llevas meses usando Claude Code en cliente real, multi-proyecto, y con sesiones que duran días.

---

## Antes: tres conceptos, no dos

Las guías rápidas suelen explicar "context window" y "context rot". Suficiente para un tuit, insuficiente para trabajar. Los conceptos que necesitas dominar son tres, y hay que entenderlos como sistema:

**Context window.** Todo lo que el modelo puede ver en el turno actual: system prompt, la conversación entera, cada tool call con su output, cada archivo leído (también los que abrió él mismo con `Read`, no solo los que tú referenciaste). Claude Code tiene 1M de tokens desde marzo de 2026 para Opus 4.6 (planes Max, Team y Enterprise). Sin cargo extra: 1M se factura al mismo precio por token que 10k.

**Context rot.** La degradación de rendimiento cuando el contexto crece. La atención se reparte entre más tokens, y el contenido antiguo empieza a competir por ella con lo que realmente importa ahora. Anthropic no publica una cifra exacta de dónde empieza a notarse, pero en la práctica el deterioro aparece mucho antes de llegar al límite. El 1M no es permiso para llenarlo; es un margen de seguridad.

**Compaction.** Cuando te acercas al límite, Claude resume la conversación en una descripción más corta y sigue en una ventana nueva. Esto pasa automáticamente si no haces nada. Y pasa en el peor momento posible: justo cuando el modelo está con el contexto más cargado y, por tanto, en su punto de menor capacidad para decidir qué conservar.

El corolario importante: **autocompact es el modo de fallo por defecto**. Si no tomas decisiones activas sobre tu contexto, el sistema las toma por ti, tarde y mal.

---

## Cinco acciones son tres decisiones

Cuando Claude termina un turno, la taxonomía oficial es:

1. `Continue` — seguir en la misma sesión.
2. `/rewind` (o doble Esc) — rebobinar a un mensaje previo y re-promptear desde ahí.
3. `/clear` — sesión nueva, contexto limpio.
4. `/compact` — Claude resume lo anterior y sigues sobre el resumen.
5. **Subagents** — delegas a un agente con su propia ventana limpia de 1M y solo vuelve la conclusión.

La taxonomía está bien. Pero en realidad cada turno resuelve **tres preguntas** en cascada:

**Pregunta 1 — ¿La tarea sigue siendo la misma?**
- Sí → decide entre `Continue`, `/rewind` o `/compact`.
- No → `/clear`. Nueva sesión. Sin discusión.

**Pregunta 2 — Si la tarea es la misma, ¿vas por el camino correcto?**
- Sí → `Continue`.
- No → `/rewind` al mensaje anterior al error. No corrijas encima; rebobina.

**Pregunta 3 — ¿Necesitarás el output intermedio del siguiente paso, o solo la conclusión?**
- Output intermedio → hazlo tú en el hilo principal.
- Solo conclusión → lanza un subagente.

`/compact` es la excepción: interviene cuando la sesión pesa demasiado pero no puedes permitirte perder todo con un `/clear`. Pero Thariq es explícito en que `/clear` suele ser mejor que `/compact` cuando puedes permitírtelo, porque tú controlas qué se arrastra y el modelo no tiene que resumir en su peor momento.

Leído así, la decisión no es "qué comando usar". La decisión es **qué parte del contexto actual merece seguir vivo en el siguiente turno**. El comando es consecuencia.

---

## Las cinco acciones, ahora sí

### 1. Continue — cuando todo lo que hay delante pesa

Lo natural. El mensaje siguiente.

**Cuándo tiene sentido:** cuando cada elemento del contexto sigue siendo *load-bearing*, en términos de Thariq: todavía sostiene el trabajo. Los archivos leídos son los que el siguiente paso va a tocar. Las decisiones tomadas son las que el siguiente paso va a aplicar.

**Error típico:** mantener una sesión abierta semanas, mezclando tareas y clientes. Yo lo he hecho. Abres Claude Code por la mañana, preguntas algo sobre el proyecto A, a mediodía cambias al proyecto B "solo para una cosa rápida", por la tarde vuelves al A. Para cuando quieres darte cuenta, llevas 200k tokens de contexto mezclado y las respuestas se han vuelto raras sin que puedas decir exactamente cuándo. La sesión larga no es una medalla. Es un cuchillo romo.

**Heurística:** si llevas más de dos correcciones a Claude sobre el mismo tema, tu contexto ya está viciado. `Continue` ha dejado de ser la respuesta correcta.

### 2. /rewind (Esc Esc) — la acción que casi nadie usa

Es la pieza más importante del post de Thariq y la que más se pasa por alto.

**Qué hace:** abre el menú de checkpoints, seleccionas un mensaje anterior, y todo lo posterior desaparece del contexto. El código vuelve también a ese estado (no solo la conversación). Desde ahí vuelves a promptear.

**Cuándo usar:** cuando Claude ha tomado un camino equivocado. El ejemplo canónico: Claude lee cinco archivos, intenta un enfoque, no funciona. Tu instinto es escribir *"eso no ha funcionado, prueba X en vez"*. Mal. Cada corrección que escribes se suma al contexto: ahora Claude tiene en la ventana el enfoque fallido, tu cara de enfadado, y el enfoque nuevo. Probablemente va a mezclarlos.

La jugada correcta es rebobinar al punto *justo después* de las lecturas útiles de archivos (esas las quieres conservar, cuestan tiempo y tokens) y re-promptear con lo aprendido: *"no uses el enfoque A, el módulo foo no expone eso, ve directamente a B"*.

**Truco que casi nadie usa:** desde el menú de `/rewind` puedes seleccionar un mensaje y elegir **"Summarize from here"**. Claude escribe un mensaje de handoff, como una nota de su yo futuro a su yo pasado explicando qué intentó y por qué no funcionó. Esto es compactación quirúrgica: conservas el contexto inicial intacto, reemplazas solo el tramo fallido por un resumen, y sigues. Ni `/compact` ni `/clear` te dan este nivel de control.

**Dato de campo:** llevo meses recomendando `/rewind` en formaciones de equipos y es el comando que más resistencia encuentra. La gente siente que "tira trabajo". No lo tira: tira ruido. Es el hábito que más separa a alguien que usa Claude Code con soltura de alguien que pelea con él.

### 3. /clear — tarea nueva, sesión nueva

La regla oficial de Anthropic: **tarea nueva = sesión nueva**.

**Qué hace:** reinicia la conversación entera. Tú decides qué contexto vuelves a introducir en el primer prompt.

**Cuándo usar:** cuando cambias de tarea y el contexto acumulado no te aporta. Idealmente con un brief corto de lo que sabes y lo que has decidido: *"estamos refactorizando el middleware de auth, la constraint es X, los archivos que importan son A y B, hemos descartado el enfoque Y"*. Cuesta dos minutos escribirlo. Recupera horas de sesión limpia.

**Cuándo NO usar:** para tareas relacionadas donde parte del contexto sí aporta. Ejemplo del propio post: acabas de implementar una feature y quieres escribir la documentación. `/clear` obliga a Claude a releer los archivos que acaba de tocar. Más lento, más caro, peor resultado. Sigue en la misma sesión (o rebobina al punto justo antes de escribir docs y re-promptea).

**Multi-cliente, el caso más caliente:** si trabajas, como yo, con varios clientes simultáneos, `/clear` entre contextos no es higiene, es obligación. No porque el modelo vaya a "filtrar" nada literal, sino porque la convención de nombres, stack y decisiones de un cliente contamina las del siguiente si quedan en ventana. Un proyecto de adopción de Copilot 365 para un gran banco y un rollout de Claude Code para una startup tienen *vocabulario*, *cadencias* y *restricciones* distintas. Mezclarlas en contexto produce respuestas que no encajan ni en uno ni en otro.

### 4. /compact — el as bajo la manga (y el modo de fallo)

**Qué hace:** Claude resume la conversación y reemplaza el historial con ese resumen. Es lossy (se pierde detalle) pero automático y suele ser razonablemente exhaustivo.

**Cuándo usar:** sesión larga donde el trabajo inicial sigue importando pero el debugging intermedio ya no. Caso típico: pasaste dos horas persiguiendo un bug, lo arreglaste, y ahora vas a seguir construyendo sobre el código corregido. No necesitas arrastrar las 40 lecturas de archivo y las 12 hipótesis fallidas; el código final y la lección sí.

**Se puede guiar:** `/compact focus on the auth refactor, drop the test debugging`. Hazlo. Un compact sin instrucciones es peor que uno dirigido.

**El modo de fallo oficial (bad autocompact):** autocompact se dispara al llegar al límite del contexto, que es precisamente cuando el modelo está en su peor momento. Si venías de una sesión larga de debugging y tu siguiente mensaje es *"ahora arregla el otro warning que vimos en bar.ts"*, puede que ese warning haya sido resumido fuera del compact. Claude ya no tiene visibilidad de él y va a pedírtelo, alucinarlo o ignorarlo.

**Solución:** compact proactivo con dirección explícita antes de que autocompact se dispare, o `/rewind → Summarize from here` para compactar solo el tramo que no importa.

**Ajuste persistente poco conocido:** en CLAUDE.md puedes dejar instrucciones permanentes para compact, del tipo *"When compacting, always preserve the full list of modified files and any test commands"*. Con eso reduces el riesgo de perder contexto crítico sin tener que acordarte de añadirlo cada vez.

### 5. Subagentes — delegar con ventana propia

**Qué hace:** Claude lanza un agente hijo vía la herramienta `Agent`. El subagente tiene su propia ventana limpia de 1M tokens, ejecuta su trabajo entero (con todas las lecturas, exploraciones y tool calls que necesite), y **solo la conclusión final vuelve al padre**. El ruido intermedio se queda en el hijo.

**El test mental de Anthropic, literal:** *¿voy a necesitar este output intermedio otra vez, o solo la conclusión?*

**Casos claros de subagente:**

- Verificación: *"lanza un subagente que valide este trabajo contra este archivo de specs"*. Si pasa, vuelve un OK. Si no, vuelve con la lista de fallos. Nada de las 800 líneas de logs que leyó para comprobarlo.
- Exploración de código ajeno: *"lanza un subagente que lea este otro repo y resuma cómo implementa el auth, luego implementa tú lo mismo aquí"*.
- Generación de docs: *"lanza un subagente que escriba las docs basándose en mis cambios de git"*.

**Conexión con multi-Claude:** los subagentes son el embrión de flujos paralelos reales. En el programa los tratamos como un módulo aparte porque la disciplina de diseñar el prompt del subagente —qué recibe, qué devuelve, qué NO debe arrastrar— es una habilidad propia. Un mal prompt de subagente devuelve el mismo ruido que tenía dentro, y entonces no has resuelto nada: solo has movido el problema un nivel.

---

## Lo que las guías de divulgación no te cuentan

Cuatro piezas que los resúmenes en español están dejando fuera y que, en mi experiencia, son donde está el 30% del valor real:

**1. `/usage` (nuevo, 15 de abril).** El comando que disparó el post. Te muestra cuánto contexto llevas gastado en la sesión actual. No esperes a que algo vaya mal para revisarlo. Míralo antes de tomar la decisión de `Continue` vs `/compact` vs `/clear`. Datos en vez de intuición.

**2. `/btw` — by the way.** Para preguntas rápidas que NO quieres que se queden en contexto. Típico: estás refactorizando auth y alguien te pregunta por Slack cómo se llamaba el paquete de tal cosa. Lo preguntas con `/btw` y la respuesta no se arrastra al siguiente turno. Parece nimio. No lo es: son exactamente las preguntas que inflan el contexto sin aportar.

**3. Summarize from here vía `/rewind`.** Lo conté arriba. Compactación quirúrgica. Casi nadie lo usa porque nadie entra al menú de `/rewind` con esa intención. Entra.

**4. CLAUDE.md como configuración permanente de compact.** Las instrucciones que dejas en CLAUDE.md sobreviven compact y clear. Todo lo que quieras que esté garantizado después de un compact (lista de archivos clave, comandos de test, restricciones del proyecto) escríbelo ahí una vez y olvídate.

---

## El principio que cierra todo

Hay una frase en findskill.ai que clavó el punto mejor que el propio post oficial: **un contexto limpio le gana a un contexto largo, siempre**. El 1M no es una invitación a dumpearlo todo. Es un margen para no tener que decidir bajo presión.

La gente buena con Claude Code no trata el contexto como memoria, lo trata como **working set**: un espacio de trabajo vivo que se mantiene limpio *a propósito*. Podan, rebobinan, compactan y delegan para mantener alta la relación señal-ruido. No porque les sobre tiempo, sino porque saben que cada token de ruido es un token que le quita atención al siguiente paso.

Si conectas esto con el modelo mental de Claude Code como agente, no como chatbot, el principio se vuelve más fuerte: **el contexto es el harness**. El harness es lo que convierte a un LLM en agente autónomo: CLAUDE.md, reglas, tools disponibles, feedback loops, control flow. Y el contexto activo en ventana es el componente más volátil de ese harness. Se ensucia cada turno. Se limpia solo si tú lo limpias.

Gestión de sesiones no es un tema operativo menor. Es **la disciplina fundamental** de trabajar con agentes. Si un equipo adopta Claude Code y no interioriza esto, va a rendir un 40% por debajo de su potencial sin poder señalar exactamente por qué.

---

## El hábito que señala a los pros

Si te vas con una sola cosa, que sea esta: **`/rewind`**.

Thariq lo dice con todas las letras: si tuviera que elegir un hábito que marca la diferencia entre alguien que entiende la gestión de contexto y alguien que no, es rebobinar en vez de corregir.

Casi nadie lo hace. A partir de hoy, tú sí.

---

*Fuentes: "Using Claude Code: session management and 1M context" (Anthropic, 15 abril 2026), hilo de Thariq Shihipar @trq212, Claude Code Best Practices (code.claude.com/docs).*
