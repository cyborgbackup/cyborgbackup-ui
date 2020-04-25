import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NbTreeGridCellDirective} from '@nebular/theme';

@Component({
  selector: 'cbg-grid-row-toggle',
  templateUrl: './grid-row-toggle.component.html',
  styleUrls: ['./grid-row-toggle.component.scss']
})
export class GridRowToggleComponent {
  @Input() type: string;
  private expandedValue: boolean;

  @Input()
  set expanded(value: boolean) {
    this.expandedValue = value;
  }
  get expanded(): boolean {
    return this.expandedValue;
  }

  @Output()
  onExpand: EventEmitter<any> = new EventEmitter();

  @HostListener('click', ['$event'])
  toggleRow($event) {
    this.onExpand.emit(this.cell);
    this.cell.toggleRow();
    $event.stopPropagation();
  }

  constructor(private cell: NbTreeGridCellDirective) {}
}
