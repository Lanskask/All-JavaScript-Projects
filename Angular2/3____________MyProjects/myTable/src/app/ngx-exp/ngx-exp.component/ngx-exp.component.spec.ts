import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxExpComponent } from '../ngx-exp.component';

describe('NgxExpComponent', () => {
  let component: NgxExpComponent;
  let fixture: ComponentFixture<NgxExpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxExpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
