import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services';
import {FormControl, FormGroup} from '@angular/forms';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'cbg-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {
  public settings: any;
  public formSetting: FormGroup;
  private formData: any = {};
  public encryptedPlaceholder: any = {};

  constructor(private settingsService: SettingsService,
              private toastrService: NbToastrService) {
  }

  buildForm(): void {
      const group: any = {};
      this.settings.forEach(input_template => {
        group[input_template.key] = new FormControl('');
        this.formData[input_template.key] = input_template.value;
        input_template.encrypted = false;
        if (/\$encrypted\$/.test(input_template.value)) {
          input_template.encrypted = true;
          if (input_template.setting_type === 'privatekey') {
            this.formData[input_template.key] = 'ENCRYPTED';
          } else {
            this.encryptedPlaceholder[input_template.key] = 'ENCRYPTED';
            this.formData[input_template.key] = '';
          }
        }
      });
      this.formSetting = new FormGroup(group);
      this.formSetting.setValue(this.formData);
  }

  ngOnInit() {
      this.settingsService.fetch().subscribe((res) => {
        this.settings = res.results;
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

  onSubmit(): void {
      if (this.formSetting.valid) {
          const arUpdates = [];
          for (const set of this.settings ) {
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
          Observable.forkJoin(arUpdates).subscribe((res: any) => {
              let errors = 0;
              for (const el of res ) {
                  let found = false;
                  for (let v of this.settings ) {
                      if (v.id === el.id) {
                          v = el;
                          const newValue = {};
                          if (/\$encrypted\$/.test(el.value)) {
                              if ( el.setting_type === 'privatekey' ) {
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
