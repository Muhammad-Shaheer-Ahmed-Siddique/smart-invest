'use client';

import { useState } from 'react';
import { ARTICLES } from '@/data/learn-articles';
import { ArticleCard } from '@/components/learn/ArticleCard';
import type { ArticleCategory } from '@/types';

const CATEGORIES: ArticleCategory[] = [
  'Fundamentals', 'Technical Analysis', 'Risk Management', 'Strategy', 'Glossary',
];

export default function LearnPage() {
  const [category, setCategory] = useState<ArticleCategory | 'All'>('All');

  const filtered = category === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === category);

  const countFor = (cat: ArticleCategory) => ARTICLES.filter((a) => a.category === cat).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Learning Hub</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Master the fundamentals of stock market investing
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategory('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === 'All'
              ? 'bg-brand-500 text-white'
              : 'bg-[var(--bg-0)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
          }`}
        >
          All <span className="ml-1 text-xs opacity-70">({ARTICLES.length})</span>
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--bg-0)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
            }`}
          >
            {cat} <span className="ml-1 text-xs opacity-70">({countFor(cat)})</span>
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
