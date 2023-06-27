import { IMeetup } from "./meetup.interface";

export class Meetup implements IMeetup {
  id: number;
  name: string;
  description: string;
  location: string;
  target_audience: string;
  need_to_know: string;
  will_happen: string;
  reason_to_come: string;
  time: string;
  duration: number;
  createdBy: number;
  owner: {
    id: number;
    email: string;
    password: string;
    fio: string;
  };
  users: [
    {
      id: number;
      email: string;
      password: string;
      fio: string;
    }
  ];


  constructor(meetupData: IMeetup) {
    this.id = meetupData.id;
    this.name = meetupData.name;
    this.description = meetupData.description;

    this.location = meetupData.location;
    this.target_audience = meetupData.target_audience;
    this.need_to_know = meetupData.need_to_know;
    this.will_happen = meetupData.will_happen;
    this.reason_to_come = meetupData.reason_to_come;
    this.time = meetupData.time;
    this.duration = meetupData.duration;
    this.createdBy = meetupData.createdBy;
    // this.owner: {
    // };
    // this.users: [
    // ];
  }
}