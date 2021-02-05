import { Component, OnInit, ɵgetDebugNode__POST_R3__ } from '@angular/core';
import * as d3 from 'd3';
import { max } from 'rxjs/operators';

@Component({
  selector: 'app-city-weather-dashboard',
  templateUrl: './city-weather-dashboard.component.html',
  styleUrls: ['./city-weather-dashboard.component.css']
})
export class CityWeatherDashboardComponent implements OnInit {

  public weatherDetails = {};

  public extractedData = {

    avgTempCin15Days: {},
    tempInDay0: {},

    astronomyInDay0: {},
    windspeedKmphInDay0: {}

  };

  constructor() { }

  ngOnInit(): void {

    console.log("Dashboard Opened");

    // to obtained By Location
    this.weatherDetails = JSON.parse(localStorage.getItem("cardsData"))[0];

    console.log(JSON.stringify(this.weatherDetails));

    this.extractDataFromWeatherDetailsJSON();
    this.showWeatherIn15DaysLineChart();

  }


  showWeatherIn15DaysLineChart() {




   


    var width = 600;
    var height = 400;
 var svg = d3.select('#weatherSVG').attr('width',width ).attr('height', height);

    var parseDate = d3.timeParse("%Y-%m-%d");

    var dataToView = [];


    // get desired Data From each day
    this.weatherDetails["weather"].forEach(oneDayWeatherData => {
      // get temp from each day
      this.extractedData.avgTempCin15Days[oneDayWeatherData.date] = oneDayWeatherData.avgtempC;
      dataToView.push({ date: parseDate(oneDayWeatherData.date), temp: oneDayWeatherData.avgtempC });

    });

    // ;; debugger

    var minDate = d3.min(dataToView, function (d) { return d["date"]; });
    var maxDate = d3.max(dataToView, function (d) { return d["date"]; });
    var maxTemp = d3.max(dataToView, function (d) { return d["temp"]; });

    var y = d3.scaleLinear()
      .domain([0, maxTemp])
      .range([height, 0]);

    var x = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width]);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    var chartGrp = svg.append('g').attr('transform', 'translate(50,10)');

    var line = d3.line()
      .x(function (d) { return x(d["date"]); })
      .y(function (d) { return y(d["temp"]); });


    chartGrp.append('path').attr('d', line(dataToView));
    chartGrp.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
    chartGrp.append('g').attr('class', 'y axis').call(yAxis);




    // var scale = d3.scale.linear()
    //   .domain([0, 1])
    //   .range([${0,width}])




  }


  public extractDataFromWeatherDetailsJSON() {

    // sunrise , sunset, ...
    this.extractedData["astronomyInDay0"] = this.weatherDetails["weather"][0]["astronomy"][0];

    // get desired Data From each day
    this.weatherDetails["weather"].forEach(oneDayWeatherData => {
      // get temp from each day
      this.extractedData.avgTempCin15Days[oneDayWeatherData.date] = oneDayWeatherData.avgtempC;

      // oneDayWeatherData.array.forEach(hoursWeatherData => {


      // });



      // sunhours.push(element.sunHour);
    });

    d3.select('p').text(JSON.stringify(this.extractedData));

  }



}
