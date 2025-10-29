import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiStringSelector } from './multi-string-selector';

describe('MultiStringSelector', () => {
  let component: MultiStringSelector;
  let fixture: ComponentFixture<MultiStringSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiStringSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiStringSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
