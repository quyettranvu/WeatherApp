import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [HomeComponent, CommonModule, RouterModule, MatIconModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
