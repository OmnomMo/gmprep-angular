import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionForm } from './action-form';

describe('ActionForm', () => {
  let component: ActionForm;
  let fixture: ComponentFixture<ActionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
