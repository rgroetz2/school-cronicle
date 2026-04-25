import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-crud-action-bar',
  standalone: true,
  styleUrl: './crud-action-bar.component.css',
  template: `
    <div class="crud-action-bar" role="group" [attr.aria-label]="ariaLabel">
      @if (showCreate) {
        <button type="button" class="crud-primary" [disabled]="createDisabled" (click)="createClicked.emit()">
          {{ createLabel }}
        </button>
      }
      @if (showSave) {
        <button type="button" class="crud-primary" [disabled]="saveDisabled" (click)="saveClicked.emit()">
          {{ saveLabel }}
        </button>
      }
      <ng-content select="[crud-secondary]"></ng-content>
      @if (showDelete) {
        <button type="button" class="crud-danger" [disabled]="deleteDisabled" (click)="deleteClicked.emit()">
          {{ deleteLabel }}
        </button>
      }
    </div>
  `,
})
export class CrudActionBarComponent {
  @Input() ariaLabel = 'CRUD action controls';
  @Input() showCreate = false;
  @Input() showSave = false;
  @Input() showDelete = false;
  @Input() createDisabled = false;
  @Input() saveDisabled = false;
  @Input() deleteDisabled = false;
  @Input() createLabel = 'Create';
  @Input() saveLabel = 'Save';
  @Input() deleteLabel = 'Delete';

  @Output() readonly createClicked = new EventEmitter<void>();
  @Output() readonly saveClicked = new EventEmitter<void>();
  @Output() readonly deleteClicked = new EventEmitter<void>();
}
