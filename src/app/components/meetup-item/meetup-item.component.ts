import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { MeetupResponse } from 'src/app/models/meetup/meetup.interface';

import { MeetupService } from 'src/app/services/meetup.service';

const DURATION = 200;

@Component({
  selector: 'app-meetup-item',
  templateUrl: './meetup-item.component.html',
  styleUrls: ['./meetup-item.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DURATION + 'ms ease-in')),
      transition('true => false', animate(DURATION + 'ms ease-out')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupItemComponent implements OnInit {
  @Input() meetup: MeetupResponse;
  _isEnded: boolean | null = null;
  _isSubscribed: boolean;
  isCollapsed = true;
  isMyMeetup = false;

  constructor(private meetupService: MeetupService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isMyMeetup = this.meetupService.checkIsMyMeetup(this.meetup);
    this._isSubscribed = this.meetupService.checkIsSubscribed(this.meetup);
    console.log(this.meetup.name, this.meetup.users, this._isSubscribed);
  }

  get isSubscribed(): boolean {
    return this._isSubscribed;
  }

  get isEnded(): boolean {
    if (this._isEnded === null) {
      const currentDate = moment();
      const meetupDate = moment.utc(this.meetup.time).local(true);

      this._isEnded = meetupDate.isBefore(currentDate);
    }

    return this._isEnded;
  }

  navigateToEditMeetup(id: number) {
    this.router.navigate(['/meetups/edit/', id]);
  }

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  subscribeUserForMeetup(meetupId: number) {
    this.meetupService
      .subscribeUserForMeetup(meetupId)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      })
      .add(() => {
        this._isSubscribed = true;
        this.cdr.detectChanges();
      });
  }

  unsubscribeUserForMeetup(meetupId: number) {
    this.meetupService
      .unsubscribeUserForMeetup(meetupId)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      })
      .add(() => {
        this._isSubscribed = false;
        this.cdr.detectChanges();
      });
  }
}
