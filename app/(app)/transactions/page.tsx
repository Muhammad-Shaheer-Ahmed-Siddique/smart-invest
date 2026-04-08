import { TransactionTable } from '@/components/transactions/TransactionTable';
import { Card } from '@/components/ui';

export const metadata = { title: 'Transactions — SmartInvest' };

export default function TransactionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transactions</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Your complete trading history</p>
      </div>
      <Card padding="md">
        <TransactionTable />
      </Card>
    </div>
  );
}
