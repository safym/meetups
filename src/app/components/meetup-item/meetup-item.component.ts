import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as moment from 'moment';

import { MeetupResponse } from 'src/app/models/meetup/meetup.interface';

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
export class MeetupItemComponent {
  @Input() meetup: MeetupResponse;
  _isEnded: boolean | null = null;
  isCollapsed = true;

  get isEnded(): boolean {
    if (this._isEnded === null) {
      const currentDate = moment();
      const meetupDate = moment.utc(this.meetup.time).local(true);

      this._isEnded = meetupDate.isBefore(currentDate);
    }

    return this._isEnded;
  }

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
