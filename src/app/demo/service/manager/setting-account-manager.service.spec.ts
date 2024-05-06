import { TestBed } from '@angular/core/testing';

import { SettingAccountManagerService } from './setting-account-manager.service';

describe('SettingAccountManagerService', () => {
  let service: SettingAccountManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingAccountManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
