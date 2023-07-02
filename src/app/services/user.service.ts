import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription, interval, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { User, UserResponse } from '../models/user.interface';
import { RoleResponse } from '../models/role.interface';

const REFRESH_INTERVAL = 5000;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userListSubject: Subject<UserResponse[]> = new Subject<UserResponse[]>();
  private _intervalSubscription: Subscription;
  private _userList: UserResponse[] = [];
  private _roleList: RoleResponse[] = [];

  constructor(private http: HttpClient) {
    this.fetchUserList();
  }

  getIntervalSubscription(): Subscription {
    this._intervalSubscription = interval(REFRESH_INTERVAL)
      .pipe(tap(() => this.fetchUserList()))
      .subscribe();

    return this._intervalSubscription;
  }

  getUserList(): Observable<UserResponse[]> {
    return this._userListSubject.asObservable();
  }

  fetchUserList(): void {
    this.http.get<UserResponse[]>(`${environment.baseUrl}/user`).subscribe(
      (userList: UserResponse[]) => {
        this._userList = userList;
        this._userListSubject.next(userList);
      },
      (error: Error) => {
        console.error('ERROR fetch meetup list:', error);
      }
    );
  }

  loadUserList(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${environment.baseUrl}/user`).pipe(
      tap((response: UserResponse[]) => {
        this._userList = response;
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
