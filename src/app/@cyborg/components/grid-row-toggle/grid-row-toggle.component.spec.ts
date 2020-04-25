import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRowToggleComponent } from './grid-row-toggle.component';

describe('GridRowToggleComponent', () => {
  let component: GridRowToggleComponent;
  let fixture: ComponentFixture<GridRowToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRowToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRowToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
