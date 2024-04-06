import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signupForm: any = FormGroup;
  password = true;
  confirmPassword = true;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  validateSubmit() {
    if (
      this.signupForm.controls['password'].value !=
      this.signupForm.controls['confirmPassword'].value
    )
      return true;
    else return false;
  }

  onSubmit() {
    const formData = this.signupForm.value;
    const data = {
      email: formData.email,
      password: formData.password,
    };

    this.authService.signUp(data.email, data.password);
  }
}
