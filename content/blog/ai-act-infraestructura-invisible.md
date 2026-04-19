---
title: "El AI Act no es un tema legal"
date: "2026-04-19"
description: "Un manual operativo sobre el AI Act para implantadores, directivos y responsables de adopción de IA. Prácticas prohibidas, alto riesgo, GPAI, OWASP LLM Top 10, gobernanza, evidencias y qué hacer antes del 2 de agosto de 2026."
excerpt: "A menos de cuatro meses del 2 de agosto de 2026, el AI Act pasa a ser plenamente aplicable. Un manual operativo para implantadores, directivos y responsables de adopción de IA — no para abogados."
category: "Adopción IA"
authors:
  - alberto-rivera
featured: false
image: "/favicon.svg"
---

# El AI Act no es un tema legal. Es la infraestructura invisible de la adopción real de IA

*Un manual operativo para implantadores, directivos y responsables de adopción de IA*

---

## Cómo leer este post

Estamos a menos de cuatro meses del 2 de agosto de 2026 — la fecha en la que el AI Act pasa de estar parcialmente en vigor a ser plenamente aplicable para los sistemas de alto riesgo. AESIA, la autoridad española, ya ha abierto 23 investigaciones preliminares a marzo de 2026. El Art. 4 sobre AI Literacy lleva obligando desde febrero de 2025, aunque la mayoría de empresas europeas no lo sabe. Y en paralelo, Bruselas está negociando en trílogo un paquete de reformas (**Digital Omnibus on AI**) que puede retrasar parte del calendario — pero solo parte, y solo si se aprueba a tiempo.

Si acompañas a una organización en adopción de IA, este escenario no es un expediente jurídico que hay que delegar al despacho. Es la arquitectura invisible que decide qué casos de uso son viables, cómo se diseña la gobernanza, qué formas de formación cumplen obligaciones legales, y qué tipo de evidencia vas a tener que mostrar cuando AESIA, un cliente corporativo o un trabajador afectado pregunte.

Este post cubre cinco bloques. No es una guía para abogados. Es un manual para gente que implanta, lidera o compra IA en organizaciones europeas.

---

## BLOQUE 1 — FUNDAMENTOS DE IA

### Qué es un sistema de IA según la definición oficial

El AI Act (Reglamento UE 2024/1689) define sistema de IA en su Art. 3(1) de forma deliberadamente amplia: un sistema basado en máquina, diseñado para operar con distintos niveles de autonomía, que puede mostrar adaptabilidad tras el despliegue, y que — a partir de los inputs que recibe — infiere cómo generar outputs (predicciones, contenidos, recomendaciones o decisiones) capaces de influir en entornos físicos o virtuales.

Tres elementos merecen atención operativa:

- **"Infiere"** deja fuera el software clásico basado en reglas deterministas explícitas. Si tu proceso tiene reglas del tipo *"si A entonces B"* escritas por una persona, probablemente no es un sistema de IA en sentido AI Act.
- **"Distintos niveles de autonomía"** incluye desde un chatbot conversacional hasta un agente con capacidad de acción sobre sistemas. La autonomía no es binaria.
- **"Influir en entornos físicos o virtuales"** captura desde una recomendación en pantalla hasta la actuación sobre un ERP, CRM o sistema de ticketing.

La Comisión publicó en febrero de 2025 unas Guidelines sobre la definición para dar seguridad interpretativa. Conviene tenerlas de referencia.

### Modelos estocásticos y datos de entrenamiento

Un LLM (y la mayoría de modelos generativos modernos) no calcula, **predice tokens**. Cada respuesta es la secuencia que el modelo estima más probable dada la entrada y sus parámetros. Esta naturaleza estocástica tiene dos implicaciones que cambian cómo se diseña el uso:

**La primera**: el mismo prompt puede generar respuestas distintas. No es un bug, es el mecanismo. Si tu caso de uso requiere determinismo, la IA generativa no es el vehículo (o necesita un sistema determinista alrededor).

**La segunda**: el modelo no "sabe" nada en sentido humano. No tiene acceso a verdad, solo a patrones aprendidos sobre texto. De ahí derivan las alucinaciones, los sesgos y la incapacidad de distinguir lo plausible de lo veraz sin ayuda externa.

Los datos de entrenamiento son la otra mitad del asunto. Lo que el modelo aprendió limita lo que puede hacer bien. Si en el corpus no hay ejemplos de cierto tipo de razonamiento, no lo va a reproducir aunque se lo pidas.

### Glosario operativo mínimo

Cinco conceptos del AI Act que debes manejar sin dudar:

- **Modelo de IA**: el componente matemático entrenado (los pesos). GPT-5, Claude 4 Opus, Gemini 2.5 Pro son modelos.
- **Sistema de IA**: el producto que integra uno o varios modelos + interfaz + lógica de uso. Copilot 365, ChatGPT, un agente customizado son sistemas.
- **Proveedor**: quien desarrolla un sistema o modelo y lo pone en el mercado bajo su nombre. OpenAI es proveedor de ChatGPT. Microsoft es proveedor de Copilot.
- **Deployer** (o *responsable del despliegue*, traducción oficial española): quien usa un sistema de IA bajo su autoridad en el curso de una actividad profesional. Una empresa que usa Copilot es deployer.
- **Importador, distribuidor, representante autorizado**: figuras intermedias relevantes si el sistema proviene de fuera de la UE.

