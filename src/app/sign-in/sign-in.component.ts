import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HomeComponent } from '../home/home.component';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    HomeComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  [x: string]: any;
  constructor(public authService: AuthService) {}

  //Values
  emailFormControl = new FormControl<string>('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl<string>('', [
    Validators.required,
    Validators.pattern('/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[W_]).{8,}$/'),
  ]);
}
