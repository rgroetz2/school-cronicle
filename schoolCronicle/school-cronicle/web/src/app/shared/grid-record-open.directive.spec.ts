import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GridRecordOpenDirective } from './grid-record-open.directive';

@Component({
  standalone: true,
  imports: [GridRecordOpenDirective],
  template: `
    <td appGridRecordOpen [recordId]="'r-1'" (recordOpen)="onOpen($event)">Cell</td>
  `,
})
class HostComponent {
  openedId: string | null = null;

  onOpen(id: string): void {
    this.openedId = id;
  }
}

describe('GridRecordOpenDirective', () => {
  it('emits record id on double click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const cell = fixture.nativeElement.querySelector('td') as HTMLTableCellElement;
    cell.dispatchEvent(new MouseEvent('dblclick'));
    fixture.detectChanges();

    expect(fixture.componentInstance.openedId).toBe('r-1');
  });
});
