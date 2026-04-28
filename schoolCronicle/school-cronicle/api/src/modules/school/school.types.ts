export interface SchoolRecord {
  id: string;
  schoolId: string;
  name: string;
  type: string;
  address: string;
  description?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSchoolDto {
  name: string;
  type: string;
  address: string;
  description?: string;
  comment?: string;
}
