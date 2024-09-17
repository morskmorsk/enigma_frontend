import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  signupError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+?1?\d{9,15}$/)]],
      carrier: ['', Validators.required],
      monthly_payment: ['', [Validators.required, Validators.min(0), this.monthlyPaymentValidator]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { 'passwordMismatch': true }
      : null;
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    return !passwordValid ? { 'passwordStrength': true } : null;
  }

  monthlyPaymentValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const isValid = !isNaN(value) && value >= 0 && value <= 1000; // Assuming a max payment of 1000
    return isValid ? null : { 'invalidMonthlyPayment': true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const userData = {
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email,
        phone_number: this.signupForm.value.phone_number,
        carrier: this.signupForm.value.carrier,
        monthly_payment: parseFloat(this.signupForm.value.monthly_payment),
      };

      this.authService.signup(userData).subscribe(
        (response) => {
          console.log('Signup successful', response);
          // Navigate to login or home page
        },
        (error) => {
          this.signupError = error.message || 'Signup failed. Please try again.';
        }
      );
    } else {
      this.signupError = 'Please correct the errors in the form.';
    }
  }
}
