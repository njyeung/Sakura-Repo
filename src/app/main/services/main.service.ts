import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'ngrok-skip-browser-warning':  '60420'
    })}


  constructor(private http: HttpClient) { } 

  endPoint: String = "https://sakurabackend.azurewebsites.net";

  // Returns true if the restaurant is open
  isOpen() {
    return this.http.get<Boolean[]>(this.endPoint + '/api/timetable/isOpen', this.httpOptions);
  }
}
