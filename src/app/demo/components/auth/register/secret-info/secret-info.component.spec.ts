import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretInfoComponent } from './secret-info.component';

describe('SecretInfoComponent', () => {
  let component: SecretInfoComponent;
  let fixture: ComponentFixture<SecretInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
