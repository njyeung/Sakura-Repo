import { Component } from '@angular/core';
import { BackdoorService } from './services/backdoor.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecialRoll } from './SpecialRoll';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'ssg-backdoor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './backdoor.component.html',
  styleUrl: './backdoor.component.scss'
})
export class BackdoorComponent {

  errorMessage: boolean = false;
  password: any = "";
  displayPage: boolean = false;

  waitTime: number = 0;
  isClosed: boolean = false;
  rolls: SpecialRoll[] = [];
  newRoll: SpecialRoll = {price: "0", description:"", name: ""};

  constructor(private backdoorService: BackdoorService) {}

  submitPassword(value: any) {
    this.backdoorService.check(value)
    .pipe(catchError(error => {
      this.errorMessage = true;
      return throwError(error);}))
      .subscribe(result=>{
      if(result == true) {
        this.displayPage = true;
        this.errorMessage = false;
        this.password = value;
        localStorage.setItem('backdoor', value);
        this.getSettings();
        return;
      }
      else{
        this.errorMessage = true;
      }
    });
  }

  updateWaitTime(){
    this.backdoorService.setWaittime(this.waitTime, this.password).subscribe(result=>{
        if(result == true) {
          window.location.reload();
        }
    });

  }

  toggleClose() {
    this.isClosed = !this.isClosed;
    this.backdoorService.setTempClose(this.isClosed, this.password).subscribe(result=>{
      if(result == true) {
        window.location.reload();
      }
    });
  }

  addItem() {
    this.backdoorService.addSpecialRoll(this.newRoll, this.password)
    .subscribe(result=>{
      if(result == true) {
        this.newRoll = {price: "", description:"", name: ""};
        window.location.reload();
      }
    });
  }

  removeItem(roll: SpecialRoll) {
    this.backdoorService.removeSpecialRoll(roll, this.password).subscribe(result => {
      window.location.reload();
    })
  }

  getSettings() {
    this.backdoorService.getSettings(this.password).subscribe(result=>{
      this.waitTime = result.waittime;
      this.isClosed = result.tempClose;
      this.rolls = result.specialRolls;
    });
  }

  ngOnInit() {
    if(localStorage.getItem('backdoor') != null) {
      this.password = localStorage.getItem('backdoor');
      this.backdoorService.check(this.password)
      .subscribe(result=>{
        if(result==true) {
          this.displayPage = true;
          this.getSettings();
        }
      });
    }
  }
}
