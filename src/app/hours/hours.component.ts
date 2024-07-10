import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { HoursService } from './services/hours.service';

@Component({
  selector: 'ssg-hours',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './hours.component.html',
  styleUrl: './hours.component.scss'
})
export class HoursComponent {
  public day: String;

  constructor(private hoursService: HoursService) {
    this.day = "";
  }

  ngOnInit() {
    this.hoursService.getDay().subscribe(day => {
      this.day = day[0];
    })
  }
}
