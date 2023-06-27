import { User } from "../user/user";
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
  owner: User;
  users: User[];


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