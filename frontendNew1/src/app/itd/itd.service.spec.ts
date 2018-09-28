import { TestBed, inject } from '@angular/core/testing';

import { ItdService } from './itd.service';

describe('ItdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItdService]
    });
  });

  it('should be created', inject([ItdService], (service: ItdService) => {
    expect(service).toBeTruthy();
  }));
});
