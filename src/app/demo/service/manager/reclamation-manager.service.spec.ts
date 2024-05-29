import { TestBed } from '@angular/core/testing';

import { ReclamationManagerService } from './reclamation-manager.service';

describe('ReclamationManagerService', () => {
  let service: ReclamationManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReclamationManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
