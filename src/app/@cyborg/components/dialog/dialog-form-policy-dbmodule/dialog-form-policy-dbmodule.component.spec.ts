import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormPolicyDbmoduleComponent } from './dialog-form-policy-dbmodule.component';

describe('DialogFormPolicyDBModuleComponent', () => {
  let component: DialogFormPolicyDbmoduleComponent;
  let fixture: ComponentFixture<DialogFormPolicyDbmoduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFormPolicyDbmoduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormPolicyDbmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
