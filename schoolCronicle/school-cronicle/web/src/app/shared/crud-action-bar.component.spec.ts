import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { CrudActionBarComponent } from './crud-action-bar.component';

describe('CrudActionBarComponent', () => {
  let fixture: ComponentFixture<CrudActionBarComponent>;
  let component: CrudActionBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudActionBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudActionBarComponent);
    component = fixture.componentInstance;
  });

  it('renders create and delete controls based on visibility inputs', () => {
    component.showCreate = true;
    component.showSave = false;
    component.showDelete = true;
    component.createLabel = 'Create appointment';
    component.deleteLabel = 'Delete appointment';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.crud-action-bar button'));
    expect(buttons.map((button) => button.nativeElement.textContent.trim())).toEqual([
      'Create appointment',
      'Delete appointment',
    ]);
  });

  it('renders save control in edit mode', async () => {
    const editFixture = TestBed.createComponent(CrudActionBarComponent);
    const editComponent = editFixture.componentInstance;
    editComponent.showCreate = false;
    editComponent.showSave = true;
    editComponent.showDelete = true;
    editComponent.saveLabel = 'Save appointment';
    editComponent.deleteLabel = 'Delete appointment';
    editFixture.detectChanges();

    const buttons = editFixture.debugElement.queryAll(By.css('.crud-action-bar button'));
    expect(buttons.map((button) => button.nativeElement.textContent.trim())).toEqual([
      'Save appointment',
      'Delete appointment',
    ]);
  });

  it('applies disabled state props and emits click events', () => {
    component.showCreate = true;
    component.showSave = false;
    component.showDelete = true;
    component.createDisabled = false;
    component.deleteDisabled = true;
    fixture.detectChanges();
    const createButton = fixture.debugElement.query(By.css('.crud-primary'));
    const deleteButton = fixture.debugElement.query(By.css('.crud-danger'));
    let createCalls = 0;
    let saveCalls = 0;
    let deleteCalls = 0;
    component.createClicked.subscribe(() => createCalls += 1);
    component.saveClicked.subscribe(() => saveCalls += 1);
    component.deleteClicked.subscribe(() => deleteCalls += 1);
    expect(createButton.nativeElement.disabled).toBe(false);
    expect(deleteButton.nativeElement.disabled).toBe(true);

    createButton.nativeElement.click();
    expect(createCalls).toBe(1);
    expect(saveCalls).toBe(0);
    expect(deleteCalls).toBe(0);
  });
});
