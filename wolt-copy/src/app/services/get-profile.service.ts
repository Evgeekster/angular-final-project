import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GetProfileService {
  private apiUrl = 'http://localhost:8000/api/profile/';
  private putApiUrl = 'http://localhost:8000/api/profile/update/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    return this.http.get(this.apiUrl, { headers });
  }

  updateProfile(data: { phone_number: string, address: string }): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(this.putApiUrl, data, {
      headers: { Authorization: `Token ${token}` }
    });
  }
}
