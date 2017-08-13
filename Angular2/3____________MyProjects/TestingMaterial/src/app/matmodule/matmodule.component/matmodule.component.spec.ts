import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatModuleComponent } from '../matmodule.component';

describe('MatModuleComponent', () => {
  let component: MatModuleComponent;
  let fixture: ComponentFixture<MatModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
