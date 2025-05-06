import { Component, OnInit, Input } from '@angular/core';
import { CartServiceService } from '../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { GetOrdersService } from '../services/get-orders.service';
import { OrdersComponent } from '../profile/orders/orders.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, OrdersComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})

export class CartComponent implements OnInit {
  @Input() restaurantId!: number;
  cartItems: any[] = [];
  total: number = 0;

  deliveryTime: number = 0;
  countdown: number = 0;
  showModal: boolean = false;
  intervalId: any;

  constructor(
    private cartService: CartServiceService,
    private orderService: GetOrdersService

  ) {}

  ngOnInit(): void {
    this.cartService.setRestaurantId(this.restaurantId);
    this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotalPrice();
    });
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item);
  }

  updateItemQuantity(item: any, quantity: number): void {
    this.cartService.updateItemQuantity(item.id);
  }


  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
  }

  submitOrder() {
    console.log('Submitting order...');
    this.cartService.createOrder().subscribe({
      next: (response) => {
        const orderId = response.id; 
        const deliveryMinutes = this.cartService.getRandomDeliveryTime();
  
        if (orderId) {
          this.orderService.startOrderTimer(orderId);
        }
        
        this.deliveryTime = deliveryMinutes;
        this.countdown = deliveryMinutes * 60; 
        this.showModal = true;
        this.orderService.startOrderTimer(orderId);
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error('Ошибка при оформлении заказа', err);
      }
    });
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.intervalId);
        this.showModal = false;
      }
    }, 1000);
  }

  closeModal() {
    this.showModal = false;
    clearInterval(this.intervalId);
  }

  checkout(): void {
    this.cartService.createOrder().subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.clearCart();
      },
      error: (error) => {
        alert(`Error creating order: ${error}`);
      }
    });
    
  }
}
