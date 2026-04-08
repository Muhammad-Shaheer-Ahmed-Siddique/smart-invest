'use client';

import { AuthProvider } from './AuthContext';
import { StockProvider } from './StockContext';
import { PortfolioProvider } from './PortfolioContext';
import { seedAdminAccount } from '@/lib/seedAdmin';

// Run synchronously so localStorage is updated before AuthContext reads it
seedAdminAccount();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StockProvider>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </StockProvider>
    </AuthProvider>
  );
}
