import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormtdsComponent } from './formtds.component';

describe('FormtdsComponent', () => {
  let component: FormtdsComponent;
  let fixture: ComponentFixture<FormtdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormtdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormtdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
