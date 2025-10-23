import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableIcon } from './selectable-icon';

describe('SelectableIcon', () => {
  let component: SelectableIcon;
  let fixture: ComponentFixture<SelectableIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectableIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
