import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { User, UserResponse } from '../models/user/user.interface';
import { RoleResponse } from '../models/role/role.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userList: UserResponse[] = [];
  private _roleList: RoleResponse[] = [];

  constructor(private http: HttpClient) {}

  get userList(): UserResponse[] {
    return this._userList;
  }

  set userList(userList: UserResponse[]) {
    this._userList = userList;
  }

  loadUserList(): Observable<UserResponse[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .get<UserResponse[]>(`${environment.baseUrl}/user`, {
        headers,
      })
      .pipe(
        tap((response: UserResponse[]) => {
          this.userList = response;
          console.log(response);
        }),
        map(response => response)
      );
  }

  getRoleList(): Observable<RoleResponse[]> {
    if (this._roleList.length === 0) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http
        .get<RoleResponse[]>(`${environment.baseUrl}/role`, {
          headers,
        })
        .pipe(
          tap((response: RoleResponse[]) => {
            this._roleList = response;
          })
        );
    } else {
      return of(this._roleList);
    }
  }

  getUserRole(user: UserResponse): RoleResponse | undefined {
    const userIsAdmin = user.roles.some(role => role.name === 'ADMIN');

    if (userIsAdmin) {
      return this._roleList.find(role => role.name === 'ADMIN');
    } else {
      return this._roleList.find(role => role.name === 'USER');
    }
  }

  editUserData(id: number, userFormData: User): Observable<Response> {
    const body = userFormData;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<Response>(`${environment.baseUrl}/user/${id}`, body, {
      headers,
    });
  }

  deleteUser(id: number): Observable<Response> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .delete<Response>(`${environment.baseUrl}/user/${id}`, {
        headers,
      })
      .pipe(
        tap(() => {
          this.loadUserList();
        }),
        map(response => response)
      );
  }

  editUserRole(id: number, roleName: string): Observable<Response> {
    const body = { name: roleName, userId: id };
    console.log(body);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<Response>(`${environment.baseUrl}/user/role`, body, {
      headers,
    });
  }
}
