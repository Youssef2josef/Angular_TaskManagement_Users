import { TestBed } from '@angular/core/testing';

import { ReportEmployeeService } from './report-employee.service';

describe('ReportEmployeeService', () => {
  let service: ReportEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
