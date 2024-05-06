import { TestBed } from '@angular/core/testing';

import { ProjectEmployeeService } from './project-employee.service';

describe('ProjectEmployeeService', () => {
  let service: ProjectEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
