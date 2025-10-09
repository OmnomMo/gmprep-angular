import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagelinkFormComponent } from './imagelink-form-component';

describe('ImagelinkFormComponent', () => {
  let component: ImagelinkFormComponent;
  let fixture: ComponentFixture<ImagelinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagelinkFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagelinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