El AI Act aplica obligaciones distintas a cada figura. Confundirlas es la primera causa de que los programas de adopción se diseñen sobre supuestos erróneos.

### Garbage in, garbage out — pero con un giro

La frase clásica dice que datos malos producen outputs malos. Con modelos generativos hay que actualizar el dicho: **garbage in, confident garbage out**. El modelo no solo produce mal output, lo produce con fluidez y confianza verosímil. Esto es más peligroso que el output clásico con datos sucios, porque el usuario no tiene señal de que algo falla.

La consecuencia operativa es que **la calidad del uso importa tanto como la calidad del sistema**. Un usuario formado que cuestiona outputs es un control de calidad. Un usuario que copia y pega sin criterio es un generador de errores plausibles que se inyectan en el flujo de trabajo.

### Proveedor vs Deployer: el doble rol

La distinción más importante del AI Act para cualquier implantador es entender que **se puede ser las dos cosas a la vez en el mismo proyecto**.

Caso típico: una empresa contrata Microsoft Copilot 365 (deployer respecto a Microsoft). Esa misma empresa construye un agente custom en Copilot Studio para atención al empleado y lo despliega a 5.000 usuarios internos. En ese agente, la empresa es **proveedor** — del agente — aunque siga siendo deployer del modelo base.

Más denso aún: un implantador como los que trabajan con herramientas BI con componentes IA integrados (por ejemplo, productos tipo Qlik AutoML, Qlik Answers o funcionalidades generativas equivalentes en otras plataformas de BI). Si esa empresa configura el sistema, lo parametriza con sus datos, entrena componentes con su corpus, y lo pone a disposición de clientes finales para scoring de empleados, evaluación de clientes o recomendaciones en RRHH, el encuadre regulatorio cambia radicalmente:

- Es **deployer** del modelo base del proveedor.
- Es **proveedor** del sistema resultante que llega al usuario final, si lo pone bajo su marca.
- Y si ese sistema entra en los supuestos del Anexo III, es proveedor **de un sistema de alto riesgo** — con todas las obligaciones que eso implica.

Esto no es una esquina de pizarra jurídica. Es una decisión de modelo de negocio. Un implantador que se asume deployer pasivo tiene obligaciones ligeras. Un implantador que asume el rol de proveedor de alto riesgo asume carga de conformidad, documentación técnica, supervisión post-mercado y responsabilidad ante incidentes. Los contratos con clientes y proveedores son el único lugar donde esto se decide.

---

## BLOQUE 2 — MARCO REGULATORIO AI ACT

### Estructura del AI Act

El Reglamento 2024/1689 fue publicado en el DOUE el 12 de julio de 2024 y entró en vigor el 1 de agosto de 2024. Su aplicación es **escalonada**, por razones prácticas: dar tiempo a empresas, Estados miembros y organismos notificados a adaptarse.

La arquitectura del texto sigue un principio: **a mayor riesgo, más obligaciones**. No regula la tecnología por lo que es, sino por el uso y el impacto potencial. Es un enfoque funcional, no tecnológico. La misma tecnología puede ser riesgo mínimo en un uso y alto riesgo en otro.

### Las 4 categorías de riesgo

**1. Riesgo inaceptable**. Prácticas prohibidas completamente. Art. 5. En vigor desde el 2 de febrero de 2025.

**2. Alto riesgo**. Sistemas que pueden afectar seriamente la salud, seguridad o derechos fundamentales. Obligaciones extensas: sistema de gestión de riesgos, gobernanza de datos, documentación técnica, registro, transparencia, supervisión humana, exactitud, robustez, ciberseguridad, evaluación de conformidad. Se divide en dos grupos por anexos:
   - **Anexo I**: IA embebida en productos ya regulados por otra legislación UE (maquinaria, juguetes, dispositivos médicos, vehículos, ascensores, etc.). Obligaciones aplicables desde el 2 de agosto de 2027.
   - **Anexo III**: sistemas autónomos en ocho áreas sensibles. Obligaciones aplicables desde el 2 de agosto de 2026 (sujeto a posible retraso por el Digital Omnibus, que veremos más adelante).

**3. Riesgo limitado**. Obligaciones de transparencia. Art. 50. Aplica a chatbots, sistemas que generan contenido sintético, deepfakes y textos de interés público.

**4. Riesgo mínimo**. Sin obligaciones específicas más allá de las generales (Art. 4 AI Literacy, respeto al resto del derecho UE). La mayoría de sistemas IA caen aquí: filtros anti-spam, corrección gramatical, recomendadores de producto simples.

### Prácticas prohibidas (Art. 5) — las 8 líneas rojas

Desde el 2 de febrero de 2025 están prohibidas ocho categorías de sistemas. La Comisión publicó en febrero 2025 unas Guidelines extensas (más de 100 páginas) con ejemplos, excepciones y zonas grises. Resumen operativo:

**a) Técnicas subliminales, manipulativas o engañosas** que distorsionan materialmente el comportamiento causando daño significativo. Ejemplo de las Guidelines: un sistema que analice en tiempo real el nivel de frustración de un jugador para ajustar ofertas de compra in-app.

**b) Explotación de vulnerabilidades** por edad, discapacidad o situación socioeconómica. El criterio no es solo intención, también efecto.

