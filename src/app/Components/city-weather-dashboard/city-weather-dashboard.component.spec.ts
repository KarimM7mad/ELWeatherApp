import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityWeatherDashboardComponent } from './city-weather-dashboard.component';

describe('CityWeatherDashboardComponent', () => {
  let component: CityWeatherDashboardComponent;
  let fixture: ComponentFixture<CityWeatherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityWeatherDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityWeatherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
