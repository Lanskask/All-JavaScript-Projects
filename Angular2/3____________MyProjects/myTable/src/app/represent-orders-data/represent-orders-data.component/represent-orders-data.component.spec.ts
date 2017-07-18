import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentOrdersDataComponent } from './represent-orders-data.component';

describe('RepresentOrdersDataComponent', () => {
  let component: RepresentOrdersDataComponent;
  let fixture: ComponentFixture<RepresentOrdersDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentOrdersDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentOrdersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
