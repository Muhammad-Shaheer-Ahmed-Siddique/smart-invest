export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-1)]">
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
