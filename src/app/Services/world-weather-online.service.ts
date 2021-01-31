import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { IipSrc } from '../PromisesTemplates/ipSrc';


import { Observable, of, throwError } from "rxjs";
import { catchError, map, retry } from 'rxjs/operators';


@Injectable()
export class WorldWeatherOnlineService implements OnInit {

  apiUrl = "https://api.worldweatheronline.com/premium/v1/weather.ashx";
  apiKey = '4475f345b7f44613857190726212801';
  format = 'json';
  includelocation = 'y';
  public ipAddress = "";


  constructor(private http: HttpClient) {
    console.log("finished initForService");
  }

  ngOnInit() {
    this.getTheCurrIp();
    console.log("finished initForService");

  }


  private async getTheCurrIp() {
    const promise = await this.getIpSrcObservable().toPromise();
    console.log("promiseIP =[" + promise.ip + "]");
    this.ipAddress = promise.ip;
    console.log("IP =[" + this.ipAddress + "]");
  }

  getIpSrcObservable(): Observable<IipSrc> {
    return this.http.get<IipSrc>("https://api.ipify.org/", { params: { 'format': "json" }, headers: { 'Content-Type': 'application/json' } })
      .pipe(retry(1), catchError(this.handleError));
  }


  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log("ELERR MSGG");
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * getPositionWeather
   */
  public getPositionWeather(q: string, tp: string) {

    if (q == null || q.length === 0) {
      this.getTheCurrIp();
      if (this.ipAddress.length === 0)
        return null;
      q = this.ipAddress;
    }

    if (tp == null || tp.length === 0) {
      tp = '1';
    }

    console.log("q in getPosWeather=[" + q + "]");

    const opts = new HttpParams()
      .set('q', q)
      .set('key', this.apiKey)
      .set('format', this.format)
      .set('includelocation', 'yes')
      .set('tp', tp);

    return this.http.get(this.apiUrl, { params: opts }).pipe(retry(1), catchError(this.handleError));
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
