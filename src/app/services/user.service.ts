import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { User, UserResponse } from '../models/user.interface';
import { RoleResponse } from '../models/role.interface';

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
    return this.http.get<UserResponse[]>(`${environment.baseUrl}/user`).pipe(
      tap((response: UserResponse[]) => {
        this.userList = response;
        console.log(response);
      }),
      map(response => response)
    );
  }

  getRoleList(): Observable<RoleResponse[]> {
    if (this._roleList.length === 0) {
      return this.http.get<RoleResponse[]>(`${environment.baseUrl}/role`).pipe(
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

    return this.http.put<Response>(`${environment.baseUrl}/user/${id}`, body);
  }

  deleteUser(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.baseUrl}/user/${id}`).pipe(
      tap(() => {
        this.loadUserList();
      }),
      map(response => response)
    );
  }

  editUserRole(id: number, roleName: string): Observable<Response> {
    const body = { name: roleName, userId: id };

    return this.http.put<Response>(`${environment.baseUrl}/user/role`, body);
  }
}
