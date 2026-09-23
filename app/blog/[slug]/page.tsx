import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Markdown } from '@/components/Markdown';
import { Button } from '@/components/tortuga';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import { PostList } from '@/components/PostList';
import { PageHeader } from '@/components/PageHeader';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artículo no encontrado' };

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
  const related = getRelatedPosts(slug, 3);

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
    <div className="page-width">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="read-col">
        <PageHeader
          crumbs={[{ href: '/', label: 'Inicio' }, { href: '/blog', label: 'Archivo' }, { label: post.title }]}
          title={post.title}
          deck={post.excerpt}
          meta={
            <>
              {authors.length > 0 && (
                <span>
                  Por{' '}
                  {authors.map((a, i) => (
                    <span key={a.slug}>
                      <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                        {a.name}
                      </a>
                      {i < authors.length - 2 ? ' · ' : i === authors.length - 2 ? ' y ' : ''}
                    </span>
                  ))}
                </span>
              )}
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              {post.readingTime && <span>{post.readingTime} de lectura</span>}
            </>
          }
        />

        <article className="py-10">
          <Markdown>{post.content}</Markdown>
        </article>

        <aside className="card card--clay mb-12">
          <span className="eyebrow">¿Te ha resonado?</span>
          <p className="card-desc">
            Escríbenos a{' '}
            <a href="mailto:hola@lahabitaciontortuga.com" className="link">
              hola@lahabitaciontortuga.com
            </a>
            . Leemos todo, sin prisas.
          </p>
          <Button href="/blog">
            <ArrowLeft aria-hidden="true" /> Ver el archivo
          </Button>
        </aside>

        {related.length > 0 && (
          <section className="block" aria-labelledby="sigue-leyendo">
            <div className="block-head">
              <h2 id="sigue-leyendo">Sigue leyendo</h2>
            </div>
            <PostList posts={related} />
          </section>
        )}
      </div>
    </div>
  );
}
