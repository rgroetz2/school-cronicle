import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { extractSessionIdFromCookieHeader } from '../auth/auth-cookie.util';
import { SessionService } from '../auth/session.service';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDraftDto } from './appointment.types';

@Controller('appointments')
@UseGuards(AuthSessionGuard)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('drafts')
  createDraft(@Body() body: Partial<CreateAppointmentDraftDto>, @Req() req: Request) {
    const title = body.title?.trim();
    const category = body.category?.trim();
    const notes = body.notes?.trim();

    if (!title || !category) {
      throw new BadRequestException({
        message: 'Required appointment metadata is missing.',
        code: 'APPOINTMENT_REQUIRED_FIELDS',
      });
    }

    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    const draft = this.appointmentsService.createDraft(session.teacherId, 'school-1', {
      title,
      category,
      notes,
    });

    return {
      data: {
        draft,
      },
    };
  }

  @Get('drafts')
  listDrafts(@Req() req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    const drafts = this.appointmentsService.listDraftsForTeacher(session.teacherId);
    return {
      data: {
        drafts,
      },
    };
  }
}
