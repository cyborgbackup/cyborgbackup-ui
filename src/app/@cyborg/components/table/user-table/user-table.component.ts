import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UsersService} from '../../../services';
import {Router} from '@angular/router';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';
import {Page} from '../page';

@Component({
  selector: 'cbg-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  @ViewChild('actionButtons', { static: true }) actionButtons: TemplateRef<any>;
  @ViewChild('enabledButton', { static: true }) enabledButton: TemplateRef<any>;
  @ViewChild('confirmationDialog', { static: true }) confirmationDialog: TemplateRef<any>;
  page = new Page();
  users = [];
  columns = [];
  user: any;

  constructor(private router: Router,
              private usersService: UsersService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService,
              private authService: NbAuthService) {
    this.page.pageNumber = 0;
    this.page.size = 50;
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
        }
    });
  }

  setPage(pageInfo) {
    this.usersService.fetch(this.page.size, pageInfo.offset + 1).subscribe((response) => {
      this.users = response.results;
      this.page.totalElements = response.count;
    });
  }

  toggleEnabled(item): void {
    item.enabled = !item.enabled;
    this.usersService.patch(item.id, {enabled: item.enabled}).subscribe((res) => {});
  }

  viewUser(item): void {
    console.log('toto');
    this.router.navigate(['/user/edit/' + item.id + '/']);
  }

  deleteUser(item): void {
    this.dialogService.open(this.confirmationDialog, {
      context: 'Confirm the deletion of user ' + item.email
    }).onClose.subscribe((res) => {
      if (res) {
        this.usersService.delete(item.id).subscribe((response) => {
          this.toastrService.show('', 'User deleted', {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            status: 'success'
          });
          const index = this.users.indexOf(item);
          if (index > -1 ) {
            const temp = [...this.users];
            temp.splice(index, 1);
            this.users = temp;
          }
        });
      }
    });
  }

  goToAddUser(): void {
    this.router.navigate(['/user/add']);
  }

  ngOnInit() {
    this.columns = [
      { prop: 'id', name: '#', flexGrow: 1 },
      { prop: 'email', name: 'Email', flexGrow: 2 },
      { prop: 'first_name', name: 'FirstName', flexGrow: 1},
      { prop: 'last_name', name: 'LastName', flexGrow: 1},
      { name: '', cellTemplate: this.actionButtons, flexGrow: 1 }
    ];
    this.setPage({ offset: 0 });
  }

}
