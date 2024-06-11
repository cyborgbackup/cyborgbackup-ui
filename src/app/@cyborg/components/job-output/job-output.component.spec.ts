import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobOutputComponent} from './job-output.component';

describe('JobOutputComponent', () => {
    let component: JobOutputComponent;
    let fixture: ComponentFixture<JobOutputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JobOutputComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobOutputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
