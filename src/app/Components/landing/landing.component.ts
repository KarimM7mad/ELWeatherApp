import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as d3 from 'd3';
import { WorldWeatherOnlineService } from 'src/app/Services/world-weather-online.service';
import { DataPickerDialogComponent } from '../data-picker-dialog/data-picker-dialog.component';

@Component({
  selector: 'app-landing-component',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponentComponent implements OnInit, OnDestroy {

  public cardsData = [];

  // public landingCompData : {
  //   location: apiResponse.data.request[0].query,
  //   date: apiResponse.data.weather[0].date,
  //   temp: apiResponse.data.current_condition[0].temp_C,
  //   weatherDesc: apiResponse.data.current_condition[0].weatherDesc[0].value,
  //   tempMaxC: apiResponse.data.weather[0].tempMaxC,
  //   tempMinC: apiResponse.data.weather[0].tempMinC,
  //   cloudcover: apiResponse.data.current_condition[0].cloudcover,
  //   humidity: apiResponse.data.current_condition[0].humidity,
  //   observation_time: apiResponse.data.current_condition[0].observation_time,
  //   precipMM: apiResponse.data.current_condition[0].precipMM,
  //   pressure: apiResponse.data.current_condition[0].pressure,
  //   visibility: apiResponse.data.current_condition[0].visibility,
  //   winddir16Point: apiResponse.data.weather[0].winddir16Point,
  //   winddirDegree: apiResponse.data.weather[0].winddirDegree,
  //   windspeed: apiResponse.data.weather[0].windspeedKmph,
  //   icon: apiResponse.data.current_condition[0].weatherIconUrl[0].value,
  // };


  constructor(private srv: WorldWeatherOnlineService, private modalService: NgbModal) { }


  async ngOnInit() {

    if (localStorage.hasOwnProperty("cardsData")) {
      this.cardsData = JSON.parse(localStorage.getItem("cardsData"));
    }

    console.log("landingCompInit");
    const ipp = await this.srv.getIpSrcObservable().toPromise();
    d3.selectAll('h1').text(ipp.ip);
    console.log("landingCompInit Finished");
  }

  // async refresh() {
  async refresh() {
    console.log("refresh Started");
    await (this.srv.getPositionWeather("Cairo", '1').toPromise().then(
      dataReceived => {
        this.addToCardsIfNotExist(dataReceived["data"])
      }
    ));

    // this.addToCardsIfNotExist(infoo["data"]);

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');

    // console.log(JSON.stringify(infoo["data"]));

    console.log("refresh ended");
  }

  async raiseModal() {
    console.log("raiseModal Called");

    await (this.srv.getPositionWeather("Alexandria", '1').toPromise().then(
      dataReceived => {
        this.addToCardsIfNotExist(dataReceived["data"])
      }
    ));

    // this.addToCardsIfNotExist(infoo["data"]);

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');

    // console.log(JSON.stringify(infoo["data"]));


    console.log("raiseModal call ended");

  }


  addToCardsIfNotExist(dataToAdd) {

    console.log("THE NEW JSON TO BE ADDED IS:" + JSON.stringify(dataToAdd))
    console.log("SIZE OF CARDS DATA BEFORE:" + this.cardsData.length)

    for (let i = 0; i < this.cardsData.length; i++) {
      if (this.cardsData[i]["nearest_area"][0]["region"][0]["value"] == dataToAdd["nearest_area"][0]["region"][0]["value"]) {
        console.log("SIZE OF CARDS DATA AFTER ADITION:" + this.cardsData.length)
        return;
      }
    }
    this.cardsData.push(dataToAdd);

    console.log(this.cardsData);
    console.log("JSON ADDED");
    console.log("SIZE OF CARDS DATA AFTER ADITION:" + this.cardsData.length)
  }


  ngOnDestroy(): void {
    if (this.cardsData.length > 0) {
      localStorage.removeItem("cardsData");
      localStorage.setItem("cardsData", JSON.stringify(this.cardsData));
    }

  }


  openLocationModal() {
    const modalRef = this.modalService.open(DataPickerDialogComponent);
    modalRef.componentInstance.name = 'World';
  }


}
