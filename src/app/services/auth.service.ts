import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { User } from "../models/user/user";
import { IUser } from "../models/user/user.interface";
import { environment } from "src/environments/environment";

interface Response {
  token: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authTokenKey = "auth_token";
  private _user: User | null = null;

  constructor(private http: HttpClient) {}

  get user(): User | null {
    const token = this.getToken();

    if (token) {
      const userData: IUser = this.parseJwt(token);
      this._user = new User(userData);

      return this._user;
    } else {
      return null;
    }
  }

  login(email: string, password: string): Observable<Response> {
    const body = { email, password };
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post<Response>(`${environment.baseUrl}/auth/login`, body, {
      headers,
    });
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this._user = null;
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  isLoggedIn(): boolean {
    return !!this._user;
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  private parseJwt(token: string): IUser {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }
}
