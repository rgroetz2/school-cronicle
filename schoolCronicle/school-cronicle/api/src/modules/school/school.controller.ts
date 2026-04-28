import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { extractSessionIdFromCookieHeader } from '../auth/auth-cookie.util';
import { SessionService } from '../auth/session.service';
import { SchoolService } from './school.service';
import type { UpsertSchoolDto } from './school.types';

@Controller('schools')
@UseGuards(AuthSessionGuard)
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  listRecords(@Req() req: Request, @Query('search') search?: string, @Query('type') type?: string) {
    this.getSession(req);
    return {
      data: {
        records: this.schoolService.listForSchool('school-1', { search, type }),
      },
    };
  }

  @Post()
  createRecord(@Req() req: Request, @Body() body: Partial<UpsertSchoolDto>) {
    this.getSession(req);
    const payload = this.validatePayload(body);
    const record = this.schoolService.createForSchool('school-1', payload);
    return { data: { record } };
  }

  @Get(':recordId')
  getRecord(@Req() req: Request, @Param('recordId') recordId: string) {
    this.getSession(req);
    const record = this.schoolService.findForSchool('school-1', recordId);
    if (!record) {
      throw new NotFoundException({ message: 'School record not found.' });
    }
    return { data: { record } };
  }

  @Patch(':recordId')
  updateRecord(@Req() req: Request, @Param('recordId') recordId: string, @Body() body: Partial<UpsertSchoolDto>) {
    this.getSession(req);
    const record = this.schoolService.findForSchool('school-1', recordId);
    if (!record) {
      throw new NotFoundException({ message: 'School record not found.' });
    }
    const payload = this.validatePayload(body);
    const updated = this.schoolService.updateForSchool(record, payload);
    return { data: { record: updated } };
  }

  @Delete(':recordId')
  deleteRecord(@Req() req: Request, @Param('recordId') recordId: string) {
    this.getSession(req);
    const deleted = this.schoolService.deleteForSchool('school-1', recordId);
    if (!deleted) {
      throw new NotFoundException({ message: 'School record not found.' });
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

  private validatePayload(body: Partial<UpsertSchoolDto>): UpsertSchoolDto {
    const name = body.name?.trim();
    const type = body.type?.trim();
    const address = body.address?.trim();
    const description = body.description?.trim() || undefined;
    const comment = body.comment?.trim() || undefined;

    if (!name || !type || !address) {
      throw new BadRequestException({
        message: 'Required fields are missing (name, type, address).',
        code: 'SCHOOL_REQUIRED_FIELDS',
      });
    }

    return {
      name,
      type,
      address,
      description,
      comment,
    };
  }
}
