import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificate197Component } from './certificate197.component';

describe('Certificate197Component', () => {
  let component: Certificate197Component;
  let fixture: ComponentFixture<Certificate197Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Certificate197Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Certificate197Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
