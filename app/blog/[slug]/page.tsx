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
  if (!post) return { title: 'Post no encontrado' };

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
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
          <nav className="mb-5 flex items-center gap-2 text-[11px] font-medium text-text-muted">
            <Link href="/" className="transition-colors hover:text-text">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="transition-colors hover:text-text">Blog</Link>
            <span>/</span>
            <span className="text-text">{post.category}</span>
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-brown">
            <span>{post.category}</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-text-muted">
              <Clock size={12} /> {post.readingTime}
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-text-muted">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-text">
            {post.title}
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-text-muted md:text-[18px] md:leading-8">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
          <article className="mx-auto max-w-[42rem]">
            <div className="prose prose-lg max-w-none
              prose-headings:font-semibold prose-headings:tracking-[-0.04em] prose-headings:text-text
              prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-[15px] prose-p:leading-8 prose-p:text-text md:prose-p:text-[17px]
              prose-a:text-brown prose-a:font-medium prose-a:underline hover:prose-a:text-text
              prose-strong:text-text prose-strong:font-semibold
              prose-code:text-sm prose-code:bg-surface prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-border prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-text prose-pre:text-bg prose-pre:p-6 prose-pre:rounded-2xl prose-pre:overflow-x-auto
              prose-ul:list-disc prose-ul:ml-6 prose-ul:my-6
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-6
              prose-li:text-text prose-li:my-2
              prose-blockquote:rounded-[16px] prose-blockquote:border prose-blockquote:border-border prose-blockquote:bg-surface prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:font-semibold prose-blockquote:text-lg prose-blockquote:leading-[1.3] prose-blockquote:my-8
              prose-img:rounded-2xl prose-img:my-8
              prose-hr:border-border prose-hr:my-12
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Newsletter CTA */}
          <div className="mx-auto mt-14 max-w-[42rem] rounded-[20px] border border-border bg-surface2 p-5 md:p-6">
            <h3 className="text-xl font-semibold text-text">Si esto te ha hecho pensar, hay más.</h3>
            <p className="mt-1 text-sm text-text-muted">Una vez a la semana. Sin spam, sin urgencia.</p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-[42rem]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2.5 text-[12px] font-medium text-text transition-transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={14} /> Ver todos los artículos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
