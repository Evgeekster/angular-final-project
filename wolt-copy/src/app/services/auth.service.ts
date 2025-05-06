import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedIn.asObservable();
  

  constructor(
    private http: HttpClient
,   private router: Router
  
  ) {
    this.loggedIn.next(!!localStorage.getItem('token'));
   
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((res: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user_id', res.user_id)
          console.log('Token saved:', res.token);
        }
        this.loggedIn.next(true);
        this.router.navigate(['/home']);
       
      })
    );
  }

  register(data: { username: string, password: string, email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}