**c) Social scoring** por autoridades públicas o privadas que evalúe personas por comportamiento social o características personales con consecuencias desproporcionadas o descontextualizadas.

**d) Evaluación de riesgo delictivo** basada **únicamente** en profiling o rasgos de personalidad. La palabra clave es "únicamente": si hay base probatoria objetiva, el sistema puede no estar prohibido, pero probablemente sea alto riesgo.

**e) Scraping no dirigido** de imágenes faciales desde internet o CCTV para construir bases de datos de reconocimiento facial.

**f) Reconocimiento emocional en el trabajo y la educación**, salvo usos médicos o de seguridad.

**g) Categorización biométrica** que deduzca raza, opiniones políticas, afiliación sindical, creencias religiosas, vida sexual u orientación sexual.

**h) Identificación biométrica remota en tiempo real** en espacios públicos con fines policiales. Con excepciones tasadas (búsqueda víctimas de trata, amenazas terroristas inminentes, etc.) que requieren autorización judicial previa.

Las sanciones por incumplir el Art. 5 son las más severas del marco: **hasta 35 millones de euros o el 7% del volumen de negocio global anual**, el mayor de los dos.

### Sistemas de alto riesgo — Anexo III

Las ocho áreas del Anexo III son las que más afectan a clientes corporativos típicos:

1. Biometría (identificación, categorización, reconocimiento emocional fuera del trabajo).
2. Infraestructuras críticas (energía, transporte, agua, gas).
3. Educación y formación profesional (admisión, evaluación, detección de trampas).
4. **Empleo, gestión de trabajadores, acceso al autoempleo** (selección, scoring, decisiones de promoción o despido, monitorización del rendimiento, asignación de tareas).
5. Acceso a servicios esenciales (ayudas públicas, **credit scoring**, seguros de vida/salud, servicios de emergencia).
6. Aplicación de la ley.
7. Migración, asilo, gestión de fronteras.
8. Justicia y procesos democráticos.

Si un sistema de IA entra en alguno de estos supuestos, el proveedor debe cumplir un paquete denso de obligaciones: sistema de gestión de riesgos (Art. 9), gobernanza de datos (Art. 10), documentación técnica (Art. 11), registro de logs (Art. 12), transparencia e información al deployer (Art. 13), supervisión humana (Art. 14), exactitud/robustez/ciberseguridad (Art. 15), conformity assessment (Art. 43), declaración de conformidad, marcado CE, registro en la base de datos UE.

El deployer también tiene obligaciones propias (Art. 26): uso conforme al manual del proveedor, supervisión humana efectiva, monitorización del funcionamiento, conservación de logs durante al menos 6 meses, información a los empleados afectados si el sistema se usa en el ámbito laboral, y — en ciertos casos — **evaluación de impacto en derechos fundamentales (FRIA)** antes del despliegue.

Esto es lo crítico para un implantador BI: **si un cliente usa un sistema con componentes IA para scoring de empleados, scoring crediticio, scoring de clientes en servicios esenciales o evaluación de rendimiento, el sistema está en Anexo III y todo el paquete aplica**. No importa que el sistema base sea BI estándar; lo relevante es la función que cumple.

### Transparencia (Art. 50) — lo que casi todos vais a tener que implementar

Art. 50 es la obligación que más empresas van a tocar. Aplica desde el 2 de agosto de 2026 (con una excepción que veremos):

- **Chatbots**: los sistemas que interactúan con personas físicas deben informar de forma clara que se trata de una IA, salvo que sea evidente por el contexto o el uso esté autorizado por ley para detectar delitos.
- **Contenido generado o manipulado** (audio, imagen, vídeo, texto sintético): debe marcarse en formato **machine-readable** (watermark o metadata). Esta obligación específica (Art. 50.2) se retrasa seis meses por el Digital Omnibus, hasta el 2 de febrero de 2027, para dar tiempo a que el Code of Practice sobre marcado de contenido IA se publique.
- **Deepfakes**: disclosure obligatorio de que el contenido es artificial.
- **Textos de interés público**: disclosure cuando se publican textos generados o manipulados por IA sobre asuntos de interés público, salvo revisión editorial humana con responsabilidad editorial.

Para un deployer corporativo: cualquier chatbot orientado a empleados, clientes o terceros que toque el mercado europeo tiene que cumplir Art. 50. Esto incluye agentes internos de soporte, asistentes de ventas, bots en la web. La obligación es ligera en forma (un aviso claro) pero exige revisar todos los puntos de contacto.

### Timeline actualizado (a 19 abril 2026)

El calendario original del AI Act, confirmado por la Comisión y el AI Act Service Desk:

| Fecha | Qué entra en vigor |
|---|---|
| 1 ago 2024 | Entrada en vigor del Reglamento |
| 2 feb 2025 | Arts. 1-5: AI Literacy (Art. 4) + prácticas prohibidas (Art. 5) |
| 2 ago 2025 | GPAI (Arts. 51-56), gobernanza, sanciones por prácticas prohibidas |
| 2 ago 2026 | Aplicabilidad general; alto riesgo Anexo III; Art. 50; enforcement |
| 2 ago 2027 | Alto riesgo Anexo I (productos regulados) |
| 2 ago 2030 | Sistemas preexistentes en sector público |

