'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Brain, Route, Users, ShieldQuestion } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { ScrollFade } from '@/components/ScrollFade';

const Hero = () => {
  return (
    <section className="pt-32 md:pt-40 pb-20 md:pb-24 px-6 md:px-10 max-w-[1800px] mx-auto min-h-[85vh] flex flex-col justify-center relative" aria-labelledby="hero-heading">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 mt-6 md:mt-0">
        <div className="hidden md:block text-xs font-mono text-gray-400">EST. 2025</div>
        <div className="text-xs font-medium tracking-widest text-gray-400 uppercase">
          ALBERTO RIVERA
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
          Esto no es un blog<br />
          sobre inteligencia artificial.<br />
          <span className="text-gray-400">Es donde paro a pensar.</span>
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="max-w-3xl mb-12">
          <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed mb-4">
            Cuando todo va demasiado rápido.<br />
            Cuando no tengo claro si estoy tomando las decisiones correctas.
          </p>
          <p className="text-xl md:text-2xl font-bold text-black mb-8 leading-tight">
            Aquí escribo para pensar. Para ordenar ideas.<br />
            Para entender qué está pasando... y qué hago yo con todo esto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/blog"
              className="bg-black text-white px-8 py-4 rounded-full uppercase text-sm font-bold tracking-widest hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              <Compass size={20} aria-hidden="true" /> Explorar el Blog
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const SubHero = () => {
  return (
    <ScrollFade>
      <section className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
              Trabajo investigando, desarrollando y ayudando a empresas a adoptar inteligencia artificial.
            </p>
            <p className="text-xl md:text-3xl font-bold text-black mb-6 leading-tight">
              Pero esto no va de vender IA.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
              Va de entenderla de verdad.<br />
              De lo que cambia en el trabajo, en las decisiones...<br />
              y en nosotros.
            </p>
            <a
              href="https://www.linkedin.com/in/albertoriveramerida"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-gray-600 hover:border-gray-600 focus:text-gray-600 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm transition-colors"
            >
              Ver mi perfil profesional <ArrowRight size={16} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </ScrollFade>
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
              <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">1/ QUÉ ES ESTO</div>
              <h2 id="about-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight">
                La Habitación<br />Tortuga es un<br />espacio mental
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal delay={100}>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-black pl-6 py-2">
                Un sitio donde todo va más lento. Donde no hace falta tener una opinión perfecta. Donde puedes dudar sin quedar mal.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Aquí intento poner en palabras cosas que muchos estamos viviendo... pero que casi nadie está explicando bien.
              </p>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-gray-200 shadow-sm">
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  <strong className="text-black text-lg">Desde la trinchera</strong>
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  No escribo desde la teoría. Escribo desde decisiones reales: proyectos, clientes, equipos, presión por avanzar... y muchas veces, información incompleta. A veces acierto. A veces no. Pero siempre intento entender por qué.
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
  const topics = [
    {
      id: '01',
      title: 'Estrategia',
      subtitle: 'Decisiones que importan',
      desc: 'Decisiones que parecen importantes... y no sabes si lo son. Cómo evaluar, cuándo actuar y cuándo esperar.',
      icon: Route,
    },
    {
      id: '02',
      title: 'Adopción de IA',
      subtitle: 'Lo que pasa de verdad',
      desc: 'Lo que realmente pasa cuando intentas meter IA en una empresa. No lo que dicen los slides.',
      icon: Brain,
    },
    {
      id: '03',
      title: 'Personas',
      subtitle: 'El factor humano',
      desc: 'Cómo cambia la forma de trabajar. Cómo reaccionamos. Qué nos cuesta aceptar.',
      icon: Users,
    },
    {
      id: '04',
      title: 'Miedos',
      subtitle: 'Lo que no se dice',
      desc: 'El miedo a quedarte atrás. O peor: el miedo a ir demasiado rápido y equivocarte.',
      icon: ShieldQuestion,
    },
    {
      id: '05',
      title: 'Experiencia real',
      subtitle: 'Sin filtro',
      desc: 'Lo que ha funcionado. Lo que no. Y lo que aún no entiendo.',
      icon: Compass,
    },
  ];

  return (
    <ScrollFade>
      <section id="content" className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto relative" aria-labelledby="content-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        <div className="mb-12 md:mb-16">
          <Reveal>
            <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">2/ LO QUE ENCONTRARÁS AQUÍ</div>
            <h2 id="content-heading" className="text-3xl md:text-5xl font-medium uppercase mb-10 max-w-3xl">
              No escribo sobre<br />la última herramienta.<br />Escribo sobre lo que importa.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <Reveal key={topic.id} delay={index * 100}>
                <article className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl h-full hover:shadow-2xl focus-within:shadow-2xl transition-all duration-300 group border-2 border-gray-200 hover:border-black focus-within:border-black hover:-translate-y-1">
                  <div className="flex items-baseline justify-between mb-5">
                    <Icon className="w-10 h-10 text-black group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                    <span className="text-xs font-bold text-gray-400" aria-label="Tema número">{topic.id}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold uppercase mb-3 group-hover:text-gray-800 transition-colors">{topic.title}</h3>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">{topic.subtitle}</p>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{topic.desc}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-gray-600 hover:border-gray-600 focus:text-gray-600 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm transition-colors"
            >
              Ver todos los artículos <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </ScrollFade>
  );
};

const AboutMe = () => {
  return (
    <ScrollFade>
      <section className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative" aria-labelledby="aboutme-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">3/ SOBRE MÍ</div>
              <h2 id="aboutme-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight">
                Soy Alberto.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal delay={100}>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Trabajo en inteligencia artificial, estrategia y desarrollo de soluciones.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Ayudo a empresas a entender cómo aplicar la IA de verdad... más allá del ruido.
              </p>
              <p className="text-xl font-bold text-black mb-6 leading-tight">
                Pero este espacio no es corporativo.<br />Es personal.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Es donde intento pensar con calma en medio de todo esto.
              </p>
              <a
                href="https://www.linkedin.com/in/albertoriveramerida"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-gray-600 hover:border-gray-600 focus:text-gray-600 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-sm transition-colors"
              >
                Conectar conmigo en LinkedIn <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </ScrollFade>
  );
};

const BlogSection = () => {
  const blogPosts = [
    { category: "Reflexión", title: "Por qué necesitaba un sitio donde pensar despacio", slug: "por-que-creamos-la-habitacion-tortuga" },
    { category: "Estrategia", title: "Las decisiones sobre IA que nadie te prepara para tomar", slug: "ia-cambiando-forma-trabajar" },
    { category: "Experiencia", title: "Lo que he aprendido adoptando IA sin mapa", slug: "aprender-en-publico" },
  ];

  return (
    <ScrollFade>
      <section className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto relative" aria-labelledby="blog-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">4/ ÚLTIMOS ARTÍCULOS</div>
              <h2 id="blog-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight mb-8">
                Lo más reciente<br />del blog
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Alguien pensando en voz alta. No alguien enseñando.
              </p>
              <p className="text-base text-gray-500 italic">
                Si algo de esto te resuena, probablemente ya estamos conectados.
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

const Closing = () => {
  return (
    <ScrollFade>
      <section className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-2xl md:text-4xl lg:text-5xl font-medium uppercase leading-tight mb-8">
              No tengo todas<br />las respuestas.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Pero creo que necesitamos más sitios donde hacernos mejores preguntas.
            </p>
            <p className="text-lg md:text-xl font-bold text-black mt-4">
              Esto es uno de ellos.
            </p>
          </div>
        </Reveal>
      </section>
    </ScrollFade>
  );
};

export default function Home() {
  return (
    <>
      <Hero />
      <SubHero />
      <About />
      <ContentSection />
      <AboutMe />
      <BlogSection />
      <Closing />
    </>
  );
}
