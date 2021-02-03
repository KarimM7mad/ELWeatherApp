import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from "rxjs";

@Injectable()
export class LocationService implements OnInit {

  public urls_universalTutorial = {
    getAccessTokenURL: 'https://www.universal-tutorial.com/api/getaccesstoken',
    getCountriesListURL: 'https://www.universal-tutorial.com/api/countries',
    getStatesInCountryURL: 'https://www.universal-tutorial.com/api/states/',
    getCitiesInStateURL: 'https://www.universal-tutorial.com/api/cities/'
  }


  public urls_Battuta = {
    getCountriesListURL: 'https://www.universal-tutorial.com/api/countries',
    getStatesInCountryURL: 'https://www.universal-tutorial.com/api/states/',
    // getCitiesInStateURL: 'https://www.universal-tutorial.com/api/cities/'
  }

  public headersDataNeeded = {
    apiKey: 'RIPCSmWYP4SHnJHupgeEk_KpMzQt7vpsdSfqhKNO6Xm7BZZ3e-vW2mVWAlx9nh7PA4w',
    accessToken: '',
    userEmail: 'KarimMohamed95@hotmail.com'
  }

  public accessTokenRequestHeaders = {
    'Accept': "application/json",
    'api-token': this.headersDataNeeded.apiKey,
    'user-email': this.headersDataNeeded.userEmail
  };

  constructor(private http: HttpClient) {
    this.getAccessToken().subscribe(
      (res) => this.headersDataNeeded.accessToken = res["auth_token"],
      (err) => { console.log("Error in get AccessToken " + err); });
    console.log("finished Constructor CountriesAndStatesService");
  }

  async ngOnInit() {
    this.getAccessToken().subscribe(
      (res) => this.headersDataNeeded.accessToken = res["auth_token"],
      (err) => { console.log("Error in get AccessToken " + err); });
    console.log("finished OnInit CountriesAndStatesService");
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
    return throwError(error); // return another `error`
  }

  getAccessToken() {

    return this.http.get(this.urls_universalTutorial.getAccessTokenURL, { headers: this.accessTokenRequestHeaders, responseType: "json" }).pipe(retry(1), catchError(this.handleError));
  }

  public getCountriesList(): Observable<any[]> {
    if (this.headersDataNeeded.accessToken.length == 0 || this.headersDataNeeded.accessToken === '') {
    this.getAccessToken().subscribe(
      (res) => this.headersDataNeeded.accessToken = res["auth_token"],
      (err) => console.log("Error in get AccessToken" + err));
    }
    //prepare the getStates Observable with the country Name given
    var requestHeaders = {
      'Accept': "application/json",
      'Authorization': 'Bearer ' + this.headersDataNeeded.accessToken
    }
    return this.http
      .get<any[]>(
        this.urls_universalTutorial.getCountriesListURL,
        { headers: requestHeaders }
      )
      .pipe(
        map(receivedData => {
          console.log("entered mapping countries");
          return receivedData.map(element => element["country_name"]);
        }),
        retry(1),
        catchError(this.handleError));
  }

  public getStatesInCountry(countryName: String): Observable<any[]> {
    if (countryName.length === 0 || countryName == "") {
      return null;
    }
    // if (this.headersDataNeeded.accessToken.length == 0 || this.headersDataNeeded.accessToken === '') {
    this.getAccessToken().subscribe(
      (res) => this.headersDataNeeded.accessToken = res["auth_token"],
      (err) => console.log("Error in get AccessToken" + err));
    // }
    //prepare the getStates Observable with the country Name given
    var requestHeaders = {
      'Accept': "application/json",
      'Authorization': 'Bearer ' + this.headersDataNeeded.accessToken
    }
    return this.http
      .get<any[]>(
        this.urls_universalTutorial.getStatesInCountryURL + countryName,
        { headers: requestHeaders }
      )
      .pipe(
        map(receivedData => { return receivedData.map(element => element["state_name"]); }),
        retry(1),
        catchError(this.handleError));
  }

  // public getCitiesInState(stateName: String): Observable<any[]> {
  //   if (stateName.length === 0 || stateName == "") {
  //     return null;
  //   }
  //   // get access token if not found
  //   // if (this.headersDataNeeded.accessToken.length == 0 || this.headersDataNeeded.accessToken === '') {
  //     this.getAccessToken().subscribe(
  //       (res) => this.headersDataNeeded.accessToken = res["auth_token"],
  //       (err) => console.log("Error in get AccessToken" + err));
  //   // }
  //   // prepare the getCities Observable with State Name Given
  //   var requestHeaders = {
  //     'Accept': "application/json",
  //     'Authorization': 'Bearer ' + this.headersDataNeeded.accessToken
  //   }
  //   return this.http
  //     .get<any[]>(
  //       this.urls_universalTutorial.getCitiesInStateURL + stateName,
  //       { headers: requestHeaders }
  //     )
  //     .pipe(
  //       map(receivedData => { return receivedData.map(element => element["city_name"]); }),
  //       retry(1),
  //       catchError(this.handleError));

  // }

}
