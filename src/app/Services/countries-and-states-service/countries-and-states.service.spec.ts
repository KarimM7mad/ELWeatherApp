import { TestBed } from '@angular/core/testing';

import { LocationService } from './countries-and-states.service';

describe('CountriesAndStatesService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
