import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeFormArray } from './node-form-array';

describe('NodeFormArray', () => {
  let component: NodeFormArray;
  let fixture: ComponentFixture<NodeFormArray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeFormArray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeFormArray);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
