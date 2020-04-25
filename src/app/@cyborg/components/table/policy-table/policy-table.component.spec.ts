import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTableComponent } from './policy-table.component';

describe('JobTableComponent', () => {
  let component: PolicyTableComponent;
  let fixture: ComponentFixture<PolicyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
