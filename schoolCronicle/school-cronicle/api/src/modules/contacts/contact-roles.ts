import { CONTACT_ROLES, ContactRole } from './contact.types';

export function isContactRole(value: string): value is ContactRole {
  return CONTACT_ROLES.includes(value as ContactRole);
}
