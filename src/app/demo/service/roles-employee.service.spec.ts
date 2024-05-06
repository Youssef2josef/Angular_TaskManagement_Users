import { TestBed } from '@angular/core/testing';

import { RolesEmployeeService } from './roles-employee.service';

describe('RolesEmployeeService', () => {
  let service: RolesEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
