import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapselection } from './mapselection';

describe('Mapselection', () => {
  let component: Mapselection;
  let fixture: ComponentFixture<Mapselection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapselection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapselection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
