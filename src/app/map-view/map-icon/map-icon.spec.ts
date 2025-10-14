import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapIcon } from './map-icon';

describe('MapIcon', () => {
  let component: MapIcon;
  let fixture: ComponentFixture<MapIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
