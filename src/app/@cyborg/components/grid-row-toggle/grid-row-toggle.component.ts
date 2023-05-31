import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NbTreeGridCellDirective} from '@nebular/theme';

@Component({
  selector: 'cbg-grid-row-toggle',
  templateUrl: './grid-row-toggle.component.html',
  styleUrls: ['./grid-row-toggle.component.scss']
})
export class GridRowToggleComponent {
  @Input() type: string;
  @Output()
      // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onExpand: EventEmitter<any> = new EventEmitter();
  private expandedValue: boolean;

  constructor(private cell: NbTreeGridCellDirective) {}

  get expanded(): boolean {
    return this.expandedValue;
  }

  @Input()
  set expanded(value: boolean) {
    this.expandedValue = value;
  }

  @HostListener('click', ['$event'])
  toggleRow($event) {
    this.onExpand.emit(this.cell);
    this.cell.toggleRow();
    $event.stopPropagation();
  }
}
