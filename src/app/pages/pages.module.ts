import { NgModule } from '@angular/core';
import {NbMenuModule, NbTreeGridModule} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import {CatalogDetailComponent} from './catalog/catalog-detail.component';
import { ClientListComponent, ClientDetailComponent } from './client/';
import { JobListComponent, JobDetailComponent } from './job/';
import { PolicyListComponent, PolicyDetailComponent } from './policy';
import { RepositoryListComponent, RepositoryDetailComponent } from './repository';
import { ScheduleListComponent, ScheduleDetailComponent } from './schedule';
import { SettingComponent } from './setting/setting.component';
import { UserListComponent, UserDetailComponent } from './user';
import { ProfileComponent } from './profile/profile.component';
import { CyborgModule} from '../@cyborg/cyborg.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    CyborgModule,
    NbMenuModule,
    DashboardModule,
  ],
  declarations: [
    PagesComponent,
    CatalogDetailComponent,
    JobListComponent,
    JobDetailComponent,
    ClientListComponent,
    ClientDetailComponent,
    PolicyListComponent,
    PolicyDetailComponent,
    RepositoryListComponent,
    RepositoryDetailComponent,
    ScheduleListComponent,
    ScheduleDetailComponent,
    SettingComponent,
    UserListComponent,
    UserDetailComponent,
    ProfileComponent,
  ],
})
export class PagesModule {
}
