import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineNameForm } from './inline-name-form';

describe('InlineNameForm', () => {
  let component: InlineNameForm;
  let fixture: ComponentFixture<InlineNameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineNameForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InlineNameForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
