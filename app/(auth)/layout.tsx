import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-1)] relative">
      {/* Back Button — top-left */}
      <Link
        href="/"
        className="fixed top-3 left-3 sm:top-6 sm:left-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[var(--bg-0)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-brand-500 hover:text-brand-500 transition-all shadow-lg text-xs sm:text-sm font-medium"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Home
      </Link>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="font-bold text-2xl text-[var(--text-primary)]">SmartInvest</span>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-0)] rounded-2xl border border-[var(--border-color)] shadow-xl p-8">
          {children}
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          Paper trading only · No real money involved
        </p>
      </div>
    </div>
  );
}
