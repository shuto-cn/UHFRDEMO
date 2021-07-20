import { TestBed } from '@angular/core/testing';

import { HardwearKeyService } from './hardwear-key.service';

describe('HardwearKeyService', () => {
  let service: HardwearKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardwearKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
