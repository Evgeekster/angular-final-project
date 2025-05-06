import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

import {Restaurant, RestaurantService} from "../../services/restaurant.service"
// import { HttpClient, HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs';
import { RestaurantListComponent } from '../../restaurant/restaurant-list/restaurant-list.component';
import { RestaurantInfoComponent } from '../../restaurant/restaurant-info/restaurant-info.component';
import { GetReviewsService } from '../../services/get-reviews.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GoogleMapsModule, RestaurantListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  searchQuery: string = '';
  categories = [
    { name: 'Fast Food', value: 'fast_food' },
    { name: 'Fine Dining', value: 'fine_dining' },
    { name: 'Cafe', value: 'cafe' },
    { name: 'Bakery', value: 'bakery' },
    { name: 'Dessert', value: 'dessert' }
  ];

  restaurants: Restaurant[] = [];
  markers:any = [];
  reviews_from_comp: any[] = [];

  filteredRestaurants: Restaurant[] = [];
 


  
  constructor(private restaurantService: RestaurantService,
              private reviewsService: GetReviewsService,               
  ) {}

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = data; 
        this.loadMarkers();
      },
      error: (err) => console.error('Ошибка загрузки ресторанов:', err)
    });
  }

  center = { lat: 44.7866, lng: 20.4489 };

  loadMarkers() {
  this.markers = this.restaurants.map(restaurant => ({
    position: {
      lat: Number(restaurant.lan),
      lng: Number(restaurant.lon)
    },
    title: restaurant.name,
    id: restaurant.id,

  }));
  
  }
  selectedRestaurant: any = null;

  categoryFilter(cat: string) {
    this.markers = this.restaurants.filter(restaurant => restaurant.category === cat).map(restaurant => ({
      position: {
        lat: Number(restaurant.lan),
        lng: Number(restaurant.lon)
      },
      title: restaurant.name,
      id: restaurant.id,
    }));

    this.restaurants = this.restaurants.filter(restaurant => restaurant.category === cat);

  }

  clearFilters(): void{
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loadMarkers();
      },
      error: (err) => console.error('Ошибка загрузки ресторанов:', err)
    });
  }

  openModal(marker: any) {
    this.reviewsService.getReviews(marker.id).subscribe({
      next: (reviews) => {
        this.selectedRestaurant = {
          title: marker.title,
          description: marker.description || 'cool.',
          reviews: Array.isArray(reviews) ? reviews.slice(0, 4) : 'No reviews yet.',
        };
        console.log(this.selectedRestaurant.reviews);
      },
      error: (err) => console.error('error:', err)
    });
  }

  closeModal() {
    this.selectedRestaurant = null;
  }

 

  search(){
    console.log('clicked', this.searchQuery);
    if (this.searchQuery === '') {
      this.filteredRestaurants = this.restaurants;
      this.loadMarkers();
      return;
    }
    this.filteredRestaurants =  this.restaurants.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
             restaurant.category.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
    this.markers = this.filteredRestaurants.map(restaurant => ({
      position: {
        lat: Number(restaurant.lan),
        lng: Number(restaurant.lon)
      },
      title: restaurant.name,
      id: restaurant.id,
    }));
    console.log(this.filteredRestaurants);
  }
}