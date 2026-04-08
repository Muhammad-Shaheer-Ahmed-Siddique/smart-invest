import Link from 'next/link';
import type { Article } from '@/types';
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

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="block bg-[var(--bg-0)] rounded-xl border border-[var(--border-color)] p-5 hover:border-brand-500/50 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge variant={categoryColors[article.category] ?? 'default'}>
          {article.category}
        </Badge>
        <Badge variant={difficultyColors[article.difficulty]}>
          {article.difficulty}
        </Badge>
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 group-hover:text-brand-500 transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">{article.summary}</p>
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {article.readingTimeMinutes} min read
        </span>
        <span className="flex gap-1 flex-wrap">
          {article.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-[var(--bg-2)] text-[var(--text-muted)]">
              #{tag}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
}
