import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateSchoolContactDto, SchoolContact, UpdateSchoolContactDto } from './contact.types';

@Injectable()
export class ContactsService {
  private readonly contacts: SchoolContact[] = [];

  listContactsForSchool(schoolId: string): SchoolContact[] {
    return this.contacts
      .filter((contact) => contact.schoolId === schoolId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  findContactForSchool(schoolId: string, contactId: string): SchoolContact | undefined {
    return this.contacts.find((contact) => contact.id === contactId && contact.schoolId === schoolId);
  }

  hasDuplicateForSchool(
    schoolId: string,
    input: { email?: string; phone?: string },
    excludeContactId?: string,
  ): boolean {
    const normalizedEmail = input.email?.trim().toLowerCase() ?? '';
    const normalizedPhone = input.phone?.trim() ?? '';
    if (!normalizedEmail || !normalizedPhone) {
      return false;
    }
    return this.contacts.some(
      (contact) =>
        contact.schoolId === schoolId &&
        contact.id !== excludeContactId &&
        (contact.email?.toLowerCase() ?? '') === normalizedEmail &&
        (contact.phone ?? '') === normalizedPhone,
    );
  }

  createContactForSchool(
    schoolId: string,
    teacherId: string,
    input: CreateSchoolContactDto,
  ): SchoolContact {
    const now = new Date().toISOString();
    const contact: SchoolContact = {
      id: randomUUID(),
      schoolId,
      createdByTeacherId: teacherId,
      name: input.name,
      role: input.role,
      email: input.email?.toLowerCase() || undefined,
      phone: input.phone || undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.contacts.push(contact);
    return contact;
  }

  updateContactForSchool(
    schoolId: string,
    contactId: string,
    input: UpdateSchoolContactDto,
  ): SchoolContact | undefined {
    const contact = this.findContactForSchool(schoolId, contactId);
    if (!contact) {
      return undefined;
    }

    contact.name = input.name;
    contact.role = input.role;
    contact.email = input.email?.toLowerCase() || undefined;
    contact.phone = input.phone || undefined;
    contact.updatedAt = new Date().toISOString();
    return contact;
  }

  deleteContactForSchool(schoolId: string, contactId: string): SchoolContact | undefined {
    const index = this.contacts.findIndex((contact) => contact.id === contactId && contact.schoolId === schoolId);
    if (index < 0) {
      return undefined;
    }
    const [deleted] = this.contacts.splice(index, 1);
    return deleted;
  }
}
