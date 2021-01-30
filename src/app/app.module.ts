import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponentComponent } from './Components/landing-component/landing-component.component';
import { CityWeatherDashboardComponent } from './Components/city-weather-dashboard/city-weather-dashboard.component';
import { WorldWeatherOnlineService } from './Services/world-weather-online.service'

@NgModule({
  declarations: [
    AppComponent,
    LandingComponentComponent,
    CityWeatherDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    WorldWeatherOnlineService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
