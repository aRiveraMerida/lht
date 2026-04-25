import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug, getPostSlugs, getRelatedPosts, getSeriesContext } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeader } from '@/components/SectionLabel';
import { getPreviewVariant } from '@/lib/assets';
import 'highlight.js/styles/github-dark.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Laboratorio no encontrado' };

  const url = `https://lahabitaciontortuga.com/blog/${slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `https://lahabitaciontortuga.com${post.image}`;
  const authors = getAuthors(post.authors);
  const truncate = (s: string, n = 155) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

  return {
    title: post.title,
    description: truncate(post.excerpt),
    authors: authors.map((a) => ({ name: a.name, url: a.linkedin })),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: truncate(post.excerpt),
      type: 'article',
      publishedTime: post.date,
      authors: authors.map((a) => a.name),
      url,
      siteName: 'La Habitación Tortuga [LHT]',
      locale: 'es_ES',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: truncate(post.excerpt),
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const authors = getAuthors(post.authors);
  const series = getSeriesContext(post);
  const related = series ? [] : getRelatedPosts(slug, post.category, 3);

  const url = `https://lahabitaciontortuga.com/blog/${slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `https://lahabitaciontortuga.com${post.image}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: authors.length > 0
      ? authors.map((a) => ({ '@type': 'Person', name: a.name, url: a.linkedin }))
      : undefined,
    publisher: { '@type': 'Organization', name: 'La Habitación Tortuga', logo: { '@type': 'ImageObject', url: 'https://lahabitaciontortuga.com/favicon.svg' } },
    datePublished: post.date,
    url,
    image: imageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'es-ES',
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <section className="ed-container" style={{ paddingTop: 130, paddingBottom: 60 }}>
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 ed-meta opacity-60 mb-12"
        >
          <Link href="/" className="hover:text-[color:var(--color-don-red)] transition-colors">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-[color:var(--color-don-red)] transition-colors">Archivo</Link>
          <span aria-hidden="true">/</span>
          <span style={{ opacity: 0.85 }}>{post.title}</span>
        </nav>

        <SectionHeader idx="Laboratorio" tag={post.category} />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-10">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="ed-kicker-bold hover:text-[color:var(--color-don-red)] transition-colors"
          >
            <span style={{ color: 'var(--color-don-red)' }}>●</span> {post.category}
          </Link>
          {series && (
            <>
              <span aria-hidden="true" className="ed-kicker opacity-30">·</span>
              <span className="ed-kicker">
                {series.title} · Parte {String(series.order + 1).padStart(2, '0')} de {String(series.total).padStart(2, '0')}
              </span>
            </>
          )}
        </div>

        <h1 className="ed-display mt-5 max-w-[22ch]">{post.title}</h1>

        <p className="ed-deck mt-8 max-w-2xl opacity-80">{post.excerpt}</p>

        <div
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 pt-6"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          {authors.length > 0 && (
            <p className="ed-meta">
              Por{' '}
              {authors.map((a, i) => (
                <span key={a.slug}>
                  <a
                    href={a.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-link"
                  >
                    {a.name}
                  </a>
                  {i < authors.length - 2 ? ' · ' : i === authors.length - 2 ? ' y ' : ''}
                </span>
              ))}
            </p>
          )}
          <time dateTime={post.date} className="ed-meta opacity-60">
            {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span className="ed-meta opacity-60">{post.readingTime}</span>
        </div>
      </section>

      {/* Within-series quick nav */}
      {series && series.posts.length > 1 && (
        <nav
          aria-label={`Guías de la serie ${series.title}`}
          className="sticky top-[80px] z-30 backdrop-blur"
          style={{
            background: 'rgba(0,0,0,0.85)',
            borderTop: '1px solid rgba(246,246,246,0.14)',
            borderBottom: '1px solid rgba(246,246,246,0.14)',
          }}
        >
          <div className="ed-container">
            <div className="flex items-center gap-x-6 overflow-x-auto py-3">
              <span className="shrink-0 ed-ribbon-label opacity-60 hidden md:inline">
                {series.title}
              </span>
              {series.posts.map((p, i) => {
                const active = p.slug === slug
                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`shrink-0 ed-meta py-2 px-1 border-b-2 transition-colors ${
                      active
                        ? 'text-ink border-[color:var(--color-don-red)]'
                        : 'opacity-60 border-transparent hover:opacity-100'
                    }`}
                  >
                    <span className="tabular-nums mr-2">
                      {String(i).padStart(2, '0')}
                    </span>
                    {p.title.replace(/^Campaign Hub\s*·\s*/, '')}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Body */}
      <section className="ed-container py-14 md:py-20">
        <article className="ed-reading">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Newsletter CTA */}
        <div
          className="ed-reading mt-16 pt-10"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <div className="ed-kicker-bold">¿Te ha resonado?</div>
          <p className="ed-deck mt-4 opacity-80">
            Apúntate al newsletter. Avisamos cuando hay otro laboratorio. Sin prisas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#newsletter" className="ed-btn ed-btn-invert">
              Apuntarme
            </Link>
            <Link href="/blog" className="ed-btn">
              <ArrowLeft size={14} aria-hidden="true" /> Ver el archivo
            </Link>
          </div>
        </div>
      </section>

      {/* Series prev/next */}
      {series && (series.prev || series.next) && (
        <section
          className="ed-container py-12 md:py-16"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <div className="ed-ribbon-label opacity-60 mb-8">
            {series.title}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {series.prev ? (
              <Link href={`/blog/${series.prev.slug}`} className="group block">
                <div className="ed-meta opacity-60 mb-3 flex items-center gap-2">
                  <ArrowLeft size={14} aria-hidden="true" /> Parte anterior
                </div>
                <div className="ed-ui-heading group-hover:text-[color:var(--color-don-red)] transition-colors">
                  {series.prev.title}
                </div>
              </Link>
            ) : <div />}

            {series.next ? (
              <Link
                href={`/blog/${series.next.slug}`}
                className="group block md:text-right md:border-l md:border-[color:var(--color-hairline)] md:pl-10"
              >
                <div className="ed-meta opacity-60 mb-3 flex items-center gap-2 md:justify-end">
                  Parte siguiente <ArrowRight size={14} aria-hidden="true" />
                </div>
                <div className="ed-ui-heading group-hover:text-[color:var(--color-don-red)] transition-colors">
                  {series.next.title}
                </div>
              </Link>
            ) : <div />}
          </div>
        </section>
      )}

      {/* Sigue leyendo */}
      {!series && related.length > 0 && (
        <section
          className="ed-container py-14 md:py-20"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <SectionHeader idx="Sigue leyendo" tag="Más laboratorios de esta categoría" />
          <div className="lab-list mt-12">
            {related.map((rp, i) => (
              <ProductCard
                key={rp.slug}
                slug={rp.slug}
                category={rp.category}
                title={rp.title}
                date={rp.date}
                authorSlugs={rp.authors}
                excerpt={rp.excerpt}
                variant={getPreviewVariant(i)}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
