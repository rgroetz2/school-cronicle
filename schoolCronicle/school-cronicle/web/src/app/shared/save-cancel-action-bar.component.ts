import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-save-cancel-action-bar',
  standalone: true,
  template: `
    <div class="save-cancel-bar" [attr.aria-label]="ariaLabel">
      <button type="button" class="primary" (click)="saveClicked.emit()" [disabled]="saveDisabled">
        {{ saveLabel }}
      </button>
      <button type="button" class="ghost" (click)="cancelClicked.emit()" [disabled]="cancelDisabled">
        {{ cancelLabel }}
      </button>
    </div>
  `,
  styles: `
    .save-cancel-bar {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 0.75rem;
    }

    .primary,
    .ghost {
      border-radius: 0.6rem;
      padding: 0.5rem 0.8rem;
      border: 1px solid var(--border);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .primary {
      background: #1d4ed8;
      color: #fff;
      border-color: #1d4ed8;
    }

    .ghost {
      background: #fff;
    }
  `,
})
export class SaveCancelActionBarComponent {
  @Input() ariaLabel = 'CRUD actions';
  @Input() saveLabel = 'SAVE';
  @Input() cancelLabel = 'CANCEL';
  @Input() saveDisabled = false;
  @Input() cancelDisabled = false;

  @Output() saveClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();
}
