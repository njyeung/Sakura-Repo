import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './main/main.component';
import { BackdoorComponent } from './backdoor/backdoor.component';

@Component({
    selector: 'ssg-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, MainComponent, BackdoorComponent]
})
export class AppComponent {
  
  title = 'Sakura';
  
}
