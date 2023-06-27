import { Injectable } from '@angular/core';
import { IMeetup } from '../models/meetup/meetup.interface';
import { Meta } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meetup } from '../models/meetup/meetup';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private _meetupList: Meetup[] = [
    {
      id: 1,
      name: 'RxJS',
      description: 'Расскажем об основах RxJS',
      location: 'Переговорка 4',
      target_audience: 'Разработчики, аналитики',
      need_to_know: 'Ядренную физику',
      will_happen: 'Будем готовить пиццу',
      reason_to_come: 'Надо',
      time: '2023-06-13T19:14:13.094Z',
      duration: 90,
      createdBy: 1,
      owner: {
        id: 1,
        email: 'pam@dundermifflin.com',
        password: 'password',
        fio: 'password',
      },
      users: [
        {
          id: 1,
          email: 'pam@dundermifflin.com',
          password: 'password',
          fio: 'password',
        },
      ],
    },
  ];

  constructor(private http: HttpClient) {}

  get meetupList(): Meetup[] {
    return this._meetupList;
  }

  set todoList(meetupList: Meetup[]) {
    this._meetupList = meetupList;
  }

  loadTodoList(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<any>(`${environment.baseUrl}/meetup`, {
      headers,
    });
  }

  addMeetup(meetup: Meetup) {
    this._meetupList.push(meetup);
  }
}
