import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMap } from './create-map';

describe('CreateMap', () => {
  let component: CreateMap;
  let fixture: ComponentFixture<CreateMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
