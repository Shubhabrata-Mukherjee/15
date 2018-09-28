import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryRuleComponent } from './query-rule.component';

describe('QueryRuleComponent', () => {
  let component: QueryRuleComponent;
  let fixture: ComponentFixture<QueryRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
