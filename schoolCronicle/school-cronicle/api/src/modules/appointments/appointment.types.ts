import { AppointmentCategory } from './appointment-categories';

export interface AppointmentDraft {
  id: string;
  teacherId: string;
  schoolId: string;
  title: string;
  appointmentDate: string;
  category: AppointmentCategory;
  notes: string;
  status: 'draft';
  createdAt: string;
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
