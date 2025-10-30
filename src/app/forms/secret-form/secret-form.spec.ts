import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretForm } from './secret-form';

describe('SecretForm', () => {
  let component: SecretForm;
  let fixture: ComponentFixture<SecretForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
