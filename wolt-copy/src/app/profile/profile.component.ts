import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GetProfileService } from '../services/get-profile.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { OrdersComponent } from './orders/orders.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterModule, OrdersComponent, CommonModule], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  user: any;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  editModalOpen: boolean = false; // <== новое поле

  constructor(
    private profileService: GetProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.getToken()) {
      this.router.navigate(['/auth']);
      return;
    }

    this.profileService.getProfile().subscribe({
      next: (data) => this.user = data,
      error: () => this.router.navigate(['/auth']) 
    });
  }

  openEditModal(): void {
    this.editModalOpen = true;
  }

  closeEditModal(): void {
    this.editModalOpen = false;
    this.successMessage = null;
    this.errorMessage = null;
  }

  submitEdit(): void {
    this.profileService.updateProfile(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Данные успешно обновлены!';
        this.errorMessage = null;
        setTimeout(() => {
          this.closeEditModal();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Ошибка при обновлении данных.';
        this.successMessage = null;
      }
    });
  }
}