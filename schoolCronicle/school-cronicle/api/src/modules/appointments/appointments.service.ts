import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AppointmentDraft,
  CreateAppointmentDraftDto,
  UpdateAppointmentDraftDto,
} from './appointment.types';
import { APPOINTMENT_CATEGORIES } from './appointment-categories';

@Injectable()
export class AppointmentsService {
  private readonly drafts: AppointmentDraft[] = [];

  createDraft(
    teacherId: string,
    schoolId: string,
    input: CreateAppointmentDraftDto,
  ): AppointmentDraft {
    const draft: AppointmentDraft = {
      id: randomUUID(),
      teacherId,
      schoolId,
      title: input.title,
      appointmentDate: input.appointmentDate,
      category: input.category,
      notes: input.notes?.trim() ?? '',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    this.drafts.push(draft);
    return draft;
  }

  listDraftsForTeacher(teacherId: string): AppointmentDraft[] {
    return this.drafts
      .filter((draft) => draft.teacherId === teacherId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateDraftForTeacher(
    teacherId: string,
    draftId: string,
    input: UpdateAppointmentDraftDto,
  ): AppointmentDraft | undefined {
    const draft = this.drafts.find((item) => item.id === draftId && item.teacherId === teacherId);
    if (!draft) {
      return undefined;
    }

    draft.title = input.title;
    draft.appointmentDate = input.appointmentDate;
    draft.category = input.category;
    draft.notes = input.notes?.trim() ?? '';
    return draft;
  }

  listCategories(): readonly string[] {
    return APPOINTMENT_CATEGORIES;
  }
}
