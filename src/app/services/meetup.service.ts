import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Meetup, MeetupResponse } from '../models/meetup/meetup.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private _meetupList: MeetupResponse[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  get meetupList(): MeetupResponse[] {
    return this._meetupList;
  }

  set meetupList(meetupList: MeetupResponse[]) {
    this._meetupList = meetupList;
  }

  loadMeetupList(): Observable<MeetupResponse[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<MeetupResponse[]>(`${environment.baseUrl}/meetup`, {
      headers,
    });
  }

  getMeetupFormDataById(id: number): Observable<Meetup> {
    return new Observable<Meetup>(observer => {
      if (!id) observer.error('MeetupService.getMeetupById: не указан id');

      const foundMeetup = this.meetupList.find(meetup => meetup.id === id);

      if (!foundMeetup) observer.error('MeetupService.getMeetupById: не найден митап по id');

      observer.next(foundMeetup);
      observer.complete();
    });
  }

  editMeetup(id: number, meetupFormData: Meetup): Observable<Response> {
    const body = meetupFormData;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<Response>(`${environment.baseUrl}/meetup/${id}`, body, {
      headers,
    });
  }

  createMeetup(meetupFormData: Meetup): Observable<Response> {
    const body = meetupFormData;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Response>(`${environment.baseUrl}/meetup`, body, {
      headers,
    });
  }

  checkIsMyMeetup(meetup: MeetupResponse): boolean {
    return meetup.owner.email === this.authService.user?.email;
  }
}
