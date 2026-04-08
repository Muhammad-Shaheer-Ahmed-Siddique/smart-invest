import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export const metadata = { title: 'Leaderboard — SmartInvest' };

export default function LeaderboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leaderboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Top traders ranked by net worth</p>
      </div>
      <LeaderboardTable />
    </div>
  );
}
