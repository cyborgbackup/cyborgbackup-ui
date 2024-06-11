import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogFormPolicyVMModuleComponent} from './dialog-form-policy-vmmodule.component';

describe('DialogFormPolicyVMModuleComponent', () => {
    let component: DialogFormPolicyVMModuleComponent;
    let fixture: ComponentFixture<DialogFormPolicyVMModuleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DialogFormPolicyVMModuleComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogFormPolicyVMModuleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
