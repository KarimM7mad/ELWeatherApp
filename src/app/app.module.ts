import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorldWeatherOnlineService } from './Services/world-weather-online.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataPickerDialogComponent } from './Components/data-picker-dialog/data-picker-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    WorldWeatherOnlineService
  ],
  entryComponents: [DataPickerDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
