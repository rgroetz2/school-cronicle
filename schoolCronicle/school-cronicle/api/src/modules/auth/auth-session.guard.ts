import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { extractSessionIdFromCookieHeader } from './auth-cookie.util';

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionId = extractSessionIdFromCookieHeader(request.headers.cookie);

    if (!this.authService.isSessionValid(sessionId)) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    return true;
  }
}
