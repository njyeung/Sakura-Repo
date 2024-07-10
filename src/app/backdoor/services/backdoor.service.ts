import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpecialRoll } from '../SpecialRoll';
import { Settings } from '../Settings';

@Injectable({
  providedIn: 'root'
})
export class BackdoorService {

  constructor(private http: HttpClient) { }

  endPoint: String = "https://sakurabackend.azurewebsites.net";

  // Check if password is correct
  check(password: string) {
    let params = new HttpParams()
      .set('auth', password)
    return this.http.get<boolean>(this.endPoint + '/api/settings/check', {params: params});
  }

  // Get settings
  getSettings(password: string) {
    let params = new HttpParams()
      .set('auth', password)
    return this.http.get<Settings>(this.endPoint + '/api/settings', {params: params});
  }

  // Set waittime
  setWaittime(time: number, password: string) {
    let params = new HttpParams()
      .set('auth', password)
      
    return this.http.post<boolean>(this.endPoint + '/api/settings/waitTime', time, {params: params});
  }

  // Set tempClose
  setTempClose(toSet: boolean, password: string) {
    let params = new HttpParams()
      .set('auth', password)
      
    return this.http.post<boolean>(this.endPoint + '/api/settings/tempClose', toSet, {params: params});
  }

  // Remove Special Roll
  removeSpecialRoll(toRemove: SpecialRoll, password: string) {
    let params = new HttpParams()
      .set('auth', password)
      
    return this.http.post<boolean>(this.endPoint + '/api/settings/removeSpecialRoll', toRemove, {params: params});
  }

  // Add Special Roll
  addSpecialRoll(newRoll: SpecialRoll, password: string) {
    let params = new HttpParams()
      .set('auth', password)
      
    return this.http.post<boolean>(this.endPoint + '/api/settings/addSpecialRoll', newRoll, {params: params});
  }
}
