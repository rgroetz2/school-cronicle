import type { AppointmentDraft, TeacherProfile } from './auth-api.service';

/** Bump when seed shape changes so presenters can confirm reset. */
export const DEMO_SEED_VERSION = '2026.04.23.1';

const DEMO_TEACHER_ID = 'teacher-1';
const DEMO_SCHOOL_ID = 'school-1';

const created = '2026-04-01T08:00:00.000Z';
const submittedAt = '2026-05-20T14:00:00.000Z';

/**
 * Deterministic in-browser demo dataset for dummy-session (localStorage) flows.
 * Covers draft vs submitted, optional metadata for filters, needs-attention, and ready-to-submit.
 */
export function buildDemoSeedDrafts(): AppointmentDraft[] {
  return [
    {
      id: 'demo-seed-submitted-1',
      teacherId: DEMO_TEACHER_ID,
      schoolId: DEMO_SCHOOL_ID,
      title: 'Demo: Submitted consult',
      appointmentDate: '2026-06-01',
      category: 'consultation',
      notes: `Demo dataset ${DEMO_SEED_VERSION} — submitted path.`,
      classGrade: '5A',
      guardianName: 'Rivera',
      location: 'Conference room B',
      status: 'submitted',
      createdAt: created,
      submittedAt,
      images: [],
    },
    {
      id: 'demo-seed-ready-1',
      teacherId: DEMO_TEACHER_ID,
      schoolId: DEMO_SCHOOL_ID,
      title: 'Demo: Ready to submit',
      appointmentDate: '2026-06-10',
      category: 'meeting',
      notes: `Demo dataset ${DEMO_SEED_VERSION} — complete required metadata.`,
      classGrade: '3A',
      guardianName: 'Nguyen',
      location: 'Room 204',
      status: 'draft',
      createdAt: created,
      images: [
        {
          id: 'demo-seed-img-1',
          name: 'agenda.png',
          mimeType: 'image/png',
          dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          addedAt: '2026-04-01T09:00:00.000Z',
        },
      ],
    },
    {
      id: 'demo-seed-attention-1',
      teacherId: DEMO_TEACHER_ID,
      schoolId: DEMO_SCHOOL_ID,
      title: 'Demo: Needs metadata',
      appointmentDate: '',
      category: '',
      notes: `Demo dataset ${DEMO_SEED_VERSION} — incomplete for needs-attention.`,
      classGrade: '4C',
      guardianName: '',
      location: '',
      status: 'draft',
      createdAt: created,
      images: [],
    },
    {
      id: 'demo-seed-filters-1',
      teacherId: DEMO_TEACHER_ID,
      schoolId: DEMO_SCHOOL_ID,
      title: 'Demo: Progress check-in',
      appointmentDate: '2026-06-15',
      category: 'progress',
      notes: 'Optional metadata for filter demos.',
      classGrade: '6B',
      guardianName: 'Patel',
      location: 'Library',
      status: 'draft',
      createdAt: created,
      images: [],
    },
  ];
}

export function buildDemoSeedProfile(): TeacherProfile {
  return {
    displayName: 'Alex Teacher (demo)',
    contactEmail: 'demo.teacher@school.local',
  };
}
