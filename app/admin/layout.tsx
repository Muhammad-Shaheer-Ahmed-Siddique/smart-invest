import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="admin-theme flex h-screen overflow-hidden admin-grid-bg"
        style={{ background: 'var(--admin-bg)' }}>
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
