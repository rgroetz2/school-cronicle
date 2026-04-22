import {
  Body,
  Controller,
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
