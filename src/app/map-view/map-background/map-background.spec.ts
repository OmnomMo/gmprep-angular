import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBackground } from './map-background';

describe('MapBackground', () => {
  let component: MapBackground;
  let fixture: ComponentFixture<MapBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
