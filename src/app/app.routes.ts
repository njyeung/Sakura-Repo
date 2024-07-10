import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { BackdoorComponent } from './backdoor/backdoor.component';

export const routes: Routes = [
    {path: 'backdoor', component: BackdoorComponent}, 
    {path: '', component: MainComponent}, 
];
