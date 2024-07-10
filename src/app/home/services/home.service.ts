import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpecialRoll } from '../../backdoor/SpecialRoll';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  endPoint: String = "https://sakurabackend.azurewebsites.net";

  getSpecials() {
    return this.http.get<SpecialRoll[]>(this.endPoint + '/api/settings/specialRolls');
  }
}
