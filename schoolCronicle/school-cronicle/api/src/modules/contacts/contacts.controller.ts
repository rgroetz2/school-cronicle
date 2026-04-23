import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { extractSessionIdFromCookieHeader } from '../auth/auth-cookie.util';
import { SessionService } from '../auth/session.service';
import { isContactRole } from './contact-roles';
import { CreateSchoolContactDto, UpdateSchoolContactDto } from './contact.types';
import { ContactsService } from './contacts.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Controller('contacts')
@UseGuards(AuthSessionGuard)
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  listContacts(@Req() req: Request) {
    const session = this.getSession(req);
    const contacts = this.contactsService.listContactsForSchool('school-1');
    return { data: { contacts } };
  }

  @Post()
  createContact(@Body() body: Partial<CreateSchoolContactDto>, @Req() req: Request) {
    const session = this.getSession(req);
    const payload = this.validatePayload(body);
    if (this.contactsService.hasDuplicateForSchool('school-1', payload)) {
      throw new BadRequestException({
        message: 'Contact already exists for this school.',
        code: 'CONTACT_DUPLICATE',
      });
    }

    const contact = this.contactsService.createContactForSchool('school-1', session.teacherId, payload);
    return { data: { contact } };
  }

  @Patch(':contactId')
  updateContact(
    @Param('contactId') contactId: string,
    @Body() body: Partial<UpdateSchoolContactDto>,
    @Req() req: Request,
  ) {
    this.getSession(req);
    const payload = this.validatePayload(body);
    const existing = this.contactsService.findContactForSchool('school-1', contactId);
    if (!existing) {
      throw new NotFoundException({ message: 'Contact not found.' });
    }
    if (this.contactsService.hasDuplicateForSchool('school-1', payload, contactId)) {
      throw new BadRequestException({
        message: 'Contact already exists for this school.',
        code: 'CONTACT_DUPLICATE',
      });
    }
    const contact = this.contactsService.updateContactForSchool('school-1', contactId, payload);
    if (!contact) {
      throw new NotFoundException({ message: 'Contact not found.' });
    }
    return { data: { contact } };
  }

  @Delete(':contactId')
  deleteContact(@Param('contactId') contactId: string, @Req() req: Request) {
    this.getSession(req);
    const deleted = this.contactsService.deleteContactForSchool('school-1', contactId);
    if (!deleted) {
      throw new NotFoundException({ message: 'Contact not found.' });
    }
    return { data: { deleted: true, contactId: deleted.id } };
  }

  private getSession(req: Request) {
    const sessionId = extractSessionIdFromCookieHeader(req.headers.cookie);
    const session = this.sessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException({ message: 'Authentication required.' });
    }
    return session;
  }

  private validatePayload(body: Partial<CreateSchoolContactDto>): CreateSchoolContactDto {
    const name = body.name?.trim();
    const role = body.role?.trim();
    const email = body.email?.trim().toLowerCase() || undefined;
    const phone = body.phone?.trim() || undefined;
    if (!name || !role) {
      throw new BadRequestException({
        message: 'Required contact fields are missing (name and role).',
        code: 'CONTACT_REQUIRED_FIELDS',
      });
    }
    if (!isContactRole(role)) {
      throw new BadRequestException({
        message: 'Role must be one of teacher, parent, staff, partner.',
        code: 'CONTACT_INVALID_ROLE',
      });
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      throw new BadRequestException({
        message: 'Email must be a valid email address.',
        code: 'CONTACT_INVALID_EMAIL',
      });
    }
    return { name, role, email, phone };
  }
}
