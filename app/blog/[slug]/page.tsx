import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
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
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post no encontrado' };
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.date,
    url: `https://lahabitaciontortuga.com/blog/${slug}`,
  };

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: `https://lahabitaciontortuga.com/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.date,
    url: `https://lahabitaciontortuga.com/blog/${slug}`,
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-bark/60 mb-8">
          <Link href="/" className="hover:text-bark transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-bark transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-bark">{post.category}</span>
        </nav>

        <article>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-ink/50 mb-6">
            <span className="rounded-full border border-bark bg-cream px-3 py-1 font-semibold text-bark">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-ink mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-ink/60 leading-relaxed mb-12">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:leading-[1.8] prose-p:text-ink/90 prose-p:text-[15px] md:prose-p:text-[17px]
            prose-a:text-bark prose-a:font-semibold prose-a:underline hover:prose-a:text-moss
            prose-strong:text-ink prose-strong:font-bold
            prose-code:text-sm prose-code:bg-cream prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-bark/20 prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-ink prose-pre:text-cream prose-pre:p-6 prose-pre:rounded-2xl prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:ml-6 prose-ul:my-6
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-6
            prose-li:text-ink/90 prose-li:my-2
            prose-blockquote:border-l-4 prose-blockquote:border-bark prose-blockquote:bg-paper prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:font-serif prose-blockquote:font-bold prose-blockquote:italic prose-blockquote:my-8
            prose-img:rounded-2xl prose-img:my-8
            prose-hr:border-bark/20 prose-hr:my-12
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Newsletter CTA */}
        <div className="mt-16 rounded-3xl border border-bark bg-bark p-8">
          <h3 className="font-serif text-xl font-bold text-cream mb-2">
            ¿Te ha gustado? Entra en la sala.
          </h3>
          <p className="text-cream/60 text-sm mb-6">
            Cada semana, un experimento o aprendizaje directo al email.
          </p>
          <NewsletterForm compact />
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-bark hover:text-moss transition-colors"
          >
            <ArrowLeft size={14} /> Ver todos los artículos
          </Link>
        </div>
      </div>
    </div>
  );
}
