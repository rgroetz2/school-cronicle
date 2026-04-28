import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appGridRecordOpen]',
  standalone: true,
})
export class GridRecordOpenDirective {
  @Input({ required: true }) recordId = '';
  @Output() recordOpen = new EventEmitter<string>();

  @HostBinding('attr.tabindex') tabindex = '0';
  @HostBinding('attr.role') role = 'button';

  @HostListener('dblclick')
  onDoubleClick(): void {
    this.emitOpen();
  }

  @HostListener('keydown.enter')
  onEnterKey(): void {
    this.emitOpen();
  }

  private emitOpen(): void {
    if (!this.recordId) {
      return;
    }
    this.recordOpen.emit(this.recordId);
  }
}
