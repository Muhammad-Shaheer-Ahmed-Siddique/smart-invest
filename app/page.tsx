'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingTickerTape } from '@/components/landing/LandingTickerTape';
import { HeroSection } from '@/components/landing/HeroSection';
import { MarketOverviewSection } from '@/components/landing/MarketOverviewSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

function HomeContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);
  const forceHome = searchParams.get('home') === '1';

  useEffect(() => {
    if (!isLoading && isAuthenticated && !forceHome) {
      setRedirecting(true);
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, forceHome]);

  if (isLoading || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-1)]">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)]">
      <LandingNavbar />
      <LandingTickerTape />
      <HeroSection />
      <MarketOverviewSection />
      <FeaturesSection />
      <LandingFooter />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-1)]">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
