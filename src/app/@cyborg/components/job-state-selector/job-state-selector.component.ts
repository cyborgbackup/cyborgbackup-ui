import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'cbg-job-state-selector',
  templateUrl: './job-state-selector.component.html',
  styleUrls: ['./job-state-selector.component.scss']
})
export class JobStateSelectorComponent implements OnInit {
  @Output() change: EventEmitter<any> = new EventEmitter();
  items = [
    {id: 1, name: 'New'},
    {id: 2, name: 'Running'},
    {id: 3, name: 'Failed'},
    {id: 4, name: 'Successful'},
    {id: 5, name: 'Error'},
    {id: 6, name: 'Canceled'},
    {id: 7, name: 'Waiting'},
    {id: 8, name: 'Pending'},
  ];
  selected = [
    {id: 1, name: 'New'},
    {id: 2, name: 'Running'},
    {id: 3, name: 'Failed'},
    {id: 4, name: 'Successful'},
    {id: 5, name: 'Error'},
    {id: 6, name: 'Canceled'},
    {id: 7, name: 'Waiting'},
    {id: 8, name: 'Pending'},
  ];

  onChange($event): void {
    this.change.emit($event);
  }

  constructor() { }

  ngOnInit() {
  }

}
