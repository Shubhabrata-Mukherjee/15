import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form26asComponent } from './form26as.component';

describe('Form26asComponent', () => {
  let component: Form26asComponent;
  let fixture: ComponentFixture<Form26asComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form26asComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form26asComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
