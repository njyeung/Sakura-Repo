import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HoursService {
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'ngrok-skip-browser-warning':  '60420'
  })};

  constructor(private http: HttpClient) { }

  endPoint: String = "https://sakurabackend.azurewebsites.net";

  // Returns the current day
  getDay() {
    return this.http.get<String[]>(this.endPoint + '/api/timetable/localDay', this.httpOptions);
  }
}
