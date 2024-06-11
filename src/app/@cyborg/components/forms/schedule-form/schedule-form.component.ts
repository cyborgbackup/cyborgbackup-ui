import {Component, OnInit, ViewChild} from '@angular/core';
import {SchedulesService} from '../../../services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {CronGenComponent, CronOptions} from '../../cron-editor';

@Component({
    selector: 'cbg-schedule-form',
    templateUrl: './schedule-form.component.html',
    styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
    @ViewChild('cronEditorDemo', {static: false}) cronEditor: CronGenComponent;
    public cronExpression: '* * * * *';
    formSchedule: FormGroup;
    schedule: any;
    scheduleId: number;

    public cronOptions: CronOptions = {
        defaultTime: '00:00:00',
        hideMinutesTab: false,
        hideHourlyTab: false,
        hideDailyTab: false,
        hideWeeklyTab: false,
        hideMonthlyTab: false,
        hideYearlyTab: false,
        hideAdvancedTab: false,
        hideSpecificWeekDayTab: false,
        hideSpecificMonthWeekTab: false,
        use24HourTime: true,
        hideSeconds: false,
        cronFlavor: 'standard',
        formCheckboxClass: '',
        formInputClass: '',
        formRadioClass: '',
        formSelectClass: ''
    };

    constructor(private formBuilder: FormBuilder,
                private schedulesService: SchedulesService,
                private route: ActivatedRoute,
                private toastrService: NbToastrService,
                private router: Router) {
        this.cronExpression = '* * * * *';
        this.schedule = {
            name: '',
            crontab: '* * * * *',
            enabled: false
        };
    }

    ngOnInit() {
        this.formSchedule = this.formBuilder.group({
            name: ['', Validators.required],
            crontab: ['', Validators.required],
            enabled: [false]
        });
        this.formSchedule.patchValue(this.schedule);
        this.route.paramMap.subscribe(params => {
            this.scheduleId = +params.get('id');
            if (this.scheduleId !== 0) {
                this.schedulesService.get(this.scheduleId).subscribe((res) => {
                    this.schedule = res;
                    this.schedule.crontab = this.schedule.crontab.replace(/ \*$/, '');
                    this.formSchedule.patchValue(this.schedule);
                    this.cronExpression = this.schedule.crontab;
                    this.cronEditor.cron = this.schedule.crontab;
                    this.cronEditor.handleModelChange(this.schedule.crontab);
                });
            }
        });
    }

    updateSchedule(data) {
        this.schedulesService.patch(this.scheduleId, data).subscribe(() => {
            this.toastrService.show('', 'Schedule updated', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success'
            });
        }, (err) => {
            this.toastrService.show(err.message, 'Error on Update', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    createSchedule(data) {
        this.schedulesService.post(data).subscribe((res) => {
            this.toastrService.show('', 'Schedule created', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success'
            });
            this.router.navigate(['/schedule/edit/' + res.id + '/']);
            // this.route.
        }, (err) => {
            this.toastrService.show(err.message, 'Error on Create', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    submit() {
        if (this.formSchedule.valid) {
            const data = this.formSchedule.value;
            data.crontab = this.cronEditor.cron + ' *';
            if (this.scheduleId !== 0) {
                this.updateSchedule(this.formSchedule.value);
            } else {
                this.createSchedule(this.formSchedule.value);
            }
        }
    }
}
