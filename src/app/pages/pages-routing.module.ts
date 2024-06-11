import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {JobListComponent, JobDetailComponent} from './job';
import {ScheduleListComponent, ScheduleDetailComponent} from './schedule';
import {PolicyListComponent, PolicyDetailComponent} from './policy';
import {SettingComponent} from './setting/setting.component';
import {CatalogDetailComponent} from './catalog/catalog-detail.component';
import {RepositoryListComponent, RepositoryDetailComponent} from './repository/';
import {UserListComponent, UserDetailComponent} from './user';
import {ClientListComponent, ClientDetailComponent} from './client';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
        },
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'catalog',
            component: CatalogDetailComponent,
        },
        {
            path: 'job',
            component: JobListComponent,
        },
        {
            path: 'job/detail/:id',
            component: JobDetailComponent,
        },
        {
            path: 'client',
            component: ClientListComponent,
        },
        {
            path: 'client/add',
            component: ClientDetailComponent,
        },
        {
            path: 'client/edit/:id',
            component: ClientDetailComponent,
        },
        {
            path: 'policy',
            component: PolicyListComponent,
        },
        {
            path: 'policy/add',
            component: PolicyDetailComponent,
        },
        {
            path: 'policy/edit/:id',
            component: PolicyDetailComponent,
        },
        {
            path: 'repository',
            component: RepositoryListComponent,
        },
        {
            path: 'repository/add',
            component: RepositoryDetailComponent,
        },
        {
            path: 'repository/edit/:id',
            component: RepositoryDetailComponent,
        },
        {
            path: 'schedule',
            component: ScheduleListComponent,
        },
        {
            path: 'schedule/add',
            component: ScheduleDetailComponent,
        },
        {
            path: 'schedule/edit/:id',
            component: ScheduleDetailComponent,
        },
        {
            path: 'user',
            component: UserListComponent,
        },
        {
            path: 'user/add',
            component: UserDetailComponent,
        },
        {
            path: 'user/edit/:id',
            component: UserDetailComponent,
        },
        {
            path: 'profile',
            component: ProfileComponent,
        },
        {
            path: 'settings',
            component: SettingComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
