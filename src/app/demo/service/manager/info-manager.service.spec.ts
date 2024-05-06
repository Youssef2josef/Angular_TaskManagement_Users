import { TestBed } from '@angular/core/testing';

import { InfoManagerService } from './info-manager.service';

describe('InfoManagerService', () => {
  let service: InfoManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
