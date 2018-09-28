import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForm15ghComponent } from './add-form15gh.component';

describe('AddForm15ghComponent', () => {
  let component: AddForm15ghComponent;
  let fixture: ComponentFixture<AddForm15ghComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddForm15ghComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddForm15ghComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
