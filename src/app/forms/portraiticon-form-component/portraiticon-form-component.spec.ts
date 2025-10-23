import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortraiticonFormComponent } from './portraiticon-form-component';

describe('PortraiticonFormComponent', () => {
  let component: PortraiticonFormComponent;
  let fixture: ComponentFixture<PortraiticonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortraiticonFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortraiticonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
