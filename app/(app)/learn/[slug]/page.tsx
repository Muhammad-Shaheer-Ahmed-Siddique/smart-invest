import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES } from '@/data/learn-articles';
import { ArticleContent } from '@/components/learn/ArticleContent';
import { ArticleCard } from '@/components/learn/ArticleCard';
import { Badge } from '@/components/ui';

const categoryColors: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  'Fundamentals': 'info',
  'Technical Analysis': 'warning',
  'Risk Management': 'danger',
  'Strategy': 'success',
  'Glossary': 'default',
};

const difficultyColors = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
} as const;

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = ARTICLES
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 2);

  return (
    <div className="max-w-3xl">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Learn
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={categoryColors[article.category] ?? 'default'}>{article.category}</Badge>
          <Badge variant={difficultyColors[article.difficulty]}>{article.difficulty}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <span>{article.readingTimeMinutes} min read</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        <p className="mt-3 text-[var(--text-secondary)]">{article.summary}</p>
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-6 md:p-8 mb-8">
        <ArticleContent content={article.content} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
