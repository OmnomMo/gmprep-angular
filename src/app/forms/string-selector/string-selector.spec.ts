import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringSelector } from './string-selector';

describe('StringSelector', () => {
  let component: StringSelector;
  let fixture: ComponentFixture<StringSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
