'use client';

import ReactMarkdown from 'react-markdown';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-[var(--text-primary)] mt-6 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-[var(--text-primary)] mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[var(--text-secondary)] leading-relaxed mb-3">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-[var(--text-secondary)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-[var(--text-secondary)]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-500 pl-4 italic text-[var(--text-secondary)] my-3">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <pre className="bg-[var(--bg-2)] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[var(--text-primary)] my-3">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-[var(--bg-2)] rounded px-1.5 py-0.5 text-sm font-mono text-brand-600 dark:text-brand-400">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-[var(--bg-2)] px-3 py-2 text-left font-semibold text-[var(--text-primary)] border border-[var(--border-color)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[var(--text-secondary)] border border-[var(--border-color)]">
              {children}
            </td>
          ),
          hr: () => <hr className="border-[var(--border-color)] my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
