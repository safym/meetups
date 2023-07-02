import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Meetup, MeetupResponse } from '../models/meetup.interface';
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
    return this.http.get<MeetupResponse[]>(`${environment.baseUrl}/meetup`).pipe(
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

    return this.http.put<Response>(`${environment.baseUrl}/meetup/${id}`, body);
  }

  deleteMeetup(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.baseUrl}/meetup/${id}`);
  }

  createMeetup(meetupFormData: Meetup): Observable<Response> {
    const body = meetupFormData;

    return this.http.post<Response>(`${environment.baseUrl}/meetup`, body);
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

    return this.http.put<Response>(`${environment.baseUrl}/meetup`, body);
  }

  unsubscribeUserForMeetup(idMeetup: number) {
    const idUser = this.authService.user?.id;

    const body = { idMeetup, idUser };

    const options = {
      body,
    };

    console.log(body);

    return this.http.delete<Response>(`${environment.baseUrl}/meetup`, options);
  }
}
