import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthApiService } from '../../core/auth-api.service';
import { SchoolComponent } from './school.component';

describe('SchoolComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolComponent],
      providers: [
        {
          provide: AuthApiService,
          useValue: {
            getSessionContext: () =>
              of({
                authenticated: true,
                teacherId: 'teacher-1',
                email: 'admin@school.local',
                role: 'admin' as const,
              }),
            listSchools: () =>
              of([
                {
                  id: 'school-1',
                  schoolId: 'school-1',
                  name: 'Primary School North',
                  type: 'public',
                  address: 'Musterstrasse 10, 8000 Zurich',
                  description: 'Main school site',
                  comment: '',
                  createdAt: '2026-01-01T00:00:00.000Z',
                  updatedAt: '2026-01-01T00:00:00.000Z',
                },
              ]),
            createSchool: () =>
              of({
                id: 'school-2',
                schoolId: 'school-1',
                name: 'Secondary School West',
                type: 'private',
                address: 'Schulgasse 2, 8001 Zurich',
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
              }),
            updateSchool: () =>
              of({
                id: 'school-1',
                schoolId: 'school-1',
                name: 'Primary School North Updated',
                type: 'public',
                address: 'Musterstrasse 10, 8000 Zurich',
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-02T00:00:00.000Z',
              }),
          } satisfies Pick<AuthApiService, 'getSessionContext' | 'listSchools' | 'createSchool' | 'updateSchool'>,
        },
      ],
    }).compileComponents();
  });

  it('renders school grid and opens editor on double click', () => {
    const fixture = TestBed.createComponent(SchoolComponent);
    fixture.detectChanges();

    const cell = (fixture.nativeElement as HTMLElement).querySelector('tbody td') as HTMLTableCellElement;
    cell.dispatchEvent(new MouseEvent('dblclick'));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('School list');
    expect(text).toContain('Edit school');
    expect(text).toContain('SAVE');
    expect(text).toContain('CANCEL');
  });
});
