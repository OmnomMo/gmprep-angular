import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeView } from './node-view';

describe('NodeView', () => {
  let component: NodeView;
  let fixture: ComponentFixture<NodeView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
