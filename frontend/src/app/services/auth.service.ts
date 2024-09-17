import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private tokenKey = 'auth_token';
  
  private authState = new BehaviorSubject<AuthState>({
    token: this.getStoredToken(),
    isAuthenticated: !!this.getStoredToken()
  });

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authState.asObservable().pipe(map(state => state.isAuthenticated));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{token: string}>(`${this.baseUrl}/api/api-token-auth/`, { username, password })
      .pipe(
        tap(response => this.setAuthState(response.token)),
        catchError(error => this.errorService.handleError(error))
      );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/signup/`, userData)
      .pipe(
        catchError(error => this.errorService.handleError(error))
      );
  }

  logout(): void {
    this.setAuthState(null);
  }

  private setAuthState(token: string | null): void {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
      this.authState.next({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem(this.tokenKey);
      this.authState.next({ token: null, isAuthenticated: false });
    }
  }

  getToken(): string | null {
    return this.authState.value.token;
  }
}
