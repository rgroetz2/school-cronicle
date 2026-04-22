export interface AuthSession {
  id: string;
  teacherId: string;
  email: string;
  createdAt: number;
}

export interface SignInResult {
  teacherId: string;
  email: string;
  sessionId: string;
}
