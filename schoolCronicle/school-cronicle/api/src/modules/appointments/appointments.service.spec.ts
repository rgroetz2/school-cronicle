import { describe, expect, it } from 'vitest';
import { AppointmentDraft } from './appointment.types';
import { AppointmentsService, buildChronicleSectionLines } from './appointments.service';

function buildDraft(printableImageNames: string[]): AppointmentDraft {
  return {
    id: 'draft-1',
    teacherId: 'teacher-1',
    schoolId: 'school-1',
    title: 'Chronicle item',
    appointmentDate: '2026-09-01',
    category: 'special_event',
    notes: 'Narrative',
    status: 'submitted',
    createdAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    participants: [
      { contactId: 'c-1', name: 'Alex Parent', role: 'parent' },
    ],
    images: printableImageNames.map((name, idx) => ({
      id: `img-${idx + 1}`,
      name,
      mimeType: 'image/png',
      dataUrl: 'data:image/png;base64,AAAA',
      addedAt: new Date().toISOString(),
      printableInChronicle: true,
    })),
  };
}

describe('buildChronicleSectionLines fixed layout', () => {
  it('keeps 3 image slots for 0..3 printable images', () => {
    const zero = buildChronicleSectionLines(buildDraft([]));
    const one = buildChronicleSectionLines(buildDraft(['one.png']));
    const two = buildChronicleSectionLines(buildDraft(['one.png', 'two.png']));
    const three = buildChronicleSectionLines(buildDraft(['one.png', 'two.png', 'three.png']));

    const slotLines = (lines: string[]) => lines.filter((line) => line.startsWith('Image slot'));
    expect(slotLines(zero)).toEqual([
      'Image slot 1: [empty]',
      'Image slot 2: [empty]',
      'Image slot 3: [empty]',
    ]);
    expect(slotLines(one)).toEqual([
      'Image slot 1: one.png',
      'Image slot 2: [empty]',
      'Image slot 3: [empty]',
    ]);
    expect(slotLines(two)).toEqual([
      'Image slot 1: one.png',
      'Image slot 2: two.png',
      'Image slot 3: [empty]',
    ]);
    expect(slotLines(three)).toEqual([
      'Image slot 1: one.png',
      'Image slot 2: two.png',
      'Image slot 3: three.png',
    ]);
  });
});

describe('markdown export deterministic contract', () => {
  it('produces stable output regardless input id order', () => {
    const service = new AppointmentsService();
    const draftA = service.createDraft('teacher-1', 'school-1', {
      title: 'B Appointment',
      appointmentDate: '2026-08-10',
      category: 'meeting',
      notes: '',
    });
    const draftB = service.createDraft('teacher-1', 'school-1', {
      title: 'A Appointment',
      appointmentDate: '2026-08-09',
      category: 'meeting',
      notes: '',
    });
    service.setParticipantsForTeacher('teacher-1', draftA.id, [
      { contactId: 'c2', name: 'Beta Parent', role: 'parent' },
      { contactId: 'c1', name: 'Alpha Parent', role: 'parent' },
    ]);
    service.setParticipantsForTeacher('teacher-1', draftB.id, [
      { contactId: 'c3', name: 'Gamma Parent', role: 'parent' },
    ]);
    service.attachImageToDraftForTeacher('teacher-1', draftA.id, {
      name: 'zeta.png',
      mimeType: 'image/png',
      dataUrl: 'data:image/png;base64,AAAA',
    });
    service.attachImageToDraftForTeacher('teacher-1', draftA.id, {
      name: 'alpha.png',
      mimeType: 'image/png',
      dataUrl: 'data:image/png;base64,BBBB',
    });
    service.submitDraftForTeacher('teacher-1', draftA.id);
    service.submitDraftForTeacher('teacher-1', draftB.id);

    const exportOne = service.exportChronicleMarkdownForTeacher('teacher-1', [draftA.id, draftB.id]);
    const exportTwo = service.exportChronicleMarkdownForTeacher('teacher-1', [draftB.id, draftA.id]);
    const markdownOne = Buffer.from(exportOne.base64, 'base64').toString('utf8');
    const markdownTwo = Buffer.from(exportTwo.base64, 'base64').toString('utf8');

    expect(markdownOne).toEqual(markdownTwo);
    expect(exportOne.exportedAppointmentIds).toEqual(exportTwo.exportedAppointmentIds);
    expect(markdownOne.indexOf('### A Appointment')).toBeLessThan(markdownOne.indexOf('### B Appointment'));
    expect(markdownOne.indexOf('file=alpha.png')).toBeLessThan(markdownOne.indexOf('file=zeta.png'));
    expect(markdownOne.indexOf('name=Alpha Parent')).toBeLessThan(markdownOne.indexOf('name=Beta Parent'));
  });

  it('never serializes data urls/base64 payloads in markdown media lines', () => {
    const service = new AppointmentsService();
    const draft = service.createDraft('teacher-1', 'school-1', {
      title: 'Media safety',
      appointmentDate: '2026-08-11',
      category: 'meeting',
      notes: '',
    });
    service.attachImageToDraftForTeacher('teacher-1', draft.id, {
      name: 'proof.png',
      mimeType: 'image/png',
      dataUrl: 'data:image/png;base64,AAAABBBBCCCC',
    });
    service.submitDraftForTeacher('teacher-1', draft.id);

    const artifact = service.exportChronicleMarkdownForTeacher('teacher-1', [draft.id]);
    const markdown = Buffer.from(artifact.base64, 'base64').toString('utf8');
    expect(markdown).toContain('file=proof.png; mime=image/png; printable=no');
    expect(markdown).not.toContain('data:image/');
    expect(markdown).not.toContain('AAAABBBBCCCC');
  });
});
