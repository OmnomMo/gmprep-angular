import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigButton } from './big-button';

describe('BigButton', () => {
  let component: BigButton;
  let fixture: ComponentFixture<BigButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
