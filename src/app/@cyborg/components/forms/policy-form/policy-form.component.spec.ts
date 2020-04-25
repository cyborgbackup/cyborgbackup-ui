import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormComponent } from './policy-form.component';

describe('PolicyFormComponent', () => {
  let component: PolicyFormComponent;
  let fixture: ComponentFixture<PolicyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
