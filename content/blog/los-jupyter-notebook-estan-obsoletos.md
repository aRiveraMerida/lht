---
title: "Los Jupyter Notebook están obsoletos"
date: "2026-05-03"
description: "El notebook fue útil cuando experimentar era lento y costoso. Ya no lo es."
excerpt: "El notebook fue útil cuando experimentar era lento y costoso. Ya no lo es."
category: "Sin Filtro"
authors:
  - javier-carreira
featured: false
image: "/favicon.svg"
---

Llevo tiempo pensando en esto y creo que ya es momento de decirlo sin rodeos: el Jupyter
Notebook, tal como lo usamos hoy, está quedándose obsoleto. No desaparecerá de un día para
otro, pero su papel en el trabajo real de data science es cada vez más marginal.

## Por qué funcionaron tan bien

Hay que ser justo: el notebook tuvo mucho sentido cuando apareció. Cuando experimentar
con datos era lento, cuando cada iteración costaba tiempo y esfuerzo, poder ejecutar
celdas de forma independiente y ver resultados intermedios era una ventaja enorme.
Combinabas código, visualizaciones y texto en un mismo sitio. Para explorar un dataset
o probar una idea rápida, era la herramienta perfecta.

El problema es que ese contexto ha cambiado mucho.

## La IA cambia la ecuación de la experimentación

Antes, el notebook te daba visibilidad sobre lo que estaba pasando en cada paso porque
no tenías otra forma de obtenerla. Si querías entender por qué tu modelo daba resultados
raros, ibas celda a celda, imprimías variables, visualizabas distribuciones. Era el único
flujo que te permitía inspeccionar el proceso sin demasiado esfuerzo.

Ahora puedes hacer exactamente lo mismo en un script normal con una IA al lado. Describes
lo que ves, le pegas el error o el resultado inesperado, y en segundos tienes una
explicación y una propuesta de corrección. No necesitas interrumpir el flujo de tu código
en celdas para entender qué está pasando. El rol de "ventana de inspección" que tenía el
notebook lo ha absorbido el asistente.

Lo que antes justificaba la estructura del notebook —la capacidad de parar, mirar y
decidir— ya no depende del notebook.

## Los problemas que siempre hemos tolerado

Los notebooks tienen defectos conocidos que el sector lleva años aceptando como si fueran
inevitables.

El primero es el estado oculto. Durante una sesión larga ejecutas las celdas en distinto
orden, sobrescribes variables, borras celdas que ya no necesitas. Al final tienes un
entorno cuyo estado real es imposible de reconstruir. Reinicias el kernel e intentas
ejecutarlo de arriba a abajo, y a menudo falla porque el orden importaba y nadie lo
documentó.

El segundo es el control de versiones. Un fichero `.ipynb` es JSON con los outputs
incrustados. Hacer un diff entre dos versiones en git es prácticamente ilegible. Comparar
qué cambió entre ayer y hoy en un notebook es mucho más difícil de lo que debería ser
en 2026.

El tercero es la colaboración. No hay una forma natural de que dos personas trabajen
sobre el mismo notebook al mismo tiempo. No hay revisión de código real, no hay pull
requests con sentido. Es una herramienta diseñada para trabajo individual.

## Un notebook no es un proyecto, ni siquiera una POC

Aquí creo que está la confusión más importante. Mucho trabajo en data science se queda
en notebooks y se presenta como si fuera un entregable. No lo es.

Una prueba de concepto mínima tiene que poder ejecutarla otra persona sin que tú estés
delante explicando qué celda va primero y cuál hay que saltarse. Tiene que ser
reproducible. Un notebook rara vez cumple eso sin trabajo adicional.

Un proyecto real tiene módulos, tiene una forma de ejecutarse de forma repetible, tiene
tests aunque sean básicos, tiene una estructura que otra persona puede entender. Un
notebook puede ser una pieza dentro de ese proyecto, la parte de exploración inicial,
pero no puede ser el proyecto en sí. El notebook empieza siendo un borrador y acaba
convirtiéndose en el lugar donde vive el trabajo. Eso es lo que hay que evitar.

## Dónde seguirá teniendo sentido

No estoy diciendo que los notebooks vayan a desaparecer ni que no sirvan para nada.
En análisis exploratorio puntual, en enseñanza, en demostraciones donde quieres mezclar
texto y código de forma visual, siguen siendo una opción razonable.

Pero si tu equipo hace data science principalmente en notebooks, hay algo más de fondo
en cómo entendéis lo que es un proyecto y lo que significa avanzar en él. Los notebooks
os están dando la sensación de avanzar sin la estructura que hace que ese avance sea
real y sostenible.

Vale la pena imaginar cómo organizaríais el trabajo si los notebooks nunca hubieran
existido. Probablemente con más estructura desde el principio. Y eso, hoy, es
perfectamente posible sin sacrificar velocidad.
