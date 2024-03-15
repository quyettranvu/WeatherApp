import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

//All routes defined from here
export const routes: Routes = [
  { path: '', component: HomeComponent },
  // {
  //   path: 'weather',
  //   component: WeatherComponent,
  // },
  { path: '**', component: HomeComponent },
];