El AI Act entró en vigor el 1 de agosto de 2024. Las prácticas prohibidas aplican desde el 2 de febrero de 2025. Las reglas GPAI desde el 2 de agosto de 2025. El resto de disposiciones, incluidos los sistemas de alto riesgo, aplican desde el 2 de agosto de 2026.

### El Digital Omnibus on AI — lo que está en trílogo ahora mismo

El 19 de noviembre de 2025 la Comisión Europea publicó la propuesta Digital Omnibus, un paquete legislativo que puede modificar varias disposiciones del AI Act. La parte que toca al AI Act se separó por la urgencia de decidir antes de agosto 2026.

Las posiciones adoptadas:

- **Consejo Europeo** (13 marzo 2026): propone retrasar las obligaciones de alto riesgo del Anexo III hasta **2 diciembre 2027** y las del Anexo I hasta **2 agosto 2028** como fechas tope fijas.
- **Parlamento Europeo** (26 marzo 2026): aprobó enmiendas propuestas por IMCO y LIBE. Mantiene la obligatoriedad del Art. 4 AI Literacy frente al intento de la Comisión de convertirlo en voluntario.

Ahora empieza el trílogo entre Comisión, Consejo y Parlamento para acordar el texto final.

**La trampa estratégica**: si la Digital Omnibus no se adopta antes de agosto de 2026, el calendario original vuelve automáticamente. Basar planes de negocio en la asunción del retraso es una apuesta, no una estrategia de cumplimiento. Un proceso completo de compliance para alto riesgo tarda entre 8 y 14 meses. Los organismos notificados ya reportan agendas completas para el segundo trimestre de 2026.

Traducción operativa: quien esté esperando el retraso como vía para no hacer nada está tomando una decisión de riesgo inasumible para la mayoría de organizaciones.

Además hay una razón más fina para no confiarse: aunque el retraso se apruebe, **no afecta ni a las prohibiciones del Art. 5 (ya aplican y ya sancionan), ni al Art. 4 de AI Literacy (ya obliga), ni al Art. 50 de transparencia (aplica en agosto 2026 salvo el marcado de contenido), ni a las obligaciones GPAI (ya aplican)**. La parte que se retrasaría — la obligación del deployer y proveedor de alto riesgo del Anexo III — es importante, pero no es el 90% del trabajo que hay que hacer.

### Sanciones: la arquitectura en tres niveles

El régimen sancionador del AI Act es el más severo de cualquier regulación tecnológica europea, superando incluso al RGPD. Tres niveles:

- **Prácticas prohibidas (Art. 5)**: hasta 35M€ o 7% del volumen de negocio global anual, el mayor de ambos.
- **Incumplimientos de otras obligaciones** (alto riesgo, GPAI, transparencia): hasta 15M€ o 3%, el mayor.
- **Información incorrecta o engañosa a autoridades**: hasta 7,5M€ o 1,5%, el mayor.

Para PYMES y startups, las multas se calculan como el **menor** de los dos importes (fijo vs porcentaje), lo que las hace proporcionales al tamaño. Pero "proporcional" no significa indoloro: un 3% de facturación puede hundir a una empresa mediana.

### AI Act × RGPD: no son sustitutivos, son acumulativos

La confusión más extendida entre directivos: pensar que cumplir RGPD cubre el AI Act o al revés. No es así.

Si una empresa de banca usa IA para credit scoring sin cumplir el AI Act Y sin Evaluación de Impacto en Protección de Datos conforme al RGPD, puede recibir una multa de hasta 15 millones del AI Act más otra del RGPD. Las sanciones no se sustituyen, se suman.

Puntos de fricción y complementariedad:

- Las decisiones automatizadas que producen efectos jurídicos o significativamente similares caen bajo el **Art. 22 RGPD** (derecho a no ser objeto de decisiones automatizadas) **y** bajo el AI Act si el sistema es alto riesgo.
- La **EIPD (Evaluación de Impacto en Protección de Datos)** del RGPD y la **FRIA (Fundamental Rights Impact Assessment)** del AI Act son instrumentos distintos con solapamientos, pero ambos obligatorios en su ámbito.
- La **gobernanza de datos** del Art. 10 AI Act (calidad, representatividad, documentación de datasets) se suma a los principios del RGPD (minimización, limitación de finalidad, etc.), no los reemplaza.

En España, la supervisión del AI Act corresponde a **AESIA** (Agencia Española de Supervisión de la Inteligencia Artificial), con sede en A Coruña, creada por Real Decreto en 2023. La supervisión del RGPD sigue correspondiendo a la **AEPD**. Una empresa puede ser investigada por ambas simultáneamente sobre el mismo sistema, con sanciones que se acumulan.

---

## BLOQUE 3 — RIESGOS, SESGOS Y SEGURIDAD

### Los cuatro sesgos — un framework operativo

La bibliografía sobre sesgos en IA es densa y suele quedarse en lo académico. Para quien implanta, la matriz útil es esta:

**Sesgo de datos**. El corpus de entrenamiento no representa bien a la población objetivo. El caso clásico: sistemas de reconocimiento facial entrenados mayoritariamente con rostros blancos que fallan con rostros negros. En empresa: un modelo de scoring entrenado con datos históricos reproduce patrones discriminatorios del pasado.

**Sesgo de entrenamiento**. El objetivo de optimización está mal especificado. Ejemplo: optimizar "engagement" en una red social produjo rabbit holes hacia contenido extremo porque el sistema aprendió que la indignación retiene. El objetivo era retención, pero "retención" no capturaba el coste social.

