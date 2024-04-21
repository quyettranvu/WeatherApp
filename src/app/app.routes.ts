import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherComponent } from './weather/weather.component';
import { EarthquakeComponent } from './earthquake/earthquake.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RedirectToDashboardGuard } from './shared/guard/redirect.guard';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';

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
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [RedirectToDashboardGuard],
  },
  {
    path: 'register-user',
    component: SignUpComponent,
    canActivate: [RedirectToDashboardGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify-email-address',
    component: VerifyEmailComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subscription-plan',
    component: SubscriptionPlanComponent,
  },
  { path: '**', component: HomeComponent },
];
