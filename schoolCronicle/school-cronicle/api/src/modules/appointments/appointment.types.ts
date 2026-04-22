import { AppointmentCategory } from './appointment-categories';

export interface DraftImage {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  addedAt: string;
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
  images: DraftImage[];
}

export interface CreateAppointmentDraftDto {
  title: string;
  appointmentDate: string;
  category: AppointmentCategory;
  notes?: string;
}

export interface UpdateAppointmentDraftDto {
  title: string;
  appointmentDate: string;
  category: AppointmentCategory;
  notes?: string;
}

export interface AttachDraftImageDto {
  name: string;
  mimeType: string;
  dataUrl: string;
}