**Sesgo de uso**. El usuario introduce sesgos en el prompt. *"Describe las cualidades típicas de un buen directivo"* puede producir respuestas con sesgo de género implícito que luego el usuario toma como neutras. El sesgo no está en el modelo, está en el prompt.

**Sesgo de interpretación**. El usuario lee el output con su propio sesgo de confirmación. El modelo dice "en algunos contextos" y el usuario lo lee como "siempre". O el modelo da tres alternativas equilibradas y el usuario se queda solo con la que ya prefería.

Cada sesgo tiene un responsable distinto y una mitigación distinta. Confundirlos lleva a programas de "prompt engineering" que intentan arreglar problemas estructurales del modelo, y a auditorías de modelo que no detectan problemas de uso.

### Técnicas de prompting para mitigación de sesgos

Prácticas que reducen sesgo de uso y de interpretación:

- **Diversity prompting**: "Dame tres perspectivas distintas sobre esto, incluyendo una que contradiga la hipótesis implícita en mi pregunta."
- **Mandato explícito de challenge**: "Antes de responder, identifica los supuestos que estás asumiendo y cuestiónalos."
- **Role con obligación de disentir**: "Actúa como un analista cuya única función es encontrar los puntos débiles de esta propuesta."
- **Forzar el contraargumento**: "Dame la mejor respuesta y después la mejor objeción a esa respuesta."
- **Explicitar la población objetivo**: evitar singular masculino genérico cuando se pide "describe un buen X".

Ninguna técnica de prompting arregla un sesgo estructural del modelo. Sí mejora la calidad del uso.

### Alucinaciones — qué son y qué no

Una alucinación no es una mentira ni un error aleatorio. Es una **respuesta plausible que no se corresponde con la realidad**. El modelo no sabe que está alucinando: genera lo que le parece probable dado el input.

Tipologías útiles:

- **Alucinación factual**: datos inventados (fechas, nombres, cifras).
- **Alucinación contextual**: la respuesta contradice el contexto que se ha dado en el prompt.
- **Alucinación lógica**: pasos de razonamiento que no siguen.
- **Alucinación de atribución**: cita fuentes que no existen o dice cosas que la fuente no dice.

El caso más famoso — el del abogado Mata v. Avianca en 2023, con seis sentencias inventadas por ChatGPT citadas en un escrito judicial — es alucinación de atribución.

Mitigaciones según riesgo del output:

- **Alto riesgo** (legal, médico, financiero, decisiones sobre personas): verificación manual de toda afirmación factual, RAG con fuentes documentadas, citation obligatoria, revisión humana antes de acción.
- **Riesgo intermedio** (comunicación interna, análisis preliminar): verificación de puntos clave, sentido común aplicado.
- **Riesgo bajo** (brainstorming, primera redacción de texto que luego se reescribe): uso fluido, criterio.

No todo output necesita triple verificación. El criterio proporcional es el que distingue programas de adopción maduros de programas paralizados por miedo.

### Ciberseguridad — OWASP LLM Top 10 2025

OWASP publicó en 2025 la segunda versión de su Top 10 para aplicaciones LLM. Es el marco de referencia que están usando CISOs europeos. El OWASP Top 10 for LLM Applications 2025 sitúa la prompt injection como la vulnerabilidad crítica número uno.

Las diez categorías, con lectura operativa:

**1. Prompt Injection.** Un atacante manipula el comportamiento del LLM vía inputs maliciosos. Dos variantes: **directa** (el usuario intenta evadir las protecciones) e **indirecta** (contenido malicioso oculto en documentos, webs o emails que el LLM procesa). La indirecta es la que más preocupa en agentes con acceso a herramientas.

**2. Sensitive Information Disclosure**. El modelo expone información confidencial: PII, credenciales, secretos del sistema, propiedad intelectual.

**3. Supply Chain**. Dependencias comprometidas (bibliotecas, modelos preentrenados, datasets). El ejemplo reciente es PoisonGPT: un modelo modificado y republicado en Hugging Face que pasaba controles de seguridad básicos.

**4. Data and Model Poisoning**. Inyección maliciosa durante entrenamiento o fine-tuning para producir comportamientos sesgados o backdoors.

**5. Improper Output Handling**. La aplicación inserta output del LLM en otro sistema (SQL, shell, HTML) sin sanitizar, abriendo vectores de inyección clásicos.

**6. Excessive Agency**. El agente tiene más permisos, herramientas o autonomía de los necesarios. Cuando algo sale mal, el daño es proporcional a lo que podía hacer.

**7. System Prompt Leakage** (nuevo en 2025). El system prompt se filtra al usuario, exponiendo instrucciones, credenciales embebidas o lógica de negocio.

**8. Vector and Embedding Weaknesses** (nuevo en 2025). Vulnerabilidades en las bases de datos vectoriales y procesos de embedding usados en RAG.

**9. Misinformation**. El modelo produce información falsa con confianza.

**10. Unbounded Consumption**. No hay límite de recursos: un atacante puede provocar ataques de *denial of wallet* con prompts que disparan el coste.

Mitigar OWASP LLM Top 10 no es solo responsabilidad del proveedor del modelo. Gran parte corresponde a quien construye el sistema encima (el deployer si usa APIs; el proveedor interno si construye agentes). Ningún programa de adopción corporativa debería lanzarse sin cubrir estos vectores de forma explícita.

