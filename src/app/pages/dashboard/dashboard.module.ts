import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import {CyborgModule} from "../../@cyborg/cyborg.module";

@NgModule({
    imports: [
        NbCardModule,
        ThemeModule,
        CyborgModule,
    ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
