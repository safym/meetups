import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, interval, map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Meetup, MeetupResponse } from '../models/meetup.interface';
import { UserResponse } from '../models/user.interface';
import { isDateString } from '../utils/isDateString';
import { isDateMatch } from '../utils/isDateMatch';
import { AuthService } from './auth.service';

const KEYS_TO_SEARCH = ['name', 'time', 'description'];
const REFRESH_INTERVAL = 2000;

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private meetupListSubject: BehaviorSubject<MeetupResponse[]> = new BehaviorSubject<MeetupResponse[]>([]);
  private intervalSubscription: Subscription;
  private _meetupList: MeetupResponse[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.fetchMeetupList();

    this.intervalSubscription = interval(REFRESH_INTERVAL)
      .pipe(tap(() => this.fetchMeetupList()))
      .subscribe();
  }

  getIntervalSubscription(): Subscription {
    return this.intervalSubscription;
  }

  fetchMeetupList(): void {
    this.http.get<MeetupResponse[]>(`${environment.baseUrl}/meetup`).subscribe(
      (meetupList: MeetupResponse[]) => {
        this._meetupList = meetupList;
        this.meetupListSubject.next(meetupList);
      },
      (error: Error) => {
        console.error('ERROR fetch meetup list:', error);
      }
    );
  }

  getMeetupList(): Observable<MeetupResponse[]> {
    return this.meetupListSubject.asObservable();
  }

  getMyMeetups(meetupList: MeetupResponse[]): MeetupResponse[] {
    return meetupList.filter((meetup: MeetupResponse) => {
      return this.checkIsMyMeetup(meetup);
    });
  }

  getMeetupFormDataById(id: number): MeetupResponse | undefined {
    return this._meetupList.find(item => item.id === id);
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
    return meetup.owner.id === this.authService.user?.id;
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
    return this.filterMeetupListBySubstring(this._meetupList, searchQuery, KEYS_TO_SEARCH);
  }

  private filterMeetupListBySubstring(
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
