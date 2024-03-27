import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherComponent } from './weather/weather.component';
import { EarthquakeComponent } from './earthquake/earthquake.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

//All routes defined from here
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'earthquake',
    component: EarthquakeComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'register-user',
    component: SignUpComponent,
  },
  {
    path: 'weather',
    component: WeatherComponent,
  },
  { path: '**', component: HomeComponent },
];
