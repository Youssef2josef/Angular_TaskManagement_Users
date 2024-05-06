import { TestBed } from '@angular/core/testing';

import { SettingAccountService } from './setting-account.service';

describe('SettingAccountService', () => {
  let service: SettingAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