### Shadow AI — el problema invisible

Shadow AI es el uso de herramientas IA por empleados sin conocimiento ni autorización de IT o dirección. Las auditorías encuentran, de media, entre 5 y 12 herramientas IA no documentadas por empresa, la mayoría instaladas por empleados de forma autónoma sin conocimiento de IT o la dirección.

El problema no es solo de seguridad. Es también regulatorio: cada herramienta no documentada es una obligación de AI Literacy que no se está cumpliendo (¿cómo vas a formar a los usuarios en un sistema cuya existencia no conoces?). Y es de gobierno de datos: información confidencial viajando por APIs de proveedores con políticas de privacidad que nadie ha leído.

Mitigación operativa:

- **Inventario**: cruzar self-reporting, revisión de navegadores (qué dominios IA están en uso), revisión de transacciones (suscripciones individuales), entrevistas por equipos.
- **Política de uso de IA**: qué está permitido, qué no, qué requiere aprobación. Corta y accionable.
- **Oferta de herramientas aprobadas**: si la empresa no da alternativa oficial, los empleados van a buscar la suya. Shadow AI crece donde hay demanda y no hay oferta.

### Privacidad en prompts

Cada prompt que sale de la red corporativa puede contener datos sensibles: clientes, empleados, estrategia, código, finanzas. Dos puntos:

**La distinción entre planes consumer y enterprise** importa. Los planes enterprise de los principales proveedores (ChatGPT Enterprise, Claude for Enterprise, Copilot 365) garantizan que los prompts no se usan para reentrenar modelos. Los planes consumer, por defecto, sí pueden usarse (con opciones de opt-out que el usuario medio no configura).

**Las políticas internas de uso** deben distinguir qué tipo de información puede entrar en cada tipo de sistema. No es lo mismo pedir que resuma un email interno que pegar un contrato firmado con datos de terceros. La formación tiene que hacer esta distinción operativa, no teórica.

---

## BLOQUE 4 — USO RESPONSABLE Y EFECTIVO

### Prompting básico — la arquitectura que siempre funciona

Un buen prompt tiene cinco componentes, aunque rara vez los cinco en el mismo peso:

- **Contexto**: qué se sabe antes de la tarea. "Soy director de operaciones en una empresa de logística con 200 empleados..."
- **Rol**: qué perspectiva adopta el modelo. "Actúa como consultor senior de procesos..."
- **Tarea**: qué se pide exactamente. "Diseña un proceso de onboarding para nuevos operarios de almacén."
- **Formato**: cómo se quiere la respuesta. "En forma de plan de 30-60-90 días con hitos medibles."
- **Restricciones**: qué no hacer, qué evitar. "No uses jerga anglosajona; adapta al contexto español; no incluyas tecnología sin justificar por qué."

Los anti-patrones más frecuentes: peticiones vagas ("mejora este texto"), múltiples tareas sin jerarquía ("analiza esto, mejóralo, tradúcelo y haz un resumen"), falta de contexto ("explica esto" sin decir para quién).

### Técnicas avanzadas — cuándo usar cada una

**Role-based**. Útil cuando se necesita una perspectiva específica (senior vs junior, escéptico vs entusiasta, externo vs interno). Cuidado con roles que el modelo puede interpretar con sesgo propio.

**Few-shot**. Dar dos o tres ejemplos de cómo se quiere el output. Eficaz cuando el formato es idiosincrático o la tarea es repetitiva. Es la técnica más infrautilizada en empresa.

**Chain-of-Thought**. Pedir al modelo que razone paso a paso antes de responder. Eficaz en tareas que requieren deducción, cálculo, análisis de trade-offs. Los modelos de razonamiento recientes (Claude extended thinking, o3, etc.) lo hacen internamente.

**Tree of Thoughts**. Explorar varias ramas de razonamiento en paralelo antes de converger. Útil en problemas complejos con alternativas.

**Self-consistency**. Generar varias respuestas y quedarse con la más común. Reduce variabilidad en tareas donde hay una respuesta correcta.

La mayoría de usuarios corporativos obtienen el 80% del valor con los tres primeros. Las dos últimas son para usuarios avanzados o para flujos automatizados.

### Verificación de outputs — una matriz proporcional

No todo output se verifica igual. La matriz útil cruza tres dimensiones:

- **Impacto de la decisión**: ¿afecta a una persona, a dinero, a reputación? ¿En qué magnitud?
- **Reversibilidad**: si el output está mal y se actúa sobre él, ¿se puede deshacer? ¿A qué coste?
- **Trazabilidad**: ¿queda registro de quién usó qué, cómo, y con qué resultado?

De la combinación salen tres niveles de verificación:

**Ligera**. Para outputs de bajo impacto, reversibles, con trazabilidad estándar. Borradores, brainstorming, primera versión de comunicaciones internas. El usuario lee críticamente y ajusta.

**Intermedia**. Para outputs que llegan a clientes, decisiones operativas con impacto moderado. Revisión de puntos clave, contraste con fuentes si hay cifras, segundo par de ojos cuando sea posible.

**Exhaustiva**. Para outputs en decisiones sobre personas, contratos, comunicaciones legales o financieras, decisiones irreversibles. Verificación factual completa, validación humana obligatoria antes de acción, trazabilidad completa.

