import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetReviewsService {
  private apiUrl = 'http://127.0.0.1:8000/api/restaurants';
  constructor(private httpClient: HttpClient) { }

  getReviews(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/${id}/reviews/`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return this.httpClient.get<any[]>(`${this.apiUrl}/${id}`);
        }
        throw error;
      })
    );
  }
}
