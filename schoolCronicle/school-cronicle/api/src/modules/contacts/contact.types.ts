export const CONTACT_ROLES = ['teacher', 'parent', 'staff', 'partner'] as const;

export type ContactRole = (typeof CONTACT_ROLES)[number];

export interface SchoolContact {
  id: string;
  schoolId: string;
  createdByTeacherId: string;
  name: string;
  role: ContactRole;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolContactDto {
  name: string;
  role: ContactRole;
  email?: string;
  phone?: string;
}

export interface UpdateSchoolContactDto {
  name: string;
  role: ContactRole;
  email?: string;
  phone?: string;
}
