import type { User, AuthSession, Portfolio, Transaction } from '@/types';

export const STORAGE_KEYS = {
  USERS: 'si_users',
  SESSION: 'si_session',
  PORTFOLIO: (userId: string) => `si_portfolio_${userId}`,
  TRANSACTIONS: (userId: string) => `si_transactions_${userId}`,
} as const;

export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// ===========================
// USERS
// ===========================

export function getAllUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS) ?? [];
}

export function saveUser(user: User): void {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
}

export function getUserByEmail(email: string): User | null {
  return getAllUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserById(id: string): User | null {
  return getAllUsers().find((u) => u.id === id) ?? null;
}

// ===========================
// SESSION
// ===========================

export function getSession(): AuthSession | null {
  return getItem<AuthSession>(STORAGE_KEYS.SESSION);
}

export function saveSession(session: AuthSession): void {
  setItem(STORAGE_KEYS.SESSION, session);
}

export function clearSession(): void {
  removeItem(STORAGE_KEYS.SESSION);
}

// ===========================
// PORTFOLIO
// ===========================

export function getPortfolio(userId: string): Portfolio | null {
  return getItem<Portfolio>(STORAGE_KEYS.PORTFOLIO(userId));
}

export function savePortfolio(portfolio: Portfolio): void {
  setItem(STORAGE_KEYS.PORTFOLIO(portfolio.userId), portfolio);
}

// ===========================
// TRANSACTIONS
// ===========================

export function getTransactions(userId: string): Transaction[] {
  return getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS(userId)) ?? [];
}

export function saveTransactions(userId: string, txns: Transaction[]): void {
  setItem(STORAGE_KEYS.TRANSACTIONS(userId), txns);
}
