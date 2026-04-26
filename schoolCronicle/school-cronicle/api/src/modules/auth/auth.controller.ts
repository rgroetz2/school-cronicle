import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './sign-in.dto';
import {
  authCookieOptions,
  AUTH_COOKIE_NAME,
  extractSessionIdFromCookieHeader,
} from './auth-cookie.util';
import { AuthSessionGuard } from './auth-session.guard';
import { RequireAuthRole } from './auth-role.decorator';
import { AuthRoleGuard } from './auth-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() body: Partial<SignInDto>,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      throw this.buildSignInUnauthorized('invalid-credentials');
    }

    const existingSessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const signInAttempt = this.authService.signIn(email, password, existingSessionId);
    const authResult = signInAttempt.result;

    if (!authResult) {
      throw this.buildSignInUnauthorized(
        signInAttempt.failureReason ?? 'invalid-credentials',
      );
    }

    response.cookie(AUTH_COOKIE_NAME, authResult.sessionId, authCookieOptions());

    return {
      data: {
        teacherId: authResult.teacherId,
        email: authResult.email,
        role: authResult.role,
      },
    };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const currentSessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    this.authService.signOut(currentSessionId);

    response.clearCookie(AUTH_COOKIE_NAME, {
      path: '/',
      sameSite: authCookieOptions().sameSite,
      httpOnly: authCookieOptions().httpOnly,
      secure: authCookieOptions().secure,
    });

    return {
      data: {
        signedOut: true,
      },
    };
  }

  @Get('session')
  @UseGuards(AuthSessionGuard)
  getSessionProbe() {
    return {
      data: {
        authenticated: true,
      },
    };
  }

  @Get('session-context')
  @UseGuards(AuthSessionGuard, AuthRoleGuard)
  getSessionContext(@Req() req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.authService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    return {
      data: {
        authenticated: true,
        teacherId: session.teacherId,
        email: session.email,
        role: session.role,
      },
    };
  }

  @Get('admin-probe')
  @UseGuards(AuthSessionGuard, AuthRoleGuard)
  @RequireAuthRole('admin')
  getAdminProbe(@Req() req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.authService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    if (!session.role) {
      throw new ForbiddenException({
        message: 'Forbidden.',
        code: 'AUTH_INVALID_SESSION_ROLE',
      });
    }

    return {
      data: {
        authorized: true,
        role: session.role,
      },
    };
  }

  private buildSignInUnauthorized(reason: 'invalid-credentials' | 'account-blocked') {
    return new UnauthorizedException({
      message: 'Sign-in failed. Check your credentials and try again.',
      code: 'AUTH_SIGN_IN_FAILED',
      reason,
      support: {
        label: process.env.SC_SUPPORT_LABEL ?? 'School account support',
        email: process.env.SC_SUPPORT_EMAIL ?? 'support@school.local',
      },
    });
  }
}
