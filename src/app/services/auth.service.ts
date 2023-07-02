import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserAuthToken } from '../models/user.interface';

interface Response {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenKey = 'auth_token';
  private _parsedAuthToken: UserAuthToken | null = null;
  private _isAdmin: boolean = false;
  private _isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  get authToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  get user(): UserAuthToken | null {
    if (!this.isLoggedIn) return null;

    return this._parsedAuthToken;
  }

  get isAdmin(): boolean {
    if (!this._parsedAuthToken) return false;

    this._isAdmin = this.checkIsAdmin(this._parsedAuthToken);

    return this._isAdmin;
  }

  get isLoggedIn(): boolean {
    const token = this.authToken;

    if (!token) return false;

    if (!this._parsedAuthToken) {
      const parsedAuthToken: UserAuthToken = this.parseJwt(token);
      this._parsedAuthToken = parsedAuthToken;
    }

    this._isLoggedIn = !!this._parsedAuthToken;

    return this._isLoggedIn;
  }

  register(email: string, password: string, fio: string): Observable<Response> {
    const body = { email, password, fio };

    return this.http.post<Response>(`${environment.baseUrl}/auth/registration`, body).pipe(
      tap((response: Response) => {
        console.log(response);
      }),
      map(response => response)
    );
  }

  login(email: string, password: string): Observable<Response> {
    const body = { email, password };

    return this.http.post<Response>(`${environment.baseUrl}/auth/login`, body).pipe(
      tap((response: Response) => {
        const token = response.token;

        this.setAuthToken(token);
        this._parsedAuthToken = this.parseJwt(token);
        console.log(this._parsedAuthToken);
        this._isAdmin = this.checkIsAdmin(this._parsedAuthToken);
        this._isLoggedIn = true;
      }),
      map(response => response)
    );
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this._parsedAuthToken = null;
    this._isLoggedIn = false;
  }

  checkIsAdmin(parsedAuthToken: UserAuthToken): boolean {
    return parsedAuthToken.roles.some(role => role.id === 1);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  private parseJwt(token: string): UserAuthToken {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
