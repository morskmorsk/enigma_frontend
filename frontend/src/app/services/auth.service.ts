import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  private hasToken(): boolean {
    return !!this.getToken();
  }

  // Login Method
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/api-token-auth/`, {
      username,
      password,
    }).pipe(
      catchError(error => this.errorService.handleError(error))
    );
  }

  // Signup Method
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/signup/`, userData).pipe(
      catchError(error => this.errorService.handleError(error))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}