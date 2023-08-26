import { TestBed } from '@angular/core/testing';

import { NgswWorkerService } from './ngsw-worker.service';

describe('NgswWorkerService', () => {
  let service: NgswWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgswWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
