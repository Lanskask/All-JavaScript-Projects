import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenEditDialogComponent } from './open-edit-dialog.component';

describe('OpenEditDialogComponent', () => {
  let component: OpenEditDialogComponent;
  let fixture: ComponentFixture<OpenEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
