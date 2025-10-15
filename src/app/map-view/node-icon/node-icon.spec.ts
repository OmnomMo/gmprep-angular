import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeIcon } from './node-icon';

describe('NodeIcon', () => {
  let component: NodeIcon;
  let fixture: ComponentFixture<NodeIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
