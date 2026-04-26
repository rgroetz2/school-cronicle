import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSessionGuard } from './auth-session.guard';
import { AuthRoleGuard } from './auth-role.guard';
import { SessionService } from './session.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionService, AuthSessionGuard, AuthRoleGuard],
  exports: [AuthService, SessionService, AuthSessionGuard, AuthRoleGuard],
})
export class AuthModule {}
