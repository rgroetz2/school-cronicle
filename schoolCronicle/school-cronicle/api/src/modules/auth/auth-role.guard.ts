import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { extractSessionIdFromCookieHeader } from './auth-cookie.util';
import { AuthService } from './auth.service';
import { AUTH_ROLE_KEY } from './auth-role.decorator';
import { AUTH_ROLES, type AuthRole } from './auth.types';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<AuthRole>(AUTH_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const sessionId = extractSessionIdFromCookieHeader(request.headers.cookie);
    const session = this.authService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    if (!AUTH_ROLES.includes(session.role)) {
      throw new ForbiddenException({
        message: 'Forbidden.',
        code: 'AUTH_INVALID_SESSION_ROLE',
      });
    }

    if (session.role !== requiredRole) {
      throw new ForbiddenException({
        message: 'Forbidden.',
        code: 'AUTH_FORBIDDEN_ROLE',
        requiredRole,
      });
    }

    return true;
  }
}
