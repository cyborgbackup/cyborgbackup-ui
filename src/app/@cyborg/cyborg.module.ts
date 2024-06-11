import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbToggleModule,
    NbSelectModule,
    NbTabsetModule,
    NbTreeGridModule,
    NbIconModule,
    NbAccordionModule,
    NbAutocompleteModule, NbTooltipModule,
    NbListModule, NbContextMenuModule, NbAlertModule, NbCheckboxModule, NbSpinnerModule
} from '@nebular/theme';
import {NgxEchartsModule} from 'ngx-echarts';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CronEditorModule} from './components/cron-editor';

import {
    JobStateSelectorComponent, GridRowToggleComponent,
    JobTableComponent, JobResultComponent, JobOutputComponent,
    ClientTableComponent, ClientFormComponent, CatalogComponent,
    PolicyTableComponent, PolicyFormComponent, DashboardComponent,
    RepositoryTableComponent, RepositoryFormComponent,
    UserTableComponent, UserFormComponent, ProfileFormComponent,
    ScheduleTableComponent, ScheduleFormComponent, SettingsFormComponent,
    LoginComponent, ContextMenuDirective, DialogFormPolicyVMModuleComponent,
    DialogFormPolicyDBModuleComponent
} from './components';
import {
    JobStatePipe, LongDatePipe, HumanSizePipe, SettingNamePipe
} from './pipes';
import {TextFieldModule} from '@angular/cdk/text-field';
import {AutosizeModule} from 'ngx-autosize';

const NB_MODULES = [
    NbCardModule,
    NgSelectModule,
    FormsModule,
    NbButtonModule,
    NbInputModule,
    NbToggleModule,
    NbSelectModule,
    NbTabsetModule,
    NgxDatatableModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CronEditorModule,
    AutosizeModule,
    NbTreeGridModule,
    NbIconModule,
    NbListModule,
    NbContextMenuModule,
    NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
    }),
    FullCalendarModule,
    NbAlertModule,
    NbCheckboxModule,
    NbAutocompleteModule,
    NbTooltipModule,
    NbAccordionModule
];
const PIPES = [
    JobStatePipe,
    LongDatePipe,
    HumanSizePipe,
    SettingNamePipe
];
const COMPONENTS = [
    JobStateSelectorComponent,
    JobTableComponent,
    JobResultComponent,
    JobOutputComponent,
    ClientTableComponent,
    ClientFormComponent,
    PolicyTableComponent,
    PolicyFormComponent,
    RepositoryTableComponent,
    RepositoryFormComponent,
    ScheduleTableComponent,
    ScheduleFormComponent,
    UserTableComponent,
    UserFormComponent,
    CatalogComponent,
    GridRowToggleComponent,
    SettingsFormComponent,
    ProfileFormComponent,
    DashboardComponent,
    LoginComponent,
    ContextMenuDirective,
    DialogFormPolicyDBModuleComponent,
    DialogFormPolicyVMModuleComponent
];
const SERVICES = [];

@NgModule({
    imports: [CommonModule, ...NB_MODULES, TextFieldModule, NbSpinnerModule],
    exports: [CommonModule, ...COMPONENTS, ...PIPES, ...SERVICES],
    declarations: [...COMPONENTS, ...PIPES]
})
export class CyborgModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas);
    }

    static forRoot(): ModuleWithProviders<CyborgModule> {
        return {
            ngModule: CyborgModule,
            providers: [],
        };
    }
}
