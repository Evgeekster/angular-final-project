import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Restaurant {
  id: number;
  name: string;
  location: string;
  lan: number;
  lon: number;
  rating: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://127.0.0.1:8000/api/restaurants/';
  constructor(private http: HttpClient) { }
  getRestaurants(): Observable<Restaurant[]> {
   
    return this.http.get<Restaurant[]>(this.apiUrl);
  }
  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}${id}/`);
  }
}
