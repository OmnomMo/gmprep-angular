import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapContext } from './map-context';

describe('MapContext', () => {
  let component: MapContext;
  let fixture: ComponentFixture<MapContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
