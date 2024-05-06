import { TestBed } from '@angular/core/testing';

import { TaskEmployeeService } from './task-employee.service';

describe('TaskEmployeeService', () => {
  let service: TaskEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
