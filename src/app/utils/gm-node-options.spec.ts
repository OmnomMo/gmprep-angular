import { TestBed } from '@angular/core/testing';

import { GmNodeOptions } from './gm-node-options';

describe('GmNodeOptions', () => {
  let service: GmNodeOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GmNodeOptions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
