import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AttachDraftImageDto,
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
      images: [],
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

  findDraftForTeacher(teacherId: string, draftId: string): AppointmentDraft | undefined {
    return this.drafts.find((item) => item.id === draftId && item.teacherId === teacherId);
  }

  evaluateMetadataReadiness(draft: AppointmentDraft): string[] {
    const missing: string[] = [];
    if (!draft.title.trim()) {
      missing.push('title');
    }
    if (!draft.appointmentDate.trim()) {
      missing.push('appointmentDate');
    }
    if (!draft.category.trim()) {
      missing.push('category');
    }

    return missing;
  }

  deleteDraftForTeacher(teacherId: string, draftId: string): AppointmentDraft | undefined {
    const draftIndex = this.drafts.findIndex((item) => item.id === draftId && item.teacherId === teacherId);
    if (draftIndex < 0) {
      return undefined;
    }

    const [deletedDraft] = this.drafts.splice(draftIndex, 1);
    return deletedDraft;
  }

  attachImageToDraftForTeacher(
    teacherId: string,
    draftId: string,
    image: AttachDraftImageDto,
  ): AppointmentDraft | undefined {
    const draft = this.findDraftForTeacher(teacherId, draftId);
    if (!draft) {
      return undefined;
    }

    draft.images = [
      ...draft.images,
      {
        id: randomUUID(),
        name: image.name.trim(),
        mimeType: image.mimeType.trim(),
        dataUrl: image.dataUrl.trim(),
        addedAt: new Date().toISOString(),
      },
    ];
    return draft;
  }
}
