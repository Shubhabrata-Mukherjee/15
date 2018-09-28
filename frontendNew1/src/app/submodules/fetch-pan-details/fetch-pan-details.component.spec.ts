import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchPanDetailsComponent } from './fetch-pan-details.component';

describe('FetchPanDetailsComponent', () => {
  let component: FetchPanDetailsComponent;
  let fixture: ComponentFixture<FetchPanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchPanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchPanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
