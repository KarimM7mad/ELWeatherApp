import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import { time } from 'console';
import * as d3 from 'd3';

@Component({
  selector: 'app-city-weather-dashboard',
  templateUrl: './city-weather-dashboard.component.html',
  styleUrls: ['./city-weather-dashboard.component.css']
})
export class CityWeatherDashboardComponent implements OnInit {

  // @Input()
  public weatherDetails = {};


  public extractedData = {

    avgTempCin15Days: {},
    tempInDay0: {},

    astronomyInDay0: {},
    windspeedKmphInDay0: {}

  };

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let index = Number.parseInt(params.get('cardIndex'));
      this.weatherDetails = JSON.parse(localStorage.getItem('cardsData'))[index];
    })
  }

  onResize(event): void {
    this.draw();
  }

  ngOnInit(): void {
    console.log("Dashboard Opened");
    // to obtained By Location
    // this.weatherDetails = JSON.parse(localStorage.getItem("cardsData"))[0];
    console.log(JSON.stringify(this.weatherDetails));
    this.extractDataFromWeatherDetailsJSON();
    this.draw();
  }

  public draw() {
    this.showTempTodayLineChart();
    this.showTempIn15DaysLineChart();
  }



  public extractDataFromWeatherDetailsJSON() {
    // sunrise , sunset, ...
    this.extractedData["astronomyInDay0"] = this.weatherDetails["weather"][0]["astronomy"][0];
    // extract data from one day's hours
    this.weatherDetails["weather"][0]["hourly"].forEach(oneHrWeatherData => {
      this.extractedData.tempInDay0[oneHrWeatherData["time"]] = oneHrWeatherData["tempC"];

    });
    // get desired Data From each day
    this.weatherDetails["weather"].forEach(oneDayWeatherData => {
      // get temp from each day
      this.extractedData.avgTempCin15Days[oneDayWeatherData.date] = oneDayWeatherData.avgtempC;
    });

    d3.select('p').text(JSON.stringify(this.extractedData));

  }

  showTempIn15DaysLineChart() {
    var dataToView = [];
    var parseDate = d3.timeParse("%Y-%m-%d");
    // get Temp in 15 days
    Object.keys(this.extractedData.avgTempCin15Days).forEach(key => {
      dataToView.push({ date: parseDate(key), temp: this.extractedData.avgTempCin15Days[key] });
    });
    const svg = d3.select('#weatherIn15DaysSVG');
    svg.selectAll('*').remove();
    const width = +svg.node().parentNode.clientWidth;
    const height = +svg.node().parentNode.clientHeight;
    svg.attr("width", width).attr("height", height).attr("viewBox", '0 0 ' + width + ' ' + height + '\'');
    const render = data => {
      const title = 'Weather in 15 days';
      const xValue = d => d["date"];
      const xAxisLabel = 'day';
      const yValue = d => d["temp"];
      const yAxisLabel = 'Temperature in Celcius';
      const margin = { top: 60, right: 40, bottom: 88, left: 70 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
      const yScale = d3.scaleLinear()
        // .domain(d3.extent(data, yValue))
        .domain([(d3.min(data, yValue) - 2), (d3.max(data, yValue) - (-1))])
        .range([innerHeight, 0])
        .nice();
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      const xAxis = d3.axisBottom(xScale)
      // .tickSize(-innerHeight*0)
      // .tickPadding(15);
      const yAxis = d3.axisLeft(yScale)
      // .tickSize(-innerWidth)
      // .tickPadding(10);
      const yAxisG = g.append('g').call(yAxis);
      // yAxisG.selectAll('.domain').remove();
      yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -30)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
      const xAxisG = g.append('g').call(xAxis).attr('transform', `translate(0,${innerHeight})`);
      xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .attr("dy", "1em")
        .text(xAxisLabel);
      const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveLinear);
      g.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('class', 'line-path')
        .attr("fill", "none")
        .attr("stroke", "darkblue")
        .attr("stroke-width", "5");
      g.selectAll(".circle-germany")
        .data(data)
        .join("circle") // enter append
        .attr("fill", "black")
        .attr("stroke", "darkblue")
        .attr("r", "8") // radius
        .attr("cx", d => xScale(xValue(d)))   // center x passing through your xScale
        .attr("cy", d => yScale(yValue(d)))   // center y through your yScale
    };
    render(dataToView);
  }

  showTempTodayLineChart() {
    var dataToView = [];
    // var parseDate = d3.timeParse("%Y-%m-%d");
    // get Temp in 15 days
    Object.keys(this.extractedData.tempInDay0).forEach(key => {
      dataToView.push({ time: (Number.parseInt(key) / 100), temp: this.extractedData.tempInDay0[key] });
    });
    const svg = d3.select('#weatherTodaySVG');
    svg.selectAll('*').remove();
    const width = +svg.node().parentNode.clientWidth;
    const height = +svg.node().parentNode.clientHeight;
    svg.attr("width", width).attr("height", height).attr("viewBox", '0 0 ' + width + ' ' + height + '\'');
    const render = data => {
      const title = 'Weather in 15 days';
      const xValue = d => d["time"];
      const xAxisLabel = 'time';
      const yValue = d => d["temp"];
      const yAxisLabel = 'Temperature in Celcius';
      const margin = { top: 60, right: 40, bottom: 88, left: 70 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const xScale = d3.scaleLinear()
        .domain([(d3.min(data, xValue)), (d3.max(data, xValue) - (-1))])
        // .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
      const yScale = d3.scaleLinear()
        // .domain(d3.extent(data, yValue))
        .domain([(d3.min(data, yValue) - 1), (d3.max(data, yValue) - (-1))])
        .range([innerHeight, 0])
        .nice();
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      const xAxis = d3.axisBottom(xScale).tickFormat(x => x + ":00")
      // .tickSize(-innerHeight*0)
      // .tickPadding(15);
      const yAxis = d3.axisLeft(yScale)
      // .tickSize(-innerWidth)
      // .tickPadding(10);
      const yAxisG = g.append('g').call(yAxis);
      // yAxisG.selectAll('.domain').remove();
      yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -30)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
      const xAxisG = g.append('g').call(xAxis).attr('transform', `translate(0,${innerHeight})`);
      xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .attr("dy", "1em")
        .text(xAxisLabel);
      const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveLinear);
      g.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('class', 'line-path')
        .attr("fill", "none")
        .attr("stroke", "darkblue")
        .attr("stroke-width", "5");
      g.selectAll(".circle-germany")
        .data(data)
        .join("circle") // enter append
        .attr("fill", "black")
        .attr("stroke", "darkblue")
        .attr("r", "8") // radius
        .attr("cx", d => xScale(xValue(d)))   // center x passing through your xScale
        .attr("cy", d => yScale(yValue(d)))   // center y through your yScale
    };
    render(dataToView);
  }


}
