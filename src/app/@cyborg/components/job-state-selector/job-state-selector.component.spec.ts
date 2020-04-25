import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStateSelectorComponent } from './job-state-selector.component';

describe('JobStateSelectorComponent', () => {
  let component: JobStateSelectorComponent;
  let fixture: ComponentFixture<JobStateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStateSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
