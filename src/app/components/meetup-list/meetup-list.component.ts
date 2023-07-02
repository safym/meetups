import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, interval, take } from 'rxjs';

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
  private _meetupListSubscription: Subscription;
  private _intervalSubscription: Subscription;
  private _loadingInterval: Subscription;
  meetupList: MeetupResponse[] = [];
  isLoading: boolean = false;
  isFiltered: boolean = false;
  filteredMeetupList: MeetupResponse[] = [];

  constructor(private meetupService: MeetupService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isLoading = true;

    this._meetupListSubscription = this.meetupService
      .getMeetupList()
      .subscribe((meetupList: MeetupResponse[]) => {
        this.processMeetupList(meetupList);
      });

    this._intervalSubscription = this.meetupService.getIntervalSubscription();

    this._loadingInterval = interval(0)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  private processMeetupList(meetupList: MeetupResponse[]): void {
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

  trackById(index: number, item: MeetupResponse): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.isLoading = false;

    if (this._meetupListSubscription) {
      this._meetupListSubscription.unsubscribe();
    }

    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
    }
  }
}
