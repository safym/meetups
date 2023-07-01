import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

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

    return this.http
      .get<MeetupResponse[]>(`${environment.baseUrl}/meetup`, {
        headers,
      })
      .pipe(
        tap((response: MeetupResponse[]) => {
          this.meetupList = response;
        }),
        map(response => response)
      );
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

  deleteMeetup(id: number): Observable<Response> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.delete<Response>(`${environment.baseUrl}/meetup/${id}`, {
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

  checkIsSubscribed(meetup: MeetupResponse): boolean {
    return meetup.users.some(user => user.id === this.authService.user?.id);
  }

  subscribeUserForMeetup(idMeetup: number) {
    const idUser = this.authService.user?.id;
    const body = { idMeetup, idUser };

    console.log(body);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<Response>(`${environment.baseUrl}/meetup`, body, {
      headers,
    });
  }

  unsubscribeUserForMeetup(idMeetup: number) {
    const idUser = this.authService.user?.id;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { idMeetup, idUser };

    const options = {
      headers,
      body,
    };

    console.log(body);

    return this.http.delete<Response>(`${environment.baseUrl}/meetup`, options);
  }
}
