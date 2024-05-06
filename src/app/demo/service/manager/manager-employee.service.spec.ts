import { TestBed } from '@angular/core/testing';

import { ManagerEmployeeService } from './manager-employee.service';

describe('ManagerEmployeeService', () => {
  let service: ManagerEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
