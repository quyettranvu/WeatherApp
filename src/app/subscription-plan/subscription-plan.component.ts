import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-subscription-plan',
  standalone: true,
  imports: [HomeComponent, MatCardModule, MatButtonModule],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.scss',
})
export class SubscriptionPlanComponent {}
