import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PoliciesService} from '../../../services';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'cbg-dialog-form-policy-dbmodule',
  templateUrl: './dialog-form-policy-dbmodule.component.html',
  styleUrls: ['./dialog-form-policy-dbmodule.component.css']
})
export class DialogFormPolicyDBModuleComponent implements OnInit {
  @ViewChild('credentialDialog', { static: true }) credentialDialog: TemplateRef<any>;
  formCredential: FormGroup;
  vars: any;
  client: any;
  module: String;
  dbs: any;
  loading: boolean;
  state: any;
  checked: {};
  error: string;

  constructor(private policiesService: PoliciesService,
              protected dialogRef: NbDialogRef<any>,
              private dialogService: NbDialogService,
              private formBuilder: FormBuilder) {
    this.loading = true;
    this.checked = {};
    this.error = null;
    this.formCredential = this.formBuilder.group({
      user: [],
      password: [],
      port: []
    });
  }

  close(save= false) {
    const filtered = Object.keys(this.checked).filter(key => this.checked[key]);
    const credValues = this.formCredential.value;
    Object.keys(credValues).forEach(val => {
      if (credValues[val] === null || credValues[val] === '') {
        delete credValues[val];
      }
    });
    this.dialogRef.close(save ? {credential: credValues, databases: filtered} : undefined);
  }

  toggle(item): void {
    this.state[item] = !this.state[item];
  }

  select(db): void {
    this.checked[db.name] = !this.checked[db.name];
  }

  checkAll(event): void {
    this.dbs.forEach((db) => {
      this.checked[db.name] = event.target.checked;
    });
  }

  changeCredential(): void {
    this.dialogService.open(this.credentialDialog).onClose.subscribe((res) => {
      if (res) {
        const credValues = this.formCredential.value;
        Object.keys(credValues).forEach(val => {
          if (credValues[val] === null || credValues[val] === '') {
            delete credValues[val];
          }
        });
        this.getDBs(credValues);
      }
    });
  }

  getDBs(credential = null): void {
    this.loading = true;
    this.error = null;
    this.policiesService.moduleItems(this.module, this.client.id, credential).subscribe((res) => {
      if (res.status === 200) {
        res.body.forEach((db) => {
          this.checked[db.name] = this.vars !== undefined
              && Object.keys(this.vars).includes('databases')
              && this.vars['databases'].includes(db.name);
        });
        this.dbs = res.body;
      } else {
        this.error = 'Unable to get element. Check credential';
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.getDBs();
    if (this.vars !== undefined && Object.keys(this.vars).includes('credential'))
      this.formCredential.patchValue(this.vars['credential']);
  }

}
