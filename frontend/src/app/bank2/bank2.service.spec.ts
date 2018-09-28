import { TestBed, inject } from '@angular/core/testing';

import { Bank2Service } from './bank2.service';

describe('Bank2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Bank2Service]
    });
  });

  it('should be created', inject([Bank2Service], (service: Bank2Service) => {
    expect(service).toBeTruthy();
  }));
});
