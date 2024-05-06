import { TestBed } from '@angular/core/testing';

import { RolesManagerService } from './roles-manager.service';

describe('RolesManagerService', () => {
  let service: RolesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
