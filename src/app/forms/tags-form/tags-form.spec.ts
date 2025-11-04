import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsForm } from './tags-form';

describe('TagsForm', () => {
  let component: TagsForm;
  let fixture: ComponentFixture<TagsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
