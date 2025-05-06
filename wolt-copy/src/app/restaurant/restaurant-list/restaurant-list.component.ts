import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ul class="restaurant-list">
      <li *ngFor="let r of restaurants">
        <div class="restaurant-card" [routerLink]="['/restaurants', r.id]">
          <h3>{{ r.name }}</h3>
          <p>Category: {{ r.category }}</p>
          <p>Rate: ★{{ r.rating }}</p>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    .restaurant-list {
      list-style: none;
      padding: 0;
    }

    .restaurant-card {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .restaurant-card:hover {
      background-color: #34495e;
    }
  `]
})
export class RestaurantListComponent  {
  @Input() restaurants: any[] = [];
  

}  