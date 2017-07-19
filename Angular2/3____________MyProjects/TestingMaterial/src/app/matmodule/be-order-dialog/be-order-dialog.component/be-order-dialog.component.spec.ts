import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeOrderDialogComponent } from '../be-order-dialog.component';

describe('BeOrderDialogComponent', () => {
  let component: BeOrderDialogComponent;
  let fixture: ComponentFixture<BeOrderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeOrderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
