import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SchoolPersonalRecord, UpsertSchoolPersonalDto } from './school-personal.types';
import type { AuthRole } from '../auth/auth.types';

@Injectable()
export class SchoolPersonalService {
  private readonly records: SchoolPersonalRecord[] = [
    {
      id: randomUUID(),
      teacherId: 'teacher-1',
      schoolId: 'school-1',
      name: 'Teacher Account',
      role: 'user',
      jobRole: 'teacher',
      class: '8A',
      startDate: '2026-01-15',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      teacherId: 'admin-1',
      schoolId: 'school-1',
      name: 'Admin Account',
      role: 'admin',
      jobRole: 'supporter',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  listForSchool(schoolId: string, filters: { search?: string; role?: AuthRole; jobRole?: string }): SchoolPersonalRecord[] {
    const searchTerm = filters.search?.trim().toLowerCase() ?? '';
    return this.records
      .filter((record) => record.schoolId === schoolId)
      .filter((record) => !filters.role || record.role === filters.role)
      .filter((record) => !filters.jobRole || record.jobRole === filters.jobRole)
      .filter((record) => {
        if (!searchTerm) {
          return true;
        }
        return [record.name, record.role, record.jobRole, record.class ?? '', record.startDate ?? '']
          .join(' ')
          .toLowerCase()
          .includes(searchTerm);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  findForSchool(schoolId: string, recordId: string): SchoolPersonalRecord | undefined {
    return this.records.find((record) => record.schoolId === schoolId && record.id === recordId);
  }

  findByTeacherId(schoolId: string, teacherId: string): SchoolPersonalRecord | undefined {
    return this.records.find((record) => record.schoolId === schoolId && record.teacherId === teacherId);
  }

  createForSchool(schoolId: string, teacherId: string, input: UpsertSchoolPersonalDto): SchoolPersonalRecord {
    const now = new Date().toISOString();
    const record: SchoolPersonalRecord = {
      id: randomUUID(),
      teacherId,
      schoolId,
      name: input.name,
      role: input.role,
      jobRole: input.jobRole,
      class: input.class,
      startDate: input.startDate,
      createdAt: now,
      updatedAt: now,
    };
    this.records.push(record);
    return record;
  }

  updateForSchool(record: SchoolPersonalRecord, input: UpsertSchoolPersonalDto): SchoolPersonalRecord {
    record.name = input.name;
    record.role = input.role;
    record.jobRole = input.jobRole;
    record.class = input.class;
    record.startDate = input.startDate;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  deleteForSchool(schoolId: string, recordId: string): SchoolPersonalRecord | undefined {
    const index = this.records.findIndex((record) => record.schoolId === schoolId && record.id === recordId);
    if (index < 0) {
      return undefined;
    }
    const [deleted] = this.records.splice(index, 1);
    return deleted;
  }
}
