// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
  
      this.authService.login(username, password).subscribe(
        (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.loginError = error.message || 'Invalid username or password.';
        }
      );
    } else {
      this.loginError = 'Please enter your username and password.';
    }
  }
}