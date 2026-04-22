import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
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
import { CreateAppointmentDraftDto, UpdateAppointmentDraftDto } from './appointment.types';
import { isAppointmentCategory } from './appointment-categories';

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
    if (!isAppointmentCategory(category)) {
      throw new BadRequestException({
        message: 'Category must be one of the allowed values.',
        code: 'APPOINTMENT_INVALID_CATEGORY',
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

  @Patch('drafts/:draftId')
  updateDraft(
    @Param('draftId') draftId: string,
    @Body() body: Partial<UpdateAppointmentDraftDto>,
    @Req() req: Request,
  ) {
    const title = body.title?.trim();
    const category = body.category?.trim();
    const notes = body.notes?.trim();

    if (!title || !category) {
      throw new BadRequestException({
        message: 'Required appointment metadata is missing.',
        code: 'APPOINTMENT_REQUIRED_FIELDS',
      });
    }
    if (!isAppointmentCategory(category)) {
      throw new BadRequestException({
        message: 'Category must be one of the allowed values.',
        code: 'APPOINTMENT_INVALID_CATEGORY',
      });
    }

    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    const draft = this.appointmentsService.updateDraftForTeacher(session.teacherId, draftId, {
      title,
      category,
      notes,
    });
    if (!draft) {
      throw new NotFoundException({
        message: 'Draft not found.',
      });
    }

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

  @Get('categories')
  listCategories(@Req() req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    return {
      data: {
        categories: this.appointmentsService.listCategories(),
      },
    };
  }
}
