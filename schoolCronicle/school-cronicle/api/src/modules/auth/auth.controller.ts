import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './sign-in.dto';

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
      throw new UnauthorizedException({
        message: 'Sign-in failed. Check your credentials and try again.',
      });
    }

    const existingSessionId = this.extractSessionId(req);
    const authResult = this.authService.signIn(email, password, existingSessionId);

    if (!authResult) {
      throw new UnauthorizedException({
        message: 'Sign-in failed. Check your credentials and try again.',
      });
    }

    response.cookie('sc_session', authResult.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
      path: '/',
    });

    return {
      data: {
        teacherId: authResult.teacherId,
        email: authResult.email,
      },
    };
  }

  private extractSessionId(req: Request): string | undefined {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    const sessionPair = cookieHeader
      .split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith('sc_session='));

    return sessionPair?.slice('sc_session='.length);
  }
}
