import { TestBed } from '@angular/core/testing';

import { AuthEmployeeService } from './auth-employee.service';

describe('AuthEmployeeService', () => {
  let service: AuthEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
