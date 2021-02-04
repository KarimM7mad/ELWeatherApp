import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { LocationService } from 'src/app/Services/countries-and-states-service/countries-and-states.service';
import { WorldWeatherOnlineService } from 'src/app/Services/world-weather-online-service/world-weather-online.service';
import { DataPickerDialogComponent } from '../data-picker-dialog/data-picker-dialog.component';

@Component({
  selector: 'app-landing-component',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponentComponent implements OnInit, OnDestroy {
  public cardsData = [];
  public locationsJSON = {};
  public closeResult = '';
  public canOpenModal = false;

  public isAllFinishedd = new Subject<boolean>();

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

  constructor(
    private weatherService: WorldWeatherOnlineService,
    private locationService: LocationService,
    private locationModal: NgbModal
  ) { }

  ngOnInit() {
    console.log('landingCompInit Started');

    if (localStorage.hasOwnProperty('cardsData')) {
      this.cardsData = JSON.parse(localStorage.getItem('cardsData'));
    }

    // open modal if locations exist
    if (localStorage.hasOwnProperty('locations')) {
      this.locationsJSON = JSON.parse(localStorage.getItem('locations'));
      if (!this.isEmptyObject(this.locationsJSON)) {
        this.canOpenModal = true;
      }
    }

    this.weatherService.getCurrClientIP().subscribe(res => {
      let r = Math.floor(Math.random() * 127) + 128;
      let g = Math.floor(Math.random() * 127) + 128;
      let b = Math.floor(Math.random() * 127) + 128;
      d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')').text("IP from NgOnInit:" + res.ip);
    });
    console.log('landingCompInit Finished');
  }

  getCurrIP() {
    console.log('refresh Started');

    this.weatherService.getCurrClientIP().subscribe(res => {
      let r = Math.floor(Math.random() * 127) + 128;
      let g = Math.floor(Math.random() * 127) + 128;
      let b = Math.floor(Math.random() * 127) + 128;
      d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')').text("IP from getCurrIP:" + res.ip);
      this.weatherService.getPositionWeather(res.ip).subscribe(
        (dataReceived) => this.addToCardsIfNotExist(dataReceived)
      );
      console.log('refresh ended');
    }, (err) => {
      let r = Math.floor(Math.random() * 127) + 128;
      let g = Math.floor(Math.random() * 127) + 128;
      let b = Math.floor(Math.random() * 127) + 128;
      d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')').text("CAN'T GET IP");
    }
    );

  }

  addDummyData() {
    console.log('addDummyData Called');

    this.weatherService.getPositionWeather('Alexandria', '1').subscribe((dataReceived) => {
      this.addToCardsIfNotExist(dataReceived);
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
      console.log('addDummyData call ended');
    });

  }

  openLocationModal() {

    if (!this.canOpenModal) {
      return;
    }
    // if (this.locationsJSONtoBeStored && (Object.keys(this.locationsJSONtoBeStored).length === 0)) {
    //   this.getLocations();
    // }

    // const modalOptions = {
    //   backdrop: true,
    //   keyboard: true,
    //   focus: true,
    //   show: true,
    //   ignoreBackdropClick: false,
    //   class: 'modal-dialog modal-dialog-centered',
    //   animated: true,
    //   // role: 'document'
    // };

    const modalRef = this.locationModal.open(DataPickerDialogComponent);
    modalRef.componentInstance.openningSrcId = 'openLocationModalBtn';
    modalRef.componentInstance.locationsStored = this.locationsJSON;
    modalRef.componentInstance.passEntry.subscribe(
      arg => {
        console.log("choices received");
        console.log(JSON.stringify(arg));
        modalRef.close();
        // go to Dashboard with the data 

      }
    );

  }

  addToCardsIfNotExist(dataToAdd) {
    console.log('THE NEW JSON TO BE ADDED IS:' + JSON.stringify(dataToAdd));
    console.log('SIZE OF CARDS DATA BEFORE:' + this.cardsData.length);

    for (let i = 0; i < this.cardsData.length; i++) {
      if (this.cardsData[i]['nearest_area'][0]['region'][0]['value'] == dataToAdd['nearest_area'][0]['region'][0]['value']) {
        return;
      }
    }
    this.cardsData.push(dataToAdd);

    console.log(this.cardsData);
    console.log('JSON ADDED');
    console.log('SIZE OF CARDS DATA AFTER ADITION:' + this.cardsData.length);
  }

  ngOnDestroy(): void {
    if (this.cardsData.length > 0) {
      localStorage.removeItem('cardsData');
      localStorage.setItem('cardsData', JSON.stringify(this.cardsData));
    }
  }

  getLocations() {
    if (!this.isEmptyObject(this.locationsJSON)) {
      return;
    }
    console.log("GETTING LOCATIONS STARTED");
    this.isAllFinishedd.subscribe(res => {
      localStorage.setItem('locations', JSON.stringify(this.locationsJSON));
      console.log(JSON.stringify(this.locationsJSON));
      this.canOpenModal = res;
      console.log("Changed the canOpenModal flag");
    }
    );

    this.locationService.getCountriesList().subscribe(
      (countriesListReceived) => {
        d3.select('p').text("wait while getting data");
        console.log("COUNTRIES received");
        console.log(countriesListReceived.length);
        console.log(countriesListReceived);
        countriesListReceived.forEach(
          (country) => this.locationsJSON[country] = {}
        );
      },
      (err) => {
        console.error(err);
      }, () => {
        Object.keys(this.locationsJSON).forEach(
          (country) => {
            this.locationService.getStatesInCountry(country).subscribe(
              (statesListReceived) => {
                console.log("states in " + country);
                console.log(statesListReceived.length);
                console.log(statesListReceived);
                // adding placeholders for Cities of each state and adding the cities 
                this.locationsJSON[country] = statesListReceived;

                // if this is the last country, toggle the button selectable
                if (Object.keys(this.locationsJSON).indexOf(country) === (Object.keys(this.locationsJSON).length - 1)) {
                  console.log("THIS WAS LAST OF ALL LASTS");
                  this.isAllFinishedd.next(true);
                }

              },
              (err) => console.error(err),
            );
          });
        d3.select('p').text("data is obtained");
      }
    );
    console.log("GETTING LOCATIONS FINISED");
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }








}




