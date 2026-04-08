'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-1)]">
      <div className="text-center max-w-md px-4">
        <div className="w-12 h-12 rounded-xl bg-danger-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Something went wrong</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
