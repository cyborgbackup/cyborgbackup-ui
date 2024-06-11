import {Component, OnInit} from '@angular/core';
import {RepositoriesService} from '../../../services/repositories/repositories.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Component({
    selector: 'cbg-repository-form',
    templateUrl: './repository-form.component.html',
    styleUrls: ['./repository-form.component.scss']
})
export class RepositoryFormComponent implements OnInit {
    formRepository: FormGroup;
    repository: any;
    repositoryId: number;

    constructor(private formBuilder: FormBuilder,
                private repositoriesService: RepositoriesService,
                private route: ActivatedRoute,
                private toastrService: NbToastrService,
                private router: Router) {
    }

    ngOnInit() {
        this.formRepository = this.formBuilder.group({
            name: ['', Validators.required],
            path: ['', Validators.required],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            repository_key: ['', Validators.required],
            enabled: []
        });

        this.route.paramMap.subscribe(params => {
            this.repositoryId = +params.get('id');
            if (this.repositoryId !== 0) {
                this.repositoriesService.get(this.repositoryId).subscribe((res) => {
                    this.repository = res;
                    this.formRepository.patchValue(this.repository);
                });
            }
        });
    }

    updateRepository(data) {
        this.repositoriesService.patch(this.repositoryId, data).subscribe(() => {
            this.toastrService.show('', 'Repository updated', {
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

    createRepository(data) {
        this.repositoriesService.post(data).subscribe((res) => {
            this.toastrService.show('', 'Repository created', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success'
            });
            this.router.navigate(['/repository/edit/' + res.id + '/']);
            // this.route.
        }, (err) => {
            this.toastrService.show(err, 'Error on Create', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'danger'
            });
        });
    }

    submit() {
        if (this.formRepository.valid) {
            if (this.repositoryId !== 0) {
                this.updateRepository(this.formRepository.value);
            } else {
                this.createRepository(this.formRepository.value);
            }
        }
    }
}
