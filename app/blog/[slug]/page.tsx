import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { NewsletterForm } from '@/components/NewsletterForm';
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

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url,
      siteName: 'La Habitación Tortuga [LHT]',
      locale: 'es_ES',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `https://lahabitaciontortuga.com/blog/${slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `https://lahabitaciontortuga.com${post.image}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author, url: 'https://www.linkedin.com/in/albertoriveramerida' },
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
      <section className="hairline-b">
        <div className="fg-container py-16 md:py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 fg-mono-label text-ink/55 mb-10">
            <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-ink transition-colors">Archivo</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{post.category}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className="fg-cat-tag"
              style={{ ['--tag-color' as string]: getCategoryAccent(post.category) }}
            >
              {post.category}
            </span>
            <span className="fg-mono-label text-ink/55">{post.readingTime}</span>
            <time dateTime={post.date} className="fg-mono-label text-ink/55">
              {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          <h1 className="fg-display max-w-[20ch]">
            {post.title}
          </h1>
          <p className="fg-body-lg mt-8 max-w-2xl text-ink/65">
            {post.excerpt}
          </p>
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
          <div className="fg-reading mt-20">
            <div className="rounded-lg bg-black/5 p-8">
              <h3 className="fg-feature-title">Si esto te ha hecho pensar, hay más.</h3>
              <p className="fg-body mt-2 text-ink/65">
                Una vez a la semana. Sin spam, sin urgencia.
              </p>
              <div className="mt-6">
                <NewsletterForm compact />
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
    </div>
  );
}
