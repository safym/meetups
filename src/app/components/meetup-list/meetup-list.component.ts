import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, filter, from, map, mergeMap, of, tap, toArray } from 'rxjs';

import { MeetupResponse } from 'src/app/models/meetup.interface';
import { MeetupService } from 'src/app/services/meetup.service';

@Component({
  selector: 'app-meetup-list',
  templateUrl: './meetup-list.component.html',
  styleUrls: ['./meetup-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupListComponent implements OnInit, OnDestroy {
  @Input() isMyMeetups: boolean;
  private meetupListSubscription: Subscription;
  private intervalSubscription: Subscription;
  meetupList: MeetupResponse[] = [];
  isLoading: boolean = false;
  isFiltered: boolean = false;
  filteredMeetupList: MeetupResponse[] = [];

  constructor(private meetupService: MeetupService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.meetupListSubscription = this.meetupService
      .getMeetupList()
      .subscribe((meetupList: MeetupResponse[]) => {
        this.processMeetupList(meetupList);
      });

    this.intervalSubscription = this.meetupService.getIntervalSubscription();
  }

  processMeetupList(meetupList: MeetupResponse[]): void {
    console.log('Meetup list', this.meetupList);

    if (!this.isMyMeetups) {
      this.meetupList = meetupList;
    } else {
      this.meetupList = this.meetupService.getMyMeetups(meetupList);
    }

    this.cdr.detectChanges();
  }

  filterMeetupList(searchQuery: string) {
    if (!searchQuery) {
      this.isFiltered = false;
      this.filteredMeetupList = [];
    } else {
      this.isFiltered = true;
      this.filteredMeetupList = this.meetupService.getFilteredMeetupList(searchQuery);
    }
  }

  ngOnDestroy(): void {
    if (this.meetupListSubscription) {
      this.meetupListSubscription.unsubscribe();
    }

    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}
