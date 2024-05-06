import { TestBed } from '@angular/core/testing';

import { TeamEmployeeService } from './team-employee.service';

describe('TeamEmployeeService', () => {
  let service: TeamEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
