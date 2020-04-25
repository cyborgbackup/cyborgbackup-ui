import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {SchedulesService} from '../../../services';
import {Page} from '../page';

@Component({
  selector: 'cbg-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.scss']
})
export class ScheduleTableComponent implements OnInit {
  @ViewChild('actionButtons', { static: true }) actionButtons: TemplateRef<any>;
  @ViewChild('enabledButton', { static: true }) enabledButton: TemplateRef<any>;
  @ViewChild('confirmationDialog', { static: true }) confirmationDialog: TemplateRef<any>;
  page = new Page();
  schedules = [];
  columns = [];

  constructor(private router: Router,
              private schedulesService: SchedulesService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) {
    this.page.pageNumber = 0;
    this.page.size = 50;
  }

  toggleEnabled(item): void {
    item.enabled = !item.enabled;
    this.schedulesService.patch(item.id, {enabled: item.enabled}).subscribe((res) => {});
  }

  setPage(pageInfo) {
    this.schedulesService.fetch(this.page.size, pageInfo.offset + 1).subscribe((response) => {
      this.schedules = response.results;
      this.page.totalElements = response.count;
    });
  }

  viewSchedule(item): void {
    this.router.navigate(['/schedule/edit/' + item.id + '/']);
  }

  deleteSchedule(item): void {
    this.dialogService.open(this.confirmationDialog, {
      context: 'Confirm the deletion of schedule ' + item.name
    }).onClose.subscribe((res) => {
      if (res) {
        this.schedulesService.delete(item.id).subscribe((response) => {
          this.toastrService.show('', 'Schedule deleted', {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            status: 'success'
          });
          const index = this.schedules.indexOf(item);
          if (index > -1 ) {
            const temp = [...this.schedules];
            temp.splice(index, 1);
            this.schedules = temp;
          }
        });
      }
    });
  }

  goToAddSchedule(): void {
    this.router.navigate(['/schedule/add']);
  }

  ngOnInit() {
    this.columns = [
      { prop: 'id', name: '#' },
      { prop: 'name', name: 'Name' },
      { prop: 'crontab', name: 'Schedule' },
      { prop: 'enabled', cellTemplate: this.enabledButton },
      { name: '', cellTemplate: this.actionButtons }
    ];
    this.setPage({ offset: 0 });
  }

}
