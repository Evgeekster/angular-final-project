import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://127.0.0.1:8000/api/register/', payload).subscribe({
      next: () => {
        this.successMessage = 'Регистрация успешна!';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Ошибка регистрации. Проверьте данные.';
        this.successMessage = '';
      }
    });
  }
}