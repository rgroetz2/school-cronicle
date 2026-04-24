import { describe, expect, it } from 'vitest';
import { AppointmentDraft } from './appointment.types';
import { buildChronicleSectionLines } from './appointments.service';

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
