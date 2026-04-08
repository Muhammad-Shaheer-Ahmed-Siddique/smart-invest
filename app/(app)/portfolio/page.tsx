import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummaryCard';
import { AllocationPieChart } from '@/components/portfolio/AllocationPieChart';
import { HoldingsList } from '@/components/portfolio/HoldingsList';
import { Card, CardHeader, CardTitle } from '@/components/ui';

export const metadata = { title: 'Portfolio — SmartInvest' };

export default function PortfolioPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Portfolio</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Your holdings and performance</p>
      </div>

      <PortfolioSummaryCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-5 pt-5 pb-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Holdings</h3>
            </div>
            <HoldingsList />
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <AllocationPieChart />
          </Card>
        </div>
      </div>
    </div>
  );
}
