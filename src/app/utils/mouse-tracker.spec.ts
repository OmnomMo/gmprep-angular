import { TestBed } from '@angular/core/testing';

import { MouseTracker } from './mouse-tracker';

describe('MouseTracker', () => {
  let service: MouseTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseTracker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
