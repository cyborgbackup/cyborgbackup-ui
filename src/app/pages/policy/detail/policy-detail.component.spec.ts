import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDetailComponent } from './policy-detail.component';

describe('PolicyDetailComponent', () => {
  let component: PolicyDetailComponent;
  let fixture: ComponentFixture<PolicyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
