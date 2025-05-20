import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { passwordMismatchValidator } from '../../shared/password-mismatch.directive';
import { AuthService } from '../../services/auth.service';
import { RegisterPostData } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private registerService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  registerForm = new FormGroup({
    username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
    ]),
    email: new FormControl('', [
        Validators.required,
        Validators.email 
    ]),
    password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
    ])
}, {
    validators: passwordMismatchValidator
});

  onRegister() {
    if (this.registerForm.valid) {
        const postData: RegisterPostData = {
            username: this.registerForm.value.username || '',
            email: this.registerForm.value.email || '',
            password: this.registerForm.value.password || '',
            review: [],
            purchasedBook: [],
            purchasedMedicine: [],
            cartItem: [],
            totalBookAmount: 0,
            totalMedicineAmount: 0
        };
        this.registerService.registerUser(postData).subscribe({
            next: (response) => {
                console.log('Register response:', response);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Registered successfully'
                });
                this.router.navigate(['login']);
            },
            error: (err) => {
                console.error('Register error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.status === 0 ? 'Cannot connect to server. Is http://localhost:8080 running?' : err.message || 'Registration failed'
                });
            }
        });
    }
}

  get username() {
    return this.registerForm.controls['username'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
}