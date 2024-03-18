import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherComponent } from './weather/weather.component';
import { EarthquakeComponent } from './earthquake/earthquake.component';

//All routes defined from here
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'earthquake',
    component: EarthquakeComponent,
  },
  {
    path: 'weather',
    component: WeatherComponent,
  },
  { path: '**', component: HomeComponent },
];
