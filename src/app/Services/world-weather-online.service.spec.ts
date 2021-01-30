import { TestBed } from '@angular/core/testing';

import { WorldWeatherOnlineService } from './world-weather-online.service';

describe('WorldWeatherOnlineService', () => {
  let service: WorldWeatherOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldWeatherOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
