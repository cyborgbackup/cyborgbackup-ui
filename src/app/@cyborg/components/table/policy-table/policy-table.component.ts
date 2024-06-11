import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {PoliciesService} from '../../../services';
import {LongDatePipe} from '../../../pipes';
import {Page} from '../page';

@Component({
    selector: 'cbg-policy-table',
    templateUrl: './policy-table.component.html',
    styleUrls: ['./policy-table.component.scss']
})
export class PolicyTableComponent implements OnInit {
    @ViewChild('actionButtons', {static: true}) actionButtons: TemplateRef<any>;
    @ViewChild('enabledButton', {static: true}) enabledButton: TemplateRef<any>;
    @ViewChild('confirmationDialog', {static: true}) confirmationDialog: TemplateRef<any>;
    page = new Page();
    policies = [];
    columns = [];

    constructor(private router: Router,
                private policiesService: PoliciesService,
                private dialogService: NbDialogService,
                private toastrService: NbToastrService) {
        this.page.pageNumber = 0;
        this.page.size = 50;
    }

    toggleEnabled(item): void {
        item.enabled = !item.enabled;
        this.policiesService.patch(item.id, {enabled: item.enabled}).subscribe(() => {
        });
    }

    setPage(pageInfo) {
        this.policiesService.fetch(this.page.size, pageInfo.offset + 1).subscribe((response) => {
            this.policies = response.results;
            this.page.totalElements = response.count;
        });
    }

    viewPolicy(item): void {
        this.router.navigate(['/policy/edit/' + item.id + '/']);
    }

    launchPolicy(item): void {
        this.policiesService.launch(item.id).subscribe((res) => {
            if (res) {
                this.toastrService.show('', 'Policy Job Launched', {
                    position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                    status: 'success'
                });
            }
        }, (err) => {
            this.toastrService.show(err, 'Error on Policy launch', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    deletePolicy(item): void {
        this.dialogService.open(this.confirmationDialog, {
            context: 'Confirm the deletion of policy ' + item.name
        }).onClose.subscribe((res) => {
            if (res) {
                this.policiesService.delete(item.id).subscribe(() => {
                    this.toastrService.show('', 'Policy deleted', {
                        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                        status: 'success'
                    });
                    const index = this.policies.indexOf(item);
                    if (index > -1) {
                        const temp = [...this.policies];
                        temp.splice(index, 1);
                        this.policies = temp;
                    }
                });
            }
        });
    }

    goToAddPolicy(): void {
        this.router.navigate(['/policy/add']);
    }

    ngOnInit() {
        this.columns = [
            {prop: 'id', name: '#', flexGrow: 1},
            {prop: 'name', name: 'Name', flexGrow: 2},
            {prop: 'summary_fields.schedule.name', name: 'Schedule', flexGrow: 2},
            {prop: 'summary_fields.repository.name', name: 'Repository', flexGrow: 2},
            {prop: 'next_run', name: 'Next Run', pipe: new LongDatePipe(), flexGrow: 2},
            {prop: 'enabled', cellTemplate: this.enabledButton, flexGrow: 1},
            {name: '', cellTemplate: this.actionButtons, flexGrow: 1}
        ];
        this.setPage({offset: 0});
    }

}
