import { Injectable } from '@angular/core';
import { IMeetup } from '../models/meetup/meetup.interface';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meetup } from '../models/meetup/meetup';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private _meetupList: Meetup[] = [];

  constructor(private http: HttpClient) {}

  get meetupList(): Meetup[] {
    return this._meetupList;
  }

  set meetupList(meetupList: Meetup[]) {
    this._meetupList = meetupList;
  }

  loadMeetupList(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<any>(`${environment.baseUrl}/meetup`, {
      headers,
    });
  }

  addMeetup(meetup: Meetup) {
    this._meetupList.push(meetup);
  }
}
