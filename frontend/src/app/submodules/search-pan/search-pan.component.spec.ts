import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPanComponent } from './search-pan.component';

describe('SearchPanComponent', () => {
  let component: SearchPanComponent;
  let fixture: ComponentFixture<SearchPanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
