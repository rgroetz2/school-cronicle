import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SchoolRecord, UpsertSchoolDto } from './school.types';

@Injectable()
export class SchoolService {
  private readonly records: SchoolRecord[] = [
    {
      id: randomUUID(),
      schoolId: 'school-1',
      name: 'Primary School North',
      type: 'public',
      address: 'Musterstrasse 10, 8000 Zurich',
      description: 'Main school site for grade 1-6',
      comment: 'Pitch seed school',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  listForSchool(schoolId: string, filters?: { search?: string; type?: string }): SchoolRecord[] {
    const searchTerm = filters?.search?.trim().toLowerCase() ?? '';
    const type = filters?.type?.trim().toLowerCase() ?? '';
    return this.records
      .filter((record) => record.schoolId === schoolId)
      .filter((record) => !type || record.type.toLowerCase() === type)
      .filter((record) => {
        if (!searchTerm) {
          return true;
        }
        return [record.name, record.type, record.address, record.description ?? '', record.comment ?? '']
          .join(' ')
          .toLowerCase()
          .includes(searchTerm);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  findForSchool(schoolId: string, recordId: string): SchoolRecord | undefined {
    return this.records.find((record) => record.schoolId === schoolId && record.id === recordId);
  }

  createForSchool(schoolId: string, input: UpsertSchoolDto): SchoolRecord {
    const now = new Date().toISOString();
    const record: SchoolRecord = {
      id: randomUUID(),
      schoolId,
      name: input.name,
      type: input.type,
      address: input.address,
      description: input.description,
      comment: input.comment,
      createdAt: now,
      updatedAt: now,
    };
    this.records.push(record);
    return record;
  }

  updateForSchool(record: SchoolRecord, input: UpsertSchoolDto): SchoolRecord {
    record.name = input.name;
    record.type = input.type;
    record.address = input.address;
    record.description = input.description;
    record.comment = input.comment;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  deleteForSchool(schoolId: string, recordId: string): SchoolRecord | undefined {
    const index = this.records.findIndex((record) => record.schoolId === schoolId && record.id === recordId);
    if (index < 0) {
      return undefined;
    }
    const [deleted] = this.records.splice(index, 1);
    return deleted;
  }
}
