import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { PrivacySummaryComponent } from './privacy-summary.component';

describe('PrivacySummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacySummaryComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders privacy categories in clear language', () => {
    const fixture = TestBed.createComponent(PrivacySummaryComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Privacy data category summary');
    expect(text).toContain('Account and identity data');
    expect(text).toContain('Appointment metadata');
    expect(text).toContain('Image attachments');
    expect(text).toContain('Operational activity records');
    expect(text).toContain('Erasure and restriction request path');
    expect(text).toContain('privacy@school.local');
  });

  it('navigates back to appointments', () => {
    const fixture = TestBed.createComponent(PrivacySummaryComponent);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(navigateSpy).toHaveBeenCalledWith('/appointments');
  });

  it('validates and saves editable profile corrections', () => {
    const fixture = TestBed.createComponent(PrivacySummaryComponent);
    fixture.detectChanges();

    fixture.componentInstance.profileForm.setValue({
      displayName: 'Teacher Updated',
      contactEmail: 'teacher.updated@school.local',
    });
    fixture.componentInstance.saveProfile();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Profile corrections saved.');
    expect(fixture.componentInstance.profileForm.value.displayName).toBe('Teacher Updated');
    expect(fixture.componentInstance.profileForm.value.contactEmail).toBe('teacher.updated@school.local');
  });

  it('records auditable initiation when invoking erasure request path', () => {
    const fixture = TestBed.createComponent(PrivacySummaryComponent);
    fixture.detectChanges();

    fixture.componentInstance.initiatePrivacyRequest('erasure');
    expect(fixture.componentInstance.privacyRequestMessage).toContain('Erasure request initiation recorded');
    expect(fixture.componentInstance.privacyRequestMessage).toContain('reference:');
  });
});
