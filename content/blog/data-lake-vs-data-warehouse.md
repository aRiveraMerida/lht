---
title: "Data Lake vs Data Warehouse: ¿dónde meto todos estos datos?"
date: "2026-04-23"
description: "Tenemos datos en MongoDB, hojas de cálculo y exportaciones de herramientas por todos lados. Estamos empezando a organizarlos bien. Esto es lo que hemos aprendido hasta ahora sobre Data Lake, Data Warehouse, y el error que ya cometimos."
excerpt: "Tenemos datos en MongoDB, hojas de cálculo y exportaciones de herramientas por todos lados. Estamos empezando a organizarlos bien. Esto es lo que hemos aprendido hasta ahora."
category: "Sin Filtro"
authors:
  - javier-carreira
featured: false
image: "/favicon.svg"
---

En The Power tenemos datos por todos lados. MongoDB, hojas de cálculo, exportaciones de herramientas, registros de operaciones... Llevan tiempo ahí, acumulándose. Y hace poco alguien decidió que había que organizarlos. Sin inventario previo. Sin estrategia. Directamente a mover cosas.

Ya sabemos cómo acaba eso.

Ahora estamos en el punto de hacerlo bien: definir qué tenemos, qué necesitamos, y qué arquitectura tiene sentido antes de mover una sola fila. Y en ese proceso, dos conceptos aparecen siempre: **Data Lake** y **Data Warehouse**. Suenan parecido. Son bastante distintos. Confundirlos, o saltarse uno, es exactamente el tipo de error que ya hemos cometido.

Esto es lo que estamos aprendiendo mientras lo decidimos.

## Imagina un almacén... y un lago

La metáfora más útil que conozco es esta:

Un **Data Warehouse** es como un almacén muy bien organizado. Cada caja está etiquetada, tiene su sitio, y sabes exactamente qué hay dentro. Si alguien te pide "las ventas del tercer trimestre por región", puedes ir directo a la estantería correcta y tenerlo en segundos. Todo está limpio, estructurado y listo para usar.

Un **Data Lake** es como un lago. Puedes echar dentro casi cualquier cosa: agua dulce, agua salada, peces, algas, piedras. No pasa nada. El lago lo acepta todo. Luego, cuando necesites algo concreto, bajas al lago y lo pescas. Pero para eso necesitas saber bucear.

Ninguno es mejor que el otro. Son herramientas distintas para necesidades distintas.

## Data Warehouse: para preguntas conocidas

El Data Warehouse nació para responder preguntas de negocio de forma rápida y fiable. ¿Cuánto vendimos este mes? ¿Qué producto tiene mejor margen? ¿Cómo evolucionó la retención de clientes en el último año?

Para que eso funcione bien, los datos tienen que llegar ya **limpios, transformados y con un esquema claro**. Antes de cargar nada, decides qué columnas va a tener cada tabla, qué tipos de datos, cómo se relacionan las tablas entre sí. Esto se llama *schema-on-write*: defines la estructura al escribir.

El resultado es una herramienta perfecta para analistas de negocio y dashboards. Herramientas como **BigQuery**, **Snowflake** o **Amazon Redshift** son los referentes del sector.

**Sus puntos fuertes:**
- Consultas muy rápidas
- Datos fiables y consistentes
- Fácil de usar para perfiles no técnicos

**Sus limitaciones:**
- No acepta bien datos no estructurados (imágenes, logs, JSON anidado...)
- Requiere un trabajo previo de modelado y transformación
- Cambiar el esquema cuando ya hay datos cargados puede ser costoso

## Data Lake: para datos que aún no sabes cómo usar

El Data Lake parte de una idea diferente: *guarda primero, ya veremos para qué sirve esto*.

Aquí llegan los datos **en crudo**, tal como salen de la fuente. Un JSON con mil campos anidados, logs de servidor, clics de usuarios, imágenes, documentos de texto... todo tiene cabida. El esquema se define más tarde, cuando vas a leer los datos. Esto se llama *schema-on-read*.

Esto lo hace ideal para equipos de ciencia de datos y machine learning, donde la exploración es parte del trabajo. También es el destino natural de fuentes de datos complejas, como bases de datos NoSQL.

Tecnologías habituales: **Amazon S3**, **Azure Data Lake Storage**, **Google Cloud Storage**.