La regla para adopción real: **la verificación exhaustiva solo se aplica donde importa**. Aplicarla a todo paraliza. Aplicarla a nada es irresponsable.

### Casos por rol — ejemplos operativos

- **Dirección**: preparación de reuniones, síntesis de informes largos, escritura de comunicaciones internas de alto impacto (verificación intermedia-exhaustiva).
- **RRHH**: nunca para decisiones automatizadas de selección (alto riesgo Anexo III). Sí para preparar entrevistas, estructurar feedback, redactar políticas (verificación intermedia).
- **Finanzas**: análisis preliminar de datos, preparación de informes, revisión de contratos (verificación exhaustiva en números y términos jurídicos).
- **Legal**: research preliminar, redacción de primeras versiones, comparación de cláusulas (verificación exhaustiva obligatoria — el caso Mata v. Avianca).
- **Marketing**: ideación, primeras versiones, análisis de tendencias (verificación ligera-intermedia según canal).
- **Operaciones**: documentación de procesos, diseño de checklists, análisis de incidencias (verificación intermedia).
- **IT**: revisión de código, generación de tests, documentación técnica (verificación exhaustiva en código productivo; code review + tests automatizados).

### Antiejemplos reales

**Air Canada (2024)**. El chatbot de la web prometió un reembolso en condiciones que no estaban en la política oficial. Un tribunal canadiense consideró a la aerolínea responsable de lo que había prometido su agente automatizado. La defensa de "era solo un chatbot" no se aceptó. Lección: el output de un sistema IA en nombre de una empresa obliga a la empresa.

**Mata v. Avianca (2023)**. Un abogado usó ChatGPT para preparar un escrito y citó seis sentencias inventadas. El tribunal impuso sanciones al letrado. Lección: la verificación factual es responsabilidad del usuario, no del modelo.

**DPD Chatbot (2024)**. El chatbot de la empresa de paquetería aprendió a insultar y escribir poemas críticos contra la propia empresa después de que un usuario lo manipulara. Viralizó. Lección: sin controles de dominio y moderación de output, cualquier chatbot público es una crisis de reputación en ciernes.

**Samsung (2023)**. Ingenieros pegaron código confidencial en ChatGPT consumer para que lo debuggeara. Información sensible quedó fuera de control. La empresa acabó prohibiendo el uso. Lección: formar en qué información puede entrar y en qué plan.

Los antiejemplos son el material formativo más eficaz. Mucho más que las buenas prácticas abstractas.

---

## BLOQUE 5 — GOBERNANZA Y ADOPCIÓN RESPONSABLE

### Gobierno de la IA — no es un documento, es un sistema

Un gobierno de IA funcional responde, en cualquier momento, a seis preguntas:

1. ¿Qué sistemas IA tenemos?
2. ¿En qué nivel de riesgo está cada uno?
3. ¿Quién es responsable de cada sistema?
4. ¿Qué evidencias de cumplimiento podemos mostrar?
5. ¿Cómo detectamos y gestionamos incidentes?
6. ¿Cómo introducimos nuevos sistemas con criterios claros?

Si la empresa no puede responder en 48 horas a un requerimiento de AESIA o de un cliente corporativo sobre estas seis preguntas, no hay gobierno de IA — hay documentos dispersos.

Roles mínimos:

- **Comité de IA** (transversal): decide políticas, aprueba nuevos casos de uso, revisa incidentes. Legal, IT, seguridad, RRHH, dueño de negocio.
- **AI Officer o responsable de IA** (no obligatorio en AI Act, pero recomendable). Punto único de contacto, coordinación operativa.
- **Dueño del caso de uso**: responsable del funcionamiento y supervisión del sistema en su ámbito.

### Ética — los siete requisitos HLEG como base

Las Ethics Guidelines for Trustworthy AI del Grupo de Expertos de Alto Nivel (HLEG) de la Comisión siguen siendo la referencia ética operativa más coherente, anterior al AI Act pero alineada con él:

1. Agencia humana y supervisión.
2. Robustez técnica y seguridad.
3. Privacidad y gobernanza de datos.
4. Transparencia.
5. Diversidad, no discriminación y equidad.
6. Bienestar social y ambiental.
7. Rendición de cuentas.

No son siete casillas a marcar. Son siete ángulos desde los que evaluar cualquier sistema antes de desplegarlo.

### Procesos antes que IA

Uno de los patrones más frecuentes de fracaso en adopción: **elegir herramienta antes de elegir problema**. La secuencia correcta es la inversa:

1. ¿Qué proceso queremos mejorar y por qué?
2. ¿Qué fricción concreta estamos resolviendo? ¿Qué métrica va a moverse?
3. ¿La IA es el mejor vehículo, o hay soluciones no-IA más baratas y seguras?
4. Si IA es el vehículo, ¿qué tipo? ¿Generativa, predictiva, agentes?
5. ¿Qué sistema concreto?

Los programas que empiezan con "vamos a adoptar Copilot" suelen terminar en piloto eterno. Los que empiezan con "el proceso de atención al empleado tarda demasiado y genera 2.000 tickets/mes redundantes" suelen llegar a adopción real — con o sin Copilot.

### El cambio de paradigma que no se nombra

Adoptar IA generativa no es adoptar una herramienta más. Es cambiar tres cosas en la forma de trabajar:

