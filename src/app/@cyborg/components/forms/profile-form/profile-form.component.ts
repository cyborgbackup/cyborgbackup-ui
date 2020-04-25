import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../../services';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'cbg-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  public formProfile: FormGroup;
  public userId: number;

  constructor(private usersService: UsersService,
              private formBuilder: FormBuilder,
              private toastrService: NbToastrService) {
    this.formProfile = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      password_confirm: [''],
      notify_backup_daily: [''],
      notify_backup_failed: [''],
      notify_backup_monthly: [''],
      notify_backup_success: [''],
      notify_backup_summary: [''],
      notify_backup_weekly: [''],
    },
        {validator: this.checkPasswords });
    this.usersService.me().subscribe((res) => {
      this.formProfile.patchValue(res);
      this.userId = res.id;
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('password_confirm').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  ngOnInit() {
  }

  submit(): void {
    if (this.formProfile.valid) {
      const data = this.formProfile.value;
      if (data.password === '') {
        delete data.password;
        delete data.password_confirm;
      }
      this.usersService.patch(this.userId, data).subscribe((res) => {
        this.toastrService.show('', 'Profile updated', {
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
  }

}
