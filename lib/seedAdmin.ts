import { getAllUsers, saveUser, savePortfolio } from './storage';
import { hashPassword, getAvatarInitials } from './auth';
import { STARTING_CASH } from './constants';

const ADMIN_ID = 'admin-seed-001';
const ADMIN_EMAIL = 'admin@smartinvest.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_USERNAME = 'Admin';

export function seedAdminAccount(): void {
  if (typeof window === 'undefined') return;

  const users = getAllUsers();

  // If any user already has admin, nothing to do
  const hasAdmin = users.some((u) => u.isAdmin);
  if (hasAdmin) return;

  // Promote the first existing user to admin (so whoever signed up first gets access)
  if (users.length > 0) {
    saveUser({ ...users[0], isAdmin: true });
    return;
  }

  // No users at all — create the seed admin account
  const now = Date.now();

  saveUser({
    id: ADMIN_ID,
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    passwordHash: hashPassword(ADMIN_PASSWORD),
    avatarInitials: getAvatarInitials(ADMIN_USERNAME),
    createdAt: now,
    startingCash: STARTING_CASH,
    isAdmin: true,
  });

  savePortfolio({
    userId: ADMIN_ID,
    cashBalance: STARTING_CASH,
    holdings: {},
    netWorthHistory: [{ timestamp: now, netWorth: STARTING_CASH, cashBalance: STARTING_CASH, portfolioValue: 0 }],
    watchlist: [],
  });
}
