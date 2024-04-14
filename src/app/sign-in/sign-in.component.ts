import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HomeComponent } from '../home/home.component';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    HomeComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  loginForm: any = FormGroup;
  password = true;
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password,
    };

    // this.authService.signIn(data.email, data.password);
    this.authService.signInRxJs(data.email, data.password).subscribe({
      next: (res) => {
        // continue procesing with returned datas
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loginwithGoogle() {
    this.authService.GoogleAuth();
  }
}
