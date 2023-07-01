import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../models/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userList: User[] = [];

  constructor(private http: HttpClient) {}

  get userList(): User[] {
    return this._userList;
  }

  set userList(meetupList: User[]) {
    this._userList = meetupList;
  }

  loadUserList(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<User[]>(`${environment.baseUrl}/user`, {
      headers,
    });
  }

  addUser(user: User) {
    this._userList.push(user);
  }
}
