import { SignupForm } from '@/components/auth/SignupForm';

export const metadata = { title: 'Create Account — SmartInvest' };

export default function SignupPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Start trading</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Create your free account and get $100,000 to invest</p>
      </div>
      <SignupForm />
    </>
  );
}
