import { TestBed } from '@angular/core/testing';

import { InfoEmployeeService } from './info-employee.service';

describe('InfoEmployeeService', () => {
  let service: InfoEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
