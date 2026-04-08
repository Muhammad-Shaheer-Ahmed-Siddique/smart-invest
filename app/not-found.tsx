import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-1)]">
      <div className="text-center">
        <div className="text-6xl font-bold text-[var(--text-primary)] mb-2">404</div>
        <h1 className="text-xl font-semibold text-[var(--text-secondary)] mb-4">Page not found</h1>
        <p className="text-[var(--text-muted)] mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
