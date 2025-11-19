'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Youtube, Users, MessageCircle, Instagram } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { ScrollFade } from '@/components/ScrollFade';

const Hero = () => {
  return (
    <section className="pt-40 md:pt-48 pb-32 md:pb-40 px-6 md:px-10 max-w-[1800px] mx-auto min-h-[90vh] flex flex-col justify-center relative" aria-labelledby="hero-heading">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 mt-10 md:mt-0">
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
          Bienvenido a la habitación<br />
          donde hablamos de<br />
          <span className="text-gray-400">lo que vivimos.</span>
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="max-w-2xl mb-16">
          <p className="text-xl md:text-3xl font-bold text-black mb-6 leading-tight">
            Sin guión. Sin filtros. Sin postureo.
          </p>
          <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed">
            Solo lo que nos pasa, lo que aprendemos y lo que nos hace pensar.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="https://www.youtube.com/@LaHabitacionTortuga" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF0000] text-white px-10 py-5 rounded-full uppercase text-sm font-bold tracking-widest hover:bg-[#cc0000] focus:bg-[#cc0000] focus:outline-none focus:ring-4 focus:ring-red-400 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            aria-label="Ver canal en YouTube"
          >
            <Youtube size={20} aria-hidden="true" /> Ver en YouTube
          </a>
          <a 
            href="https://instagram.com/lahabitaciontortuga" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-10 py-5 rounded-full uppercase text-sm font-bold tracking-widest hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            aria-label="Seguir en Instagram"
          >
            <Instagram size={20} aria-hidden="true" /> Seguir en Instagram
          </a>
        </div>
      </Reveal>
    </section>
  );
};

const About = () => {
  return (
    <ScrollFade>
      <section id="about" className="py-32 md:py-48 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative" aria-labelledby="about-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">1/ ALBERTO Y DAVID</div>
            <h2 id="about-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight">
              Dos personas normales
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-7 flex flex-col justify-center">
          <Reveal delay={100}>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-2 border-black pl-6">
              A las que les gusta entender las cosas, trabajar con IA, crear proyectos y compartir cómo es vivir entre ideas, dudas, decisiones, pruebas y descubrimientos.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Aquí dentro grabamos lo que forma parte de nuestro día a día.
              Trabajo, vida, tecnología, hábitos, creatividad, problemas reales y conversaciones que nacen sin planear.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                <strong className="text-black text-lg">¿Qué es La Habitación Tortuga?</strong>
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Un sitio donde cada semana entramos, cerramos la puerta, ponemos la cámara… y hablamos de lo que de verdad nos ronda la cabeza.
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
      title: 'Charlas desde la Habitación',
      subtitle: 'Cada semana, cada uno trae un tema',
      desc: 'Algo que nos ha pasado, una decisión difícil, una idea que no entendemos, algo que nos preocupa o una situación que queremos ver cómo la piensa el otro. Siempre viene un invitado para sumar otra mirada. Son conversaciones reales, sin guión perfecto, tal y como salen.',
      icon: MessageCircle,
    },
    {
      id: '02',
      title: 'Invitados en la Habitación',
      subtitle: 'Gente normal con historias que merecen ser escuchadas',
      desc: 'Emprendedores, personas que están aprendiendo, creando, equivocándose o cambiando cosas en su entorno. Hablamos sin máscaras: lo bueno, lo malo, lo que funcionó y lo que no.',
      icon: Users,
    },
  ];

  return (
    <ScrollFade>
      <section id="content" className="py-32 md:py-48 px-6 md:px-10 max-w-[1800px] mx-auto relative" aria-labelledby="content-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      <div className="mb-20">
        <Reveal>
          <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">2/ LO QUE HABLAMOS CADA SEMANA</div>
          <h2 id="content-heading" className="text-3xl md:text-5xl font-medium uppercase mb-10 max-w-3xl">
            Conversaciones sin guión
          </h2>
          <div className="max-w-3xl space-y-5 text-base md:text-lg text-gray-600 leading-relaxed">
            <p>Lo que nos preocupa. Lo que nos ilusiona. Lo que estamos probando. Lo que hemos aprendido (o desaprendido).</p>
            <p>Lo que la IA está cambiando en nuestra vida y en cómo trabajamos. Lo que vemos en empresas, proyectos y personas.</p>
            <p className="text-sm text-gray-500 italic border-l-2 border-black pl-6 py-3">
              La IA es parte de nuestro día a día —nos obsesiona entender su avance, integrarla bien y ver su impacto real—<br/>
              pero no es lo único de lo que hablamos. La habitación es más grande.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {formats.map((format, index) => {
          const Icon = format.icon;
          return (
            <Reveal key={format.id} delay={index * 100}>
              <article className="bg-white p-10 rounded-lg h-full hover:shadow-lg focus-within:shadow-lg transition-all group border border-gray-200 hover:border-black focus-within:border-black">
                <div className="flex items-baseline justify-between mb-6">
                  <Icon className="w-12 h-12 text-black group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-bold text-gray-400" aria-label="Formato número">{format.id}</span>
                </div>
                <h3 className="text-2xl font-bold uppercase mb-3">{format.title}</h3>
                <p className="text-sm font-bold uppercase text-gray-600 mb-5 tracking-widest">{format.subtitle}</p>
                <p className="text-base text-gray-600 leading-relaxed">{format.desc}</p>
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
      <section className="py-32 md:py-48 px-6 md:px-10 max-w-[1800px] mx-auto bg-white relative" aria-labelledby="blog-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6" aria-label="Sección">3/ EL BLOG DE LA HABITACIÓN</div>
            <h2 id="blog-heading" className="text-3xl md:text-5xl font-medium uppercase leading-tight mb-8">
              A veces necesitamos escribir
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Pequeñas ideas, reflexiones, aprendizajes o cosas que queremos dejar por escrito para entenderlas mejor.
            </p>
            <p className="text-base text-gray-500 italic">
              No son guías definitivas.<br/>
              Son perspectivas honestas desde dos personas que intentan avanzar y entender el mundo.
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
