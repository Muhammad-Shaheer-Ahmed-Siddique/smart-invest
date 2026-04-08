// Mock auth — NOT cryptographically secure, for demo/portfolio purposes only

export function createToken(userId: string): string {
  const payload = { userId, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token)) as { userId: string; exp: number };
    if (payload.exp < Date.now()) return null;
    return payload.userId;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  // Simple deterministic hash for demo — not cryptographic
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return btoa(`si_${hash}_${password.length}`);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function getAvatarInitials(username: string): string {
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}
