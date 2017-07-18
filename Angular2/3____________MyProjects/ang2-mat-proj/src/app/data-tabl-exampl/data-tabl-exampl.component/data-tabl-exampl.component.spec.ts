import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTablExamplComponent } from '../data-tabl-exampl.component';

describe('DataTablExamplComponent', () => {
  let component: DataTablExamplComponent;
  let fixture: ComponentFixture<DataTablExamplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTablExamplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTablExamplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
