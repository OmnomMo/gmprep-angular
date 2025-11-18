import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordValidationMessages } from './password-validation-messages';

describe('PasswordValidationMessages', () => {
  let component: PasswordValidationMessages;
  let fixture: ComponentFixture<PasswordValidationMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordValidationMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordValidationMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
