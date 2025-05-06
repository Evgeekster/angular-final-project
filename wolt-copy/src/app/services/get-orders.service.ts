
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Order } from '../profile/orders/orders.component';

@Injectable({
  providedIn: 'root'
})
export class GetOrdersService {
  private apiUrl = 'http://127.0.0.1:8000/api/profile/orders/';
  private orderUrl = 'http://127.0.0.1:8000/api/orders/';
  
  private orderTimers = new Map<number, BehaviorSubject<number>>();
  private orderDeliveredSubject = new Subject<number>();
  orderDelivered$ = this.orderDeliveredSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserOrders(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });
    return this.http.get(this.apiUrl, { headers });
  }

  changeOrderStatus(orderId: number, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });
    return this.http.patch(`${this.orderUrl}${orderId}/`, { status }, { headers });
  }

  submitReview(orderId: number, rating: number, review: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });
    return this.http.post(`${this.orderUrl}${orderId}/review/`, { rating, review }, { headers });
  }

  deleteReview(reviewId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Token ${token}` };
    return this.http.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}/delete/`, { headers });
  }

  startOrderTimer(orderId: number): void {
    const minutes = this.getRandomDeliveryTime();
    const totalSeconds = minutes * 60;
    const startTime = Date.now();
    
    localStorage.setItem(`order_timer_${orderId}`, JSON.stringify({ startTime, totalSeconds }));

    const countdown$ = new BehaviorSubject<number>(totalSeconds);

    if (this.orderTimers.has(orderId)) {
      this.orderTimers.get(orderId)?.complete();
      this.orderTimers.delete(orderId);
    }

    this.orderTimers.set(orderId, countdown$);

    timer(0, 1000).pipe(
      map(elapsed => totalSeconds - elapsed),
      takeWhile(remaining => remaining >= 0)
    ).subscribe({
      next: (remaining) => countdown$.next(remaining),
      complete: () => {
        countdown$.next(0);
        countdown$.complete();
        localStorage.removeItem(`order_timer_${orderId}`);
        this.changeOrderStatus(orderId, 'completed').subscribe({
          next: () => this.orderDeliveredSubject.next(orderId),
          error: (err) => console.error('Ошибка при обновлении статуса заказа', err)
        });
      }
    });
  }

  private getRandomDeliveryTime(): number {
    return Math.random() * (2 - 1) + 1;
  }

  getOrderTimer(orderId: number): Observable<number> | null {
    return this.orderTimers.get(orderId)?.asObservable() || null;
  }

  stopOrderTimer(orderId: number): void {
    if (this.orderTimers.has(orderId)) {
      this.orderTimers.get(orderId)?.complete();
      this.orderTimers.delete(orderId);
      this.changeOrderStatus(orderId, 'delivered').subscribe();
    }
  }

  restoreOrderTimers(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('order_timer_')) {
        const orderId = Number(key.replace('order_timer_', ''));
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        
        if (data.startTime && data.totalSeconds) {
          const elapsedSeconds = Math.floor((Date.now() - data.startTime) / 1000);
          const remainingSeconds = data.totalSeconds - elapsedSeconds;

          if (remainingSeconds > 0) {
            const countdown$ = new BehaviorSubject<number>(remainingSeconds);
            this.orderTimers.set(orderId, countdown$);

            timer(0, 1000).pipe(
              map(elapsed => remainingSeconds - elapsed),
              takeWhile(remaining => remaining >= 0)
            ).subscribe({
              next: (remaining) => countdown$.next(remaining),
              complete: () => {
                countdown$.next(0);
                countdown$.complete();
                localStorage.removeItem(`order_timer_${orderId}`);
                this.changeOrderStatus(orderId, 'completed').subscribe({
                  next: () => this.orderDeliveredSubject.next(orderId),
                  error: (err) => console.error('Ошибка при обновлении статуса заказа', err)
                });
              }
            });
          } else {
            localStorage.removeItem(`order_timer_${orderId}`); // Ensure the timer is removed immediately
            this.getUserOrders().subscribe({
              next: (orders: Order[]) => {
                const order = orders.find(o => o.id === orderId);
                if (order && order.status !== 'completed') {
                  this.changeOrderStatus(orderId, 'completed').subscribe({
                    next: () => this.orderDeliveredSubject.next(orderId),
                    error: (err) => console.error('Ошибка при обновлении завершённого заказа', err)
                  });
                }
              },
              error: (err) => console.error('Ошибка при получении заказов', err)
            });
          }
        }
      }
    });
  }
}
