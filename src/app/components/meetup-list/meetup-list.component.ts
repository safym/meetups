import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { filter, from, map, mergeMap, of, tap, toArray } from 'rxjs';
import { MeetupResponse } from 'src/app/models/meetup/meetup.interface';
import { AuthService } from 'src/app/services/auth.service';
import { MeetupService } from 'src/app/services/meetup.service';

@Component({
  selector: 'app-meetup-list',
  templateUrl: './meetup-list.component.html',
  styleUrls: ['./meetup-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupListComponent implements OnInit {
  @Input() isMyMeetups: boolean;
  meetupList: MeetupResponse[] = [];
  isLoading = false;

  constructor(
    private meetupService: MeetupService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getMeetupList();
  }

  getMeetupList(): void {
    this.isLoading = true;

    const meetupsListObservable = this.getFullMetupList().pipe(
      tap(() => (this.isLoading = false)),
      map((metupList: MeetupResponse[]) => {
        return metupList;
      }),
      mergeMap((meetupList: MeetupResponse[]) => {
        if (!this.isMyMeetups) {
          return of(meetupList);
        } else {
          return from(meetupList).pipe(
            filter((meetup: MeetupResponse) => {
              return this.meetupService.checkIsMyMeetup(meetup);
            }),
            toArray()
          );
        }
      })
    );

    meetupsListObservable.subscribe({
      next: (metupList: MeetupResponse[]) => this.processMeetupList(metupList),
    });
  }

  getFullMetupList() {
    return this.meetupService.loadMeetupList();
  }

  processMeetupList(metupList: MeetupResponse[]): void {
    this.meetupList = metupList;
    console.log('Meetup list', this.meetupList);
    this.meetupService.meetupList = this.meetupList;
    this.cdr.detectChanges();
  }
}
