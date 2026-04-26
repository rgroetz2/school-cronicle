export const AUTH_ROLES = ['admin', 'user'] as const;
export type AuthRole = (typeof AUTH_ROLES)[number];

export interface AuthSession {
  id: string;
  teacherId: string;
  email: string;
  role: AuthRole;
  createdAt: number;
}

export interface SignInResult {
  teacherId: string;
  email: string;
  role: AuthRole;
  sessionId: string;
}

export type SignInFailureReason =
  | 'invalid-credentials'
  | 'account-blocked'
  | 'invalid-role-state';
