import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign In — SmartInvest' };

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to your account to continue</p>
      </div>
      <LoginForm />

      {/* Admin hint */}
      <div className="mt-5 p-3 rounded-xl border text-xs space-y-0.5"
        style={{ background: 'rgba(0,212,255,0.04)', borderColor: 'rgba(0,212,255,0.15)' }}>
        <div className="font-semibold" style={{ color: '#00d4ff' }}>🛡 Admin Access</div>
        <div className="text-[var(--text-muted)]">Sign up with <strong>admin@smartinvest.com</strong> to unlock the admin panel.</div>
      </div>
    </>
  );
}
