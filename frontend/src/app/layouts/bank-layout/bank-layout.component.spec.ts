import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankLayoutComponent } from './bank-layout.component';

describe('BankLayoutComponent', () => {
  let component: BankLayoutComponent;
  let fixture: ComponentFixture<BankLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
