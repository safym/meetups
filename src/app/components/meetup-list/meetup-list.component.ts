import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { filter, from, map, merge, mergeMap, of, tap, toArray } from 'rxjs';
import { Meetup } from 'src/app/models/meetup/meetup';
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
  meetupList: Meetup[] = [];
  isLoading: boolean = false;

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
      map((metupList: any) => {
        return metupList;
      }),
      mergeMap((meetupList: any) => {
        if (!this.isMyMeetups) {
          return of(meetupList);
        } else {
          return from(meetupList).pipe(
            filter((meetup: any) => {
              const userEmail = this.authService.user?.email;
              return meetup.owner.email === userEmail;
            }),
            toArray()
          );
        }
      })
    );

    meetupsListObservable.subscribe({
      next: (response: any) => this.processMeetupList(response),
    });
  }

  getFullMetupList() {
    return this.meetupService.loadMeetupList();
  }

  processMeetupList(response: any): void {
    this.meetupList = response;
    this.meetupService.meetupList = this.meetupList;
    this.cdr.detectChanges();
  }
}
