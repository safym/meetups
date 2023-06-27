import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAuthToken } from '../models/auth-token/auth-token.interface';
import { AuthToken } from '../models/auth-token/auth-token';
import { environment } from 'src/environments/environment';

interface Response {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenKey = 'auth_token';
  private _authToken: AuthToken | null = null;
  private _isAdmin: boolean = false;

  constructor(private http: HttpClient) {}

  get user(): AuthToken | null {
    const token = this.getToken();

    if (token) {
      const tokenData: IAuthToken = this.parseJwt(token);
      this._authToken = new AuthToken(tokenData);

      console.log(tokenData)

      return this._authToken;
    } else {
      return null;
    }
  }

  get isAdmin(): boolean {

    if (!this._authToken) return false
    console.log(this._authToken.roles.some(role => role.id === 1))
    return this._authToken.roles.some(role => role.id === 1);
  }

  login(email: string, password: string): Observable<Response> {
    const body = { email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Response>(`${environment.baseUrl}/auth/login`, body, {
      headers,
    });
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this._authToken = null;
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  isLoggedIn(): boolean {
    return !!this._authToken;
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  private parseJwt(token: string): IAuthToken {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
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
