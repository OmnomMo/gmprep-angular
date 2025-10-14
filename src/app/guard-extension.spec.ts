import { TestBed } from '@angular/core/testing';

import { GuardExtension } from './guard-extension';

describe('GuardExtension', () => {
  let service: GuardExtension;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardExtension);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
