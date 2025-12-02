import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestiaryWindow } from './bestiary-window';

describe('BestiaryWindow', () => {
  let component: BestiaryWindow;
  let fixture: ComponentFixture<BestiaryWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestiaryWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestiaryWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
