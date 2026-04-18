import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getCategoryAccent } from '@/lib/palette';
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
  if (!post) return { title: 'Post no encontrado' };

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

const joinNames = (parts: string[]): string => {
  if (parts.length <= 1) return parts.join('');
  if (parts.length === 2) return parts.join(' y ');
  return parts.slice(0, -1).join(' · ') + ' y ' + parts[parts.length - 1];
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const authors = getAuthors(post.authors);
  const related = getRelatedPosts(slug, post.category, 3);

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

  const byline = joinNames(authors.map((a) => a.name));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <section className="hairline-b">
        <div className="fg-container py-16 md:py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 fg-mono-label text-ink/55 mb-10">
            <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-ink transition-colors">Archivo</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="fg-cat-tag hover:opacity-80 transition-opacity"
              style={{ ['--tag-color' as string]: getCategoryAccent(post.category) }}
            >
              {post.category}
            </Link>
            <span className="fg-mono-label text-ink/55">{post.readingTime}</span>
            <time dateTime={post.date} className="fg-mono-label text-ink/55">
              {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          <h1 className="fg-display max-w-[20ch]">{post.title}</h1>
          <p className="fg-body-lg mt-8 max-w-2xl text-ink/65">{post.excerpt}</p>

          {byline && (
            <p className="fg-mono-label mt-10 text-ink/70">
              Por{' '}
              {authors.map((a, i) => (
                <span key={a.slug}>
                  <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {a.name}
                  </a>
                  {i < authors.length - 2 ? ' · ' : i === authors.length - 2 ? ' y ' : ''}
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="fg-container py-16 md:py-24">
          <article className="fg-reading">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Newsletter CTA */}
          <div className="fg-reading mt-16">
            <div className="rounded-lg bg-black/5 p-8">
              <h3 className="fg-feature-title">¿Te ha resonado?</h3>
              <p className="fg-body mt-2 text-ink/65">
                Entra en la newsletter. Publicamos así, cada semana como mucho.
              </p>
              <div className="mt-6">
                <Link href="/#suscribete" className="fg-btn fg-btn-primary">
                  Apuntarme
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/blog" className="fg-btn fg-btn-glass-dark">
                <ArrowLeft size={14} aria-hidden="true" /> Ver todos los artículos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sigue leyendo */}
      {related.length > 0 && (
        <section className="hairline-t bg-black/[0.02]">
          <div className="fg-container py-16 md:py-20">
            <div className="fg-mono-label-lg mb-10">Sigue leyendo</div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      )}
    </div>
  );
}
