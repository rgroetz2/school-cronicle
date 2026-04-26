import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthApiService } from '../../core/auth-api.service';
import { SchoolPersonalComponent } from './school-personal.component';

describe('SchoolPersonalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolPersonalComponent],
      providers: [
        {
          provide: AuthApiService,
          useValue: {
            getSessionContext: () =>
              of({
                authenticated: true,
                teacherId: 'teacher-1',
                email: 'teacher@school.local',
                role: 'admin' as const,
              }),
            listSchoolPersonalJobRoles: () => ['teacher', 'assistant', 'supporter', 'other'] as const,
            listSchoolPersonal: () =>
              of([
                {
                  id: 'sp-1',
                  teacherId: 'teacher-1',
                  schoolId: 'school-1',
                  name: 'Teacher Account',
                  role: 'user' as const,
                  jobRole: 'teacher' as const,
                  class: '8A',
                  startDate: '2026-01-15',
                  createdAt: '2026-01-01T00:00:00.000Z',
                  updatedAt: '2026-01-01T00:00:00.000Z',
                },
              ]),
            createSchoolPersonal: () =>
              of({
                id: 'sp-new',
                teacherId: 'teacher-2',
                schoolId: 'school-1',
                name: 'New Teacher',
                role: 'user' as const,
                jobRole: 'assistant' as const,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
              }),
            updateSchoolPersonal: () =>
              of({
                id: 'sp-1',
                teacherId: 'teacher-1',
                schoolId: 'school-1',
                name: 'Teacher Account Updated',
                role: 'user' as const,
                jobRole: 'teacher' as const,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-02T00:00:00.000Z',
              }),
          } satisfies Pick<
            AuthApiService,
            | 'getSessionContext'
            | 'listSchoolPersonalJobRoles'
            | 'listSchoolPersonal'
            | 'createSchoolPersonal'
            | 'updateSchoolPersonal'
          >,
        },
      ],
    }).compileComponents();
  });

  it('renders school-personal grid and opens editor on double click', () => {
    const fixture = TestBed.createComponent(SchoolPersonalComponent);
    fixture.detectChanges();

    const cell = (fixture.nativeElement as HTMLElement).querySelector('tbody td') as HTMLTableCellElement;
    cell.dispatchEvent(new MouseEvent('dblclick'));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('School-personal list');
    expect(text).toContain('Edit profile');
    expect(text).toContain('SAVE');
    expect(text).toContain('CANCEL');
  });
});
