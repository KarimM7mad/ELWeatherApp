import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IipSrc } from '../ipSrc';


@Injectable()
export class WorldWeatherOnlineService implements OnInit {

  apiUrl = "https://api.worldweatheronline.com/premium/v1/weather.ashx";
  apiKey = '4475f345b7f44613857190726212801';
  format = 'json';
  includelocation = 'y';
  public ipAddress = "";


  constructor(private http: HttpClient) {

    // await this.getIpSrcObservable().subscribe(res => this.assignIpSrc(res));
    this.getTheCurrIp();
    console.log("finished initForService");


  }



  ngOnInit() {

    // await this.getIpSrcObservable().subscribe(res => this.assignIpSrc(res));
    this.getTheCurrIp();
    console.log("finished initForService");

  }


  private async getTheCurrIp() {
    const promise = await this.getIpSrcObservable().toPromise();
    console.log("promiseIP =[" + promise.ip + "]");
    // console.log("IP =[" + this.ipAddress + "]");
    // console.log("IP =[" + this.ipAddress + "]");
    // return promise.ip;

    this.ipAddress = promise.ip;
    console.log("IP =[" + this.ipAddress + "]");



    // console.log("elIPAdreess");
    // console.log(promise.ip);

  }


  getIpSrcObservable(): Observable<IipSrc> {
    return this.http.get<IipSrc>("https://api.ipify.org/",
      {
        params: { 'format': "json" },
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * getPositionWeather
   */
  public getPositionWeather() {

    // return this.getIpSrcObservable();

    // return this.getIpSrcObservable();

    this.getTheCurrIp();
    console.log("IP in getPosWeather=[" + this.ipAddress + "]");


    const opts = new HttpParams()
      .set('q', this.ipAddress)
      .set('key', this.apiKey)
      .set('format', this.format)
      .set('includelocation', 'yes')
      .set('tp', '1');

    return this.http.get(this.apiUrl, { params: opts }).toPromise();

  }

  public assignIpSrc(x: IipSrc) {
    console.log("-----------------");
    console.log("the X in srcIpToBeAssigned is");
    console.log(x);
    console.log(x.ip);
    console.log("------------------");
    this.ipAddress = x.ip;
    console.log("ip address After Assignment is");
    console.log(this.ipAddress);
    console.log("------------------");

  }





}
