import { SetMetadata } from '@nestjs/common';
import type { AuthRole } from './auth.types';

export const AUTH_ROLE_KEY = 'auth:role';

export const RequireAuthRole = (role: AuthRole) => SetMetadata(AUTH_ROLE_KEY, role);
