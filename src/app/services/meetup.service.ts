import { Injectable } from '@angular/core';
import { IMeetup } from '../model/meetup.interface';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MeetupService {
  private meetupList: IMeetup[] = [
    {
      id: 1,
      name: 'name',
      date: new Date,
      location: 'location',
      shortDescription: 'shortDescription',
      detailedDescription: 'detailedDescription',
      targetAudience: 'targetAudience',
      requirements: 'requirements',
      agenda: 'agenda',
      reasonToAttend: 'reasonToAttend',
      organizer: {
        fisrtName: 'john',
        lastName: 'doe',
      }
    },
  ]

  getMeetupList(): IMeetup[] {
    return this.meetupList;
  }

  addMeetup(meetup: IMeetup) {
    this.meetupList.push(meetup)
  }

  constructor() { }
}
