import { Component, Output, EventEmitter} from '@angular/core';
import { SpecialRoll } from '../backdoor/SpecialRoll';
import { HomeService } from './services/home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ssg-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  bannerImage: string = "assets/images/banner.jpg";
  bannerImage2: string = "assets/images/banner2.jpg";
  constructor(private homeService: HomeService) {}
  
  specialRolls: SpecialRoll[] = [];

  @Output() newOrderEvent = new EventEmitter<string>();
  
  goToMenuPage() {
    this.newOrderEvent.emit("menu");
  }

  ngOnInit() {
    this.homeService.getSpecials().subscribe(result=>{this.specialRolls = result;});
  }
}
