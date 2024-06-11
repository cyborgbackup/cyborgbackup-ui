import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {JobsService} from '../../../services';
import {Router} from '@angular/router';
import {WebsocketService} from '../../../../websocket.service';
import {Page} from '../page';

@Component({
    selector: 'cbg-job-table',
    templateUrl: './job-table.component.html',
    styleUrls: ['./job-table.component.scss']
})
export class JobTableComponent implements OnInit {
    @ViewChild('jobStatus', {static: true}) jobStatus: TemplateRef<any>;
    @ViewChild('actionButtons', {static: true}) actionButtons: TemplateRef<any>;
    @ViewChild('jobsStateSelector', {static: true}) jobsStateSelector: any;
    page = new Page();
    loading = false;
    needReload = false;

    jobs = [];

    columns = [];

    constructor(private jobsService: JobsService,
                private router: Router,
                private websocketService: WebsocketService) {
        this.page.pageNumber = 0;
        this.page.size = 50;
    }

    viewJobResults(item): void {
        this.router.navigate(['/job/detail/' + item.id]);
    }

    cancelItem(item): void {
        console.log('tutu');
        console.log(item);
    }

    onChange(): void {
        this.setPage({offset: this.page.pageNumber});
    }

    setPage(pageInfo) {
        this.loading = true;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const status = {status__in: this.jobsStateSelector.selected.map((e) => e.name.toLowerCase()).join(',')};
        this.jobsService.fetch(this.page.size, pageInfo.offset + 1, status).subscribe((response) => {
            this.jobs = response.results;
            this.page.totalElements = response.count;
            this.loading = false;
            if (this.needReload) {
                this.needReload = false;
                this.setPage({offset: this.page.pageNumber});
            }
        });
    }

    ngOnInit() {
        this.columns = [
            {prop: 'status', name: '', cellTemplate: this.jobStatus, flexGrow: 0.2},
            {prop: 'id', name: 'ID', flexGrow: 0.2},
            {prop: 'name', name: 'Name', flexGrow: 4},
            {prop: 'summary_fields.policy.name', name: 'Policy', flexGrow: 1},
            {prop: 'summary_fields.policy.policy_type', name: 'Type', flexGrow: 0.5},
            {prop: 'finished', name: 'Finished', flexGrow: 1.5},
            {name: '', cellTemplate: this.actionButtons, flexGrow: 0.5}
        ];
        this.setPage({offset: 0});
        this.websocketService.connect().subscribe((messages) => {
            if (messages.group_name === 'jobs') {
                if (!this.loading) {
                    this.setPage({offset: this.page.pageNumber});
                } else {
                    this.needReload = true;
                }
            }
        }, (err) => console.log(err));
    }

}
