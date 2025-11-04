import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeFilter } from './node-filter';

describe('NodeFilter', () => {
  let component: NodeFilter;
  let fixture: ComponentFixture<NodeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
