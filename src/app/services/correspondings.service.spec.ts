import { TestBed } from '@angular/core/testing';

import { CorrespondingsService } from './correspondings.service';

describe('CorrespondingsService', () => {
  let service: CorrespondingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrespondingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
