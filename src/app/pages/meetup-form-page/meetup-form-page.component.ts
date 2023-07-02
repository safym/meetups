import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meetup-form-page',
  templateUrl: './meetup-form-page.component.html',
})
export class MeetupFormPageComponent implements OnInit {
  meetupId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.meetupId = Number(this.route.snapshot.params['id']) || null;
  }
}
