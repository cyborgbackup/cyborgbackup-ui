import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {ClientsService} from '../../../services';
import {Page} from '../page';

@Component({
  selector: 'cbg-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss']
})
export class ClientTableComponent implements OnInit {
  @ViewChild('actionButtons', { static: true }) actionButtons: TemplateRef<any>;
  @ViewChild('enabledButton', { static: true }) enabledButton: TemplateRef<any>;
  @ViewChild('confirmationDialog', { static: true }) confirmationDialog: TemplateRef<any>;
  page = new Page();
  clients = [];
  columns = [];

  constructor(private router: Router,
              private clientsService: ClientsService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) {
    this.page.pageNumber = 0;
    this.page.size = 50;
  }

  toggleEnabled(item): void {
    item.enabled = !item.enabled;
    this.clientsService.patch(item.id, {enabled: item.enabled}).subscribe((res) => {});
  }

  setPage(pageInfo) {
    this.clientsService.fetch(this.page.size, pageInfo.offset + 1).subscribe((response) => {
      this.clients = response.results;
      this.page.totalElements = response.count;
    });
  }

  viewClient(item): void {
    this.router.navigate(['/client/edit/' + item.id + '/']);
  }

  deleteClient(item): void {
    this.dialogService.open(this.confirmationDialog, {
      context: 'Confirm the deletion of client ' + item.name
    }).onClose.subscribe((res) => {
      if (res) {
        this.clientsService.delete(item.id).subscribe((response) => {
          this.toastrService.show('', 'Client deleted', {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            status: 'success'
          });
          const index = this.clients.indexOf(item);
          if (index > -1 ) {
            const temp = [...this.clients];
            temp.splice(index, 1);
            this.clients = temp;
          }
        });
      }
    });
  }

  goToAddClient(): void {
    this.router.navigate(['/client/add']);
  }

  ngOnInit() {
    this.columns = [
      { prop: 'id', name: '#' },
      { prop: 'hostname', name: 'Hostname' },
      { prop: 'version', name: 'Version' },
      { prop: 'ips', name: 'IPs' },
      { prop: 'enabled', cellTemplate: this.enabledButton },
      { name: '', cellTemplate: this.actionButtons }
    ];
    this.setPage({ offset: 0 });
  }

}
