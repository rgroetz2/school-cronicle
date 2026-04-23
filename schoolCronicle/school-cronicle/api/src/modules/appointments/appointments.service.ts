import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AttachDraftImageDto,
  AppointmentDraft,
  CreateAppointmentDraftDto,
  DraftImage,
  UpdateAppointmentDraftDto,
} from './appointment.types';
import { APPOINTMENT_CATEGORIES } from './appointment-categories';
import {
  APPOINTMENT_IMAGE_ALLOWED_MIME_TYPES,
  APPOINTMENT_IMAGE_MAX_BYTES,
  estimateDataUrlPayloadBytes,
} from './appointment-image-validation';

const RETENTION_DRAFT_MAX_AGE_DAYS = 30;
const RETENTION_SUBMITTED_MAX_AGE_DAYS = 365;
const RETENTION_RETRY_DELAY_MS = 60_000;

interface RetentionConfig {
  draftMaxAgeDays: number;
  submittedMaxAgeDays: number;
}

interface RetentionAuditAction {
  id: string;
  action: 'delete_draft' | 'delete_submission';
  draftId: string;
  teacherId: string;
  mediaCount: number;
  occurredAt: string;
  outcome: 'deleted' | 'failed';
}

interface RetentionFailure {
  id: string;
  draftId: string;
  teacherId: string;
  reason: string;
  retryable: boolean;
  retryCount: number;
  nextRetryAt?: string;
  flaggedAt: string;
}

export interface RetentionRunResult {
  processedCount: number;
  deletedCount: number;
  failedCount: number;
  audits: RetentionAuditAction[];
  failures: RetentionFailure[];
}

@Injectable()
export class AppointmentsService {
  private readonly drafts: AppointmentDraft[] = [];
  private readonly retentionAudits: RetentionAuditAction[] = [];
  private readonly retentionFailures: RetentionFailure[] = [];
  private readonly retentionConfig: RetentionConfig = {
    draftMaxAgeDays: RETENTION_DRAFT_MAX_AGE_DAYS,
    submittedMaxAgeDays: RETENTION_SUBMITTED_MAX_AGE_DAYS,
  };

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
    if (draft.status === 'submitted') {
      draft.editedAfterSubmitAt = new Date().toISOString();
      draft.editedAfterSubmitBy = teacherId;
    }
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

  evaluateImageReadiness(draft: AppointmentDraft): DraftImage[] {
    return draft.images.filter((image) => {
      if (
        !APPOINTMENT_IMAGE_ALLOWED_MIME_TYPES.includes(
          image.mimeType as (typeof APPOINTMENT_IMAGE_ALLOWED_MIME_TYPES)[number],
        )
      ) {
        return true;
      }

      return estimateDataUrlPayloadBytes(image.dataUrl) > APPOINTMENT_IMAGE_MAX_BYTES;
    });
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
    if (draft.status === 'submitted') {
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

  submitDraftForTeacher(teacherId: string, draftId: string): AppointmentDraft | undefined {
    const draft = this.findDraftForTeacher(teacherId, draftId);
    if (!draft) {
      return undefined;
    }
    if (draft.status === 'submitted') {
      return draft;
    }

    draft.status = 'submitted';
    draft.submittedAt = new Date().toISOString();
    return draft;
  }

  runRetention(nowIso = new Date().toISOString()): RetentionRunResult {
    const now = new Date(nowIso);
    const audits: RetentionAuditAction[] = [];
    const failures: RetentionFailure[] = [];
    const staleDraftIds = this.collectRetentionCandidates(now);

    for (const draftId of staleDraftIds) {
      const draftIndex = this.drafts.findIndex((draft) => draft.id === draftId);
      if (draftIndex < 0) {
        continue;
      }
      const draft = this.drafts[draftIndex];

      try {
        this.assertRetentionReady(draft);
        this.drafts.splice(draftIndex, 1);

        const audit: RetentionAuditAction = {
          id: randomUUID(),
          action: draft.status === 'submitted' ? 'delete_submission' : 'delete_draft',
          draftId: draft.id,
          teacherId: draft.teacherId,
          mediaCount: draft.images.length,
          occurredAt: now.toISOString(),
          outcome: 'deleted',
        };
        audits.push(audit);
        this.retentionAudits.unshift(audit);
      } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : 'Retention action failed.';
        const failure = this.recordRetentionFailure(draft, reason, now);
        failures.push(failure);

        const failureAudit: RetentionAuditAction = {
          id: randomUUID(),
          action: draft.status === 'submitted' ? 'delete_submission' : 'delete_draft',
          draftId: draft.id,
          teacherId: draft.teacherId,
          mediaCount: draft.images.length,
          occurredAt: now.toISOString(),
          outcome: 'failed',
        };
        audits.push(failureAudit);
        this.retentionAudits.unshift(failureAudit);
      }
    }

    return {
      processedCount: staleDraftIds.length,
      deletedCount: audits.filter((audit) => audit.outcome === 'deleted').length,
      failedCount: failures.length,
      audits,
      failures,
    };
  }

  listRetentionAudits(): RetentionAuditAction[] {
    return [...this.retentionAudits];
  }

  listRetentionFailures(): RetentionFailure[] {
    return [...this.retentionFailures];
  }

  private collectRetentionCandidates(now: Date): string[] {
    const nowMs = now.getTime();
    return this.drafts
      .filter((draft) => {
        const referenceTime = draft.status === 'submitted' ? draft.submittedAt : draft.createdAt;
        if (!referenceTime) {
          return true;
        }
        const referenceMs = new Date(referenceTime).getTime();
        if (Number.isNaN(referenceMs)) {
          return true;
        }

        const ageInDays = (nowMs - referenceMs) / (1000 * 60 * 60 * 24);
        if (draft.status === 'submitted') {
          return ageInDays >= this.retentionConfig.submittedMaxAgeDays;
        }
        return ageInDays >= this.retentionConfig.draftMaxAgeDays;
      })
      .map((draft) => draft.id);
  }

  private assertRetentionReady(draft: AppointmentDraft): void {
    const createdMs = new Date(draft.createdAt).getTime();
    if (Number.isNaN(createdMs)) {
      throw new Error('Draft has invalid createdAt timestamp.');
    }

    if (draft.status === 'submitted') {
      if (!draft.submittedAt) {
        throw new Error('Submitted draft is missing submittedAt timestamp.');
      }
      const submittedMs = new Date(draft.submittedAt).getTime();
      if (Number.isNaN(submittedMs)) {
        throw new Error('Submitted draft has invalid submittedAt timestamp.');
      }
    }
  }

  private recordRetentionFailure(draft: AppointmentDraft, reason: string, now: Date): RetentionFailure {
    const existingFailure = this.retentionFailures.find((failure) => failure.draftId === draft.id);
    const retryCount = (existingFailure?.retryCount ?? 0) + 1;
    const retryable = true;
    const failure: RetentionFailure = {
      id: existingFailure?.id ?? randomUUID(),
      draftId: draft.id,
      teacherId: draft.teacherId,
      reason,
      retryable,
      retryCount,
      nextRetryAt: new Date(now.getTime() + RETENTION_RETRY_DELAY_MS).toISOString(),
      flaggedAt: now.toISOString(),
    };

    if (existingFailure) {
      const index = this.retentionFailures.findIndex((entry) => entry.id === existingFailure.id);
      this.retentionFailures[index] = failure;
    } else {
      this.retentionFailures.unshift(failure);
    }

    return failure;
  }
}
