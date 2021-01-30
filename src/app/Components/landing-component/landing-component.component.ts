import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { IipSrc } from 'src/app/ipSrc';
import { WorldWeatherOnlineService } from 'src/app/Services/world-weather-online.service';

@Component({
  selector: 'app-landing-component',
  templateUrl: './landing-component.component.html',
  styleUrls: ['./landing-component.component.css']
})
export class LandingComponentComponent implements OnInit {


  constructor(private srv: WorldWeatherOnlineService) { }

  ngOnInit() {
    console.log("landingCompInit");
    // let data: any;
    // .subscribe(
    //   (dataa) => {
    //     console.log("returned from service");
    //     // console.log("THE DATAAA ENTERED IS:" + dataa.toString());
    //     // this.ipp = dataa
    //     // d3.select('p').value(this.ipp.ip);

    //   });
    // console.log("after subscibe service");


    console.log("landingCompInit Finished");
  }

  async onClick() {
    console.log("onClick Started");
    const infoo = await this.srv.getPositionWeather();

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')').text(JSON.stringify(infoo));

    console.log("onClick ended");
  }


}
