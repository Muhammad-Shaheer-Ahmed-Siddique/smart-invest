import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ToastNotifications } from '@/components/layout/ToastNotifications';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[var(--bg-1)]">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden bg-[var(--bg-1)]">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      <ToastNotifications />
    </AuthGuard>
  );
}
