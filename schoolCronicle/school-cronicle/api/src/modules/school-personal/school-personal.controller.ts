import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AUTH_ROLES, type AuthRole } from '../auth/auth.types';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { extractSessionIdFromCookieHeader } from '../auth/auth-cookie.util';
import { SessionService } from '../auth/session.service';
import { SCHOOL_PERSONAL_JOB_ROLES, type UpsertSchoolPersonalDto } from './school-personal.types';
import { SchoolPersonalService } from './school-personal.service';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@Controller('school-personal')
@UseGuards(AuthSessionGuard)
export class SchoolPersonalController {
  constructor(
    private readonly schoolPersonalService: SchoolPersonalService,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  listRecords(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('jobRole') jobRole?: string,
  ) {
    const session = this.getSession(req);
    if (session.role === 'admin') {
      if (role && !AUTH_ROLES.includes(role as AuthRole)) {
        throw new BadRequestException({
          message: 'Role must be admin or user.',
          code: 'SCHOOL_PERSONAL_INVALID_ROLE_FILTER',
        });
      }
      return {
        data: {
          records: this.schoolPersonalService.listForSchool('school-1', {
            search,
            role: role as AuthRole | undefined,
            jobRole,
          }),
        },
      };
    }

    const self = this.schoolPersonalService.findByTeacherId('school-1', session.teacherId);
    return { data: { records: self ? [self] : [] } };
  }

  @Post()
  createRecord(@Req() req: Request, @Body() body: Partial<UpsertSchoolPersonalDto & { teacherId?: string }>) {
    const session = this.getSession(req);
    this.ensureAdmin(session.role);
    const teacherId = body.teacherId?.trim();
    if (!teacherId) {
      throw new BadRequestException({
        message: 'teacherId is required for creation.',
        code: 'SCHOOL_PERSONAL_TEACHER_REQUIRED',
      });
    }
    const payload = this.validatePayload(body);
    const record = this.schoolPersonalService.createForSchool('school-1', teacherId, payload);
    return { data: { record } };
  }

  @Get(':recordId')
  getRecord(@Req() req: Request, @Param('recordId') recordId: string) {
    const session = this.getSession(req);
    const record = this.schoolPersonalService.findForSchool('school-1', recordId);
    if (!record) {
      throw new NotFoundException({ message: 'School-personal record not found.' });
    }
    this.ensureReadAccess(session, record.teacherId);
    return { data: { record } };
  }

  @Patch(':recordId')
  updateRecord(@Req() req: Request, @Param('recordId') recordId: string, @Body() body: Partial<UpsertSchoolPersonalDto>) {
    const session = this.getSession(req);
    const record = this.schoolPersonalService.findForSchool('school-1', recordId);
    if (!record) {
      throw new NotFoundException({ message: 'School-personal record not found.' });
    }
    this.ensureReadAccess(session, record.teacherId);
    const payload = this.validatePayload(body);
    if (session.role === 'user' && payload.role !== record.role) {
      throw new ForbiddenException({
        message: 'Users cannot change their profile role.',
        code: 'SCHOOL_PERSONAL_ROLE_CHANGE_FORBIDDEN',
      });
    }
    const updated = this.schoolPersonalService.updateForSchool(record, payload);
    return { data: { record: updated } };
  }

  @Delete(':recordId')
  deleteRecord(@Req() req: Request, @Param('recordId') recordId: string) {
    const session = this.getSession(req);
    this.ensureAdmin(session.role);
    const deleted = this.schoolPersonalService.deleteForSchool('school-1', recordId);
    if (!deleted) {
      throw new NotFoundException({ message: 'School-personal record not found.' });
    }
    return { data: { deleted: true, recordId: deleted.id } };
  }

  private getSession(req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException({ message: 'Authentication required.' });
    }
    return session;
  }

  private ensureAdmin(role: AuthRole): void {
    if (role !== 'admin') {
      throw new ForbiddenException({
        message: 'Forbidden.',
        code: 'AUTH_FORBIDDEN_ROLE',
        requiredRole: 'admin',
      });
    }
  }

  private ensureReadAccess(session: { role: AuthRole; teacherId: string }, teacherId: string): void {
    if (session.role === 'admin') {
      return;
    }
    if (session.teacherId !== teacherId) {
      throw new ForbiddenException({
        message: 'Forbidden.',
        code: 'SCHOOL_PERSONAL_SELF_ONLY',
      });
    }
  }

  private validatePayload(body: Partial<UpsertSchoolPersonalDto>): UpsertSchoolPersonalDto {
    const name = body.name?.trim();
    const role = body.role?.trim() as AuthRole | undefined;
    const jobRole = body.jobRole?.trim();
    const classValue = body.class?.trim() || undefined;
    const startDate = body.startDate?.trim() || undefined;

    if (!name || !role || !jobRole) {
      throw new BadRequestException({
        message: 'Required fields are missing (name, role, jobRole).',
        code: 'SCHOOL_PERSONAL_REQUIRED_FIELDS',
      });
    }
    if (!AUTH_ROLES.includes(role)) {
      throw new BadRequestException({
        message: 'Role must be admin or user.',
        code: 'SCHOOL_PERSONAL_INVALID_ROLE',
      });
    }
    if (!SCHOOL_PERSONAL_JOB_ROLES.includes(jobRole as (typeof SCHOOL_PERSONAL_JOB_ROLES)[number])) {
      throw new BadRequestException({
        message: 'jobRole must be teacher, assistant, supporter, or other.',
        code: 'SCHOOL_PERSONAL_INVALID_JOB_ROLE',
      });
    }
    if (startDate && !ISO_DATE_PATTERN.test(startDate)) {
      throw new BadRequestException({
        message: 'startDate must be in YYYY-MM-DD format.',
        code: 'SCHOOL_PERSONAL_INVALID_START_DATE',
      });
    }

    return {
      name,
      role,
      jobRole: jobRole as (typeof SCHOOL_PERSONAL_JOB_ROLES)[number],
      class: classValue,
      startDate,
    };
  }
}
