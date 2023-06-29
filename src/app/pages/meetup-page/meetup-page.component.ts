import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meetup-page',
  templateUrl: './meetup-page.component.html',
  styleUrls: ['./meetup-page.component.scss'],
  host: {
    class: 'page',
  },
})
export class MeetupPageComponent implements OnInit {
  isMyMeetups: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isMyMeetups = this.route.snapshot.data['isMyMeetups'] || false;
  }
}
