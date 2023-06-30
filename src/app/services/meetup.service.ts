import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { MeetupForm, MeetupRequest, MeetupResponse } from '../models/meetup/meetup.interface';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private _meetupList: MeetupResponse[] = [];

  constructor(private http: HttpClient) {}

  get meetupList(): MeetupResponse[] {
    return this._meetupList;
  }

  set meetupList(meetupList: MeetupResponse[]) {
    this._meetupList = meetupList;
  }

  loadMeetupList(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<any>(`${environment.baseUrl}/meetup`, {
      headers,
    });
  }

  createMeetup(meetupFormData: MeetupForm) {
    const transformedMeetup = this.transformMeetup(meetupFormData);

    const body = transformedMeetup;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Response>(`${environment.baseUrl}/meetup`, body, {
      headers,
    });
  }

  transformMeetup(meetupFormData: MeetupForm): MeetupRequest {
    const { short_description, long_description, ...rest } = meetupFormData;
    const transformedMeetup: MeetupRequest = {
      ...rest,
      description: `${short_description} \n ${long_description}`,
    };

    return transformedMeetup;
  }
}
