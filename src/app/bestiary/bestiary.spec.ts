import { TestBed } from '@angular/core/testing';

import { Bestiary } from './bestiary';

describe('Bestiary', () => {
  let service: Bestiary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bestiary);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
