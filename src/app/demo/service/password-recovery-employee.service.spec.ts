import { TestBed } from '@angular/core/testing';

import { PasswordRecoveryEmployeeService } from './password-recovery-employee.service';

describe('PasswordRecoveryEmployeeService', () => {
  let service: PasswordRecoveryEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRecoveryEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
