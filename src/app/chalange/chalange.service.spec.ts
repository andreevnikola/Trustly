import { TestBed } from '@angular/core/testing';

import { ChalangeService } from './chalange.service';

describe('ChalangeService', () => {
  let service: ChalangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChalangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
