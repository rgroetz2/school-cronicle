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

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidAppointmentDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

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
    const appointmentDate = body.appointmentDate?.trim();
    const category = body.category?.trim();
    const notes = body.notes?.trim();

    if (!title || !appointmentDate || !category) {
      throw new BadRequestException({
        message: 'Required appointment metadata is missing.',
        code: 'APPOINTMENT_REQUIRED_FIELDS',
      });
    }
    if (!isValidAppointmentDate(appointmentDate)) {
      throw new BadRequestException({
        message: 'Appointment date must be a valid ISO date (YYYY-MM-DD).',
        code: 'APPOINTMENT_INVALID_DATE',
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
      appointmentDate,
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
    const appointmentDate = body.appointmentDate?.trim();
    const category = body.category?.trim();
    const notes = body.notes?.trim();

    if (!title || !appointmentDate || !category) {
      throw new BadRequestException({
        message: 'Required appointment metadata is missing.',
        code: 'APPOINTMENT_REQUIRED_FIELDS',
      });
    }
    if (!isValidAppointmentDate(appointmentDate)) {
      throw new BadRequestException({
        message: 'Appointment date must be a valid ISO date (YYYY-MM-DD).',
        code: 'APPOINTMENT_INVALID_DATE',
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
      appointmentDate,
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

  @Delete('drafts/:draftId')
  deleteDraft(@Param('draftId') draftId: string, @Req() req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    const deletedDraft = this.appointmentsService.deleteDraftForTeacher(session.teacherId, draftId);
    if (!deletedDraft) {
      throw new NotFoundException({
        message: 'Draft not found.',
      });
    }

    return {
      data: {
        deleted: true,
        draftId: deletedDraft.id,
      },
    };
  }

  @Post('drafts/:draftId/submit')
  submitDraft(@Param('draftId') draftId: string, @Req() req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException({
        message: 'Authentication required.',
      });
    }

    const draft = this.appointmentsService.findDraftForTeacher(session.teacherId, draftId);
    if (!draft) {
      throw new NotFoundException({
        message: 'Draft not found.',
      });
    }

    const missingRequiredFields = this.appointmentsService.evaluateMetadataReadiness(draft);
    if (missingRequiredFields.length > 0) {
      throw new ForbiddenException({
        message: 'Submission blocked until required metadata is complete.',
        code: 'APPOINTMENT_SUBMIT_BLOCKED',
        missingRequiredFields,
      });
    }

    return {
      data: {
        submitted: false,
        draftId: draft.id,
        readyToSubmit: true,
      },
    };
  }
}
