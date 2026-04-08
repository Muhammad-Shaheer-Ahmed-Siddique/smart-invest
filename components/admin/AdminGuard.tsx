'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace('/login');
      else if (!user.isAdmin) router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center" style={{ background: 'var(--admin-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-2 border-transparent"
            style={{ borderTopColor: 'var(--admin-cyan)', borderRightColor: 'var(--admin-purple)' }}
          />
          <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>Verifying admin access…</p>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return <>{children}</>;
}
