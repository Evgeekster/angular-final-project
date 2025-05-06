

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { get } from 'http';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
interface Cart {
  items: CartItem[];
  totalPrice: number;
  restaurant_id: number;
} 
@Injectable({
  providedIn: 'root'
})

export class CartServiceService {
  private cartItems: CartItem[] = [];
  private restaurantId: number = 0; // ID ресторана, который будет передан в API
  
  private cart: Cart = {
    items: [],
    totalPrice: 0,
    restaurant_id: this.restaurantId,
  };
  private apiUrl = 'http://127.0.0.1:8000/api/create_order/'; //cart в localstorage

  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor(private httpClient: HttpClient) {
    this.loadCart();
  }

  private loadCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      this.cartItems = cart.items.map((item: any) => ({
        ...item,
        quantity: item.quantity && !isNaN(item.quantity) ? item.quantity : 1 
      }));
      this.cart.totalPrice = cart.totalPrice || 0;
      this.cartSubject.next(this.cartItems);
    }
  }

  addItem(item: CartItem): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity || 1; 
    } else {
      this.cartItems.push({ ...item, quantity: item.quantity && !isNaN(item.quantity) ? item.quantity : 1 });
    }
    this.updateCart();
  }
  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
    this.updateCart();
  }

  getItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable(); 
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }



  inCart(itemId: number): boolean {
    return this.cartItems.some(item => item.id === itemId);
  }

  updateItemQuantity(itemId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      item.quantity = this.getItemQuantity(itemId);
      if (item.quantity <= 0) {
        this.removeItem(item); 
      } else {
        
        this.updateCart();
      }
    }
  }

  getItemQuantity(itemId: number): number {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }


  clearCart(): void {
    this.cartItems = [];
    this.cart.totalPrice = 0;
    localStorage.removeItem('cart');
    this.cartSubject.next(this.cartItems); 
  }

  private updateCart(): void {
    this.cart.items = this.cartItems;
    this.cart.totalPrice = this.getTotalPrice();
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cartItems); 
  }

  setRestaurantId(id: number): void {
    this.restaurantId = id;
    this.cart.restaurant_id = id;
    this.updateCart();
  }

  getRandomDeliveryTime(): number {
    return Math.floor(Math.random() * (5 - 1 + 1)) + 1;
  }

  createOrder(): Observable<any> {
    const token = localStorage.getItem('token');
    const items = this.cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));
  
    return this.httpClient.post('http://127.0.0.1:8000/api/create_order/', { items, restaurant_id: this.restaurantId }, {
      headers: { Authorization: `Token ${token}` }
    });
  }
  
}

