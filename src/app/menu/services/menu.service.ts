import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuItem } from '../MenuItem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'ngrok-skip-browser-warning':  '60420'
  })};

  constructor(private http: HttpClient) { }

  endPoint: String = "https://sakurabackend.azurewebsites.net";

  // Returns all menu items
  getMenu() {
    return this.http.get<MenuItem[]>(this.endPoint + '/api/menu', this.httpOptions);
  }

  // Return all items in given category
  getMenuByCategory(category: String) {
    this.http.get<MenuItem[]>(this.endPoint + '/api/menu/category/' + category, this.httpOptions);
  }

  // Return all categories
  getCategories() {
    return this.http.get<String[]>(this.endPoint + '/api/menu/categories', this.httpOptions);
  }

  // Returns true if restaurant is open, false otherwise
  isOpen() {
    return this.http.get<Boolean[]>(this.endPoint + '/api/timetable/isOpen', this.httpOptions);
  }

  // Returns true if it is lunchtime, false otherwise
  isLunchTime() {
    return this.http.get<Boolean[]>(this.endPoint + '/api/timetable/isLunchTime', this.httpOptions);
  }

  // Return an item when given an id
  getItemById(id: number) {
    return this.http.get<MenuItem>(this.endPoint + '/api/menu/id/' + id, this.httpOptions)
  }
}
