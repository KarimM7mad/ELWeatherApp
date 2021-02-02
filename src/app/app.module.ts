import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorldWeatherOnlineService } from './Services/world-weather-online-service/world-weather-online.service';
import { LocationService } from './Services/countries-and-states-service/countries-and-states.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataPickerDialogComponent } from './Components/data-picker-dialog/data-picker-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DataPickerDialogComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    WorldWeatherOnlineService,
    LocationService
  ],
  entryComponents: [DataPickerDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
