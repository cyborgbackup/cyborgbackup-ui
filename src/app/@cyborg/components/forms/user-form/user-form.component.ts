import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../../services/users/users.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {nbAuthCreateToken, NbAuthJWTToken, NbAuthService, NbTokenService} from '@nebular/auth';

@Component({
    selector: 'cbg-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    formUser: FormGroup;
    formNotif: FormGroup;
    user: any;
    userId: number;

    constructor(private formBuilder: FormBuilder,
                private usersService: UsersService,
                private route: ActivatedRoute,
                private toastrService: NbToastrService,
                private authService: NbAuthService,
                private tokenService: NbTokenService,
                private router: Router) {
    }

    ngOnInit() {
        this.formUser = this.formBuilder.group({
            email: ['', Validators.required],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            password: [],
            confirmPassword: [],
            is_superuser: [false]
        });
        this.formNotif = this.formBuilder.group({
            notify_backup_daily: [false],
            notify_backup_weekly: [false],
            notify_backup_monthly: [false],
            notify_backup_failed: [false],
            notify_backup_success: [false],
            notify_backup_summary: [false]
        });

        this.route.paramMap.subscribe((params) => {
            this.userId = +params.get('id');
            if (this.userId !== 0) {
                this.usersService.get(this.userId).subscribe((res) => {
                    this.user = res;
                    this.formUser.patchValue(this.user);
                    this.formNotif.patchValue(this.user);
                });
            }
        });
    }

    updateUser(data) {
        this.usersService.patch(this.userId, data).subscribe((res) => {
            if (res.headers.keys().indexOf('x-token') !== -1) {
                const token = nbAuthCreateToken(
                    NbAuthJWTToken,
                    res.headers.get('x-token'),
                    'email'
                );
                this.tokenService.set(token).subscribe(() => {
                    this.toastrService.show('', 'User updated', {
                        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                        status: 'success'
                    });
                });
            } else {
                this.toastrService.show('', 'User updated', {
                    position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                    status: 'success'
                });
            }
        }, (err) => {
            this.toastrService.show(err, 'Error on Update', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    createUser(data) {
        this.usersService.post(data).subscribe((res) => {
            this.toastrService.show('', 'User created', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success'
            });
            this.router.navigate(['/user/edit/' + res.id + '/']);
            // this.route.
        }, (err) => {
            this.toastrService.show(err, 'Error on Create', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    submitUser() {
        if (this.formUser.valid) {
            const data = this.formUser.value;
            if (data.password === null) {
                delete data.password;
                delete data.confirmPassword;
            }
            if (this.userId !== 0) {
                this.updateUser(this.formUser.value);
            } else {
                const newUser = this.formUser.value;
                Object.assign(newUser, this.formNotif.value);
                this.createUser(newUser);
            }
        }
    }

    submitNotif() {
        if (this.formNotif.value && this.userId !== 0) {
            console.log(this.formNotif.value);
            this.usersService.patch(this.userId, this.formNotif.value).subscribe(() => {
                this.toastrService.show('', 'Notification settings updated', {
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
