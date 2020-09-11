import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {RepositoriesService} from '../../../services';
import {Page} from '../page';

@Component({
  selector: 'cbg-repository-table',
  templateUrl: './repository-table.component.html',
  styleUrls: ['./repository-table.component.scss']
})
export class RepositoryTableComponent implements OnInit {
  @ViewChild('actionButtons', { static: true }) actionButtons: TemplateRef<any>;
  @ViewChild('enabledButton', { static: true }) enabledButton: TemplateRef<any>;
  @ViewChild('confirmationDialog', { static: true }) confirmationDialog: TemplateRef<any>;
  page = new Page();
  repositories = [];
  columns = [];

  constructor(private router: Router,
              private repositoriesService: RepositoriesService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) {
    this.page.pageNumber = 0;
    this.page.size = 50;
  }

  toggleEnabled(item): void {
    item.enabled = !item.enabled;
    this.repositoriesService.patch(item.id, {enabled: item.enabled}).subscribe((res) => {});
  }

  setPage(pageInfo) {
    this.repositoriesService.fetch(this.page.size, pageInfo.offset + 1).subscribe((response) => {
      this.repositories = response.results;
      this.page.totalElements = response.count;
    });
  }

  viewRepository(item): void {
    this.router.navigate(['/repository/edit/' + item.id + '/']);
  }

  deleteRepository(item): void {
    this.dialogService.open(this.confirmationDialog, {
      context: 'Confirm the deletion of repository ' + item.name
    }).onClose.subscribe((res) => {
      if (res) {
        this.repositoriesService.delete(item.id).subscribe((response) => {
          this.toastrService.show('', 'Repository deleted', {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            status: 'success'
          });
          const index = this.repositories.indexOf(item);
          if (index > -1 ) {
            const temp = [...this.repositories];
            temp.splice(index, 1);
            this.repositories = temp;
          }
        });
      }
    });
  }

  goToAddRepository(): void {
    this.router.navigate(['/repository/add']);
  }

  ngOnInit() {
    this.columns = [
      { prop: 'id', name: '#', flexGrow: 1 },
      { prop: 'name', name: 'Name', flexGrow: 2 },
      { prop: 'path', name: 'Path', flexGrow: 3},
      { prop: 'enabled', cellTemplate: this.enabledButton, flexGrow: 1 },
      { name: '', cellTemplate: this.actionButtons, flexGrow: 1 }
    ];
    this.setPage({ offset: 0 });
  }

}
