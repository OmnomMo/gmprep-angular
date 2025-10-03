import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Campaignselection } from './campaignselection';

describe('Campaignselection', () => {
  let component: Campaignselection;
  let fixture: ComponentFixture<Campaignselection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campaignselection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Campaignselection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
