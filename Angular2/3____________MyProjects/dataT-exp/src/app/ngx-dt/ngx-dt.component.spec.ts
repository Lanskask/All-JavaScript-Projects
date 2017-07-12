import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDtComponent } from './ngx-dt.component';

describe('NgxDtComponent', () => {
  let component: NgxDtComponent;
  let fixture: ComponentFixture<NgxDtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
