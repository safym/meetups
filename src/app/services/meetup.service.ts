import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Meetup, MeetupResponse } from '../models/meetup.interface';
import { UserResponse } from '../models/user.interface';
import { isDateString } from '../utils/isDateString';
import { isDateMatch } from '../utils/isDateMatch';
import { AuthService } from './auth.service';

const KEYS_TO_SEARCH = ['name', 'time', 'description'];

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

    return this.http.put<Response>(`${environment.baseUrl}/meetup`, body);
  }

  unsubscribeUserForMeetup(idMeetup: number) {
    const idUser = this.authService.user?.id;

    const body = { idMeetup, idUser };

    const options = {
      body,
    };

    return this.http.delete<Response>(`${environment.baseUrl}/meetup`, options);
  }

  getFilteredMeetupList(searchQuery: string): MeetupResponse[] {
    return this.filterMeetupListBySubstring(this.meetupList, searchQuery, KEYS_TO_SEARCH);
  }

  filterMeetupListBySubstring(
    meetupList: MeetupResponse[],
    substring: string,
    keysToCheck: string[]
  ): MeetupResponse[] {
    return meetupList.filter(obj => {
      for (const key in obj) {
        const value = obj[key];

        if (keysToCheck.includes(key) && this.isValueMatchingSubstring(value, substring)) {
          return true;
        }
      }
      return false;
    });
  }

  isValueMatchingSubstring(
    value: string | number | UserResponse | UserResponse[],
    substring: string
  ): boolean {
    if (typeof value === 'string') {
      if (isDateString(value)) {
        return isDateMatch(value, substring);
      } else if (value.toUpperCase().includes(substring.toUpperCase())) {
        return true;
      }
    }

    return false;
  }
}
