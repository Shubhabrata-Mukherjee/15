import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form15ghComponent } from './form15gh.component';

describe('Form15ghComponent', () => {
  let component: Form15ghComponent;
  let fixture: ComponentFixture<Form15ghComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form15ghComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form15ghComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
