import type { AuthRole } from '../auth/auth.types';

export const SCHOOL_PERSONAL_JOB_ROLES = [
  'teacher',
  'assistant',
  'supporter',
  'other',
] as const;

export type SchoolPersonalJobRole = (typeof SCHOOL_PERSONAL_JOB_ROLES)[number];

export interface SchoolPersonalRecord {
  id: string;
  teacherId: string;
  schoolId: string;
  name: string;
  role: AuthRole;
  jobRole: SchoolPersonalJobRole;
  class?: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSchoolPersonalDto {
  name: string;
  role: AuthRole;
  jobRole: SchoolPersonalJobRole;
  class?: string;
  startDate?: string;
}
