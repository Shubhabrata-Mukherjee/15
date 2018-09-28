import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItdLayoutComponent } from './itd-layout.component';

describe('ItdLayoutComponent', () => {
  let component: ItdLayoutComponent;
  let fixture: ComponentFixture<ItdLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItdLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItdLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
