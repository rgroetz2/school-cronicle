import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AppointmentDraft, CreateAppointmentDraftDto } from './appointment.types';

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
}
