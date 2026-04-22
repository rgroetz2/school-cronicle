export const AUTH_COOKIE_NAME = 'sc_session';

export function isSecureCookie(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 8,
    path: '/',
  };
}

export function extractSessionIdFromCookieHeader(
  cookieHeader?: string,
): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const sessionPair = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_NAME}=`));

  return sessionPair?.slice(`${AUTH_COOKIE_NAME}=`.length);
}
