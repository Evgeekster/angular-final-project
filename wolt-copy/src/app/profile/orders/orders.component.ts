

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetOrdersService } from '../../services/get-orders.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  restaurant: string;
  order_date: string;
  total_price: number;
  delivered_at: string;
  items: OrderItem[];
  delivery_address: string;
  status: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  showReviewModal: boolean = false;
  currentOrderForReview: Order | null = null;

  reviewText: string = '';
  reviewRating: number = 0;
  hoveredRating: number = 0;

  constructor(private orderService: GetOrdersService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
      
        this.orders.forEach(order => {
          if (order.status === 'pending') {
            const existingTimer = localStorage.getItem(`order_timer_${order.id}`);
            if (!existingTimer) {
              this.orderService.startOrderTimer(order.id);
            }
          }
        });
      
        this.orderService.restoreOrderTimers();
      },
      error: (err) => console.error('Ошибка при загрузке заказов', err)
    });

    this.orderService.orderDelivered$.subscribe(orderId => {
      const deliveredOrder = this.orders.find(order => order.id === orderId);
      if (deliveredOrder) {
        deliveredOrder.status = 'delivered';
        this.currentOrderForReview = deliveredOrder;
        this.showReviewModal = true;
      }
    });
  }

  getCountdownForOrder(orderId: number): Observable<number> | null {
    return this.orderService.getOrderTimer(orderId);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewText = '';
    this.currentOrderForReview = null;
  }

  submitReview(): void {
    if (this.reviewText.trim() && this.currentOrderForReview) {
      this.orderService.submitReview(this.currentOrderForReview.id, this.reviewRating, this.reviewText).subscribe({
        next: () => {
          console.log('Отзыв отправлен');
          this.closeReviewModal();
        },
        error: (err) => {
          console.error('Ошибка отправки отзыва', err);
          alert('Не удалось отправить отзыв. Попробуйте позже.');
        }
      });
    } else {
      alert('Пожалуйста, напишите отзыв.');
    }
  }

  formatCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const paddedSecs = secs < 10 ? `0${secs}` : secs;
    return `${minutes}:${paddedSecs} min`;
  }

  cancelOrder(orderId: number): void {
    this.orderService.changeOrderStatus(orderId, 'cancelled').subscribe({
      next: () => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        localStorage.removeItem(`order_timer_${orderId}`);
        console.log('Заказ отменен');
      },
      error: (err) => console.error('Ошибка отмены заказа', err)
    });
  }
}
