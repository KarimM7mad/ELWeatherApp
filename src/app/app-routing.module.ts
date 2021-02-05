import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CityWeatherDashboardComponent } from './Components/city-weather-dashboard/city-weather-dashboard.component';
import { LandingComponentComponent } from './Components/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponentComponent },
  { path: 'landing', component: LandingComponentComponent },
  { path: 'cityDashboard/:cardIndex', component: CityWeatherDashboardComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LandingComponentComponent,
  CityWeatherDashboardComponent
];