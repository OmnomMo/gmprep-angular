import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mapGuard } from './map-guard';

describe('mapGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mapGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
