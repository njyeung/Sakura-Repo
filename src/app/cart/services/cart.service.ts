import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../Order';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'ngrok-skip-browser-warning':  '60420'
  })};
  
  constructor(private http: HttpClient) { }

  endPoint: String = "https://sakurabackend.azurewebsites.net";

  // Returns the current day
  submitForm(order : Order) {
    return this.http.post<Order>(this.endPoint + '/api/order', order, this.httpOptions);
  }
}
