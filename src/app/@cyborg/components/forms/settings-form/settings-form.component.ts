import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SettingsService} from '../../../services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'cbg-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  @ViewChild('generateSshKeyDialog', { static: true }) generateSshKeyDialog: TemplateRef<any>;
  @ViewChild('getSshPublicKeyDialog', { static: true }) getSshPublicKeyDialog: TemplateRef<any>;

  public settings: any;
  public settingsKeys: any;
  public formSetting: FormGroup;
  public formGenerateSshKey: FormGroup;
  public encryptedPlaceholder: any = {};
  private formData: any = {};

  constructor(private settingsService: SettingsService,
              private toastrService: NbToastrService,
              private formBuilder: FormBuilder,
              private dialogService: NbDialogService) {
      this.formGenerateSshKey = this.formBuilder.group({
          type: ['ecdsa', Validators.required],
          size: [],
          force: []
      });
  }

  buildForm(): void {
      const group: any = {};
      Object.keys(this.settings).forEach(key => {
          this.settings[key].forEach(inputTemplate => {
              group[inputTemplate.key] = new FormControl('');
              this.formData[inputTemplate.key] = inputTemplate.value;
              inputTemplate.encrypted = false;
              if (/\$encrypted\$/.test(inputTemplate.value)) {
                  inputTemplate.encrypted = true;
                  if (inputTemplate.setting_type === 'privatekey') {
                      this.formData[inputTemplate.key] = 'ENCRYPTED';
                  } else {
                      this.encryptedPlaceholder[inputTemplate.key] = 'ENCRYPTED';
                      this.formData[inputTemplate.key] = '';
                  }
              }
          });
      });
      this.formSetting = new FormGroup(group);
      this.formSetting.setValue(this.formData);
  }

  ngOnInit() {
      const sets: any = {};
      this.settingsService.fetch().subscribe((res) => {
        res.results.forEach(item => {
            if (typeof(sets[item['group']]) === 'undefined') {
                sets[item['group']] = [];
            }
            sets[item['group']].push(item);
            sets[item['group']].sort((a, b) => a.order - b.order);
        });
        this.settings = sets;
        this.settingsKeys = Object.keys(this.settings).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));
        this.buildForm();
      });
  }

  replaceEncrypted(elem): void {
      elem.encrypted = false;
      elem.value = '';
      const newValue = {};
      newValue[elem.key] = '';
      this.encryptedPlaceholder[elem.key] = '';
      this.formSetting.patchValue(newValue);
  }

  generateSshKeyPair(): void {
      this.settingsService.isSshPrivateKeySet().subscribe((res) => {
          this.dialogService.open(this.generateSshKeyDialog, {context: res}).onClose.subscribe((resDialog) => {
              if (resDialog && this.formGenerateSshKey.valid) {
                  this.settingsService.generateSshKey(this.formGenerateSshKey.value).subscribe(() => {
                      this.toastrService.show('', 'SSH Key Generated', {
                          position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                          status: 'success'
                      });
                  }, (err) => {
                      this.toastrService.show(err, 'Error on SSH Key Generation', {
                          position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                          status: 'danger'
                      });
                  });
              }
          });
      });
  }

  getPublicSshKey(): void {
      this.settingsService.getSshPublicKey().subscribe((res) => {
          this.dialogService.open(this.getSshPublicKeyDialog, {context: res});
      });
  }

  onSubmit(): void {
      if (this.formSetting.valid) {
          const arUpdates = [];
          for (const key of this.settingsKeys) {
              for (const set of this.settings[key] ) {
                  if ( set.value !== this.formSetting.value[set.key]
                      && set.encrypted === false
                      && ! /\$encrypted\$/.test(this.formSetting.value[set.key])
                      && this.formSetting.value[set.key] !== ''
                  ) {
                      arUpdates.push(this.settingsService.set(set.id, {
                          value: this.formSetting.value[set.key]
                      }));
                  }
              }
          }
          forkJoin(arUpdates).subscribe((res: any) => {
              let errors = 0;
              for (const el of res ) {
                  let found = false;
                  for (const key of this.settingsKeys) {
                      for (let v of this.settings[key]) {
                          if (v.id === el.id) {
                              v = el;
                              const newValue = {};
                              if (/\$encrypted\$/.test(el.value)) {
                                  if (el.setting_type === 'privatekey') {
                                      newValue[el.key] = 'ENCRYPTED';
                                  } else {
                                      newValue[el.key] = '';
                                  }
                                  v.value = '';
                                  v.encrypted = true;
                                  this.encryptedPlaceholder[el.key] = 'ENCRYPTED';
                              } else {
                                  v.encrypted = false;
                                  newValue[el.key] = el.value;
                              }
                              this.formSetting.patchValue(newValue);
                              found = true;
                          }
                      }
                  }
                  if ( !found ) {
                      errors++;
                  }
              }
              if (errors === 0 ) {
                  this.toastrService.show('', 'Settings updated', {
                      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                      status: 'success'
                  });
              } else {
                  this.toastrService.show('', 'Error on Update', {
                      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                      status: 'danger'
                  });
              }
          });
      }
  }
}
