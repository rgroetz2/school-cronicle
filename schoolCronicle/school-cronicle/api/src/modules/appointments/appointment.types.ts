import { AppointmentCategory } from './appointment-categories';

export interface DraftImage {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  addedAt: string;
}

export interface AppointmentParticipant {
  contactId: string;
  name: string;
  role: string;
}

export interface AppointmentDraft {
  id: string;
  teacherId: string;
  schoolId: string;
  title: string;
  appointmentDate: string;
  category: AppointmentCategory;
  notes: string;
  status: 'draft' | 'submitted';
  createdAt: string;
  submittedAt?: string;
  editedAfterSubmitAt?: string;
  editedAfterSubmitBy?: string;
  participants?: AppointmentParticipant[];
  chronicleExportEligible?: boolean;
  images: DraftImage[];
}

export interface CreateAppointmentDraftDto {
  title: string;
  appointmentDate: string;
  category: AppointmentCategory;
  notes?: string;
  participantContactIds?: string[];
}

export interface UpdateAppointmentDraftDto {
  title: string;
  appointmentDate: string;
  category: AppointmentCategory;
  notes?: string;
  participantContactIds?: string[];
}

export interface AttachDraftImageDto {
  name: string;
  mimeType: string;
  dataUrl: string;
}
