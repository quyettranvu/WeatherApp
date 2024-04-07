import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSidenavModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  menuItems = [
    { label: 'Home', link: '/home' },
    { label: 'Earthquake', link: '/earthquake' },
    { label: 'Weather', link: '/weather' },
    { label: 'SignUp', link: '/register-user' },
    { label: 'Login', link: '/sign-in' },
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.updateMenuItems(); //when component is initialized then will base on user'login to update
  }

  updateMenuItems() {
    if (this.authService.IsLogIn === true) {
      this.menuItems = this.menuItems.filter(
        (item) => item.label !== 'SignUp' && item.label !== 'Login',
      );
      this.menuItems.push({ label: 'Dashboard', link: '/dashboard' });
    } else {
      const isLogInExists = this.menuItems.some(
        (item) => item.label === 'Login',
      );
      const isSignUpExists = this.menuItems.some(
        (item) => item.label === 'SignUp',
      );
      if (!isLogInExists)
        this.menuItems.push({ label: 'Login', link: '/sign-in' });
      if (!isSignUpExists)
        this.menuItems.push({ label: 'SignUp', link: '/sign-in' });
    }
  }
}
