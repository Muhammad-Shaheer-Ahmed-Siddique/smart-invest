'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setIsLoading(true);
    const err = await signup(username, email, password);
    setIsLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        placeholder="johndoe"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      {error && (
        <div className="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-sm text-danger-500">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create account
      </Button>

      <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-[var(--text-secondary)]">
        You start with <strong>$100,000</strong> in virtual cash to simulate real trading.
      </div>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
