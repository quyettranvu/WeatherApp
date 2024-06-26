import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HomeComponent, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
