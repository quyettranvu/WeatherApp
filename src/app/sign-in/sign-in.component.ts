import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(
    public authService: AuthService
  ) {}
}
