import { TestBed, inject } from '@angular/core/testing';

import { Bank1Service } from './bank1.service';

describe('Bank1Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Bank1Service]
    });
  });

  it('should be created', inject([Bank1Service], (service: Bank1Service) => {
    expect(service).toBeTruthy();
  }));
});
