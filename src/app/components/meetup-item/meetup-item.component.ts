import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { MeetupResponse } from 'src/app/models/meetup.interface';

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
export class MeetupItemComponent implements OnInit, AfterViewInit {
  @Input() meetup: MeetupResponse;
  @ViewChild('collapsibleContent') collapsibleContent!: ElementRef;
  _isEnded: boolean | null = null;
  _isSubscribed: boolean;
  _hasCollapsibleContent: boolean = false;
  isCollapsed: boolean = true;
  isMyMeetup: boolean = false;

  constructor(private meetupService: MeetupService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isMyMeetup = this.meetupService.checkIsMyMeetup(this.meetup);
    this._isSubscribed = this.meetupService.checkIsSubscribed(this.meetup);
    // console.log(this.meetup.name, this.meetup, this._isSubscribed);
  }

  ngAfterViewInit(): void {
    const collapsibleContent = this.collapsibleContent.nativeElement.children;
    const hasCollapsibleContent = collapsibleContent.length > 0;

    this._hasCollapsibleContent = hasCollapsibleContent;
    this.cdr.detectChanges();
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

  get hasCollapsibleContent(): boolean {
    return this._hasCollapsibleContent;
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
