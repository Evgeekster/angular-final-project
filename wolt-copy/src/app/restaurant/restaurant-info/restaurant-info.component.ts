import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu-service.service';
import { GetReviewsService } from '../../services/get-reviews.service';
import { Router } from '@angular/router';
import { CartComponent } from '../../cart/cart.component';
import { CartServiceService } from '../../services/cart-service.service';
import { GetOrdersService } from '../../services/get-orders.service';


@Component({
  selector: 'app-restaurant-detail',
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.css']
})
export class RestaurantInfoComponent implements OnInit {
  restaurant: any;
  menu: any[] = []; 
  reviews: any[] = [];

  totalPrice: number = 0;
  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private reviewsService: GetReviewsService,
    private cart: CartServiceService,
    private cdr: ChangeDetectorRef,
    private orderService: GetOrdersService,
    
  ) {}


  currentUserId: number = localStorage.getItem('user_id') ? Number(localStorage.getItem('user_id')) : 0; 

  deleteReview(reviewId: number): void {
    this.orderService.deleteReview(reviewId).subscribe({
      next: () => {
        console.log('Отзыв удалён');
        this.reviews = this.reviews.filter(review => review.id !== reviewId);

      },
      error: (err) => {
        console.error('Ошибка удаления отзыва', err);
        alert('Не удалось удалить отзыв.');
      }
    });
  }

  addToCart(item: any): void {
    this.cart.addItem(item);
    this.cart.updateItemQuantity(item.id); 
  }

  checkOnCart(item: any): boolean {
    return this.cart.inCart(item);
  }

  removeFromCart(item: any): void {
    this.cart.removeItem(item);
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.restaurantService.getRestaurantById(+id).subscribe(data => {
        this.restaurant = data;  
        });
      this.menuService.getMenuByRestaurant(+id).subscribe(menuData => {
        this.menu = menuData;
         console.log(this.menu);
        
      });
      this.reviewsService.getReviews(+id).subscribe(reviewsData => {
        this.reviews = reviewsData;
        
      });
      this.cart.getItems().subscribe(items => {
        this.cartItems = items;
        this.totalPrice = this.cart.getTotalPrice();
        this.cdr.detectChanges();
      });
    }
  }
}