'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Youtube, Users, MessageCircle, Instagram, Info } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { ScrollFade } from '@/components/ScrollFade';

const Hero = () => {
  return (
    <section className="pt-32 md:pt-40 pb-20 md:pb-24 px-6 md:px-10 max-w-[1800px] mx-auto min-h-[85vh] flex flex-col justify-center relative" aria-labelledby="hero-heading">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 mt-6 md:mt-0">
        <div className="hidden md:block text-xs font-mono text-gray-400">EST. 2025</div>
        <div className="text-xs font-medium tracking-widest text-gray-400 uppercase">
          EN VIVO DESDE LA HABITACIÓN
        </div>
      </div>

      <Reveal>
        <div className="mb-6 md:mb-10">
          <h1 id="hero-heading" className="text-[15vw] md:text-[11vw] font-medium leading-[0.85] tracking-tighter uppercase -ml-1 md:-ml-2">
            La Habitación
          </h1>
          <div className="flex items-baseline gap-4 -ml-1 md:-ml-2">
            <h1 className="text-[15vw] md:text-[11vw] font-medium leading-[0.85] tracking-tighter uppercase">
              Tortuga
            </h1>
            <span className="text-2xl md:text-4xl font-bold text-gray-400">[LHT]</span>
          </div>
        </div>
      </Reveal>
      
      <Reveal delay={100}>
        <p className="text-2xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight uppercase text-gray-800 mb-12 max-w-5xl">
          Bienvenido al sitio donde probamos<br />
          el futuro con IA,<br />
          <span className="text-gray-400">en voz alta.</span>
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12">
          <div>
            <p className="text-xl md:text-3xl font-bold text-black mb-6 leading-tight">
              Sin guión cerrado. Sin filtros. Sin postureo.
            </p>
            <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed mb-8">
              Grabamos experimentos, pruebas, ideas a medio cocinar y las decisiones que tomamos cuando intentamos entender qué hace la IA en nuestro trabajo—y en nuestra vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="https://www.youtube.com/@LaHabitacionTortuga" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF0000] text-white px-8 py-4 rounded-full uppercase text-sm font-bold tracking-widest hover:bg-[#cc0000] focus:bg-[#cc0000] focus:outline-none focus:ring-4 focus:ring-red-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105"
            aria-label="Ver canal en YouTube"
          >
            <Youtube size={20} aria-hidden="true" /> Ver La Habitación en Directo
          </a>
          <a 
            href="https://instagram.com/lahabitaciontortuga" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-8 py-4 rounded-full uppercase text-sm font-bold tracking-widest hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105"
            aria-label="Seguir en Instagram"
          >
            <Instagram size={20} aria-hidden="true" /> Seguir en Instagram
          </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-black">
              <Image
                src="/image.png"
                alt="La Habitación Tortuga - David, Yona y Alberto"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const About = () => {
  return (
    <ScrollFade>
      <section id="about" className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative" aria-labelledby="about-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">1/ DAVID, YONA Y ALBERTO</div>
            <h2 id="about-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight">
              Tres personas normales<br />probando cosas poco normales
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-7 flex flex-col justify-center">
          <Reveal delay={100}>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-black pl-6 py-2">
              Nos gusta entender cómo funcionan las cosas. Trabajar con IA. Crear proyectos. Y compartir cómo se vive entre dudas, pruebas y esos momentos en los que algo por fin hace clic.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              En La Habitación Tortuga no mostramos solo los resultados. 
              Aquí se ve el proceso: lo que probamos, lo que falla, lo que nos pilla por sorpresa—y también lo que termina siendo útil de verdad.
            </p>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-gray-200 shadow-sm">
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                <strong className="text-black text-lg">¿Qué es La Habitación Tortuga?</strong>
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Un sitio donde cada semana entramos, cerramos la puerta, encendemos la cámara...
                y probamos en voz alta cómo la IA nos cambia las cosas. ¿Qué hacemos con eso? Aquí lo vamos descubriendo.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
    </ScrollFade>
  );
};

const ContentSection = () => {
  const formats = [
    {
      id: '01',
      title: 'La Habitación en Directo',
      subtitle: 'Cada semana, un ejercicio o problema encima de la mesa',
      desc: 'Cada episodio trae algo para poner a prueba: reescribir una escena de Seinfeld con IA, comparar prompts en JSON vs tradicionales, analizar un caso de bias de verdad, probar workflows que usamos en proyectos reales. A veces entra un invitado. Sale como sale—sin guión que disimule.',
      icon: MessageCircle,
    },
    {
      id: '02',
      title: 'En la Habitación entra…',
      subtitle: 'Personas con historias que se cruzan con la IA',
      desc: 'Una vez al mes, alguien nuevo entra a la habitación. Gente que está aprendiendo, montando proyectos, metiéndola hasta el fondo o reinventándose. Hablamos de su camino, sus miedos, cómo la IA se les coló en el trabajo o en la vida—lo bueno, lo incómodo, lo que les reta.',
      icon: Users,
    },
    {
      id: '03',
      title: 'Guardando Ideas en tu Caparazón',
      subtitle: 'Series por profesión para usar la IA sin perder quién eres',
      desc: 'Series prácticas por profesión: cocineros, profesores, diseñadores, comerciales... Te damos ideas concretas que puedes guardar y sacar cuando las necesites. Menús, escandallos, formación de equipo, contenido para redes. Videos cortos, directos, que se aplican ya.',
      icon: MessageCircle,
    },
    {
      id: '04',
      title: 'Notebooks de la Habitación',
      subtitle: 'Cuadernos para estudiar con IA sin engañarte',
      desc: 'Para estudiantes y gente que aprende por su cuenta: cómo preparar exámenes con IA, organizar apuntes, proyectos, entregas. Cómo buscar info fiable y contrastarla. Cómo aprender más rápido sin dejar de pensar por ti. No son trucos. Son cuadernos abiertos de lo que descubrimos.',
      icon: Users,
    },
    {
      id: '05',
      title: 'Conceptos Tortuga (IA al Mando)',
      subtitle: 'Videos y podcasts hechos por IA sobre cosas que hay que pillar',
      desc: 'Conceptos que vale la pena frenar y explicar: sesgos, alucinaciones, evaluación de prompts, límites, riesgos... Escribimos el guion, pero la voz o el video los genera la IA. Píldoras cortas para entender mejor qué está pasando—usando la propia tecnología para contarlo.',
      icon: Info,
    },
  ];

  return (
    <ScrollFade>
      <section id="content" className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto relative" aria-labelledby="content-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      <div className="mb-12 md:mb-16">
        <Reveal>
          <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">2/ LO QUE PASA CADA SEMANA</div>
          <h2 id="content-heading" className="text-3xl md:text-5xl font-medium uppercase mb-10 max-w-3xl">
            Conversaciones, experimentos<br />y series desde la Habitación
          </h2>
          <div className="max-w-3xl space-y-5 text-base md:text-lg text-gray-600 leading-relaxed">
            <p>Lo que nos preocupa. Lo que nos ilusiona. Lo que estamos probando ahora mismo.</p>
            <p>Cómo la IA está cambiando la forma en que trabajamos, estudiamos, decidimos.
              Lo que vemos en empresas, proyectos y en vidas como la tuya.</p>
            <p className="text-sm text-gray-500 italic border-l-4 border-black pl-6 py-3 bg-gray-50 rounded-r-lg">
              Sí, la IA es parte de nuestro día a día—nos obsesiona entenderla, integrarla bien, ver su impacto real.<br/>
              Pero no es lo único de lo que hablamos. La habitación es más grande que eso.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {formats.map((format, index) => {
          const Icon = format.icon;
          return (
            <Reveal key={format.id} delay={index * 100}>
              <article className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl h-full hover:shadow-2xl focus-within:shadow-2xl transition-all duration-300 group border-2 border-gray-200 hover:border-black focus-within:border-black hover:-translate-y-1">
                <div className="flex items-baseline justify-between mb-5">
                  <Icon className="w-10 h-10 text-black group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  <span className="text-xs font-bold text-gray-400" aria-label="Formato número">{format.id}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase mb-3 group-hover:text-gray-800 transition-colors">{format.title}</h3>
                <p className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">{format.subtitle}</p>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{format.desc}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={300}>
        <div className="flex justify-center">
          <a
            href="https://www.youtube.com/@LaHabitacionTortuga"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-gray-600 hover:border-gray-600 focus:text-gray-600 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm transition-colors"
            aria-label="Ver todos los episodios en YouTube"
          >
            <Youtube size={18} aria-hidden="true" /> Ver todos los episodios <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
    </ScrollFade>
  );
};

const BlogSection = () => {
  const blogPosts = [
    { category: "Reflexión", title: "Por qué decidimos crear La Habitación Tortuga", slug: "por-que-creamos-la-habitacion-tortuga" },
    { category: "IA y Trabajo", title: "Cómo la IA está cambiando nuestra forma de trabajar", slug: "ia-cambiando-forma-trabajar" },
    { category: "Proceso", title: "Aprender en público: lo que hemos descubierto", slug: "aprender-en-publico" },
  ];

  return (
    <ScrollFade>
      <section className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative" aria-labelledby="blog-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">3/ EL BLOG DE LA HABITACIÓN</div>
            <h2 id="blog-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight mb-8">
              A veces necesitamos<br />parar y escribir
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Hay cosas que no caben en un episodio. O que necesitan más tiempo para aterrizar.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              En el blog dejamos ideas, reflexiones, aprendizajes y marcos mentales que nos ayudan a entender lo que estamos viviendo con la IA, el trabajo, los cambios que vienen.
            </p>
            <p className="text-base text-gray-500 italic">
              No son guías definitivas ni verdades universales.<br/>
              Son notas honestas de tres personas que intentan avanzar mientras lo prueban todo en directo.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={100}>
            <nav className="space-y-6" aria-label="Artículos destacados del blog">
              {blogPosts.map((post, index) => (
                <Link 
                  key={index}
                  href={`/blog/${post.slug}`}
                  className="block border-t border-gray-100 pt-6 hover:pl-4 focus:pl-4 transition-all focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-4 rounded"
                >
                  <span className="text-xs font-bold uppercase text-gray-600 mb-2 block">{post.category}</span>
                  <h3 className="text-xl md:text-2xl font-bold uppercase">{post.title}</h3>
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 focus:text-gray-600 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm transition-colors"
                aria-label="Ver todos los artículos del blog"
              >
                Leer el Blog <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
    </ScrollFade>
  );
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ContentSection />
      <BlogSection />
    </>
  );
}
