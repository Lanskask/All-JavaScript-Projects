import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RavilComponent } from './ravil.component';

describe('RavilComponent', () => {
  let component: RavilComponent;
  let fixture: ComponentFixture<RavilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RavilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RavilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
