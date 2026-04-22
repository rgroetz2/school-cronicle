export interface AppointmentDraft {
  id: string;
  teacherId: string;
  schoolId: string;
  title: string;
  category: string;
  notes: string;
  status: 'draft';
  createdAt: string;
}

export interface CreateAppointmentDraftDto {
  title: string;
  category: string;
  notes?: string;
}
