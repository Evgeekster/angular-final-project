import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://127.0.0.1:8000/api/restaurants';
  constructor(private http: HttpClient) {}
  getMenuByRestaurant(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${restaurantId}/menu/`); // Пример API для получения меню
  }
}
