import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Meetup } from 'src/app/models/meetup/meetup';
import { MeetupService } from 'src/app/services/meetup.service';

@Component({
  selector: 'app-meetup-list',
  templateUrl: './meetup-list.component.html',
  styleUrls: ['./meetup-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupListComponent implements OnInit {
  meetupList: Meetup[] = [];
  isLoading: boolean = false;

  constructor(
    private meetupService: MeetupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTodoList();
  }

  getTodoList(): void {
    this.isLoading = true;
    this.meetupService
      .loadMeetupList()
      .subscribe({
        next: (response: any) => {

          console.log(response)
          this.meetupList = response;
          this.meetupService.meetupList = this.meetupList;
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}
