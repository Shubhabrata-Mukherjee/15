import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Download26asComponent } from './download26as.component';

describe('Download26asComponent', () => {
  let component: Download26asComponent;
  let fixture: ComponentFixture<Download26asComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Download26asComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Download26asComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
