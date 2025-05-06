import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h2>Вход</h2>
      <form (ngSubmit)="login()">
        <input [(ngModel)]="loginData.username" name="username" placeholder="Login" required />
        <input [(ngModel)]="loginData.password" name="password" type="password" placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>

      <hr />

      <h3>No account? <a routerLink="/register">Register</a></h3>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 300px;
      margin: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input {
      width: 100%;
      padding: 8px;
    }
    button {
      padding: 8px;
      background-color: #007bff;
      border: none;
      color: white;
      cursor: pointer;
    }
  `]
})
export class AuthComponent {
  loginData = { username: '', password: '' };
  registerData = { username: '', email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router 

  ) {}

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => this.router.navigate(['/profile']),
      error: () => alert('Ошибка входа')
    });
  }

  register() {
    this.authService.register(this.registerData).subscribe({
      next: () => alert('Регистрация прошла успешно!'),
      error: () => alert('Ошибка регистрации')
    });
  }
}
