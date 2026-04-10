'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSubTool = pathname !== '/tools';

  return (
    <>
      {isSubTool && (
        <div className="px-5 md:px-8 pt-4">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-0)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-brand-500 hover:text-brand-500 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tools
          </Link>
        </div>
      )}
      {children}
    </>
  );
}
