---
title: "La muerte de internet ya ocurrió. WebMCP solo decide la herencia."
date: "2026-06-01"
description: "El 7 de mayo Google activó por defecto un examen de Lighthouse que mide si tu web sirve para agentes de IA, no para personas. Qué comprueba, por qué casi todas suspenden y qué hacer hoy."
excerpt: "El internet humano lleva dos años vaciándose de humanos. WebMCP no es el último clavo del ataúd: es la pelea por lo que queda."
authors:
  - alberto-rivera
featured: false
image: "/favicon.svg"
---

ClaudeBot se lleva más de veinte mil páginas por cada visita que devuelve a la web que rastrea. (Cloudflare, primer trimestre de 2026.) No es un fallo técnico: es el modelo de negocio. El crawler de Anthropic entrena a Claude con lo que lee y no tiene un producto que te mande tráfico de vuelta. Rasca y no firma.

Esa cifra es la radiografía de algo que lleva dos años pasando sin que le pongamos nombre: el internet que montamos para que lo leyeran personas se está quedando sin personas. No se muere internet. Se muere el internet *humano* —el que daba por hecho que al otro lado de la página había alguien leyendo.

El 7 de mayo, Google hizo oficial el relevo. Metió en Lighthouse —su herramienta de auditoría, la que está detrás de PageSpeed Insights— una categoría nueva, activada por defecto: *Agentic Browsing*. No mide si tu web le sirve a una persona. Mide si le sirve a un agente.

Le pasé ese examen a varias webs reales esta semana. No voy a enseñar las notas: son de clientes. Pero lo importante no son sus notas, es que el examen está diseñado para que hoy suspenda casi todo el mundo. Y eso sí lo puedo demostrar con datos públicos.

## Qué mide el examen, y por qué casi todos suspenden sin saberlo

Antes, las cuatro categorías de Lighthouse que mirabas eran Rendimiento, Accesibilidad, Buenas Prácticas y SEO. Ahora hay una quinta, y no te da una nota sobre 100: te da un ratio de checks aprobados y suspensos. Es la primera categoría de Lighthouse donde no puedes optimizar hasta el "87/100" y olvidarte. O pasas el check, o no.

Comprueba cuatro cosas. Una es WebMCP, el protocolo del que todo el mundo habla. Las otras tres son las que de verdad te suspenden, y son tan poco glamurosas que nadie escribe sobre ellas: la salud del *accessibility tree*, la estabilidad del layout mientras carga (el CLS) y la presencia de un `llms.txt` en la raíz.

Aquí está el truco que casi ningún artículo cuenta: **WebMCP es el techo, no el suelo.** Su adopción es prácticamente cero, incluso entre los sitios más técnicos de internet —y de hecho todavía vive tras un flag en Chrome, ningún agente en producción llama a esas tools hoy. Así que no, no suspendes por no tener WebMCP. Suspendes por lo de siempre.

Y "lo de siempre" tiene números. El 95,9% de las webs más visitadas del mundo tiene errores de accesibilidad detectables (WebAIM Million, 2026). Texto con mal contraste en el 79% de ellas. Imágenes sin texto alternativo. Botones que un lector de pantalla no sabe nombrar. El mismo árbol de accesibilidad que esas webs llevan años ignorando para las personas con discapacidad es, exactamente, lo que ahora lee el agente. La factura llega por partida doble: primero la moral, ahora la de la máquina.

El agente no ve tu página bonita. Lee el árbol de accesibilidad —una versión simplificada de la estructura— porque es muchísimo más barato que procesar el HTML entero o una captura. Si ese árbol está roto para una persona ciega, está roto para el agente. Y si tu layout baila mientras carga, el agente identifica un botón en el segundo uno y lo pulsa en el segundo dos, cuando ya se ha movido. Pulsa el equivocado.

## La parte donde la historia se da la vuelta

Si la muerte del internet humano ya ocurrió —y los datos dicen que sí—, WebMCP no es el último clavo del ataúd. Es la pelea por la herencia.

Hasta ahora, los estándares de la web para la IA eran de **permiso**. `robots.txt`, `ai.txt`: le decían al agente "esto puedes mirarlo, esto no". WebMCP es el primero de otra categoría: **capacidad**. No dice qué puede mirar el agente. Dice qué puede *hacer*, y en tus términos.

Esa diferencia parte el futuro en dos. O la web se vuelve un saqueo —el agente rapiña tu HTML, lo resume y no devuelve a nadie, que es lo que pasa hoy— o se vuelve un contrato: tú declaras las acciones que un agente puede ejecutar sobre tu sitio, mantienes el control de qué toca y qué no, y a cambio dejas de ser raspado a ciegas.

Llamar a eso "la muerte de internet" es quedarse en el titular. WebMCP es, de los diecisiete estándares que se disputan ahora mismo este terreno, el que más control te devuelve. La muerte ya pasó. Esto es lo que viene después, y por una vez no lo decide solo Google.

## Cómo lo arreglaría —y voy a arreglar— en La Habitación Tortuga

Por orden de coste y retorno. No empieza por WebMCP. Empieza por lo aburrido, que es lo que da puntos hoy y no depende de ningún estándar que aún puede cambiar:

- **Arreglar el accessibility tree.** Nombres programáticos en los elementos interactivos, estructura de roles válida, nada importante oculto del árbol siendo clicable. Esto ya deberías hacerlo por accesibilidad humana; ahora tiene una segunda factura.
- **Estabilizar el layout (CLS bajo).** Que nada salte de sitio mientras carga. Deja de ser solo experiencia de usuario: es fiabilidad para una máquina que apunta y dispara con un segundo de diferencia.
- **Poner un `llms.txt` en la raíz.** Un resumen para máquinas de qué es el sitio y dónde está lo importante, para que el agente no gaste su presupuesto de contexto rastreándolo a ciegas. Lo tiene en torno a una de cada diez webs.

Con una pega honesta sobre el último: Google ha confirmado que su buscador no usa hoy el `llms.txt`, y ni Anthropic ni OpenAI han dicho que lo consuman. Lighthouse lo puntúa; los que mandan, todavía no lo leen. Lo pongo igualmente porque cuesta diez minutos, no porque tenga pruebas de que sirva. Si en LHT lo metemos, va a ser con esa etiqueta puesta.

Solo después de eso miraría WebMCP, y en su versión más sobria: tools de solo lectura —buscar artículos, devolver contexto estructurado del sitio— sin escritura, sin autenticación, sin abrir superficie de seguridad para una spec que aún se mueve. Si cambia, son cien líneas y un redeploy. Hay tres caminos para hacerlo: anotar los formularios HTML que ya tienes (cero JavaScript), registrar tools por código con `navigator.modelContext`, o publicar un manifest en `.well-known/webmcp` si tienes una API de verdad. El paso a paso entero, con código, es otra pieza —un laboratorio, no este artículo.

## Lo que se llevan

Arreglar el árbol de accesibilidad no suena a salvar internet. Pero es lo único de toda esta historia que puedes hacer hoy, con datos en la mano, sin esperar a que ningún estándar se estabilice ni a que ningún agente aparezca. Y es lo que decide si, cuando el agente llegue, entra por la puerta que le dejaste abierta o por la ventana que olvidaste cerrar.
