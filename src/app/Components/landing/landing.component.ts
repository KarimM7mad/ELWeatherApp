import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LandingComponentComponent implements OnInit, OnDestroy, DoCheck {
  public cardsData = [];
  public locationsJSON = {};
  public closeResult = '';
  public canOpenModal = false;
  public isAllFinishedd = new Subject<boolean>();

  constructor(
    private weatherService: WorldWeatherOnlineService,
    private locationService: LocationService,
    private locationModal: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngDoCheck(): void {
    if (this.cardsData.length === 0) {
      this.addCurrIPsWeather();
    }
    if (!this.isEmptyObject(this.locationsJSON)) {
      this.getLocations();
    }
  }

  ngOnInit() {
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

  }

  getCurrWeatherDetailsByIp() {
    // console.log('refresh Started');
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

  addCurrIPsWeather() {
    this.weatherService.getPositionWeather().subscribe((dataReceived) => {
      this.addToCardsIfNotExist(dataReceived);
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')').text("added From addCurrIPsWeather");
    }, (err) => {
      let r = Math.floor(Math.random() * 127) + 128;
      let g = Math.floor(Math.random() * 127) + 128;
      let b = Math.floor(Math.random() * 127) + 128;
      d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')').text("CAN'T GET IP");
    });

  }

  openLocationModal() {

    if (!this.canOpenModal) {
      return;
    }

    const modalRef = this.locationModal.open(DataPickerDialogComponent);
    modalRef.componentInstance.openningSrcId = 'openLocationModalBtn';
    modalRef.componentInstance.locationsStored = this.locationsJSON;
    modalRef.componentInstance.passEntry.subscribe(
      arg => {
        console.log("choices received");
        console.log(JSON.stringify(arg));

        var q = "";
        if (arg["state"].length > 0 && arg["country"].length > 0) {
          q = arg["state"] + "," + arg["country"];
        } else {
          if (arg["state"].length === 0)
            q = arg["country"];
          if (arg["country"].length === 0)
            q = arg["state"];
        }

        console.log(q);

        this.weatherService.getPositionWeather(q, '1').subscribe((dataReceived) => {
          let index = this.addToCardsIfNotExist(dataReceived);
          modalRef.close();
          this.router.navigate(['/cityDashboard', index]);
        });

      }
    );

  }

  getCardIndex(arg): Number {

    for (let i = 0; i < this.cardsData.length; i++) {

      if (arg["state"].length > 0 && arg["country"].length > 0) {
        if (this.cardsData[i]['nearest_area'][0]['areaName'][0]['value'] == arg["state"] && this.cardsData[i]['nearest_area'][0]['country'][0]['value'] == arg["country"]) {
          return i;
        }
      }
      else {
        if (arg["state"].length === 0) {
          if (this.cardsData[i]['nearest_area'][0]['country'][0]['value'] == arg["country"]) {
            return i;
          }
        }
        if (arg["country"].length === 0) {
          if (this.cardsData[i]['nearest_area'][0]['areaName'][0]['value'] == arg["state"]) {
            return i;
          }
        }
      }
    }
    return -1;
  }

  addToCardsIfNotExist(dataToAdd) {
    console.log('THE NEW JSON TO BE ADDED IS:' + JSON.stringify(dataToAdd));
    console.log('SIZE OF CARDS DATA BEFORE:' + this.cardsData.length);

    for (let i = 0; i < this.cardsData.length; i++) {
      if (this.cardsData[i]['nearest_area'][0]['region'][0]['value'] == dataToAdd['nearest_area'][0]['region'][0]['value']) {
        return i;
      }
    }
    this.cardsData.push(dataToAdd);

    console.log(this.cardsData);
    console.log('JSON ADDED');
    console.log('SIZE OF CARDS DATA AFTER ADITION:' + this.cardsData.length);
    return this.cardsData.length - 1;
  }

  ngOnDestroy(): void {
    if (this.cardsData.length > 0) {
      localStorage.removeItem('cardsData');
      localStorage.setItem('cardsData', JSON.stringify(this.cardsData));
    }
    if (!this.isEmptyObject(this.locationsJSON)) {
      localStorage.removeItem('locations');
      localStorage.setItem('locations', JSON.stringify(this.locationsJSON));
    }
  }

  getLocations() {
    if (!this.isEmptyObject(this.locationsJSON)) {
      return;
    }
    console.log("GETTING LOCATIONS STARTED");
    this.isAllFinishedd.subscribe(res => {
      d3.select('p').style('background-color', 'green').text("Locations Accquired");
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




