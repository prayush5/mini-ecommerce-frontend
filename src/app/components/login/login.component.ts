import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Login, User } from '../../interfaces/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, InputTextModule, FormsModule, PasswordModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: Login = {
    email: '',
    password: ''
  }; 

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  

  onLogin(form: NgForm) {
  if (form.valid) {
    const { email, password } = this.login;
    this.authService.login(email, password).subscribe({
      next: (response: User) => {
        console.log('Login response:', response);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', response.id.toString());
        localStorage.setItem('role', response.role); 
        localStorage.setItem('username', response.username);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully'
        });

        switch (response.role?.toUpperCase()) {
          case 'ADMIN':
            this.router.navigate(['/admin-home']);
            break;
          case 'AGENT':
            this.router.navigate(['/agent-home']);
            break;
          case 'CUSTOMER':
          default:
            this.router.navigate(['/home']);
            break;
}

      },
      error: (err) => {
        console.error('Login error:', err);
        let errorMessage = 'Login failed';
        if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Is http://localhost:8080 running?';
        } else if (err.status === 401) {
          errorMessage = 'Invalid email or password';
        } else {
          errorMessage = err.message || 'Login failed';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    });
  }
}

}