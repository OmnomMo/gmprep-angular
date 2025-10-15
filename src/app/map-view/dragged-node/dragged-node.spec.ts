import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggedNode } from './dragged-node';

describe('DraggedNode', () => {
  let component: DraggedNode;
  let fixture: ComponentFixture<DraggedNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggedNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggedNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
