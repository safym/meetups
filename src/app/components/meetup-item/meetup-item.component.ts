import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
  isCollapsed = true;
  isMyMeetup = false;

  constructor(private meetupService: MeetupService, private router: Router) {}

  ngOnInit(): void {
    this.isMyMeetup = this.meetupService.checkIsMyMeetup(this.meetup);
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
}
