'use client';

import { createContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { User, AuthSession } from '@/types';
import {
  createToken, verifyToken, hashPassword, verifyPassword, getAvatarInitials,
} from '@/lib/auth';
import {
  getAllUsers, saveUser, getUserByEmail, getSession, saveSession, clearSession, savePortfolio, getTransactions, saveTransactions,
} from '@/lib/storage';
import { STARTING_CASH } from '@/lib/constants';

// ===========================
// STATE
// ===========================

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'INIT'; user: User | null; session: AuthSession | null }
  | { type: 'LOGIN'; user: User; session: AuthSession }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE'; user: User };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT':
      return { user: action.user, session: action.session, isLoading: false };
    case 'LOGIN':
      return { user: action.user, session: action.session, isLoading: false };
    case 'LOGOUT':
      return { user: null, session: null, isLoading: false };
    case 'UPDATE':
      return { ...state, user: action.user };
    default:
      return state;
  }
}

// ===========================
// CONTEXT
// ===========================

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (username: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    session: null,
    isLoading: true,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const session = getSession();
    if (!session) {
      dispatch({ type: 'INIT', user: null, session: null });
      return;
    }
    const userId = verifyToken(session.token);
    if (!userId) {
      clearSession();
      dispatch({ type: 'INIT', user: null, session: null });
      return;
    }
    // Re-read from storage so any seed mutations (e.g. isAdmin promotion) are reflected
    const users = getAllUsers();
    const user = users.find((u) => u.id === userId) ?? null;
    dispatch({ type: 'INIT', user, session: user ? session : null });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const user = getUserByEmail(email);
    if (!user) return 'No account found with that email';
    if (!verifyPassword(password, user.passwordHash)) return 'Incorrect password';

    const token = createToken(user.id);
    const session: AuthSession = {
      userId: user.id,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    saveSession(session);
    dispatch({ type: 'LOGIN', user, session });
    return null;
  }, []);

  const signup = useCallback(async (
    username: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    if (getUserByEmail(email)) return 'An account with this email already exists';
    if (username.trim().length < 2) return 'Username must be at least 2 characters';
    if (password.length < 6) return 'Password must be at least 6 characters';

    const id = uuidv4();
    const normalizedEmail = email.toLowerCase().trim();
    const user: User = {
      id,
      username: username.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      avatarInitials: getAvatarInitials(username),
      createdAt: Date.now(),
      startingCash: STARTING_CASH,
      isAdmin: normalizedEmail === 'admin@smartinvest.com',
    };
    saveUser(user);

    // Initialize empty portfolio
    savePortfolio({
      userId: id,
      cashBalance: STARTING_CASH,
      holdings: {},
      netWorthHistory: [{ timestamp: Date.now(), netWorth: STARTING_CASH, cashBalance: STARTING_CASH, portfolioValue: 0 }],
      watchlist: [],
    });
    saveTransactions(id, getTransactions(id));

    const token = createToken(id);
    const session: AuthSession = {
      userId: id,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    saveSession(session);
    dispatch({ type: 'LOGIN', user, session });
    return null;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        session: state.session,
        isLoading: state.isLoading,
        isAuthenticated: !!state.user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
