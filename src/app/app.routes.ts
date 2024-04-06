import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherComponent } from './weather/weather.component';
import { EarthquakeComponent } from './earthquake/earthquake.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { authGuard } from './shared/guard/auth.guard';

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
    canActivate: [authGuard],
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
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify-email-address',
    component: VerifyEmailComponent,
  },
  { path: '**', component: HomeComponent },
];
