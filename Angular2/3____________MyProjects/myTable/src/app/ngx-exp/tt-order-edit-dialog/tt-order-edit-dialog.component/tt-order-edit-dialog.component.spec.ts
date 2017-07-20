import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtOrderEditDialogComponent } from '../tt-order-edit-dialog.component';

describe('TtOrderEditDialogComponent', () => {
  let component: TtOrderEditDialogComponent;
  let fixture: ComponentFixture<TtOrderEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtOrderEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtOrderEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