**Sus puntos fuertes:**
- Almacenamiento barato para grandes volúmenes
- Acepta cualquier formato y estructura
- Ideal para exploración y modelos de ML

**Sus limitaciones:**
- Sin disciplina, se convierte en un "Data Swamp" (pantano de datos): nadie sabe qué hay ni cómo usarlo
- Las consultas son más lentas sin optimización
- Requiere perfiles técnicos para sacarle partido

## El error que ya cometimos: saltarse el lago

Cuando tienes fuentes de datos complejas, como una base de datos MongoDB con documentos anidados e irregulares, la tentación es migrarlas directamente al Data Warehouse y convertirlo todo en tablas SQL. Parece lo más rápido. Parece lo más limpio.

No lo es.

Las consecuencias son predecibles, y las hemos visto:

1. **Se pierden datos.** Al forzar un documento JSON complejo en una tabla plana, los campos anidados y los arrays se aplanan mal o directamente se descartan.
2. **No hay red de seguridad.** Si la transformación tiene errores y no guardaste los datos originales en ningún sitio, no hay vuelta atrás.
3. **El esquema se vuelve frágil.** MongoDB no obliga a que todos los documentos tengan los mismos campos. Un Data Warehouse sí. Esa tensión provoca migraciones rotas.

El orden correcto es respetar el flujo natural: primero el lago, luego el almacén. Pero para respetar ese orden primero tienes que saber que existe. Nosotros lo aprendimos a las malas.

## La arquitectura moderna: Lakehouse

Hoy en día, la mayoría de empresas con cierta madurez de datos no eligen entre uno u otro. Usan los dos, en una arquitectura que se conoce como **Lakehouse**:

```
Fuentes de datos (MongoDB, APIs, logs, etc.)
           ↓
       DATA LAKE          → Datos en crudo, sin procesar
           ↓
    Transformación         → Limpieza, modelado, aplanado
           ↓
    DATA WAREHOUSE         → Datos listos para análisis
           ↓
   BI y Reportes           → Dashboards, decisiones
```

Plataformas como **Databricks** o **dbt** viven en esa capa intermedia de transformación, siendo el pegamento entre el lago y el almacén.

En el ecosistema de Google Cloud, por ejemplo, el lago sería **Google Cloud Storage** y el almacén sería **BigQuery**. En AWS, **S3** y **Redshift**. En Azure, **ADLS** y **Synapse**.

## ¿Por dónde empezar?

Si estás planteándote montar esta arquitectura, como lo estamos haciendo nosotros ahora, hay tres preguntas que deberías responder antes de escribir una sola línea de código:

**1. ¿Qué preguntas necesitas responder?**
Si son preguntas de negocio concretas y repetitivas, un Data Warehouse puede ser suficiente. Si quieres explorar datos, hacer ML o simplemente no sabes todavía qué vas a necesitar, empieza por el lago.

**2. ¿Qué tipo de datos tienes?**
Datos relacionales y bien estructurados van bien al warehouse. Datos de NoSQL, logs, APIs o cualquier cosa irregular necesita pasar primero por el lago.

**3. ¿Tienes los datos originales a salvo?**
Antes de cualquier migración, asegúrate de tener una copia en crudo de tus datos en algún sitio. Es tu red de seguridad. Sin ella, cualquier error de transformación puede ser irreversible.

Nosotros todavía estamos respondiendo estas preguntas. Hay decisiones que no están tomadas. Hay fuentes de datos que no sabemos bien cómo encajan. Pero al menos ahora sabemos qué preguntas hacer antes de mover nada.

## Conclusión

La diferencia entre Data Lake y Data Warehouse no es solo técnica: es una diferencia de filosofía. El warehouse asume que sabes lo que quieres. El lago asume que aún estás descubriendo lo que tienes.

Nosotros estamos claramente en la segunda fase. Y lo más valioso que hemos aprendido hasta ahora no es qué herramientas usar, sino en qué orden pensar: primero inventario, luego estrategia, luego arquitectura, luego migración. En ese orden y no en otro.

La arquitectura no importa tanto como el cuidado con el que se ejecuta. Los datos son activos críticos. Tratarlos como tal: guardarlos bien desde el primer día, documentar las transformaciones, validar que nada se pierde. Eso es lo que separa un proyecto de datos sólido de uno que acaba siendo un problema. Lo estamos aprendiendo mientras lo hacemos.
