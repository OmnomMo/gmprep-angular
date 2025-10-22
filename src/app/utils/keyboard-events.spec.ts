import { TestBed } from '@angular/core/testing';

import { KeyboardEvents } from './keyboard-events';

describe('KeyboardEvents', () => {
  let service: KeyboardEvents;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardEvents);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
