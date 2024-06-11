import {
    Component,
    OnInit,
} from '@angular/core';
import {ClientsService, PoliciesService, RepositoriesService, SchedulesService} from '../../../services';
import {DialogFormPolicyDBModuleComponent, DialogFormPolicyVMModuleComponent} from '../../dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';


@Component({
    selector: 'cbg-policy-form',
    templateUrl: './policy-form.component.html',
    styleUrls: ['./policy-form.component.scss']
})
export class PolicyFormComponent implements OnInit {
    formPolicy: FormGroup;
    policy: any;
    policyId: number;

    typesArray: Array<Array<string>>;
    schedules: Array<any>;
    repositories: Array<any>;
    clients: Array<any>;

    constructor(private formBuilder: FormBuilder,
                private policiesService: PoliciesService,
                private schedulesService: SchedulesService,
                private repositoriesService: RepositoriesService,
                private clientsService: ClientsService,
                private route: ActivatedRoute,
                private toastrService: NbToastrService,
                private router: Router,
                private dialogService: NbDialogService) {
        this.typesArray = [];
        this.schedules = [];
        this.repositories = [];
        this.clients = [];
    }

    ngOnInit() {
        this.formPolicy = this.formBuilder.group({
            name: ['', Validators.required],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            policy_type: ['', Validators.required],
            schedule: ['', Validators.required],
            repository: ['', Validators.required],
            clients: [[]],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            extra_vars: [],
            prehook: [''],
            posthook: [''],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            keep_hourly: [{value: null, disabled: true}],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            keep_daily: [{value: null, disabled: true}],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            keep_weekly: [{value: null, disabled: true}],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            keep_monthly: [{value: null, disabled: true}],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            keep_yearly: [{value: null, disabled: true}],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            boolean_keep_hourly: [false],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            boolean_keep_daily: [false],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            boolean_keep_weekly: [false],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            boolean_keep_monthly: [false],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            boolean_keep_yearly: [false],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mode_pull: [false],
            enabled: [false]
        });

        this.route.paramMap.subscribe(params => {
            this.policyId = +params.get('id');
            if (this.policyId !== 0) {
                this.policiesService.get(this.policyId).subscribe((res) => {
                    this.policy = res;
                    this.formPolicy.patchValue(this.policy);
                    if (this.policy.keep_hourly !== null) {
                        this.formPolicy.controls.keep_hourly.enable();
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        this.formPolicy.patchValue({boolean_keep_hourly: true});
                    }
                    if (this.policy.keep_daily !== null) {
                        this.formPolicy.controls.keep_daily.enable();
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        this.formPolicy.patchValue({boolean_keep_daily: true});
                    }
                    if (this.policy.keep_weekly !== null) {
                        this.formPolicy.controls.keep_weekly.enable();
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        this.formPolicy.patchValue({boolean_keep_weekly: true});
                    }
                    if (this.policy.keep_monthly !== null) {
                        this.formPolicy.controls.keep_monthly.enable();
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        this.formPolicy.patchValue({boolean_keep_monthly: true});
                    }
                    if (this.policy.keep_yearly !== null) {
                        this.formPolicy.controls.keep_yearly.enable();
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        this.formPolicy.patchValue({boolean_keep_yearly: true});
                    }
                });
            }
        });
        this.policiesService.options().subscribe((res) => {
            this.typesArray = res.POST.policy_type.choices;
        });
        this.schedulesService.fetch().subscribe((res) => {
            this.schedules = res.results;
        });
        this.repositoriesService.fetch().subscribe((res) => {
            this.repositories = res.results;
        });
        this.clientsService.fetch().subscribe((res) => {
            this.clients = res.results;
        });
    }

    showClientEditor(): boolean {
        return this.formPolicy.value.policy_type === 'proxmox' ||
            this.formPolicy.value.policy_type === 'mysql' ||
            this.formPolicy.value.policy_type === 'postgresql';
    }

    showExtraVars(): boolean {
        return this.formPolicy.value.extra_vars.length > 0 &&
            this.formPolicy.value.policy_type !== 'proxmox' &&
            this.formPolicy.value.policy_type !== 'mysql' &&
            this.formPolicy.value.policy_type !== 'postgresql';
    }

    editClient(event, clientId): void {
        let client = null;
        this.clients.forEach((el) => {
            if (el.id === clientId) {
                client = el;
            }
        });
        let theClass = null;
        if (this.formPolicy.value['policy_type'] === 'proxmox') {
            theClass = DialogFormPolicyVMModuleComponent;
        } else {
            theClass = DialogFormPolicyDBModuleComponent;
        }
        const extraVars = JSON.parse(this.formPolicy.value.extra_vars);
        if (!Object.keys(extraVars).includes('extended_' + this.formPolicy.value['policy_type'])) {
            extraVars['extended_' + this.formPolicy.value['policy_type']] = {};
        }
        const extendedVars = extraVars['extended_' + this.formPolicy.value['policy_type']][client.id];
        this.dialogService.open(theClass, {
            context: {
                client,
                module: this.formPolicy.value['policy_type'],
                vars: extendedVars
            }
        }).onClose.subscribe((res) => {
            if (res) {
                if (!Object.keys(extraVars).includes('extended_' + this.formPolicy.value['policy_type'])) {
                    extraVars['extended_' + this.formPolicy.value['policy_type']] = {};
                }
                extraVars['extended_' + this.formPolicy.value['policy_type']][client.id] = res;
                // eslint-disable-next-line @typescript-eslint/naming-convention
                this.formPolicy.patchValue({extra_vars: JSON.stringify(extraVars, null, 4)});
            }
        });
    }

    updatePolicy(data) {
        this.policiesService.patch(this.policyId, data).subscribe(() => {
            this.toastrService.show('', 'Policy updated', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success'
            });
        }, (err) => {
            this.toastrService.show(err, 'Error on Update', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    createPolicy(data) {
        this.policiesService.post(data).subscribe((res) => {
            this.toastrService.show('', 'Policy created', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success'
            });
            this.router.navigate(['/policy/edit/' + res.id + '/']);
            // this.route.
        }, (err) => {
            this.toastrService.show(err, 'Error on Create', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    submit() {
        if (this.formPolicy.valid) {
            if (this.policyId !== 0) {
                this.updatePolicy(this.formPolicy.getRawValue());
            } else {
                this.createPolicy(this.formPolicy.getRawValue());
            }
        }
    }

    changeType(model): void {
        if (model === 'mysql' || model === 'postgresql') {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.formPolicy.patchValue({extra_vars: '{\n"user":"",\n"password": ""\n}'});
        } else if (model === 'folders') {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.formPolicy.patchValue({extra_vars: '{\n"folders":[""],\n"exclude":[]\n}'});
        } else if (model === 'piped') {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.formPolicy.patchValue({extra_vars: '{\n"command":""\n}'});
        } else {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.formPolicy.patchValue({extra_vars: '{}'});
        }
    }

    changeKeep(name, value): void {
        const newValue = {};
        newValue[name] = (value ? 1 : null);
        this.formPolicy.patchValue(newValue);
        if (value) {
            this.formPolicy.controls[name].enable();
        } else {
            this.formPolicy.controls[name].disable();
        }
    }
}
