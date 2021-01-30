import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { WorldWeatherOnlineService } from 'src/app/Services/world-weather-online.service';

@Component({
  selector: 'app-landing-component',
  templateUrl: './landing-component.component.html',
  styleUrls: ['./landing-component.component.css']
})
export class LandingComponentComponent implements OnInit {


  constructor(private srv: WorldWeatherOnlineService) { }

  async ngOnInit() {
    console.log("landingCompInit");
    const ipp = await this.srv.getIpSrcObservable().toPromise();
    d3.selectAll('h1').text(ipp.ip);
    console.log("landingCompInit Finished");
  }

  // async refresh() {
  async refresh() {
    console.log("refresh Started");
    const infoo = await this.srv.getPositionWeatherPromise("Cairo",'1');

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    d3.select('p').style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
    
    console.log(JSON.stringify(infoo.data));

    console.log("refresh ended");
  }

  raiseModal() {
    console.log("raiseModal Called");


    console.log("raiseModal call ended");

  }


}
