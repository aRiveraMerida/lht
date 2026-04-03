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
      <section className="border-b-2 border-lht-line">
        <div className="lht-container py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="lht-label-row mb-5 text-lht-muted">
            <Link href="/" className="hover:text-lht-ink">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-lht-ink">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-lht-ink">{post.category}</span>
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em]">
            <span>{post.category}</span>
            <span className="text-lht-grey" aria-hidden="true">·</span>
            <span className="text-lht-muted">{post.readingTime}</span>
            <span className="text-lht-grey" aria-hidden="true">·</span>
            <time dateTime={post.date} className="text-lht-muted">
              {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          <h1 className="lht-display max-w-4xl text-[clamp(2rem,5vw,4rem)]">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-[1.9] text-lht-muted">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="lht-container py-8 md:py-12">
          <article className="lht-reading mx-auto">
            <div className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-[-0.04em] prose-headings:leading-[0.96] prose-headings:text-lht-ink
              prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-[17px] prose-p:leading-[1.9] prose-p:text-lht-ink
              prose-a:text-lht-blue prose-a:font-bold prose-a:underline hover:prose-a:text-lht-ink
              prose-strong:text-lht-ink prose-strong:font-bold
              prose-code:text-sm prose-code:bg-lht-paper prose-code:px-2 prose-code:py-1 prose-code:border-2 prose-code:border-lht-line prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-lht-ink prose-pre:text-lht-paper prose-pre:p-6 prose-pre:overflow-x-auto
              prose-ul:list-disc prose-ul:ml-6 prose-ul:my-6
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-6
              prose-li:text-lht-ink prose-li:my-2
              prose-blockquote:my-8 prose-blockquote:border-2 prose-blockquote:border-lht-line prose-blockquote:bg-lht-paper prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:font-bold prose-blockquote:leading-[1.15]
              prose-img:my-8
              prose-hr:border-lht-line prose-hr:my-12
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Newsletter CTA */}
          <div className="mx-auto mt-14 max-w-[42rem] lht-panel">
            <h3 className="lht-title">Si esto te ha hecho pensar, hay más.</h3>
            <p className="mt-2 text-sm text-lht-muted">Una vez a la semana. Sin spam, sin urgencia.</p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-[42rem]">
            <Link href="/blog" className="lht-btn lht-btn-secondary">
              <ArrowLeft size={14} aria-hidden="true" /> Ver todos los artículos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