- **De la respuesta determinista a la respuesta probabilística**. El mismo prompt genera respuestas distintas. Eso no es un error, es el mecanismo.
- **De la herramienta que ejecuta a la herramienta con criterio aparente**. El modelo da opiniones, valora, recomienda. Tratar eso como verdad es el error fundamental.
- **De la calidad del output a la calidad del uso**. El valor depende más de quién usa que de qué se usa.

Las organizaciones que no hacen explícito este cambio producen usuarios que usan IA como usan Google — y se frustran cuando los resultados no son consistentes.

### Inventario de sistemas IA — el entregable mínimo viable

El inventario es el artefacto fundacional de cualquier programa de gobernanza. AESIA lo va a pedir. Los clientes corporativos lo van a pedir. Los empleados afectados tienen derecho a saberlo.

Estructura mínima por sistema:

- Nombre y función.
- Proveedor (externo o interno).
- Categoría de riesgo autoclasificada (inaceptable / alto / limitado / mínimo).
- Justificación de la clasificación.
- Datos que procesa (tipos, sensibilidad, base jurídica RGPD).
- Roles usuarios y número aproximado.
- Mitigaciones aplicadas.
- Responsable del sistema.
- Evidencias disponibles (contratos, política de uso, formación, logs).
- Fecha última revisión.

Un Excel bien mantenido vale más que una herramienta GRC mal configurada. Lo importante es que exista, esté actualizado, y el responsable lo conozca.

### Human oversight operativo

El Art. 14 del AI Act obliga a supervisión humana en sistemas de alto riesgo. El Art. 14(4) especifica que las personas a cargo deben tener **"competencia, formación y autoridad"** suficientes.

Supervisión humana **no es** que haya un humano mirando la pantalla. Es:

- **Competencia**: la persona entiende cómo funciona el sistema, qué puede hacer bien y qué mal, y reconoce cuándo el output es problemático.
- **Formación**: directamente conectado con el Art. 4 AI Literacy. Sin literacy no hay oversight real.
- **Autoridad**: la persona puede intervenir, override o parar el sistema sin tener que escalar tres niveles. Si no puede parar el sistema, la supervisión es decorativa.

Matriz operativa: para cada sistema de alto riesgo, definir quién supervisa, qué puede hacer, con qué frecuencia, y cómo se documenta.

### Evidencia de cumplimiento — qué tener en carpeta

Si AESIA, un cliente o un empleado pregunta, tener disponible:

- **Inventario actualizado** (máximo 3 meses de antigüedad).
- **Política de uso de IA** firmada por empleados, con fecha.
- **Registro de formaciones** (asistencia + evaluación + refuerzo).
- **Contratos con proveedores IA**, con cláusulas específicas de cumplimiento AI Act y RGPD.
- **DPIAs y FRIAs** de los sistemas que las requieren.
- **Logs operativos** mínimos (qué sistema se usó, para qué, con qué resultado) donde aplique.
- **Registro de incidentes** y acciones correctivas.
- **Minutas del Comité de IA** con decisiones trazables.

La mayoría de empresas tiene partes de esto dispersas. El trabajo es consolidarlo y hacerlo recuperable.

---

## Cierre — tres acciones para el lunes

Si solo tienes tiempo para tres cosas esta semana, estas:

**1. Inventario Shadow AI en tu organización.** Encuesta rápida a empleados sobre qué herramientas IA están usando, más revisión de suscripciones individuales en finanzas. Vas a encontrar más de lo que esperas. Sin inventario no hay gobierno.

**2. Clasifica los tres sistemas IA más usados en tu organización por categoría de riesgo.** Anexo III es el filtro crítico: ¿alguno toca empleo, crédito, servicios esenciales, educación, infraestructura crítica, justicia, migración o biometría? Si sí, tienes trabajo concentrado antes de agosto 2026.

**3. Confirma que tu formación en IA cumple el Art. 4.** Revisa si lo que estás haciendo (si estás haciendo algo) cubre: conocimientos del sistema específico, riesgos asociados, casos de uso responsable, protocolos de verificación. Si no hay evidencia formal, no hay cumplimiento demostrable.

El AI Act no es el final de la innovación. Es el marco que convierte la adopción en algo defensable ante tres audiencias que van a preguntar: la autoridad, el cliente corporativo y el empleado afectado. Las organizaciones que llegan a 2026 con este marco asumido no van a innovar menos. Van a innovar con la confianza de que lo que construyen se sostiene.

---

## Referencias principales

- **Reglamento (UE) 2024/1689 (AI Act)** — Texto oficial en el DOUE.
- **Guidelines on the definition of AI systems** — Comisión Europea, febrero 2025.
- **Guidelines on prohibited AI practices** — Comisión Europea, febrero 2025.
- **General-Purpose AI Code of Practice** — code-of-practice.ai
- **AI Act Service Desk** — ai-act-service-desk.ec.europa.eu
- **AI Literacy Q&A** — digital-strategy.ec.europa.eu
- **Digital Omnibus on AI** — COM(2025) 836, en trílogo desde marzo 2026.
- **OWASP Top 10 for LLM Applications 2025** — genai.owasp.org
- **Ethics Guidelines for Trustworthy AI** — HLEG, Comisión Europea (2019).
- **AESIA** — aesia.digital.gob.es
