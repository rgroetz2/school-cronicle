export const APPOINTMENT_CATEGORIES = ['meeting', 'consultation', 'progress'] as const;

export type AppointmentCategory = (typeof APPOINTMENT_CATEGORIES)[number];

export function isAppointmentCategory(value: string): value is AppointmentCategory {
  return APPOINTMENT_CATEGORIES.includes(value as AppointmentCategory);
}
