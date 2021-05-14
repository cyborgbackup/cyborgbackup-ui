import {Component, OnInit} from '@angular/core';
import {ClientsService, PoliciesService} from '../../../services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'cbg-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  formClient: FormGroup;
  client: any;
  clientId: number;
  policies: [];
  policiesForm = new FormControl([]);

  constructor(private formBuilder: FormBuilder,
              private clientsService: ClientsService,
              private policiesService: PoliciesService,
              private route: ActivatedRoute,
              private toastrService: NbToastrService,
              private router: Router) {
  }

  ngOnInit() {
    this.formClient = this.formBuilder.group({
      hostname: ['', Validators.required],
      bandwidth_limit: [''],
      enabled: [],
      boolean_bandwidth_limit: [false],
      port: [22, Validators.min(1), Validators.max(65535)]
    });

    this.policiesService.fetch().subscribe((res) => {
      this.policies = res.results;
    });

    this.route.paramMap.subscribe(params => {
      this.clientId = +params.get('id');
      if (this.clientId !== 0) {
        this.clientsService.get(this.clientId).subscribe((res) => {
          this.client = res;
          this.formClient.patchValue(this.client);
          this.policiesForm.patchValue(this.client.summary_fields.policies.map(e => e.id));
          if ( this.client.bandwidth_limit !== '' && this.client.bandwidth_limit > 0 ) {
            this.formClient.patchValue({boolean_bandwidth_limit: true});
          }
        });
      }
    });
  }

  updateClient(data) {
    this.clientsService.patch(this.clientId, data).subscribe((res) => {
      this.toastrService.show('', 'Client updated', {
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

  createClient(data) {
    this.clientsService.post(data).subscribe((res) => {
      this.toastrService.show('', 'Client created', {
        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
        status: 'success'
      });
      this.router.navigate(['/client/edit/' + res.id + '/']);
      // this.route.
    }, (err) => {
      this.toastrService.show(err, 'Error on Create', {
        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
        status: 'danger'
      });
    });
  }

  submit() {
    if (this.formClient.valid) {
      if (this.formClient.value.boolean_bandwidth_limit === false) {
        delete this.formClient.value.bandwidth_limit;
      }
      if (this.clientId !== 0) {
        this.updateClient(this.formClient.value);
      } else {
        this.createClient(this.formClient.value);
      }
    }
  }

  changeBandwidthLimit(value): void {
    const newValue = {
      bandwidth_limit: (value ? 1 : '')
    };
    this.formClient.patchValue(newValue);
    if (value) {
      this.formClient.controls['bandwidth_limit'].enable();
    } else {
      this.formClient.controls['bandwidth_limit'].disable();
    }
  }
}
