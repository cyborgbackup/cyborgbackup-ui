import {Component, OnInit} from '@angular/core';
import {ClientsService, PoliciesService, RepositoriesService, SchedulesService} from '../../../services';
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
              private dialogService: NbDialogService,
              private router: Router) {
    this.typesArray = [];
    this.schedules = [];
    this.repositories = [];
    this.clients = [];
  }

  ngOnInit() {
    this.formPolicy = this.formBuilder.group({
      name: ['', Validators.required],
      policy_type: ['', Validators.required],
      schedule: ['', Validators.required],
      repository: ['', Validators.required],
      clients: [''],
      extra_vars: [],
      prehook: [''],
      posthook: [''],
      keep_hourly: [{value: null, disabled: true}],
      keep_daily: [{value: null, disabled: true}],
      keep_weekly: [{value: null, disabled: true}],
      keep_monthly: [{value: null, disabled: true}],
      keep_yearly: [{value: null, disabled: true}],
      boolean_keep_hourly: [false],
      boolean_keep_daily: [false],
      boolean_keep_weekly: [false],
      boolean_keep_monthly: [false],
      boolean_keep_yearly: [false],
      mode_pull: [],
      enabled: []
    });

    this.route.paramMap.subscribe(params => {
      this.policyId = +params.get('id');
      if (this.policyId !== 0) {
        this.policiesService.get(this.policyId).subscribe((res) => {
          this.policy = res;
          this.formPolicy.patchValue(this.policy);
          if (this.policy.keep_hourly !== null) {
            this.formPolicy.controls.keep_hourly.enable();
            this.formPolicy.patchValue({boolean_keep_hourly: true});
          }
          if (this.policy.keep_daily !== null) {
            this.formPolicy.controls.keep_daily.enable();
            this.formPolicy.patchValue({boolean_keep_daily: true});
          }
          if (this.policy.keep_weekly !== null) {
            this.formPolicy.controls.keep_weekly.enable();
            this.formPolicy.patchValue({boolean_keep_weekly: true});
          }
          if (this.policy.keep_monthly !== null) {
            this.formPolicy.controls.keep_monthly.enable();
            this.formPolicy.patchValue({boolean_keep_monthly: true});
          }
          if (this.policy.keep_yearly !== null) {
            this.formPolicy.controls.keep_yearly.enable();
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

  updatePolicy(data) {
    this.policiesService.patch(this.policyId, data).subscribe((res) => {
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
    console.log(this.formPolicy);
    console.log(this.formPolicy.valid);
    if (this.formPolicy.valid) {
      if (this.policyId !== 0) {
        this.updatePolicy(this.formPolicy.value);
      } else {
        this.createPolicy(this.formPolicy.value);
      }
    }
  }

  changeType(model): void {
    if (model === 'mysql' || model === 'postgresql') {
      this.formPolicy.patchValue({extra_vars:  '{\n"user":"",\n"password": ""\n}'});
    } else if (model === 'folders') {
      this.formPolicy.patchValue({extra_vars: '{\n"folders":[""]\n}'});
    } else if (model === 'piped') {
      this.formPolicy.patchValue({extra_vars: '{\n"command":""\n}'});
    } else {
      this.formPolicy.patchValue({extra_vars: ''});
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
